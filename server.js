require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema
const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  dob: String,
  timeOfBirth: String,
  placeOfBirth: String,
  height: String,
  complexion: String,
  gender: { type: String, required: true },
  religion: { type: String, required: true },
  caste: String,
  zodiac: String,
  location: String,
  address: String,
  phone: String,
  education: String,
  occupation: String,
  maritalStatus: String,
  motherTongue: String,
  diet: String,
  family: String,
  hobbies: String,
  horoscope: String,
  partnerPreferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 100 }
    },
    religion: { type: String, default: 'Any' },
    education: { type: String, default: 'Any' },
    occupation: { type: String, default: 'Any' },
    location: { type: String, default: 'Any' },
    diet: { type: String, default: 'Any' }
  }
});

const chatSchema = new mongoose.Schema({
  fromUserId: String,
  toUserId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);
const Chat = mongoose.model('Chat', chatSchema);

// Routes

// ➕ Add or Update Profile
app.post('/add-profile', async (req, res) => {
  try {
    const data = req.body;

    // Check for required basic fields
    const requiredFields = ['name', 'age', 'gender', 'religion'];
    const missing = requiredFields.filter(field => !data[field]);

    if (missing.length) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    // Generate or use existing userId
    const userId = data.userId || 'user-' + Math.random().toString(36).substr(2, 9);

    // Construct clean update object
    const updateData = {
  userId,
  name: data.name,
  age: data.age,
  dob: data.dob || '',
  timeOfBirth: data.timeOfBirth || '',
  placeOfBirth: data.placeOfBirth || '',
  heightCm: data.heightCm || null,
  weightKg: data.weightKg || null,
  height: data.height || '', // optional textual height like "5'4\""
  complexion: data.complexion || '',
  gender: data.gender,
  religion: data.religion,
  caste: data.caste || '',
  zodiac: data.zodiac || '',
  location: data.location || '',
  address: data.address || '',
  phone: data.phone || '',
  education: data.education || '',
  occupation: data.occupation || '',
  maritalStatus: data.maritalStatus || '',
  motherTongue: data.motherTongue || '',
  diet: data.diet || '',
  smokingHabits: data.smokingHabits || '',
  drinkingHabits: data.drinkingHabits || '',
  aboutMe: data.aboutMe || '',
  annualIncome: data.annualIncome || '',
  familyStatus: data.familyStatus || '',
  family: data.family || '',
  hobbies: data.hobbies || '',
  interests: data.interests || '',
  horoscope: data.horoscope || '',
  partnerPreferences: {
    ageRange: data.partnerPreferences?.ageRange || { min: 0, max: 100 },
    religion: data.partnerPreferences?.religion || 'Any',
    caste: data.partnerPreferences?.caste || 'Any',
    location: data.partnerPreferences?.location || 'Any',
    education: data.partnerPreferences?.education || 'Any',
    occupation: data.partnerPreferences?.occupation || 'Any',
    diet: data.partnerPreferences?.diet || 'Any'
  }
};


    const updated = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { upsert: true, new: true }
    );

    return res.json({ userId: updated.userId });
  } catch (err) {
    console.error('Error in /add-profile:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// 📤 Get Profile by userId
app.get('/get-profile/:id', async (req, res) => {
  const user = await Profile.findOne({ userId: req.params.id });
  res.json({ found: !!user, user });
});
app.post('/find-matches', async (req, res) => {
  try {
    const { userId } = req.body;
    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const prefs = userProfile.partnerPreferences; // Changed from preferences to partnerPreferences
    const userGender = userProfile.gender;

    // Build dynamic query
    const query = {
      userId: { $ne: userId }, // Changed from _id to userId
      gender: userGender === 'male' ? 'female' : 'male',
      age: {
        $gte: prefs.ageRange.min,
        $lte: prefs.ageRange.max
      }
    };

    // Add other preferences if they're not 'Any'
    if (prefs.religion && prefs.religion !== 'Any') query.religion = prefs.religion;
    if (prefs.education && prefs.education !== 'Any') query.education = prefs.education;
    if (prefs.occupation && prefs.occupation !== 'Any') query.occupation = prefs.occupation;
    if (prefs.location && prefs.location !== 'Any') query.location = prefs.location;
    if (prefs.diet && prefs.diet !== 'Any') query.diet = prefs.diet;

    // Get matching profiles
    const matches = await Profile.find(query).limit(20);

    if (!matches.length) {
      return res.json([]);
    }

    // Rank matches by compatibility
    const ranked = matches.map(profile => {
      let score = 0;
      if (prefs.location === profile.location) score += 2;
      if (prefs.religion === profile.religion) score += 3;
      if (prefs.education === profile.education) score += 2;
      if (prefs.occupation === profile.occupation) score += 2;
      if (prefs.diet === profile.diet) score += 1;
      return { ...profile._doc, score };
    }).sort((a, b) => b.score - a.score);

    res.json(ranked);

  } catch (err) {
    console.error('Error in /find-matches:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// 💬 Chat Between Users
app.post('/send-message', async (req, res) => {
  try {
    const { fromUserId, toUserId, message } = req.body;
    if (!fromUserId || !toUserId || !message) return res.status(400).json({ error: 'Missing fields' });
    await Chat.create({ fromUserId, toUserId, message });
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/get-messages/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const messages = await Chat.find({
      $or: [
        { fromUserId: from, toUserId: to },
        { fromUserId: to, toUserId: from }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// 🤖 Chat Assistant AI Logic - (Simulated)
app.post('/chat-friend', async (req, res) => {
  const { message } = req.body;
  const lower = message.toLowerCase();
  if (lower.includes('respect') || lower.includes('kind')) {
    return res.json({ reply: "That's wonderful! Respect and kindness make strong relationships." });
  } else if (lower.includes('working') || lower.includes('salary')) {
    return res.json({ reply: "Financial stability is important. I'll try to find a match with your expectations." });
  } else if (lower.includes('family')) {
    return res.json({ reply: 'Family values are truly essential in a life partner. I got that!' });
  } else {
    return res.json({ reply: "I'm here for you as a friend too! Feel free to share more about your expectations." });
  }
});
// Example for Express (Node.js)
app.post("/save-preferences", async (req, res) => {
  const { userId, preferences } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { preferences });
    res.status(200).json({ message: "Preferences saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
