import { Schema, model } from 'mongoose';
import { IBooking } from '../interfaces/BookingInterface';

const PassengerSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  seatNumber: { type: String, required: true },
});

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    train: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
