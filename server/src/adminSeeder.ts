import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = 'admin@trainbook.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user seeded successfully!');
    console.log('Email: admin@trainbook.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
