const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping original ID for compatibility with frontend mocks
    name: { type: String, required: true },
    specialties: [{ type: String }],
    rating: { type: Number, default: 0 },
    pricePerHour: { type: Number, required: true },
    bio: { type: String },
    imageUrl: { type: String },
    experienceYears: { type: Number },
    availability: [{ type: String }]
});

module.exports = mongoose.model('Trainer', trainerSchema);
