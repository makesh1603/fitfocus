const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');

// Get all trainers
router.get('/', async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json({
            "message": "success",
            "data": trainers
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Get trainer by ID
router.get('/:id', async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ id: req.params.id });
        if (!trainer) {
            res.status(404).json({ "error": "Trainer not found" });
            return;
        }
        res.json({
            "message": "success",
            "data": trainer
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

module.exports = router;
