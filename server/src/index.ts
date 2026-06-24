import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import trainRoutes from './routes/trainRoutes';
import bookingRoutes from './routes/bookingRoutes';

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Request logging in console

// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Train Ticket Booking API is running!',
  });
});

// API Routes
app.use('/api/auth', authRoutes); // Authentication endpoints
app.use('/api/trains', trainRoutes); // Train search and management
app.use('/api/bookings', bookingRoutes); // Booking endpoints

// Start the server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
