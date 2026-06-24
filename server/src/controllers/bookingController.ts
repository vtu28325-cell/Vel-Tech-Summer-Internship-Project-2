import { Response } from 'express';
import Booking from '../models/Booking';
import Train from '../models/Train';
import { AuthRequest } from '../middleware/protect';

// Helper function to generate a random 10-digit PNR
const generatePNR = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trainId, passengers } = req.body;
    const userId = req.user._id;

    // 1. Find the train
    const train = await Train.findById(trainId);
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
    const requestedSeatNumbers = passengers.map((p: any) => p.seatNumber);
    let seatsAvailable = true;

    train.seats.forEach((seat) => {
      if (requestedSeatNumbers.includes(seat.seatNumber)) {
        if (seat.isBooked) {
          seatsAvailable = false; // Someone else just booked it!
        } else {
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
    const booking = await Booking.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Find all bookings for the logged-in user, and populate the train details
    const bookings = await Booking.find({ user: req.user._id })
      .populate('train', 'trainNumber trainName source destination schedule')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get booking details by ID (or PNR)
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'train',
      'trainNumber trainName source destination schedule'
    );

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
  } catch (error: any) {
    res.status(500).json({ message: 'Invalid booking ID or Server Error' });
  }
};

// @desc    Process payment for a booking
// @route   PUT /api/bookings/:id/pay
// @access  Private
export const processPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

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
  } catch (error: any) {
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('train', 'trainNumber trainName source destination schedule')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
