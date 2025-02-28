// src/types/taskQuestTypes.ts

export interface Task {
  id: string;               // typically the _id field returned by MongoDB
  user: string;             // the user's ID
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'fitness' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  _id: string;              // unique quest identifier from the API
  user: string;             // the user's ID
  questTitle: string;       // quest title from the API
  questDescription: string; // quest description from the API
  isComplete: boolean;      // true if quest is finished
  xpReward: number;         // XP reward for the quest
  originalTask?: Task;      // Optional: the associated task (if provided)
  createdAt: string;
  updatedAt: string;
  __v?: number;             // optional version key from MongoDB
}