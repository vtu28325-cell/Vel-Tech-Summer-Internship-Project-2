import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getTrains, type ITrain } from '../services/trainService';
import toast from 'react-hot-toast';

interface SearchFormData {
  source: string;
  destination: string;
  date: string;
}

const SearchPage: React.FC = () => {
  const { register, handleSubmit } = useForm<SearchFormData>();
  const [trains, setTrains] = useState<ITrain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch all trains on initial load
  useEffect(() => {
    fetchTrains();
  }, []);

  const fetchTrains = async (params?: SearchFormData) => {
    setIsLoading(true);
    try {
      // Remove empty strings from params
      const cleanParams = params
        ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== ''))
        : undefined;

      const data = await getTrains(cleanParams);
      setTrains(data);
      if (params) setHasSearched(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch trains');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: SearchFormData) => {
    fetchTrains(data);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-10 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header & Nav */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-2xl">🚆</span>
            TrainBook
          </Link>
          <h1 className="text-2xl font-bold text-white">Search Trains</h1>
        </div>

        {/* Search Box */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl mb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">From</label>
              <input
                type="text"
                {...register('source')}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">To</label>
              <input
                type="text"
                {...register('destination')}
                placeholder="e.g. Delhi"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-2 h-[50px]"
            >
              Search 🔍
            </button>
          </form>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : trains.length === 0 ? (
          <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
            <div className="text-4xl mb-4">🤷‍♂️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No trains found</h3>
            <p className="text-slate-400">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-slate-300 font-medium mb-4">
              {hasSearched ? `Found ${trains.length} trains for your route` : `All Available Trains (${trains.length})`}
            </h3>
            
            {trains.map((train) => (
              <div
                key={train._id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/40 transition shadow-lg flex flex-col md:flex-row justify-between items-center gap-6"
              >
                {/* Train Info */}
                <div className="w-full md:w-1/3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-bold rounded">
                      {train.trainNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {train.trainType}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{train.trainName}</h2>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span>{train.source}</span>
                    <span>→</span>
                    <span>{train.destination}</span>
                  </div>
                </div>

                {/* Timing */}
                <div className="w-full md:w-1/3 flex justify-between items-center px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{train.schedule.departureTime}</div>
                    <div className="text-xs text-slate-500">{train.source}</div>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-xs text-slate-400 mb-1">{train.duration}</span>
                    <div className="w-16 h-px bg-slate-600 relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{train.schedule.arrivalTime}</div>
                    <div className="text-xs text-slate-500">{train.destination}</div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="w-full md:w-1/3 flex justify-between md:justify-end items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">₹{train.fare}</div>
                    <div className="text-sm text-slate-400">
                      <span className={train.availableSeats < 20 ? 'text-orange-400 font-medium' : 'text-emerald-500'}>
                        {train.availableSeats} seats left
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/booking/${train._id}`}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
