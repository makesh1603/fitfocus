const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings (for Admin/Host)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json({
            "message": "success",
            "data": bookings
        });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

// Get bookings for a user
router.get('/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json({
            "message": "success",
            "data": bookings
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Create booking
router.post('/', async (req, res) => {
    const { trainerId, trainerName, userEmail, date, time, img, type } = req.body;

    try {
        const newBooking = new Booking({
            trainerId,
            trainerName,
            userEmail,
            date,
            time,
            img,
            type,
            status: 'pending' // Default to pending as it's a reservation
        });

        await newBooking.save();

        res.json({
            "message": "success",
            "data": newBooking
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    }
});

// Update booking status
router.patch('/:id', async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Booking not found' });
        res.json({ message: 'success', data: updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Booking.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Booking not found' });
        res.json({ message: 'success', data: deleted });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
