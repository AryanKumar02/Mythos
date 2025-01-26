import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, // Limit task title length
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500, // Optional detailed description
    },
    isCompleted: {
      type: Boolean,
      default: false, // Track completion status
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium', // Default priority
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'fitness', 'other'],
      default: 'other', // Optional category
    },
  },
  { timestamps: true }, // Automatically add createdAt and updatedAt fields
)

const Task = mongoose.model('Task', taskSchema)

export default Task
