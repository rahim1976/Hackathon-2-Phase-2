'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth-service';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuthStatus = async () => {
      try {
        // Check if we have a token in storage first (to prevent hydration mismatch)
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (token) {
          // If we have a token, try to get user data
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token exists but user data is invalid, clear it
            localStorage.removeItem('access_token');
            sessionStorage.removeItem('access_token');
          }
        }
      } catch (error) {
        // If there's an error getting the user, they're not authenticated
        console.error('Auth check failed:', error);
        // Clear any invalid tokens
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
      } finally {
        // Always set loading to false after initial check
        setLoading(false);
      }
    };

    // Use a small timeout to ensure hydration completes before checking auth
    const timer = setTimeout(checkAuthStatus, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      // Store the token
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      setUser(response.user);
      setIsAuthenticated(true);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Clear any stored tokens
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await authService.register({ email, password, name });
      // Store the token
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      setUser(response.user);
      setIsAuthenticated(true);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};