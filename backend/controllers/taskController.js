import Task from '../models/task.js';

// Helper function for checking task ownership
const checkTaskOwnership = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  if (task.user.toString() !== userId.toString()) {
    throw new Error('Access denied');
  }
  return task;
};

// Create a new task
export const createTask = async (req, res) => {
    try {
      const { title, description, priority, category } = req.body;
  
      const task = new Task({
        user: req.user.id, // User ID from middleware
        title,
        description,
        priority,
        category,
      });
  
      console.log('Task Object:', task); // Log the task object before saving
  
      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (error) {
      console.error('Error creating task:', error.message); // Log the error message
      res.status(500).json({ error: 'Failed to create task', details: error.message });
    }
  };

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
    try {
      // Fetch tasks for the logged-in user
      const tasks = await Task.find({ user: req.user.id });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
    }
  };

// Get a single task by ID
export const getTaskById = async (req, res) => {
    try {
      console.log('Task ID:', req.params.id); // Log the task ID from the request
      console.log('Authenticated User:', req.user); // Log the authenticated user details
  
      const task = await Task.findById(req.params.id);
  
      // Log the fetched task
      console.log('Fetched Task:', task);
  
      if (!task) {
        console.error('Task not found'); // Log if task is null
        return res.status(404).json({ error: 'Task not found' });
      }
  
      if (!task.user || task.user.toString() !== req.user.id.toString()) {
        console.error('Access denied: Task belongs to another user'); // Log access denial
        return res.status(403).json({ error: 'Access denied' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task:', error.message); // Log any unexpected errors
      res.status(500).json({ error: 'Failed to fetch task', details: error.message });
    }
  };

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await checkTaskOwnership(req.params.id, req.user._id);

    Object.assign(task, req.body); // Merge updates into the task
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.message === 'Task not found' || error.message === 'Access denied') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Failed to update task', details: error.message });
    }
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
      console.log('Task ID:', req.params.id); // Log the task ID
      console.log('Authenticated User:', req.user); // Log the authenticated user details
  
      // Fetch the task by ID
      const task = await Task.findById(req.params.id);
      console.log('Fetched Task:', task); // Log the fetched task
  
      // Check if task exists and belongs to the authenticated user
      if (!task) {
        console.error('Task not found'); // Log task not found
        return res.status(404).json({ error: 'Task not found' });
      }
      if (!task.user || task.user.toString() !== req.user.id.toString()) {
        console.error('Access denied: Task belongs to another user'); // Log access denial
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Delete the task using deleteOne
      await Task.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error.message); // Log any unexpected errors
      res.status(500).json({ error: 'Failed to delete task', details: error.message });
    }
  };