import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, processPayment, type IBooking } from '../services/bookingService';
import toast from 'react-hot-toast';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock card state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (id) fetchBooking(id);
  }, [id]);

  const fetchBooking = async (bookingId: string) => {
    try {
      const data = await getBookingById(bookingId);
      if (data.paymentStatus === 'Completed') {
        toast('Payment already completed', { icon: 'ℹ️' });
        navigate('/my-bookings');
        return;
      }
      setBooking(data);
    } catch (error) {
      toast.error('Failed to load booking details');
      navigate('/my-bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) {
      toast.error('Please enter all card details');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate network delay for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      await processPayment(booking!._id);
      toast.success('Payment successful! Booking Confirmed 🎉');
      navigate('/my-bookings');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-10 px-4 pb-20 flex justify-center items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Booking Summary */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>
            <div className="space-y-4 text-slate-300">
              <div className="flex justify-between pb-4 border-b border-slate-700">
                <span className="text-slate-400">Train</span>
                <span className="font-semibold text-white">{booking.train.trainName}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-slate-700">
                <span className="text-slate-400">Route</span>
                <span className="font-semibold text-white">{booking.train.source} → {booking.train.destination}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-slate-700">
                <span className="text-slate-400">Date</span>
                <span className="font-semibold text-white">{booking.travelDate}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-slate-700">
                <span className="text-slate-400">Passengers</span>
                <span className="font-semibold text-white">{booking.passengers.length}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-600">
            <div className="flex justify-between items-end">
              <span className="text-slate-400">Total Amount Payable</span>
              <span className="text-3xl font-bold text-emerald-400">₹{booking.totalFare}</span>
            </div>
          </div>
        </div>

        {/* Payment Form (Demo) */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl relative overflow-hidden">
          {/* Demo Ribbon */}
          <div className="absolute top-4 -right-10 bg-orange-500 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-md">
            TEST MODE
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
          <p className="text-sm text-slate-400 mb-8">Enter any dummy card numbers to test the flow.</p>

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  maxLength={5}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${booking.totalFare}`
                )}
              </button>
              <div className="text-center mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
                <span>🔒</span> Payments are securely processed via Dummy Stripe Gateway
              </div>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default PaymentPage;
