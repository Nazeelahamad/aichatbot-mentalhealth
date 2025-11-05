const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (verify JWT token)
const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Attach user ID to request
        next();
    } catch (e) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

// @route   POST /api/data/save
// @desc    Save user progress (chat, activities, mood)
router.post('/save', auth, async (req, res) => {
    const userId = req.user;
    const { messages, activities, currentMood } = req.body;

    try {
        // Find user by ID and update progress fields
        const user = await User.findByIdAndUpdate(userId, {
            messages,
            activities,
            currentMood
        }, { new: true }); // {new: true} returns the updated document

        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json({ message: 'Progress saved.', savedAt: Date.now() });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;