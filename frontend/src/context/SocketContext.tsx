import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) return;

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      auth: {
        token: token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['polling', 'websocket'],
      withCredentials: true,
      timeout: 20000,
      path: '/socket.io/',
      forceNew: true,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected, transport:', newSocket.io.engine.transport.name);
      setIsConnected(true);
      toast.success('Connected to server', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected, reason:', reason);
      setIsConnected(false);
      toast.error('Disconnected from server: ' + reason, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error: ' + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt:', attemptNumber);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Failed to reconnect');
      toast.error('Failed to reconnect to server', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // Task events
    newSocket.on('taskCreated', (data) => {
      console.log('New task created:', data);
      toast.success('New task created!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // Quest events
    newSocket.on('questCreated', (data) => {
      console.log('New quest created:', data);
      toast.success('New quest available!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    newSocket.on('questCompleted', (data) => {
      console.log('Quest completed:', data);
      toast.success('Quest completed! +' + data.xpReward + ' XP', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    // Level and streak events
    newSocket.on('levelUp', (data) => {
      console.log('Level up:', data);
      toast.success('Level Up! You are now level ' + data.level, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    newSocket.on('streakUpdated', (data) => {
      console.log('Streak updated:', data);
      toast.success('Streak updated: ' + data.streakCount + ' days!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};