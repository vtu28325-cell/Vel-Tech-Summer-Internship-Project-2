import { Document } from 'mongoose';

export interface ISeat {
  seatNumber: string;
  isBooked: boolean;
}

export interface ISchedule {
  departureTime: string; // e.g. "06:30"
  arrivalTime: string;   // e.g. "12:45"
  date: string;          // e.g. "2026-06-25"
}

export interface ITrain extends Document {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  schedule: ISchedule;
  totalSeats: number;
  availableSeats: number;
  seats: ISeat[];
  fare: number;           // Price per ticket in rupees
  duration: string;       // e.g. "6h 15m"
  trainType: 'Express' | 'Superfast' | 'Rajdhani' | 'Shatabdi' | 'Local';
  createdAt: Date;
  updatedAt: Date;
}
