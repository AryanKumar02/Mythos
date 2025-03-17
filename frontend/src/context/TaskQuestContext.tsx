import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
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
  completeQuestAPI,
  createTaskAndQuestAPI,
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
  createTaskAndQuest: (task: Partial<Task>) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
}

const TaskQuestContext = createContext<TaskQuestContextType | undefined>(undefined);

interface TaskQuestProviderProps {
  children: ReactNode;
}

export const TaskQuestProvider: React.FC<TaskQuestProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const { token } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const tasksData = await fetchTasksAPI(token);
      console.log('[fetchTasks] Received tasks data:', tasksData);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('[fetchTasks] Error fetching tasks:', error);
    }
  }, [token]);

  const fetchQuests = useCallback(async () => {
    if (!token) return;
    try {
      const questsData = await fetchQuestsAPI(token);
      console.log('[fetchQuests] Received quests data:', questsData);
      if (Array.isArray(questsData)) {
        setQuests(questsData);
      } else if (
        questsData &&
        typeof questsData === 'object' &&
        'items' in questsData &&
        Array.isArray((questsData as { items: Quest[] }).items)
      ) {
        setQuests((questsData as { items: Quest[] }).items);
      } else {
        console.error('[fetchQuests] Unexpected questsData structure:', questsData);
        setQuests([]);
      }
    } catch (error) {
      console.error('[fetchQuests] Error fetching quests:', error);
    }
  }, [token]);

  const createTask = async (task: Partial<Task>) => {
    if (!token) return;
    try {
      const newTask = await createTaskAPI(token, task);
      console.log('[createTask] New task:', newTask);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error('[createTask] Error creating task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!token) return;
    try {
      const updatedTask = await updateTaskAPI(token, taskId, updates);
      console.log('[updateTask] Updated task:', updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error('[updateTask] Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!token) return;
    try {
      await deleteTaskAPI(token, taskId);
      console.log('[deleteTask] Deleted task with id:', taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('[deleteTask] Error deleting task:', error);
    }
  };

  const createQuest = async (quest: Partial<Quest>) => {
    if (!token) return;
    try {
      const newQuest = await createQuestAPI(token, quest);
      console.log('[createQuest] New quest:', newQuest);
      setQuests((prev) => [...prev, newQuest]);
    } catch (error) {
      console.error('[createQuest] Error creating quest:', error);
    }
  };

  const updateQuest = async (questId: string, updates: Partial<Quest>) => {
    if (!token) return;
    try {
      const updatedQuest = await updateQuestAPI(token, questId, updates);
      console.log('[updateQuest] Updated quest:', updatedQuest);
      setQuests((prev) =>
        prev.map((quest) => (quest._id === questId ? updatedQuest : quest))
      );
    } catch (error) {
      console.error('[updateQuest] Error updating quest:', error);
    }
  };

  const deleteQuest = async (questId: string) => {
    if (!token) return;
    try {
      await deleteQuestAPI(token, questId);
      console.log('[deleteQuest] Deleted quest with id:', questId);
      setQuests((prev) => prev.filter((quest) => quest._id !== questId));
    } catch (error) {
      console.error('[deleteQuest] Error deleting quest:', error);
    }
  };

  const createTaskAndQuest = async (task: Partial<Task>) => {
    if (!token) return;
    if (!task.title || !task.description) {
      console.error('[createTaskAndQuest] Missing title or description in task:', task);
      return;
    }
    try {
      const data = await createTaskAndQuestAPI(token, { title: task.title, description: task.description });
      console.log('[createTaskAndQuest] Data received:', data);
      setTasks((prev) => [...prev, data.task]);
      setQuests((prev) => [...prev, data.quest]);
    } catch (error) {
      console.error('[createTaskAndQuest] Error creating task and quest:', error);
    }
  };

  const completeQuest = async (questId: string) => {
    if (!token) return;
    try {
      const response = await completeQuestAPI(token, questId);
      console.log('[completeQuest] API response:', response);
      setQuests((prevQuests) => {
        const index = prevQuests.findIndex((q) => q._id === questId);
        console.log('[completeQuest] Found quest at index:', index);
        if (index !== -1) {
          const newQuests = [...prevQuests];
          newQuests[index] = response.quest;
          console.log('[completeQuest] Replacing quest. New quests array:', newQuests);
          return newQuests;
        } else {
          console.warn('[completeQuest] Quest not found in state, appending:', response.quest);
          return [...prevQuests, response.quest];
        }
      });
    } catch (error) {
      console.error('[completeQuest] Error completing quest:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchQuests();
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
        createTaskAndQuest,
        completeQuest,
      }}
    >
      {children}
    </TaskQuestContext.Provider>
  );
};

export const useTaskQuest = () => {
  const context = useContext(TaskQuestContext);
  if (!context) {
    throw new Error('useTaskQuest must be used within a TaskQuestProvider');
  }
  return context;
};

export default TaskQuestContext;
