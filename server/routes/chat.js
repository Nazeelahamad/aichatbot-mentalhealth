const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware to secure the chat route (same one used in data.js)
const auth = (req, res, next) => {
    // Note: In a real MERN app, you need to verify the JWT token here
    // For simplicity, we'll assume authentication is checked in the main route file.
    // Replace this with the actual JWT check middleware from server/routes/data.js
    next(); 
};


// Define the core AI chat endpoint
router.post('/ai_response', auth, async (req, res) => {
    const { message, history } = req.body;
    
    // 1. Define the AI Persona and Goal
    const prompt = `You are an AI Mental Health Companion designed to support university students. 
    Your goal is to detect the user's emotional state, validate their feelings, and suggest a helpful next step (like a relaxation exercise).

    CURRENT MESSAGE: "${message}"

    Analyze the user's current emotion. Provide a motivational, empathetic response (maximum 3 sentences) that addresses their feeling and concludes by suggesting a concrete action, based on their emotion, from the following list: ['Breathing', 'Journaling', 'Calming Music', 'Short Break', 'Connect to Counselor'].

    Respond ONLY with a JSON object in this format: 
    {
      "emotion": "detected_emotion (e.g., anxious, stressed, happy)",
      "response": "Your empathetic and motivational text response here."
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // A fast, capable model for chat
            contents: [
                // Include chat history if you want context (history is optional but helpful)
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                })),
                { role: 'user', parts: [{ text: prompt }] }
            ],
            config: {
                 responseMimeType: "application/json", // Force JSON output
            },
        });
        
        // The response text will be the JSON string
        const aiData = JSON.parse(response.text.trim());

        res.json(aiData);

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback to a safe, neutral response
        res.status(500).json({
            emotion: 'neutral',
            response: 'I apologize, I am experiencing a server issue. Please try talking to me again or contact a counselor.'
        });
    }
});

module.exports = router;