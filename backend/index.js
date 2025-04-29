import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import { swaggerDocs, swaggerUi } from './config/swagger.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import questRoutes from './routes/questRoutes.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Configure CORS
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3001',
  'http://localhost:80',
]

// Create HTTP server
const server = createServer(app)

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('dev'))

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/quests', questRoutes)
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')))

// Socket.IO connection handling
io.engine.on('connection_error', (err) => {
  console.error('Socket.IO connection error:', {
    code: err.code,
    message: err.message,
    req: err.req,
    context: err.context,
  })
})

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error: No token provided'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.data.user = decoded
    next()
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'))
  }
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Join user's room
  socket.join(socket.data.user.id)

  // Task Events
  socket.on('taskCreated', (data) => {
    socket.to(socket.data.user.id).emit('taskCreated', data)
  })

  // Quest Events
  socket.on('questCreated', (data) => {
    socket.to(socket.data.user.id).emit('questCreated', data)
  })

  socket.on('questCompleted', (data) => {
    socket.to(socket.data.user.id).emit('questCompleted', data)
  })

  // Level and Streak Events
  socket.on('levelUp', (data) => {
    socket.to(socket.data.user.id).emit('levelUp', data)
  })

  // Handle streak events
  socket.on('streakUpdated', (data) => {
    console.log('Streak updated:', data)
    socket.to(socket.data.user.id).emit('streakUpdated', data)
  })

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`)
  })
})

// Export io instance for use in other files
export { io, startServer }

const startServer = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
      console.log('Allowed origins:', allowedOrigins)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}

startServer()
