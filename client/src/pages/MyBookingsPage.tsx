import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, type IBooking } from '../services/bookingService';
import toast from 'react-hot-toast';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-10 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-2xl">🚆</span>
            TrainBook
          </Link>
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-slate-400 mb-6">Looks like you haven't booked any tickets yet.</p>
            <Link
              to="/search"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition"
            >
              Search Trains
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                {/* Ticket Header */}
                <div className="bg-slate-700/50 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-md font-mono font-bold tracking-wider">
                      PNR: {booking.pnrNumber}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${booking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' 
                      : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400'
                      : 'bg-orange-500/20 text-orange-400'}
                    `}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm mt-2 md:mt-0">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Train Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {booking.train.trainName} <span className="text-sm font-normal text-slate-400">({booking.train.trainNumber})</span>
                    </h3>
                    <div className="flex items-center gap-4 text-slate-300 text-sm mb-6">
                      <div className="font-semibold">{booking.train.source}</div>
                      <div className="text-slate-500">→</div>
                      <div className="font-semibold">{booking.train.destination}</div>
                      <div className="w-px h-4 bg-slate-600 mx-2"></div>
                      <div className="text-blue-400 font-medium">{booking.travelDate}</div>
                    </div>

                    {/* Passenger List */}
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Passengers</h4>
                    <div className="space-y-2">
                      {booking.passengers.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700/50">
                          <div className="text-white text-sm font-medium">{p.name} <span className="text-slate-500 text-xs ml-2">{p.age} yrs, {p.gender}</span></div>
                          <div className="text-emerald-400 font-bold font-mono">Seat: {p.seatNumber}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                    <div className="text-center">
                      <div className="text-slate-400 text-sm mb-1">Total Amount Paid</div>
                      <div className="text-3xl font-bold text-white mb-4">₹{booking.totalFare}</div>
                      <div className={`text-sm font-medium
                        ${booking.paymentStatus === 'Completed' ? 'text-emerald-400' 
                        : booking.paymentStatus === 'Pending' ? 'text-orange-400' : 'text-red-400'}
                      `}>
                        Payment: {booking.paymentStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
