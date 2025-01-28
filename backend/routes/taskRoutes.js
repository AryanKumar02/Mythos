import express from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'
import protect from '../middlewares/authMiddleware.js' // Ensure users are authenticated

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the task
 *         user:
 *           type: string
 *           description: ID of the user who owns the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         isCompleted:
 *           type: boolean
 *           description: Whether the task is completed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *               description:
 *                 type: string
 *                 description: Description of the task
 *           example:
 *             title: "Clean the house"
 *             description: "Vacuum and mop the floors, and tidy up the rooms."
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', protect, createTask)

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, getTasks)

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to retrieve
 *     responses:
 *       200:
 *         description: The requested task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, getTaskById)

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the task
 *               description:
 *                 type: string
 *                 description: Updated description of the task
 *           example:
 *             title: "Organise the workspace"
 *             description: "Clear the desk and arrange stationery neatly."
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:id', protect, updateTask)

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', protect, deleteTask)

export default router
