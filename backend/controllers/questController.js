import Quest from '../models/Quest.js';
import Task from '../models/task.js';
import openai from '../config/openai.js';
import pLimit from 'p-limit';

/**
 * Create a quest from a task.
 */
export const createQuestsFromTasks = async (req, res) => {
  const { taskIds } = req.body;

  // Validate the input
  if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ error: 'An array of task IDs is required' });
  }

  try {
    const userId = req.user.id;
    const createdQuests = [];
    const skippedTasks = [];

    // Find all tasks in one query
    const tasks = await Task.find({ _id: { $in: taskIds }, user: userId });
    const taskMap = new Map(tasks.map((task) => [task._id.toString(), task]));

    // Check for already existing quests
    const existingQuests = await Quest.find({ originalTask: { $in: taskIds } });
    const existingTaskIds = new Set(
      existingQuests.map((quest) => quest.originalTask.toString())
    );

    // Create a rate limit for OpenAI API calls
    const limit = pLimit(3); // Allow up to 3 concurrent requests
    const openAiRequests = [];

    // Process each task
    for (const taskId of taskIds) {
      const task = taskMap.get(taskId);
      if (!task) {
        skippedTasks.push({
          taskId,
          reason: 'Task not found or not owned by the user',
        });
        continue;
      }

      if (existingTaskIds.has(taskId)) {
        skippedTasks.push({
          taskId,
          reason: 'Quest already exists for this task',
        });
        continue;
      }

      // Prepare OpenAI request
      openAiRequests.push(
        limit(async () => {
          try {
            const prompt = `
                Create a short and concise fantasy RPG-style quest based on the following real-life task. The quest description should be no longer than 2-3 sentences, The response must be pure JSON, with no additional text or formatting:
                
                Task Title: ${task.title}
                Task Description: ${task.description}
              `;

            const response = await openai.chat.completions.create({
              model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a creative assistant that specialises in writing fantasy RPG quests based on real-life tasks.',
                },
                { role: 'user', content: prompt },
              ],
              max_tokens: 100,
              temperature: 0.5,
            });

            if (!response.choices || response.choices.length === 0) {
              throw new Error('Invalid response from OpenAI API');
            }

            const rawText = response.choices[0].message.content.trim();
            const questData = JSON.parse(rawText);

            // Add to created quests
            createdQuests.push({
              user: userId,
              originalTask: task._id,
              questTitle: questData.questTitle || 'Untitled Quest',
              questDescription: questData.questDescription || 'No description available.',
              isComplete: false,
            });
          } catch (error) {
            console.error(`Failed to process task ID ${taskId}:`, error.message);
            skippedTasks.push({ taskId, reason: 'OpenAI response error' });
          }
        })
      );
    }

    // Wait for all OpenAI requests to finish
    await Promise.all(openAiRequests);

    // Insert all created quests into the database
    if (createdQuests.length > 0) {
      await Quest.insertMany(createdQuests);
    }

    // Return the results
    res.status(201).json({
      message: `${createdQuests.length} quests created successfully.`,
      quests: createdQuests,
      skippedTasks,
    });
  } catch (error) {
    console.error('Error creating quests:', error.message);
    res.status(500).json({ error: 'Failed to create quests', details: error.message });
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