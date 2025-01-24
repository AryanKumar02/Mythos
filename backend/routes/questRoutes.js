import express from 'express';
import {
  createQuestFromTask,
  getQuestsByUser,
  completeQuest,
} from '../controllers/questController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a quest from a task
router.post('/create', protect, createQuestFromTask);

// Route to fetch all quests for the authenticated user
router.get('/', protect, getQuestsByUser);

// Route to mark a quest as complete
router.patch('/:questId/complete', protect, completeQuest);

export default router;