import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.warn('WARNING: MONGODB_URI environment variable is missing.');
      console.log('Skipping MongoDB connection. App will use mock storage / process requests in-memory if MongoDB is not available.');
      return;
    }
    
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Application running, but database connection is unavailable.');
    // We don't exit the process immediately, so user can still see frontend and play with mockup.
  }
};

export default connectDB;
