const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
        console.error('Error fetching trainers:', err.message);
        res.status(500).json({ "error": "Internal server error" });
    }
});

// Create a trainer
router.post('/', async (req, res) => {
    try {
        const newTrainer = new Trainer({
            ...req.body,
            id: req.body.id || Math.random().toString(36).substr(2, 9)
        });
        await newTrainer.save();
        res.status(201).json({ "message": "success", "data": newTrainer });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Update a trainer
router.put('/:id', async (req, res) => {
    try {
        const updatedTrainer = await Trainer.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedTrainer) return res.status(404).json({ "error": "Trainer not found" });
        res.json({ "message": "success", "data": updatedTrainer });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Delete a trainer
router.delete('/:id', async (req, res) => {
    try {
        const deletedTrainer = await Trainer.findOneAndDelete({ id: req.params.id });
        if (!deletedTrainer) return res.status(404).json({ "error": "Trainer not found" });
        res.json({ "message": "success", "data": deletedTrainer });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Get trainer by ID
router.get('/:id', async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ id: req.params.id });
        if (!trainer) {
            return res.status(404).json({ "error": "Trainer not found" });
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
