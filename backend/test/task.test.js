import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Task from '../models/task.js'

let mongoServer

beforeAll(async () => {
  jest.setTimeout(30000) // Set timeout for long-running setup
  mongoServer = await MongoMemoryServer.create() // Start in-memory MongoDB
  const uri = mongoServer.getUri()
  await mongoose.connect(uri) // Connect to MongoDB
})

afterAll(async () => {
  await mongoose.disconnect() // Disconnect from MongoDB
  await mongoServer.stop() // Stop MongoDB server
})

afterEach(async () => {
  await Task.deleteMany() // Clear the Task collection after each test
})

describe('Task Model', () => {
  it('should create and save a task successfully', async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
      title: 'Complete project report',
      description: 'Finish writing the quarterly project report',
      priority: 'high',
      category: 'work',
    }

    const task = new Task(taskData)
    const savedTask = await task.save()

    expect(savedTask._id).toBeDefined()
    expect(savedTask.title).toBe(taskData.title)
    expect(savedTask.description).toBe(taskData.description)
    expect(savedTask.priority).toBe(taskData.priority)
    expect(savedTask.category).toBe(taskData.category)
    expect(savedTask.isCompleted).toBe(false) // Default value
  })

  it('should fail validation if required fields are missing', async () => {
    const taskData = { description: 'This task has no title or user' }

    const task = new Task(taskData)
    let error
    try {
      await task.save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.name).toBe('ValidationError')
    expect(error.errors['user']).toBeDefined()
    expect(error.errors['title']).toBeDefined()
  })

  it('should fail validation for invalid priority', async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
      title: 'Invalid priority test',
      description: 'This task has an invalid priority',
      priority: 'urgent', // Invalid value
    }

    const task = new Task(taskData)
    let error
    try {
      await task.save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.name).toBe('ValidationError')
    expect(error.errors['priority']).toBeDefined()
  })

  it('should default isCompleted to false', async () => {
    const taskData = {
      user: new mongoose.Types.ObjectId(),
      title: 'Task with default isCompleted',
      description: 'Testing default value for isCompleted',
      priority: 'low',
    }

    const task = new Task(taskData)
    const savedTask = await task.save()

    expect(savedTask.isCompleted).toBe(false) // Default value
  })
})
