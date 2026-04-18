const Groq = require('groq-sdk');

// Use the same API key for both instances (you can use two different keys if you have them)
const info = new Groq({ apiKey: process.env.GROQ_API_KEY });
const review = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Choose Llama 3 model – 70B for best quality, or 8B for faster/cheaper
const MODEL_NAME = "llama-3.3-70b-versatile"; // or any of the above alternatives

module.exports = { info, review, MODEL_NAME };