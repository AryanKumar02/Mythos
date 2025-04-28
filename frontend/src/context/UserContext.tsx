import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserApi } from '../api/userAPI';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  streak: number;
  lastStreakDate: string | null;
  dailyQuestCount: number;
  xp: number;
  level: number;
  avatarSeed: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  error: string | null;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    console.log('DEBUG: Starting fetchUser');
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserApi();
      console.log('DEBUG: Received user data:', data);
      console.log('DEBUG: User streak is:', data.streak);
      setUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('DEBUG: fetchUser error:', err.message);
        setError(err.message);
      } else {
        console.error('DEBUG: fetchUser error: Unknown error');
        setError('Failed to load user');
      }
    } finally {
      console.log('DEBUG: Finished fetchUser');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = () => {
    fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
