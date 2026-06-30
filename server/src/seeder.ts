import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Train from './models/Train';

dotenv.config();

import { trains } from './data/trains';
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
