import mongoose from 'mongoose';
import Quest from '../models/Quest.js'; // Adjust path if necessary

describe('Quest Schema', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/questTestDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up the test database and disconnect
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a valid Quest document', async () => {
    const validQuest = new Quest({
      user: new mongoose.Types.ObjectId(),
      originalTask: new mongoose.Types.ObjectId(),
      questTitle: 'Defeat the Laundry Dragon',
      questDescription: 'A fearsome dragon guards the pile of laundry. Defeat it by sorting, washing, and folding!',
    });

    const savedQuest = await validQuest.save();

    expect(savedQuest._id).toBeDefined();
    expect(savedQuest.questTitle).toBe('Defeat the Laundry Dragon');
    expect(savedQuest.questDescription).toBe('A fearsome dragon guards the pile of laundry. Defeat it by sorting, washing, and folding!');
    expect(savedQuest.isComplete).toBe(false); // Default value
  });

  it('should throw validation errors if required fields are missing', async () => {
    const invalidQuest = new Quest({
      // Missing required fields: user, originalTask, questTitle, questDescription
    });

    let error;
    try {
      await invalidQuest.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.user).toBeDefined();
    expect(error.errors.originalTask).toBeDefined();
    expect(error.errors.questTitle).toBeDefined();
    expect(error.errors.questDescription).toBeDefined();
  });

  it('should respect default values', async () => {
    const defaultQuest = new Quest({
      user: new mongoose.Types.ObjectId(),
      originalTask: new mongoose.Types.ObjectId(),
      questTitle: 'Default Quest',
      questDescription: 'A simple description.',
    });

    const savedQuest = await defaultQuest.save();
    expect(savedQuest.isComplete).toBe(false); // Default isComplete should be false
  });
});