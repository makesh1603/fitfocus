const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    trainerId: { type: String, required: true },
    trainerName: { type: String },
    userEmail: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
