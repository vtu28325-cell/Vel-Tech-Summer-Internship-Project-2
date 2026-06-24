import api from './api';
import type { ITrain } from './trainService';

export interface IPassengerInput {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber: string;
}

export interface IBooking {
  _id: string;
  user: string;
  train: ITrain;
  pnrNumber: string;
  passengers: IPassengerInput[];
  totalFare: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  travelDate: string;
  createdAt: string;
}

// Create a new booking
export const createBooking = async (bookingData: { trainId: string; passengers: IPassengerInput[] }): Promise<IBooking> => {
  const response = await api.post<IBooking>('/bookings', bookingData);
  return response.data;
};

// Get my bookings
export const getMyBookings = async (): Promise<IBooking[]> => {
  const response = await api.get<IBooking[]>('/bookings/mybookings');
  return response.data;
};

// Get a single booking
export const getBookingById = async (id: string): Promise<IBooking> => {
  const response = await api.get<IBooking>(`/bookings/${id}`);
  return response.data;
};

// Process mock payment
export const processPayment = async (id: string): Promise<IBooking> => {
  const response = await api.put<IBooking>(`/bookings/${id}/pay`);
  return response.data;
};

// Get all bookings (Admin only)
export const getAllBookings = async (): Promise<IBooking[]> => {
  const response = await api.get<IBooking[]>('/bookings');
  return response.data;
};
