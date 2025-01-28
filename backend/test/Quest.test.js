// backend/test/Quest.test.js
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Quest from '../models/Quest.js' // Adjust the path if necessary

let mongoServer

describe('Quest Schema', () => {
  // Hook to run before all tests in this describe block
  beforeAll(async () => {
    // Initialize the in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    // Connect mongoose to the in-memory server
    await mongoose.connect(uri, {
      // No need for useNewUrlParser or useUnifiedTopology in Mongoose 6+
      // You can add other options here if necessary
    })
  })

  // Hook to run after all tests in this describe block
  afterAll(async () => {
    // Check if mongoose is connected before attempting to drop the database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  // Hook to run after each test to ensure test isolation
  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  it('should create a valid Quest document', async () => {
    const validQuest = new Quest({
      user: new mongoose.Types.ObjectId(),
      originalTask: new mongoose.Types.ObjectId(),
      questTitle: 'Defeat the Laundry Dragon',
      questDescription:
        'A fearsome dragon guards the pile of laundry. Defeat it by sorting, washing, and folding!',
    })

    const savedQuest = await validQuest.save()

    expect(savedQuest._id).toBeDefined()
    expect(savedQuest.questTitle).toBe('Defeat the Laundry Dragon')
    expect(savedQuest.questDescription).toBe(
      'A fearsome dragon guards the pile of laundry. Defeat it by sorting, washing, and folding!',
    )
    expect(savedQuest.isComplete).toBe(false) // Default value
  })

  it('should throw validation errors if required fields are missing', async () => {
    const invalidQuest = new Quest({
      // Missing required fields: user, originalTask, questTitle, questDescription
    })

    let error
    try {
      await invalidQuest.save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.name).toBe('ValidationError')
    expect(error.errors.user).toBeDefined()
    expect(error.errors.originalTask).toBeDefined()
    expect(error.errors.questTitle).toBeDefined()
    expect(error.errors.questDescription).toBeDefined()
  })

  it('should respect default values', async () => {
    const defaultQuest = new Quest({
      user: new mongoose.Types.ObjectId(),
      originalTask: new mongoose.Types.ObjectId(),
      questTitle: 'Default Quest',
      questDescription: 'A simple description.',
    })

    const savedQuest = await defaultQuest.save()
    expect(savedQuest.isComplete).toBe(false) // Default isComplete should be false
  })
})
