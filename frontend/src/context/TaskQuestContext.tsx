// src/context/TaskQuestContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { Task, Quest } from '../types/taskQuestTypes';
import {
  fetchTasksAPI,
  fetchQuestsAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  createQuestAPI,
  updateQuestAPI,
  deleteQuestAPI,
} from '../api/taskQuestAPI';

interface TaskQuestContextType {
  tasks: Task[];
  quests: Quest[];
  fetchTasks: () => Promise<void>;
  fetchQuests: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createQuest: (quest: Partial<Quest>) => Promise<void>;
  updateQuest: (questId: string, updates: Partial<Quest>) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
}

const TaskQuestContext = createContext<TaskQuestContextType | undefined>(
  undefined
);

interface TaskQuestProviderProps {
  children: ReactNode;
}

export const TaskQuestProvider: React.FC<TaskQuestProviderProps> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  console.log("Dashboard tasks:", tasks, "quests:", quests);
  const { token } = useAuth();

  const fetchTasks = useCallback(async () => {
    try {
      if (!token) {
        console.log("fetchTasks: No token available.");
        return;
      }
      const tasksData = await fetchTasksAPI(token);
      console.log("Fetched tasks data:", tasksData);
      if (Array.isArray(tasksData)) {
        console.log("tasksData is an array.");
        setTasks(tasksData);
      } else if (tasksData && typeof tasksData === 'object' && 'tasks' in tasksData) {
        console.log("tasksData is an object; using tasks property.");
        setTasks((tasksData as { tasks: Task[] }).tasks);
      } else {
        console.error("Unexpected tasksData structure:", tasksData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [token]);

  const fetchQuests = useCallback(async () => {
    try {
      if (!token) {
        console.log("fetchQuests: No token available.");
        return;
      }
      const questsData = await fetchQuestsAPI(token);
      console.log("Fetched quests data:", questsData);
      if (Array.isArray(questsData)) {
        console.log("questsData is an array.");
        setQuests(questsData);
      } else if (questsData && typeof questsData === 'object' && 'items' in questsData) {
        console.log("questsData is an object; using items property.");
        setQuests((questsData as { items: Quest[] }).items);
      } else {
        console.error("Unexpected questsData structure:", questsData);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  }, [token]);

  const createTask = async (task: Partial<Task>) => {
    try {
      if (!token) return;
      const newTask = await createTaskAPI(token, task);
      console.log("Created task:", newTask);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      if (!token) return;
      const updatedTask = await updateTaskAPI(token, taskId, updates);
      console.log("Updated task:", updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      if (!token) return;
      await deleteTaskAPI(token, taskId);
      console.log("Deleted task:", taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const createQuest = async (quest: Partial<Quest>) => {
    try {
      if (!token) return;
      const newQuest = await createQuestAPI(token, quest);
      console.log("Created quest:", newQuest);
      setQuests((prev) => [...prev, newQuest]);
    } catch (error) {
      console.error('Error creating quest:', error);
    }
  };

  const updateQuest = async (questId: string, updates: Partial<Quest>) => {
    try {
      if (!token) return;
      const updatedQuest = await updateQuestAPI(token, questId, updates);
      console.log("Updated quest:", updatedQuest);
      setQuests((prev) =>
        prev.map((quest) => (quest._id === questId ? updatedQuest : quest))
      );
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  const deleteQuest = async (questId: string) => {
    try {
      if (!token) return;
      await deleteQuestAPI(token, questId);
      console.log("Deleted quest:", questId);
      setQuests((prev) => prev.filter((quest) => quest._id !== questId));
    } catch (error) {
      console.error('Error deleting quest:', error);
    }
  };

  useEffect(() => {
    if (token) {
      console.log("Token available. Fetching tasks and quests.");
      fetchTasks();
      fetchQuests();
    } else {
      console.log("No token available in TaskQuestProvider.");
    }
  }, [fetchTasks, fetchQuests, token]);

  return (
    <TaskQuestContext.Provider
      value={{
        tasks,
        quests,
        fetchTasks,
        fetchQuests,
        createTask,
        updateTask,
        deleteTask,
        createQuest,
        updateQuest,
        deleteQuest,
      } as TaskQuestContextType}
    >
      {children}
    </TaskQuestContext.Provider>
  );
};

export const useTaskQuest = () => {
  console.log('useTaskQuest called.');
  const context = useContext(TaskQuestContext);
  if (!context) {
    console.error('useTaskQuest must be used within a TaskQuestProvider.');
    throw new Error('useTaskQuest must be used within a TaskQuestProvider');
  }
  console.log('useTaskQuest returning context:', {
    tasks: context.tasks,
    quests: context.quests,
  });
  return context;
};