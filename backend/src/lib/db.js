import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables (only needed here if not loaded elsewhere)
dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined in your .env file');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error?.message || error}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
