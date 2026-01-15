'use client';

import { useState, useEffect } from 'react';
import { authService } from '../services/auth-service';
import { User } from '../types/auth';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
  checkAuthStatus: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated by looking for a token
  const checkAuthStatus = () => {
    setLoading(true);
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (token) {
      // In a real app, you might want to validate the token or fetch user details
      // For now, we'll just check if it exists
      try {
        // Simple validation - check if token has 3 parts (header.payload.signature)
        const parts = token.split('.');
        if (parts.length === 3) {
          setIsAuthenticated(true);
          // You could fetch user details here if needed
          // fetchUserDetails();
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      setUser(result.user);
      setIsAuthenticated(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      return Promise.reject(error);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    try {
      const result = await authService.register({ email, password, name });
      setUser(result.user);
      setIsAuthenticated(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Registration error:', error);
      return Promise.reject(error);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout()
      .catch(error => console.error('Logout error:', error));

    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    checkAuthStatus
  };
};