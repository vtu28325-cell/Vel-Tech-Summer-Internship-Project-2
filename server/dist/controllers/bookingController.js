"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.processPayment = exports.getBookingById = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Train_1 = __importDefault(require("../models/Train"));
// Helper function to generate a random 10-digit PNR
const generatePNR = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};
// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { trainId, passengers } = req.body;
        const userId = req.user._id;
        // 1. Find the train
        const train = await Train_1.default.findById(trainId);
        if (!train) {
            res.status(404).json({ message: 'Train not found' });
            return;
        }
        // 2. Calculate fare based on number of passengers
        const numberOfSeats = passengers.length;
        if (train.availableSeats < numberOfSeats) {
            res.status(400).json({ message: 'Not enough seats available' });
            return;
        }
        const totalFare = train.fare * numberOfSeats;
        // 3. Mark selected seats as booked in the Train model
        // Note: In a real highly concurrent app, this requires transaction locks.
        const requestedSeatNumbers = passengers.map((p) => p.seatNumber);
        let seatsAvailable = true;
        train.seats.forEach((seat) => {
            if (requestedSeatNumbers.includes(seat.seatNumber)) {
                if (seat.isBooked) {
                    seatsAvailable = false; // Someone else just booked it!
                }
                else {
                    seat.isBooked = true;
                }
            }
        });
        if (!seatsAvailable) {
            res.status(400).json({ message: 'One or more selected seats are already booked' });
            return;
        }
        // 4. Update available seat count and save train
        train.availableSeats -= numberOfSeats;
        await train.save();
        // 5. Create the booking record
        const pnrNumber = generatePNR();
        const booking = await Booking_1.default.create({
            user: userId,
            train: trainId,
            pnrNumber,
            passengers,
            totalFare,
            status: 'Pending', // Wait for payment
            paymentStatus: 'Pending',
            travelDate: train.schedule.date,
        });
        res.status(201).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.createBooking = createBooking;
// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        // Find all bookings for the logged-in user, and populate the train details
        const bookings = await Booking_1.default.find({ user: req.user._id })
            .populate('train', 'trainNumber trainName source destination schedule')
            .sort({ createdAt: -1 }); // Newest first
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getMyBookings = getMyBookings;
// @desc    Get booking details by ID (or PNR)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id).populate('train', 'trainNumber trainName source destination schedule');
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        // Ensure the booking belongs to the logged-in user
        if (booking.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized to view this booking' });
            return;
        }
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Invalid booking ID or Server Error' });
    }
};
exports.getBookingById = getBookingById;
// @desc    Process payment for a booking
// @route   PUT /api/bookings/:id/pay
// @access  Private
const processPayment = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        // Simulate payment processing (in a real app, integrate Stripe here)
        // We'll just assume payment is successful if they hit this endpoint
        booking.paymentStatus = 'Completed';
        booking.status = 'Confirmed';
        const updatedBooking = await booking.save();
        res.status(200).json(updatedBooking);
    }
    catch (error) {
        res.status(500).json({ message: 'Payment processing failed' });
    }
};
exports.processPayment = processPayment;
// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.default.find()
            .populate('user', 'name email')
            .populate('train', 'trainNumber trainName source destination schedule')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getAllBookings = getAllBookings;
