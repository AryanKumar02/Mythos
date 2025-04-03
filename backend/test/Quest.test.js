import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Quest from '../models/Quest.js'

let mongoServer

describe('Quest Schema', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  })

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
    await mongoose.disconnect()
    await mongoServer.stop()
  })

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
    expect(savedQuest.isComplete).toBe(false)
  })

  it('should throw validation errors if required fields are missing', async () => {
    const invalidQuest = new Quest({})

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
    expect(savedQuest.isComplete).toBe(false)
  })
})
