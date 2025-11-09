function extractName(message) {
  const lower = message.toLowerCase().trim();

  const namePattern = /(?:i'm|i am|my name is|this is|it's me|call me)\s+([a-zA-Z]+)/i;
  const match = lower.match(namePattern);

  if (match && match[1]) {
    const name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    return name;
  }

  return null;
}

module.exports = extractName;
