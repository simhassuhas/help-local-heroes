
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResourceRequest, User } from '../types';
import { mockRequests, mockUsers } from '../services/mockData';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  currentUser: User | null;
  requests: ResourceRequest[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addRequest: (request: Omit<ResourceRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: 'pending' | 'inProgress' | 'fulfilled') => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
      
      // Check for saved user in localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network request
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}!`,
          });
          setIsLoading(false);
          resolve(true);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  // Add new request
  const addRequest = (request: Omit<ResourceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: ResourceRequest = {
      ...request,
      id: Math.random().toString(36).substring(2, 12),
      createdAt: new Date(),
      status: 'pending',
      citizenId: currentUser?.role === 'citizen' ? currentUser.id : undefined
    };
    
    setRequests(prev => [newRequest, ...prev]);
    
    toast({
      title: "Request submitted",
      description: `Your request ID is: ${newRequest.id.substring(0, 6)}`,
    });
  };
  
  // Update request status
  const updateRequestStatus = (id: string, status: 'pending' | 'inProgress' | 'fulfilled') => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const updated = {...req, status};
        return updated;
      }
      return req;
    }));
    
    toast({
      title: "Request updated",
      description: `Request ID: ${id.substring(0, 6)} status changed to ${status}`,
    });
  };
  
  const value = {
    currentUser,
    requests,
    login,
    logout,
    addRequest,
    updateRequestStatus,
    isLoading
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
