import { Document, Types } from 'mongoose';

export interface IPassenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber: string;
}

export interface IBooking extends Document {
  user: Types.ObjectId; // Reference to User
  train: Types.ObjectId; // Reference to Train
  pnrNumber: string; // Unique 10-digit PNR
  passengers: IPassenger[];
  totalFare: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  travelDate: string;
  createdAt: Date;
  updatedAt: Date;
}
