const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
    date: { type: String, required: true }, // e.g., "Mon", "Tue"
    mood: { type: String, required: true }, // e.g., "calm", "stressed"
    score: { type: Number, required: true }  // e.g., 7, 4 (for chart height)
}, { _id: false });

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    
    // Core Progress Data
    messages: { type: Array, default: [] },
    activities: { type: Number, default: 0 },
    currentMood: { type: String, default: 'Not tracked' },
    
    // 🚀 NEW: Dynamic Mood History Array
    moodHistory: { type: [MoodEntrySchema], default: [] }, 
});

module.exports = mongoose.model('User', UserSchema);