const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true,
    },
    company_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Companies",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    create_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Bookings", BookingSchema);