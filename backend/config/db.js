import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config() // Load environment variables

const connectDB = async () => {
  const NODE_ENV = process.env.NODE_ENV || 'development'

  if (NODE_ENV === 'test') {
    // In test environment, skip connecting using MONGO_URI
    console.log('Running in test environment. Skipping DB connection.')
    return
  }

  const MONGO_URI = process.env.MONGO_URI

  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in the environment variables.')
    process.exit(1) // Exit process if the URI is missing
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1) // Exit process if the connection fails
  }
}

export default connectDB
