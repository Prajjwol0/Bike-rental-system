import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

const refreshUser = async () => {
  try {
    const response = await api.get("/users/profile");
    setUser(response.data);
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    refreshUser();
  }, []);

 const login = async (credentials: any) => {
  try {
    // Login sets cookie automatically 
    await api.post('/auth/login', credentials);
    
    await refreshUser();
    
    console.log(' Login successful, cookie set');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};


  const register = async (data: any) => {
    await api.post('/auth/register', data);
    await refreshUser();
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
