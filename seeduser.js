// seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
  insertDummyUsers();
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  location: String,
  preferences: {
    preferredGender: String,
    preferredLocation: String,
    ageRange: {
      min: Number,
      max: Number
    }
  }
});
const User = mongoose.model('User', userSchema);

// Dummy data (10 brides + 10 grooms)
async function insertDummyUsers() {
  const User = mongoose.model('User', userSchema);

  const dummyUsers = [
    // 👰 Brides
    {
      name: "Aisha",
      age: 26,
      gender: "female",
      location: "Chennai",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Chennai",
        ageRange: { min: 27, max: 32 }
      }
    },
    {
      name: "Priya",
      age: 25,
      gender: "female",
      location: "Bangalore",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Bangalore",
        ageRange: { min: 26, max: 30 }
      }
    },
    {
      name: "Sneha",
      age: 27,
      gender: "female",
      location: "Hyderabad",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Hyderabad",
        ageRange: { min: 28, max: 33 }
      }
    },
    {
      name: "Anjali",
      age: 28,
      gender: "female",
      location: "Mumbai",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Mumbai",
        ageRange: { min: 29, max: 35 }
      }
    },
    {
      name: "Divya",
      age: 29,
      gender: "female",
      location: "Delhi",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Delhi",
        ageRange: { min: 30, max: 36 }
      }
    },
    {
      name: "Radha",
      age: 30,
      gender: "female",
      location: "Kolkata",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Kolkata",
        ageRange: { min: 32, max: 38 }
      }
    },
    {
      name: "Meera",
      age: 27,
      gender: "female",
      location: "Pune",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Pune",
        ageRange: { min: 28, max: 33 }
      }
    },
    {
      name: "Lakshmi",
      age: 24,
      gender: "female",
      location: "Coimbatore",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Coimbatore",
        ageRange: { min: 25, max: 30 }
      }
    },
    {
      name: "Kavya",
      age: 26,
      gender: "female",
      location: "Chennai",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Chennai",
        ageRange: { min: 27, max: 32 }
      }
    },
    {
      name: "Nisha",
      age: 25,
      gender: "female",
      location: "Bangalore",
      preferences: {
        preferredGender: "male",
        preferredLocation: "Bangalore",
        ageRange: { min: 26, max: 31 }
      }
    },

    // 🤵 Grooms
    {
      name: "Arjun",
      age: 29,
      gender: "male",
      location: "Chennai",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Chennai",
        ageRange: { min: 24, max: 28 }
      }
    },
    {
      name: "Rahul",
      age: 28,
      gender: "male",
      location: "Bangalore",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Bangalore",
        ageRange: { min: 23, max: 27 }
      }
    },
    {
      name: "Karthik",
      age: 30,
      gender: "male",
      location: "Hyderabad",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Hyderabad",
        ageRange: { min: 25, max: 29 }
      }
    },
    {
      name: "Ravi",
      age: 31,
      gender: "male",
      location: "Mumbai",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Mumbai",
        ageRange: { min: 26, max: 30 }
      }
    },
    {
      name: "Amit",
      age: 33,
      gender: "male",
      location: "Delhi",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Delhi",
        ageRange: { min: 27, max: 32 }
      }
    },
    {
      name: "Vikram",
      age: 32,
      gender: "male",
      location: "Kolkata",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Kolkata",
        ageRange: { min: 28, max: 33 }
      }
    },
    {
      name: "Suresh",
      age: 30,
      gender: "male",
      location: "Pune",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Pune",
        ageRange: { min: 25, max: 29 }
      }
    },
    {
      name: "Manoj",
      age: 27,
      gender: "male",
      location: "Coimbatore",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Coimbatore",
        ageRange: { min: 22, max: 26 }
      }
    },
    {
      name: "Ramesh",
      age: 28,
      gender: "male",
      location: "Chennai",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Chennai",
        ageRange: { min: 24, max: 27 }
      }
    },
    {
      name: "Naveen",
      age: 29,
      gender: "male",
      location: "Bangalore",
      preferences: {
        preferredGender: "female",
        preferredLocation: "Bangalore",
        ageRange: { min: 25, max: 29 }
      }
    }
  ];

  await User.deleteMany({}); // Clear old data if needed
  await User.insertMany(dummyUsers);

  console.log("✅ Dummy users inserted successfully.");
  process.exit();
}


