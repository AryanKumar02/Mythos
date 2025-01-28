// backend/test/User.test.js
import User from '../models/User.js'; // Ensure the correct path and proper import
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
  jest.setTimeout(30000); // Set timeout for long-running setup
  mongoServer = await MongoMemoryServer.create(); // Start in-memory MongoDB
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // Connect to MongoDB
});

afterAll(async () => {
  await mongoose.disconnect(); // Disconnect from MongoDB
  await mongoServer.stop(); // Stop MongoDB server
});

afterEach(async () => {
  await User.deleteMany(); // Clear the User collection after each test
});



describe('User Model Tests', () => {
  it('should register a user and hash the password', async () => {
    const newUser = new User({
      username: `TestUser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'Secure@123',
    });

    const savedUser = await newUser.save();
    expect(savedUser).toBeDefined();
    expect(savedUser.password).not.toBe('Secure@123'); // Ensure password is hashed
  });

  it('should login a user with valid credentials', async () => {
    const newUser = new User({
      username: `TestUser_${Date.now()}`,
      email: `login_${Date.now()}@example.com`,
      password: 'Secure@123',
    });

    await newUser.save();

    const user = await User.findOne({ email: newUser.email });
    const isMatch = await user.comparePassword('Secure@123');
    expect(isMatch).toBe(true); // Login should succeed
  });

  it('should fail to save a user with an invalid password', async () => {
    const newUser = new User({
      username: `InvalidUser_${Date.now()}`,
      email: `invalid_${Date.now()}@example.com`,
      password: 'short',
    });

    await expect(newUser.save()).rejects.toThrow(
      'Path `password` (`short`) is shorter than the minimum allowed length (8).',
    );
  });

  it('should generate a password reset token', async () => {
    const newUser = new User({
      username: `ResetTokenUser_${Date.now()}`,
      email: `reset_${Date.now()}@example.com`,
      password: 'Securepassword@123',
    });

    await newUser.save();

    const user = await User.findOne({ email: newUser.email });
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    expect(resetToken).toBeDefined();
    expect(user.resetPasswordToken).not.toBe(resetToken); // Ensure token is hashed
  });
});
