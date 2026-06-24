import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrainById, type ITrain } from '../services/trainService';
import { createBooking } from '../services/bookingService';
import toast from 'react-hot-toast';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [train, setTrain] = useState<ITrain | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for each passenger
  const [passengers, setPassengers] = useState<Record<string, { name: string; age: string; gender: string }>>({});

  useEffect(() => {
    if (id) fetchTrainDetails(id);
  }, [id]);

  const fetchTrainDetails = async (trainId: string) => {
    try {
      const data = await getTrainById(trainId);
      setTrain(data);
    } catch (error) {
      toast.error('Failed to load train details');
      navigate('/search');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeat = (seatNumber: string, isBooked: boolean) => {
    if (isBooked) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
      // Remove passenger data for this seat
      const newPassengers = { ...passengers };
      delete newPassengers[seatNumber];
      setPassengers(newPassengers);
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
      // Initialize passenger data for this new seat
      setPassengers({
        ...passengers,
        [seatNumber]: { name: '', age: '', gender: 'Male' },
      });
    }
  };

  const handlePassengerChange = (seat: string, field: string, value: string) => {
    setPassengers({
      ...passengers,
      [seat]: { ...passengers[seat], [field]: value },
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    // Validate all passenger details
    const formattedPassengers: any[] = [];
    for (const seat of selectedSeats) {
      const p = passengers[seat];
      if (!p.name || !p.age) {
        toast.error(`Please fill all details for seat ${seat}`);
        return;
      }
      formattedPassengers.push({
        seatNumber: seat,
        name: p.name,
        age: parseInt(p.age),
        gender: p.gender,
      });
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        trainId: train!._id,
        passengers: formattedPassengers,
      });
      toast.success('Seats locked! Proceeding to payment...');
      navigate(`/payment/${booking._id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !train) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate total fare
  const totalFare = selectedSeats.length * train.fare;

  return (
    <div className="min-h-screen bg-slate-900 pt-10 px-4 pb-20 text-slate-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Train Info & Seat Layout */}
        <div className="lg:col-span-2 space-y-6">
          {/* Train Summary Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-1">{train.trainName}</h2>
            <p className="text-slate-400 mb-6">
              {train.source} to {train.destination} • {train.schedule.date}
            </p>
            <div className="flex justify-between items-center px-4 py-3 bg-slate-900 rounded-xl border border-slate-700">
              <div>
                <div className="text-xl font-bold text-white">{train.schedule.departureTime}</div>
                <div className="text-sm">{train.source}</div>
              </div>
              <div className="text-center text-sm text-slate-500">
                <div>{train.duration}</div>
                <div className="w-24 h-px bg-slate-600 my-1 mx-auto"></div>
                <div className="text-blue-400">{train.trainType}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{train.schedule.arrivalTime}</div>
                <div className="text-sm">{train.destination}</div>
              </div>
            </div>
          </div>

          {/* Seat Map Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Select Seats</h3>
            <div className="flex gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-700 rounded"></div> Available</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded"></div> Selected</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500/50 rounded"></div> Booked</div>
            </div>

            <div className="grid grid-cols-10 gap-3 overflow-x-auto pb-4">
              {/* Note: train.seats comes from backend as any unfortunately because we didn't type select it perfectly, let's treat it as an array */}
              {(train as any).seats.map((seat: any) => {
                const isSelected = selectedSeats.includes(seat.seatNumber);
                return (
                  <button
                    key={seat.seatNumber}
                    onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
                    disabled={seat.isBooked}
                    className={`
                      h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition
                      ${seat.isBooked ? 'bg-red-500/20 text-red-400/50 cursor-not-allowed border border-red-500/20' 
                        : isSelected ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/40' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      }
                    `}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Passenger Details & Payment Summary */}
        <div className="space-y-6">
          {/* Passengers Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl min-h-[300px]">
            <h3 className="text-xl font-bold text-white mb-4">Passenger Details</h3>
            
            {selectedSeats.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>Please select a seat to enter passenger details.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedSeats.map((seat) => (
                  <div key={seat} className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3">
                    <div className="font-semibold text-blue-400">Seat {seat}</div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={passengers[seat]?.name || ''}
                      onChange={(e) => handlePassengerChange(seat, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Age"
                        value={passengers[seat]?.age || ''}
                        onChange={(e) => handlePassengerChange(seat, 'age', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <select
                        value={passengers[seat]?.gender || 'Male'}
                        onChange={(e) => handlePassengerChange(seat, 'gender', e.target.value)}
                        className="w-2/3 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fare Summary Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Fare Summary</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Base Fare (x{selectedSeats.length})</span>
                <span>₹{totalFare}</span>
              </div>
              <div className="flex justify-between text-sm text-green-400">
                <span>Taxes & Fees</span>
                <span>₹0 (Waived)</span>
              </div>
              <div className="w-full h-px bg-slate-700 my-3"></div>
              <div className="flex justify-between font-bold text-xl text-white">
                <span>Total Amount</span>
                <span>₹{totalFare}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                `Pay ₹${totalFare} & Book`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
