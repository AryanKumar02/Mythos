// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { signInApi, signUpApi, updateAvatarApi } from '../api/authAPI' // Adjust the path if needed

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedToken && storedToken !== "undefined") {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
          console.log("AuthProvider: Loaded user and token from localStorage");
        } catch (err) {
          console.error("AuthProvider: Failed to parse stored user", err);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      } else {
        console.log("AuthProvider: No valid auth data found in localStorage");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      const data = await signInApi(email, password);
      console.log("Sign in response data:", data);
      const userToStore: User = 'user' in data ? data.user : data as User;
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
      const data = await signUpApi(username, email, password);
      console.log("Sign up response data:", data);
      const userToStore: User = 'user' in data ? data.user : data as User;
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

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateAvatar = async (avatarSeed: string): Promise<User> => {
    try {
      const authToken = localStorage.getItem("authToken");
      const data = await updateAvatarApi(avatarSeed, authToken!);
      console.log("PUT update-avatar response:", data);
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
        isLoading,
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
