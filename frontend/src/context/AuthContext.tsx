// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Extend your user interface to include an optional avatarUrl.
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

// Define the context type, including functions to update the profile.
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUserProfile: (updatedUser: User) => void;
  updateAvatar: (avatarSeed: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist authentication state: on mount, load token and user from localStorage.
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        if (storedToken && storedToken !== "undefined") {
          setToken(storedToken);
        }
        setIsAuthenticated(true);
        console.log("AuthProvider: Loaded user and token from localStorage");
      } catch (err) {
        console.error("AuthProvider: Failed to parse stored user", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    } else {
      console.log("AuthProvider: No user found in localStorage.");
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Sign in response data:", data);
      if (!response.ok) {
        console.error("Sign in error response:", data);
        setError(data.error || "Login failed");
        throw new Error(data.error || "Login failed");
      }
      // Use data.user if available; otherwise, assume data is the user object.
      const userToStore: User = data.user ? data.user : data;
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
      } else {
        localStorage.removeItem("authToken");
        setToken(null);
      }
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error during sign in:", err);
      throw err;
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      clearError();
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log("Sign up response data:", data);
      if (!response.ok) {
        console.error("Sign up error response:", data);
        setError(data.error || "Failed to register user");
        throw new Error(data.error || "Failed to register user");
      }
      const userToStore: User = data.user ? data.user : data;
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setToken(data.token);
      } else {
        localStorage.removeItem("authToken");
        setToken(null);
      }
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error during sign up:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("User logged out");
  };

  // updateUserProfile updates the user in state and localStorage.
  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // updateAvatar sends a PUT request to the update-avatar endpoint.
  // It sends { avatarSeed } in the body, and expects the backend to update the user's avatarSeed.
  const updateAvatar = async (avatarSeed: string): Promise<User> => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/users/update-avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ avatarSeed }),
      });
      const data = await response.json();
      console.log("PUT update-avatar response:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to update avatar");
      }

      // Update the user's avatarUrl in state and localStorage
      const updatedUser: User = { ...user!, avatarUrl: data.avatarUrl };
      updateUserProfile(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Error updating avatar on backend:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        error,
        signIn,
        signUp,
        logout,
        clearError,
        updateUserProfile,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;