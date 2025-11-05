const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', async (req, res) => {
    const { userName, password } = req.body;
    try {
        let user = await User.findOne({ userName });
        if (user) return res.status(400).json({ message: 'User already exists.' });

        // 1. Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 2. Create and Save User
        user = new User({ userName, passwordHash });
        await user.save();

        // 3. Generate Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Return token and initial user data
        res.status(201).json({ token, userName: user.userName, messages: user.messages, activities: user.activities });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Login user & get progress data
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const user = await User.findOne({ userName });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials.' });

        // 1. Compare Password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials.' });

        // 2. Generate Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 3. Return token AND user data (progress)
        res.json({ 
            token, 
            userName: user.userName, 
            messages: user.messages, 
            activities: user.activities,
            currentMood: user.currentMood 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;