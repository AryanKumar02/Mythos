import Quest from '../models/Quest.js';
import Task from '../models/task.js';
import openai from '../config/openai.js';

/**
 * Create a quest from a task.
 */
export const createQuestFromTask = async (req, res) => {
  const { taskId } = req.body;

  // Validate taskId
  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    // 1. Ensure the task belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not owned by the user' });
    }

    // 2. Construct a concise prompt for OpenAI
    const prompt = `
      Create a short and concise fantasy RPG-style quest based on the following real-life task. The quest description should be no longer than 2-3 sentences, The response must be pure JSON, with no additional text or formatting:
      
      Task Title: ${task.title}
      Task Description: ${task.description}

      Format the response as JSON:
      {
        "questTitle": "A short creative title for the quest",,
        "questDescription": "A concise and engaging description for the quest in 2-3 sentences."
      }
    `;

    // 3. Call OpenAI API (updated to use chat completion)
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo', // Configurable model
      messages: [
        { role: 'system', content: 'You are a creative assistant that specialises in writing fantasy RPG quests based on real-life tasks.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    // Handle potential response issues
    if (!response || !response.choices || response.choices.length === 0) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    // 4. Parse OpenAI response
    const rawText = response.choices[0].message.content.trim();
    const sanitisedText = rawText
      .replace(/\\n/g, '\\n') // Ensure newlines are escaped
      .replace(/\\\"/g, '"') // Fix escaped quotes
      .replace(/\\$/g, ''); // Remove trailing backslashes
    let questData;
    try {
      questData = JSON.parse(sanitisedText); // Parse the JSON returned by OpenAI
    } catch (error) {
      console.error('Error parsing OpenAI response:', sanitisedText);
      return res.status(500).json({ error: 'Failed to parse OpenAI response', details: sanitisedText });
    }

    // 5. Save the quest in the database
    const newQuest = new Quest({
      user: req.user.id,
      originalTask: task._id,
      questTitle: questData.questTitle || 'Untitled Quest',
      questDescription: questData.questDescription || 'No description available.',
      isComplete: false, // Default to incomplete
    });

    await newQuest.save();

    // 6. Respond with the created quest
    res.status(201).json(newQuest);
  } catch (error) {
    console.error('Error creating quest:', error.message);
    res.status(500).json({ error: 'Failed to create quest', details: error.message });
  }
};

/**
 * Fetch all quests for the authenticated user.
 */
export const getQuestsByUser = async (req, res) => {
  try {
    const quests = await Quest.find({ user: req.user.id }).populate('originalTask');
    res.status(200).json(quests);
  } catch (error) {
    console.error('Error fetching quests:', error.message);
    res.status(500).json({ error: 'Failed to fetch quests', details: error.message });
  }
};

/**
 * Mark a quest as complete.
 */
export const completeQuest = async (req, res) => {
  const { questId } = req.params;

  try {
    const quest = await Quest.findOne({ _id: questId, user: req.user.id });
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found or not owned by the user' });
    }

    quest.isComplete = true;
    await quest.save();

    res.status(200).json(quest);
  } catch (error) {
    console.error('Error completing quest:', error.message);
    res.status(500).json({ error: 'Failed to complete quest', details: error.message });
  }
};