import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Train from './models/Train';

dotenv.config();

const trains = [
  {
    //Train1
    trainNumber: '12951',
    trainName: 'Mumbai - New Delhi Rajdhani Express',
    source: 'Mumbai',
    destination: 'Delhi',
    schedule: {
      departureTime: '17:00',
      arrivalTime: '08:32',
      date: '2026-07-01',
    },
    totalSeats: 50,
    fare: 2500,
    duration: '15h 32m',
    trainType: 'Rajdhani',
  },
  {
  trainNumber: '12627',
  trainName: 'Karnataka Express',
  source: 'Delhi',
  destination: 'Bangalore',
  schedule: {
    departureTime: '20:20',
    arrivalTime: '06:40',
    date: '2026-07-03',
  },
  totalSeats: 120,
  fare: 1950,
  duration: '34h 20m',
  trainType: 'Express',
},
{
  trainNumber: '12622',
  trainName: 'Tamil Nadu Express',
  source: 'Delhi',
  destination: 'Chennai',
  schedule: {
    departureTime: '22:30',
    arrivalTime: '07:00',
    date: '2026-07-03',
  },
  totalSeats: 110,
  fare: 2100,
  duration: '32h 30m',
  trainType: 'Superfast',
},
{
  trainNumber: '12839',
  trainName: 'Howrah Mail',
  source: 'Mumbai',
  destination: 'Kolkata',
  schedule: {
    departureTime: '19:15',
    arrivalTime: '05:45',
    date: '2026-07-03',
  },
  totalSeats: 95,
  fare: 1850,
  duration: '34h 30m',
  trainType: 'Mail',
},
{
  trainNumber: '12724',
  trainName: 'Telangana Express',
  source: 'Delhi',
  destination: 'Hyderabad',
  schedule: {
    departureTime: '16:35',
    arrivalTime: '16:10',
    date: '2026-07-03',
  },
  totalSeats: 100,
  fare: 1650,
  duration: '23h 35m',
  trainType: 'Superfast',
},
{
  trainNumber: '12626',
  trainName: 'Kerala Express',
  source: 'Delhi',
  destination: 'Trivandrum',
  schedule: {
    departureTime: '11:25',
    arrivalTime: '15:15',
    date: '2026-07-03',
  },
  totalSeats: 90,
  fare: 2400,
  duration: '51h 50m',
  trainType: 'Express',
  },
  {
    trainNumber: '12009',
    trainName: 'Mumbai - Ahmedabad Shatabdi Express',
    source: 'Mumbai',
    destination: 'Ahmedabad',
    schedule: {
      departureTime: '06:20',
      arrivalTime: '12:45',
      date: '2026-07-01',
    },
    totalSeats: 60,
    fare: 1200,
    duration: '6h 25m',
    trainType: 'Shatabdi',
  },
  {
    trainNumber: '12215',
    trainName: 'Delhi - Bandra Terminus Garibrath',
    source: 'Delhi',
    destination: 'Mumbai',
    schedule: {
      departureTime: '08:55',
      arrivalTime: '07:35',
      date: '2026-07-02',
    },
    totalSeats: 100,
    fare: 1050,
    duration: '22h 40m',
    trainType: 'Superfast',
  }
];

const seedTrains = async () => {
  try {
    await connectDB();

    await Train.deleteMany();
    console.log('Old trains deleted');

    for (const train of trains) {
      await Train.create(train as any);
    }
    console.log('Trains seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding trains:', error);
    process.exit(1);
  }
};

seedTrains();
