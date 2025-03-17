import Task from '../models/task.js'
import Quest from '../models/Quest.js'
import openai from '../config/openai.js'
import { io } from '../index.js'

const checkTaskOwnership = async (taskId, userId) => {
  const task = await Task.findById(taskId)
  if (!task) {
    throw new Error('Task not found')
  }
  if (!task.user.equals(userId)) {
    if (task.user.toString() !== userId.toString()) {
      throw new Error('Access denied')
    }
    return task
  }
}

const SYSTEM_MESSAGE = {
  role: 'system',
  content:
    'Generate fantasy RPG quests from real-life tasks. Give me a random xp number between 0 - 150. Respond with valid JSON: {questTitle: string, questDescription: string, xp: number}',
}

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

export const createTaskAndQuest = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id,
    })
    const savedTask = await task.save()

    io.to(req.user.id).emit('taskCreated', {
      message: `Task "${savedTask.title}" has been created successfully.`,
      task: savedTask,
    })

    const prompt = `Create a unique, creative and concise RPG quest for: ${savedTask.title} - ${savedTask.description}`
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [SYSTEM_MESSAGE, { role: 'user', content: prompt }],
      max_tokens: parseFloat(process.env.OPENAI_MAX_TOKENS),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
    })
    const rawJSON = response.choices[0].message.content
    const questData = parseAndValidateQuestJSON(rawJSON)

    const quest = new Quest({
      user: req.user.id,
      originalTask: savedTask._id,
      ...questData,
      isComplete: false,
      xpReward: Math.min(Math.max(questData.xp, 10), 50),
    })
    const savedQuest = await quest.save()

    io.to(req.user.id).emit('questCreated', { quest: savedQuest })

    res.status(201).json({ task: savedTask, quest: savedQuest })
  } catch (error) {
    console.error('Error creating task/quest:', error.message)
    res.status(500).json({
      error: 'Failed to create task and quest',
      details: error.message,
    })
  }
}

export const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id,
    })

    const savedTask = await task.save()
    io.to(req.user.id).emit('taskCreated', {
      message: `Task "${savedTask.title}" has been created successfully.`,
      task: savedTask,
    })
    res.status(201).json(savedTask)
  } catch (error) {
    console.error('Error creating task:', error.message)
    res.status(500).json({
      error: 'Failed to create task',
      details: error.message,
    })
  }
}

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [tasks, totalTasks] = await Promise.all([
      Task.find({ user: req.user.id }).skip(skip).limit(limit).lean(),
      Task.countDocuments({ user: req.user.id }),
    ])

    res.status(200).json({
      totalTasks,
      page,
      totalPages: Math.ceil(totalTasks / limit),
      tasks,
    })
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tasks',
      details: error.message,
    })
  }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await checkTaskOwnership(req.params.id, req.user.id)
    res.status(200).json(task)
  } catch (error) {
    const statusCode =
      error.message === 'Task not found'
        ? 404
        : error.message === 'Access denied'
          ? 403
          : 500
    res.status(statusCode).json({
      error:
        error.message === 'Access denied'
          ? error.message
          : 'Failed to fetch task',
      details: statusCode === 500 ? error.message : undefined,
    })
  }
}

export const updateTask = async (req, res) => {
  try {
    const task = await checkTaskOwnership(req.params.id, req.user._id)
    Object.assign(task, req.body)
    const updatedTask = await task.save()
    res.status(200).json(updatedTask)
  } catch (error) {
    const statusCode =
      error.message === 'Task not found'
        ? 404
        : error.message === 'Access denied'
          ? 403
          : 400
    res.status(statusCode).json({
      error: error.message || 'Failed to update task',
      details: statusCode === 400 ? error.message : undefined,
    })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const task = await checkTaskOwnership(req.params.id, req.user.id)
    await task.deleteOne()
    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    const statusCode =
      error.message === 'Task not found'
        ? 404
        : error.message === 'Access denied'
          ? 403
          : 500
    console.error('Error deleting task:', error.message)
    res.status(statusCode).json({
      error:
        error.message === 'Access denied'
          ? error.message
          : 'Failed to delete task',
      details: statusCode === 500 ? error.message : undefined,
    })
  }
}
