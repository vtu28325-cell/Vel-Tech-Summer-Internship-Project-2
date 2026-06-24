import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, processPayment, getAllBookings } from '../controllers/bookingController';
import protect, { admin } from '../middleware/protect';

const router = Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, createBooking);

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, getAllBookings);

// @route   GET /api/bookings/mybookings
// @desc    Get logged in user's bookings
// @access  Private
router.get('/mybookings', protect, getMyBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', protect, getBookingById);

// @route   PUT /api/bookings/:id/pay
// @desc    Process payment
// @access  Private
router.put('/:id/pay', protect, processPayment);

export default router;
