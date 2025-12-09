import mongoose, { Connection } from 'mongoose';

let isConnected = false;

const connectDB = async (): Promise<typeof mongoose> => {
  // If already connected, return the existing connection (important for serverless)
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose;
  }

  try {
    const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/swar-yoga-db';
    
    const conn = await mongoose.connect(mongoURI, {
      // Serverless-friendly connection options
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1, // Reduced for serverless
      minPoolSize: 0,
      retryWrites: true,
      w: 'majority',
    });
    
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const err = error as Error;
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.error('Make sure MongoDB is running or MongoDB Atlas URI is correct');
    isConnected = false;
    throw error;
  }
};

export default connectDB;
