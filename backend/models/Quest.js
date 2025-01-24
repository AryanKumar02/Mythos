import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Links the quest to the user who owns it
    },
    originalTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true, // Links the quest to the task it was created from
    },
    questTitle: {
      type: String,
      required: true, // AI-generated title for the quest
    },
    questDescription: {
      type: String,
      required: true, // AI-generated quest description
    },
    isComplete: {
      type: Boolean,
      default: false, // Marks whether the quest has been completed
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Quest = mongoose.model('Quest', questSchema);

export default Quest;