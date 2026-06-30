import { Request, Response } from 'express';
import Train from '../models/Train';

// @desc    Get all trains or search trains by source, destination, and date
// @route   GET /api/trains
// @access  Public
export const getTrains = async (req: Request, res: Response): Promise<void> => {
  try {
    const { source, destination, date } = req.query;

    // Build query object based on provided search params
    const query: any = {};
    if (source) query.source = { $regex: new RegExp(source as string, 'i') }; // Case-insensitive match
    if (destination) query.destination = { $regex: new RegExp(destination as string, 'i') };
    if (date) query['schedule.date'] = date;

    const trains = await Train.find(query).select('-seats'); // Don't return all 500+ seat objects for basic search

    res.status(200).json(trains);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single train details by ID
// @route   GET /api/trains/:id
// @access  Public
export const getTrainById = async (req: Request, res: Response): Promise<void> => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      res.status(404).json({ message: 'Train not found' });
      return;
    }

    res.status(200).json(train);
  } catch (error: any) {
    res.status(500).json({ message: 'Invalid train ID or Server Error' });
  }
};

// @desc    Create a new train
// @route   POST /api/trains
// @access  Private/Admin
export const createTrain = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      trainNumber,
      trainName,
      source,
      destination,
      schedule,
      totalSeats,
      fare,
      duration,
      trainType,
    } = req.body;

    const trainExists = await Train.findOne({ trainNumber });

    if (trainExists) {
      res.status(400).json({ message: 'Train with this number already exists' });
      return;
    }

    const train = await Train.create({
      trainNumber,
      trainName,
      source,
      destination,
      schedule,
      totalSeats,
      fare,
      duration,
      trainType,
    });

    res.status(201).json(train);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Seed trains for production
// @route   GET /api/trains/seed
// @access  Public
export const seedTrains = async (req: Request, res: Response): Promise<void> => {
  try {
    const trains = [
      {
        trainNumber: '12951', trainName: 'Mumbai - New Delhi Rajdhani Express',
        source: 'Mumbai', destination: 'Delhi',
        schedule: { departureTime: '17:00', arrivalTime: '08:32', date: '2026-07-01' },
        totalSeats: 50, fare: 2500, duration: '15h 32m', trainType: 'Rajdhani'
      },
      {
        trainNumber: '12627', trainName: 'Karnataka Express',
        source: 'Delhi', destination: 'Bangalore',
        schedule: { departureTime: '20:20', arrivalTime: '06:40', date: '2026-07-03' },
        totalSeats: 120, fare: 1950, duration: '34h 20m', trainType: 'Express'
      },
      {
        trainNumber: '12622', trainName: 'Tamil Nadu Express',
        source: 'Delhi', destination: 'Chennai',
        schedule: { departureTime: '22:30', arrivalTime: '07:00', date: '2026-07-03' },
        totalSeats: 110, fare: 2100, duration: '32h 30m', trainType: 'Superfast'
      }
    ];

    await Train.deleteMany({});
    for (const train of trains) {
      await Train.create(train as any);
    }
    
    res.status(200).json({ message: 'Trains seeded successfully!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
