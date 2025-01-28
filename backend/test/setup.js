// backend/test/setup.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

let mongoServer;

beforeAll(async () => {
  // Load environment variables specific to testing, if any
  dotenv.config({ path: '.env.test' }); // Ensure you have a .env.test file if needed

  // Initialize the in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory MongoDB
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Clear all data after each test to ensure test isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

afterAll(async () => {
  // Disconnect Mongoose and stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});
