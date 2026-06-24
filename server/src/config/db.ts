import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`🍃[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️[database]: MongoDB Connection Failed: ${(error as Error).message}`);
    console.log(`⚠️[database]: Server will run in OFFLINE mode (database functions won't work).`);
  }
};

export default connectDB;
