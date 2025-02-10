import Task from '../models/task.js'
import { io } from '../index.js'

// Helper function for checking task ownership
const checkTaskOwnership = async (taskId, userId) => {
  const task = await Task.findById(taskId)
  if (!task) {
    throw new Error('Task not found')
  }
  if (!task.user.equals(userId)) {
    // More efficient ObjectId comparison
    if (task.user.toString() !== userId.toString()) {
      throw new Error('Access denied')
    }
    return task
  }
}

// Create a new task
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

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Parallel execution for better performance
    const [tasks, totalTasks] = await Promise.all([
      Task.find({ user: req.user.id }).skip(skip).limit(limit).lean(), // Faster read-only response
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

// Get a single task by ID
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

// Update a task
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

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await checkTaskOwnership(req.params.id, req.user.id)
    await task.deleteOne() // More efficient deletion using existing document
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
