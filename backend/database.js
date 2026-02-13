const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('--- MongoDB Connection Error Details ---');
        console.error(`Message: ${error.message}`);
        console.error(`Code: ${error.code}`);
        if (error.reason) console.error(`Reason: ${error.reason}`);
        if (error.library) console.error(`Library: ${error.library}`);
        console.error('---------------------------------------');
        // process.exit(1); // Don't exit, let the server try to run anyway
    }
};

module.exports = connectDB;
