import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-2xl">🚆</span>
            TrainBook
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-emerald-400 font-bold hover:text-emerald-300 transition text-sm">
                    Admin Panel
                  </Link>
                )}
                <Link to="/my-bookings" className="text-slate-300 hover:text-white transition text-sm">
                  My Bookings
                </Link>
                <span className="text-slate-300 text-sm pl-2 border-l border-slate-600">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white text-sm transition">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="mb-4 inline-block px-4 py-1.5 bg-blue-600/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
          🚀 Book Train Tickets Instantly
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
          Your Journey Starts{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Here
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
          Search trains, book seats, and manage your tickets all in one place. Fast, reliable, and hassle-free.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {user ? (
            <Link
              to="/search"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition text-lg"
            >
              Search Trains 🔍
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-xl transition text-lg"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {[
            { icon: '🔍', title: 'Smart Search', desc: 'Find trains by source, destination, and travel date instantly.' },
            { icon: '🎫', title: 'Easy Booking', desc: 'Select your seats and confirm your booking in under 2 minutes.' },
            { icon: '📱', title: 'Manage Tickets', desc: 'View booking history, download tickets, and cancel if needed.' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left hover:border-blue-500/40 transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-6 text-center text-slate-500 text-sm">
        © 2026 TrainBook — Built with React + TypeScript + Node.js
      </footer>
    </div>
  );
};

export default HomePage;
