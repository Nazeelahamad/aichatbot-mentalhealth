const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/data/save
// @desc    Save user progress (chat, activities, mood)
router.post('/save', auth, async (req, res) => {
    const userId = req.user;
    const { messages, activities, currentMood, moodHistory } = req.body;

    if (!Array.isArray(messages) || !Array.isArray(moodHistory) ||
        !Number.isSafeInteger(activities) || activities < 0 ||
        typeof currentMood !== 'string' || currentMood.length > 40) {
        return res.status(400).json({ message: 'Invalid progress data.' });
    }

    try {
        // Find user by ID and update progress fields
        const user = await User.findByIdAndUpdate(userId, {
            messages,
            activities,
            currentMood,
            moodHistory
        }, { new: true, runValidators: true }); // {new: true} returns the updated document

        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json({ message: 'Progress saved.', savedAt: Date.now() });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/data/journal
// @desc    Create a private journal entry for the signed-in user
router.post('/journal', auth, async (req, res) => {
    const content = typeof req.body.content === 'string' ? req.body.content.trim() : '';
    if (!content || content.length > 5000) {
        return res.status(400).json({ message: 'Journal entries must be between 1 and 5000 characters.' });
    }

    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.journalEntries.push({ content });
        await user.save();
        res.status(201).json({ entry: user.journalEntries[user.journalEntries.length - 1] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Could not save journal entry.' });
    }
});

// @route   GET /api/data/journal
// @desc    Get the signed-in user's journal entries, newest first
router.get('/journal', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('journalEntries');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const entries = [...user.journalEntries].sort((a, b) => b.createdAt - a.createdAt);
        res.json({ entries });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Could not load journal entries.' });
    }
});

// @route   DELETE /api/data/journal/:entryId
// @desc    Delete one journal entry owned by the signed-in user
router.delete('/journal/:entryId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const entry = user.journalEntries.id(req.params.entryId);
        if (!entry) return res.status(404).json({ message: 'Journal entry not found.' });

        entry.deleteOne();
        await user.save();
        res.json({ message: 'Journal entry deleted.' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: 'Could not delete journal entry.' });
    }
});

module.exports = router;
