// src/api/authApi.ts

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

const API_BASE_URL = "http://localhost:3001/api/users";

// API function for signing in
export async function signInApi(email: string, password: string): Promise<{ user: User; token?: string }> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
}

// API function for signing up
export async function signUpApi(username: string, email: string, password: string): Promise<{ user: User; token?: string }> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to register user");
  }
  return data;
}

// API function for updating the avatar
export async function updateAvatarApi(avatarSeed: string, authToken: string): Promise<{ avatarUrl: string }> {
  const response = await fetch(`${API_BASE_URL}/update-avatar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ avatarSeed }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to update avatar");
  }
  return data;
}
