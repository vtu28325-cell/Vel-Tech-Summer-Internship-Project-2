"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Sub-schema for individual seat
const SeatSchema = new mongoose_1.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
});
// Sub-schema for schedule (date + timings)
const ScheduleSchema = new mongoose_1.Schema({
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    date: { type: String, required: true },
});
const TrainSchema = new mongoose_1.Schema({
    trainNumber: {
        type: String,
        required: [true, 'Train number is required'],
        unique: true,
        trim: true,
    },
    trainName: {
        type: String,
        required: [true, 'Train name is required'],
        trim: true,
    },
    source: {
        type: String,
        required: [true, 'Source station is required'],
        trim: true,
    },
    destination: {
        type: String,
        required: [true, 'Destination station is required'],
        trim: true,
    },
    schedule: {
        type: ScheduleSchema,
        required: true,
    },
    totalSeats: {
        type: Number,
        required: [true, 'Total seats is required'],
        min: [1, 'Train must have at least 1 seat'],
    },
    availableSeats: {
        type: Number,
    },
    seats: [SeatSchema],
    fare: {
        type: Number,
        required: [true, 'Fare is required'],
        min: [0, 'Fare cannot be negative'],
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
    },
    trainType: {
        type: String,
        enum: ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Local', 'Mail'],
        default: 'Express',
    },
}, { timestamps: true });
// Auto-generate seats and set availableSeats before saving
TrainSchema.pre('save', function () {
    // Only generate seats on first creation (when seats array is empty)
    if (this.isNew && this.seats.length === 0) {
        this.availableSeats = this.totalSeats;
        // Generate seat numbers: A1, A2, ..., B1, B2...
        const seats = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
        let count = 0;
        let rowIndex = 0;
        let seatInRow = 1;
        while (count < this.totalSeats) {
            seats.push({
                seatNumber: `${rows[rowIndex]}${seatInRow}`,
                isBooked: false,
            });
            seatInRow++;
            if (seatInRow > 10) { // 10 seats per row
                seatInRow = 1;
                rowIndex++;
            }
            count++;
        }
        this.seats = seats;
    }
});
const Train = (0, mongoose_1.model)('Train', TrainSchema);
exports.default = Train;
