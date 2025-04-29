import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
  const NODE_ENV = process.env.NODE_ENV || 'development'

  if (NODE_ENV === 'test') {
    console.log('Running in test environment. Skipping DB connection.')
    return
  }

  const MONGO_URI = process.env.MONGO_URI

  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in the environment variables.')
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
