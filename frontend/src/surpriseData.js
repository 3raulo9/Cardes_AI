const languages = [
  "French", "German", "Hebrew", "Spanish", "Italian", "Russian", 
  "Japanese", "Chinese", "Korean", "Arabic", "Portuguese", "Dutch", 
  "Swedish", "Norwegian", "Danish", "Finnish", "Polish", "Greek", 
  "Turkish", "Czech", "Hungarian", "Romanian", "Bulgarian", "Croatian", 
  "Serbian", "Slovak", "Slovenian", "Ukrainian", "Lithuanian", "Latvian", 
  "Estonian", "Hindi", "Bengali", "Punjabi", "Gujarati", "Tamil", 
  "Telugu", "Kannada", "Malayalam", "Marathi", "Urdu", "Persian", 
  "Thai", "Vietnamese", "Indonesian", "Malay", "Filipino", "Swahili", 
  "Zulu", "Afrikaans", "Amharic", "Somali", "Yoruba", "Igbo", 
  "Hausa", "Xhosa"
];

const actions = [
  "Give me", "Provide me with", "Please, give me", "Could you give me", 
  "I'd like", "Can you share", "I need"
];

const sentenceQuantities = [3, 4, 5, 6, 7, 8, 9, 10];

const words = [
  "sentences", "phrases"
];

const keywords = [
  "beginner", "hope", "hello", "love", "friend", "thank you", 
  "basic conversations", "tourists", "yes", "no", "peace", "joy", 
  "please", "sorry", "welcome", "goodbye", "good morning", "good night", 
  "excuse me", "congratulations", "well done", "best wishes", "farewell", 
  "happy birthday", "happy new year", "merry christmas", "happy holidays",
  "family", "food", "drink", "weather", "time", "day", "night", 
  "week", "month", "year", "city", "country", "travel", "hobbies", 
  "sports", "music", "movie", "book", "computer", "internet", "phone", 
  "school", "university", "work", "job", "business", "money", 
  "shopping", "health", "doctor", "hospital", "emergency", "police",
  "directions", "location", "map", "street", "restaurant", "cafe", 
  "hotel", "airport", "station", "bus", "train", "car", "taxi",

  "wulfenite", 
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomOption = () => {
  const action = getRandomElement(actions);
  const quantity = getRandomElement(sentenceQuantities);
  const language = getRandomElement(languages);
  const wordType = getRandomElement(words);
  const keyword = getRandomElement(keywords);
  const translation = getRandomElement(languages);

  return `${action} ${quantity} ${wordType} in ${language} using the word ${keyword} + translation in ${translation} and encase each sentence with "^" first the translation then the sentence`;
};

const surpriseOptions = Array.from({ length: 100 }, generateRandomOption);

export default surpriseOptions;
