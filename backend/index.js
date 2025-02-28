import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http' // Required for Socket.IO
import { Server } from 'socket.io' // Import Socket.IO
import connectDB from './config/db.js'
import { swaggerDocs, swaggerUi } from './config/swagger.js'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import questRoutes from './routes/questRoutes.js'
import cookieParser from 'cookie-parser'

/* Configurations */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

/* Middleware */
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001'] // Add allowed frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/quests', questRoutes)
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')))

/* Create HTTP Server */
const server = createServer(app) // Create the HTTP server for Socket.IO

/* Socket.IO Setup */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Allow only specific frontend origins
  },
})

// Handle Socket.IO connections
io.on('connection', (socket) => {
  // Example: Listening for a custom event

  socket.on('customEvent', () => {})

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// Export io for use in other files (e.g., controllers)
export {
  io,

  /* MongoDB Connection */
}
;(async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
})()
