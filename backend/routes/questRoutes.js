import express from 'express'
import { io } from '../index.js'
import {
  createQuestsFromTasks,
  getQuestsByUser,
  completeQuest,
  deleteQuest,
} from '../controllers/questController.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Quest:
 *       type: object
 *       required:
 *         - user
 *         - originalTask
 *         - questTitle
 *         - questDescription
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the quest
 *         user:
 *           type: string
 *           description: ID of the user who owns the quest
 *         originalTask:
 *           type: string
 *           description: ID of the task associated with the quest
 *         questTitle:
 *           type: string
 *           description: The title of the quest
 *         questDescription:
 *           type: string
 *           description: The description of the quest
 *         isComplete:
 *           type: boolean
 *           description: Whether the quest is complete
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the quest was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the quest was last updated
 */

/**
 * @swagger
 * /quests/create:
 *   post:
 *     summary: Create a quest from a task
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: The ID of the task to create a quest from
 *           example:
 *             taskId: "63d9f7e4c9b1e8123b7d0f98"
 *     responses:
 *       201:
 *         description: The created quest
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/create', protect, async (req, res, next) => {
  const originalJson = res.json.bind(res)
  res.json = (data) => {
    io.emit('questCreated', data)
    return originalJson(data)
  }
  return createQuestsFromTasks(req, res, next)
})

/**
 * @swagger
 * /quests:
 *   get:
 *     summary: Fetch all quests for the authenticated user
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of quests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quest'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, getQuestsByUser)

/**
 * @swagger
 * /quests/{questId}/complete:
 *   patch:
 *     summary: Mark a quest as complete
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *         description: "The ID of the quest to mark as complete"
 *     responses:
 *       200:
 *         description: "The updated quest and streak data. Note: The streak is only updated after completing 3 quests in a single day."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quest:
 *                   $ref: '#/components/schemas/Quest'
 *                 streak:
 *                   type: number
 *                   description: "The user's current streak"
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:questId/complete', protect, async (req, res, next) => {
  const originalJson = res.json.bind(res)
  res.json = (data) => {
    io.emit('questCompleted', data)
    return originalJson(data)
  }
  return completeQuest(req, res, next)
})

/**
 * @swagger
 * /quests/{questId}:
 *   delete:
 *     summary: Delete a quest
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest to delete
 *     responses:
 *       200:
 *         description: Quest deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quest:
 *                   $ref: '#/components/schemas/Quest'
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:questId', protect, async (req, res, next) => {
  const originalJson = res.json.bind(res)
  res.json = (data) => {
    io.emit('questDeleted', data)
    return originalJson(data)
  }
  return deleteQuest(req, res, next)
})

export default router
