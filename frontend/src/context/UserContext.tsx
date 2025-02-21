// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  avatarUrl: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUserState(parsedUser);
      console.log('Loaded user from localStorage:', parsedUser);
    } else {
      console.log('No user found in localStorage.');
    }
  }, []);

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('User set:', user);
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem('user');
    console.log('User cleared');
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;