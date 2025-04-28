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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001']
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

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

io.on('connection', (socket) => {
  socket.on('customEvent', () => {})
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

export { io }
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
