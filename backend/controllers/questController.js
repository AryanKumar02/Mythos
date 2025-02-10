import Quest from '../models/Quest.js'
import Task from '../models/task.js'
import openai from '../config/openai.js'
import User from '../models/User.js'
import pLimit from 'p-limit'
import { io } from '../index.js'
import {
  getPaginationParams,
  formatPaginationResult,
} from '../utills/paginationControl.js'

// GPT-4 Turbo context window is 128k, keep system message concise
const SYSTEM_MESSAGE = {
  role: 'system',
  content:
    'Generate fantasy RPG quests from real-life tasks. Respond with valid JSON: {questTitle: string, questDescription: string, xp: number}',
}

export const createQuestsFromTasks = async (req, res) => {
  const { taskIds } = req.body

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ error: 'Array of task IDs required' })
  }

  try {
    const userId = req.user.id.toString()
    const [tasks, existingQuests] = await Promise.all([
      Task.find({ _id: { $in: taskIds }, user: userId }).lean(),
      Quest.find({ originalTask: { $in: taskIds } }).lean(),
    ])

    const existingTaskIds = new Set(
      existingQuests.map((q) => q.originalTask.toString()),
    )
    const taskMap = new Map(tasks.map((t) => [t._id.toString(), t]))

    const limit = pLimit(5) // Increased concurrency for modern GPT-4 Turbo
    const results = await Promise.allSettled(
      taskIds.map((taskId) =>
        limit(async () => {
          if (existingTaskIds.has(taskId))
            return { taskId, status: 'skipped', reason: 'Quest exists' }

          const task = taskMap.get(taskId)
          if (!task)
            return { taskId, status: 'skipped', reason: 'Task not found' }

          try {
            const prompt = `Create a concise RPG quest (2-3 sentences) for: ${task.title} - ${task.description}. Include the quest title, description, and XP reward.`

            const response = await openai.chat.completions.create({
              model: process.env.OPENAI_MODEL || 'gpt-4',
              messages: [SYSTEM_MESSAGE, { role: 'user', content: prompt }],
              response_format: { type: 'json_object' },
              max_tokens: parseFloat(process.env.OPENAI_MAX_TOKENS),
              temperature: parseFloat(process.env.OPENAI_TEMPERATURE), // Lower temp for more consistent JSON
            })

            const rawJSON = response.choices[0].message.content
            const questData = parseAndValidateQuestJSON(rawJSON)

            return {
              taskId,
              status: 'success',
              quest: {
                user: userId,
                originalTask: task._id,
                ...questData,
                isComplete: false,
                xpReward: Math.min(Math.max(questData.xp, 10), 50), // Clamp XP between 10-50
              },
            }
          } catch (error) {
            console.error(`Task ${taskId} failed:`, error)
            return { taskId, status: 'error', reason: 'API error' }
          }
        }),
      ),
    )

    const [createdQuests, skippedTasks] = results.reduce(
      ([success, skipped], result) => {
        const value = result.value || result.reason
        return value.status === 'success'
          ? [[...success, value.quest], skipped]
          : [success, [...skipped, value]]
      },
      [[], []],
    )

    if (createdQuests.length > 0) {
      const insertedQuests = await Quest.insertMany(createdQuests)
      insertedQuests.forEach((quest) => {
        io.to(userId).emit('questCreated', { quest })
      })
    }

    res.status(201).json({
      created: createdQuests.length,
      skipped: skippedTasks,
      quests: createdQuests,
    })
  } catch (error) {
    console.error('Quest creation error:', error)
    res
      .status(500)
      .json({ error: 'Failed to create quests', details: error.message })
  }
}

export const getQuestsByUser = async (req, res) => {
  try {
    // Extract pagination parameters from the request query
    const { page, limit, skip } = getPaginationParams(req.query)

    // Retrieve quests for the user with pagination
    const [quests, totalCount] = await Promise.all([
      Quest.find({ user: req.user.id })
        .populate('originalTask', 'title description')
        .lean()
        .skip(skip)
        .limit(limit),
      Quest.countDocuments({ user: req.user.id }),
    ])

    // Format the pagination result
    const paginatedData = formatPaginationResult(
      totalCount,
      quests,
      page,
      limit,
    )
    res.json(paginatedData)
  } catch (error) {
    console.error('Quest fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch quests' })
  }
}

export const completeQuest = async (req, res) => {
  try {
    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.questId, user: req.user.id, isComplete: false },
      { isComplete: true },
      { new: true },
    )

    if (!quest)
      return res.status(404).json({ error: 'Quest not found or completed' })

    const user = await User.findById(req.user.id)
    user.xp += quest.xpReward

    // Calculate level ups
    let levelsGained = 0
    while (user.xp >= user.level * 100) {
      user.xp -= user.level * 100
      user.level += 1
      levelsGained += 1
    }

    // Streak handling with UTC dates
    const now = new Date()
    const todayUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    )

    if (!user.lastStreakDate || todayUTC - user.lastStreakDate > 86400000) {
      user.streak =
        user.lastStreakDate && todayUTC - user.lastStreakDate < 172800000
          ? user.streak
          : 0
      user.dailyQuestCount = 0
    }

    user.dailyQuestCount += 1
    user.lastStreakDate = todayUTC

    if (user.dailyQuestCount === 3) {
      user.streak += 1
      user.dailyQuestCount = 0
      io.to(user.id).emit('streakUpdated', { streak: user.streak })
    }

    await user.save()


    // Emit events
    const emitPayload = {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      quest,
    }

    io.to(user.id).emit('questCompleted', emitPayload)
    if (levelsGained > 0) io.to(user.id).emit('levelUp', { level: user.level })

    res.json(emitPayload)
  } catch (error) {
    console.error('Quest completion error:', error)
    res.status(500).json({ error: 'Failed to complete quest' })
  }
}

// Helper function for JSON validation
function parseAndValidateQuestJSON(rawJSON) {
  const jsonString = rawJSON
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()
  const data = JSON.parse(jsonString)

  if (
    !data.questTitle ||
    !data.questDescription ||
    typeof data.xp !== 'number'
  ) {
    throw new Error('Invalid quest format from OpenAI')
  }

  return data
}