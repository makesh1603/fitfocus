const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user
router.post('/', async (req, res) => {
    const { email, name, photoUrl, role } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { email, name, photoUrl, role },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json({
            "message": "success",
            "data": user
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Get user
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.json({
            "message": "success",
            "data": user
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

module.exports = router;
