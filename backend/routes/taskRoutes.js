import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import protect from '../middlewares/authMiddleware.js'; // Ensure users are authenticated

const router = express.Router();

// Route for creating a new task
router.post('/', protect, createTask);

// Route for getting all tasks of the logged-in user
router.get('/', protect, getTasks);

// Route for getting a single task by ID
router.get('/:id', protect, getTaskById);

// Route for updating a task
router.put('/:id', protect, updateTask);

// Route for deleting a task
router.delete('/:id', protect, deleteTask);

export default router;