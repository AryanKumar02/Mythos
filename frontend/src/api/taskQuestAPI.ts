// src/api/taskQuestAPI.ts
import { Task, Quest } from '../types/taskQuestTypes';

const API_BASE = 'http://localhost:3001/api';

const requireToken = (token: string | null): string => {
  if (!token) {
    throw new Error('Token is required for API calls');
  }
  return token;
};

export const fetchTasksAPI = async (token: string | null): Promise<Task[]> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch tasks: ' + res.statusText);
  }
  return await res.json();
};

export const fetchQuestsAPI = async (token: string | null): Promise<Quest[]> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/quests`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch quests: ' + res.statusText);
  }
  return await res.json();
};

export const createTaskAPI = async (token: string | null, task: Partial<Task>): Promise<Task> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    throw new Error('Failed to create task: ' + res.statusText);
  }
  return await res.json();
};

export const updateTaskAPI = async (
  token: string | null,
  taskId: string,
  updates: Partial<Task>
): Promise<Task> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PUT', // or PATCH, depending on your API
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error('Failed to update task: ' + res.statusText);
  }
  return await res.json();
};

export const deleteTaskAPI = async (token: string | null, taskId: string): Promise<void> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete task: ' + res.statusText);
  }
};

export const createQuestAPI = async (token: string | null, quest: Partial<Quest>): Promise<Quest> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/quests/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(quest),
  });
  if (!res.ok) {
    throw new Error('Failed to create quest: ' + res.statusText);
  }
  return await res.json();
};

export const updateQuestAPI = async (
  token: string | null,
  questId: string,
  updates: Partial<Quest>
): Promise<Quest> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/quests/${questId}`, {
    method: 'PATCH', // or PUT, depending on your API
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error('Failed to update quest: ' + res.statusText);
  }
  return await res.json();
};

export const deleteQuestAPI = async (token: string | null, questId: string): Promise<void> => {
  const authToken = requireToken(token);
  const res = await fetch(`${API_BASE}/quests/${questId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete quest: ' + res.statusText);
  }
};