import mongoose from 'mongoose';
import config from './index.js';

/**
 * MongoDB connection handler
 * Uses singleton pattern to avoid multiple connections
 */
let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      // These options are now default in Mongoose 6+
      // but explicitly setting for clarity
    });

    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
}

export default connectDB;
