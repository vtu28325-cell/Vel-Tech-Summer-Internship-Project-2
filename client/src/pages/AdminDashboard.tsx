import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAllBookings, type IBooking } from '../services/bookingService';
import { createTrain } from '../services/trainService';

interface TrainFormData {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  totalSeats: number;
  fare: number;
  duration: string;
  trainType: 'Express' | 'Superfast' | 'Rajdhani' | 'Shatabdi' | 'Local';
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'bookings' | 'addTrain'>('bookings');
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TrainFormData>();

  useEffect(() => {
    // Basic protection: if not admin, kick them out
    if (user?.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    if (activeTab === 'bookings') {
      fetchAllBookings();
    } else {
      setIsLoading(false);
    }
  }, [activeTab, user, navigate]);

  const fetchAllBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error: any) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const onAddTrain = async (data: TrainFormData) => {
    setIsSubmitting(true);
    try {
      // Structure the payload to match ITrain interface expected by backend
      const payload = {
        trainNumber: data.trainNumber,
        trainName: data.trainName,
        source: data.source,
        destination: data.destination,
        schedule: {
          departureTime: data.departureTime,
          arrivalTime: data.arrivalTime,
          date: data.date,
        },
        totalSeats: Number(data.totalSeats),
        fare: Number(data.fare),
        duration: data.duration,
        trainType: data.trainType,
      };

      await createTrain(payload as any);
      toast.success('Train added successfully!');
      reset();
      setActiveTab('bookings'); // switch back to bookings view
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add train');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl">🚆</Link>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
              ADMIN MODE
            </span>
            <Link to="/" className="text-slate-400 hover:text-white transition text-sm">
              Back to Site
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-2 text-sm font-semibold transition ${
              activeTab === 'bookings' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('addTrain')}
            className={`pb-4 px-2 text-sm font-semibold transition ${
              activeTab === 'addTrain' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Add New Train
          </button>
        </div>

        {/* Tab Content: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
                <p className="text-slate-400">No bookings found in the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-700/50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">PNR / Date</th>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Train Route</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-mono text-blue-400 font-bold">{booking.pnrNumber}</div>
                          <div className="text-xs text-slate-500 mt-1">{new Date(booking.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{(booking.user as any).name}</div>
                          <div className="text-xs text-slate-500">{(booking.user as any).email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{booking.train.trainNumber} - {booking.train.trainName}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {booking.train.source} → {booking.train.destination} <span className="mx-2">•</span> {booking.travelDate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${booking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' 
                            : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400'
                            : 'bg-orange-500/20 text-orange-400'}
                          `}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-400">
                          ₹{booking.totalFare}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Add Train */}
        {activeTab === 'addTrain' && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-6">Create New Train Schedule</h2>
            <form onSubmit={handleSubmit(onAddTrain)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Train Number</label>
                  <input
                    {...register('trainNumber', { required: true })}
                    placeholder="e.g. 12951"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Train Name</label>
                  <input
                    {...register('trainName', { required: true })}
                    placeholder="e.g. Rajdhani Express"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Source Station</label>
                  <input
                    {...register('source', { required: true })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Destination Station</label>
                  <input
                    {...register('destination', { required: true })}
                    placeholder="e.g. Delhi"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Departure Time</label>
                  <input
                    type="time"
                    {...register('departureTime', { required: true })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Arrival Time</label>
                  <input
                    type="time"
                    {...register('arrivalTime', { required: true })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    {...register('date', { required: true })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Total Seats</label>
                  <input
                    type="number"
                    {...register('totalSeats', { required: true, min: 1 })}
                    placeholder="e.g. 60"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fare (₹)</label>
                  <input
                    type="number"
                    {...register('fare', { required: true, min: 1 })}
                    placeholder="e.g. 1500"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                  <input
                    {...register('duration', { required: true })}
                    placeholder="e.g. 15h 30m"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Train Type</label>
                  <select
                    {...register('trainType')}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Express">Express</option>
                    <option value="Superfast">Superfast</option>
                    <option value="Rajdhani">Rajdhani</option>
                    <option value="Shatabdi">Shatabdi</option>
                    <option value="Local">Local</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  ) : (
                    'Save Train'
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
