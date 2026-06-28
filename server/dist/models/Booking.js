"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PassengerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    seatNumber: { type: String, required: true },
});
const BookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    train: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Train',
        required: true,
    },
    pnrNumber: {
        type: String,
        required: true,
        unique: true,
    },
    passengers: [PassengerSchema],
    totalFare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    travelDate: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Booking = (0, mongoose_1.model)('Booking', BookingSchema);
exports.default = Booking;
