import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// User profile route (protected)
router.get('/profile', protect, getUserProfile);

export default router;