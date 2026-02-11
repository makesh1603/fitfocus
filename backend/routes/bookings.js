const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get bookings for a user
router.get('/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ userEmail: req.params.email });
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
    const { trainerId, trainerName, userEmail, date, time } = req.body;

    try {
        const newBooking = new Booking({
            trainerId,
            trainerName,
            userEmail,
            date,
            time,
            status: 'confirmed'
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

module.exports = router;
