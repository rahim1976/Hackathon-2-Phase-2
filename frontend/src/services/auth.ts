// Frontend authentication services

import apiClient from './api-client';

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with registration response
 */
export const registerUser = async (userData: {
  email: string;
  password: string;
  name?: string;
}) => {
  try {
    const response = await apiClient.post('/auth/register', userData);

    // Store the token in localStorage or sessionStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Registration failed'
    );
  }
};

/**
 * Login user
 * @param credentials - User credentials (email, password)
 * @returns Promise with login response
 */
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    // Store the token in localStorage or sessionStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Login failed'
    );
  }
};

/**
 * Logout user
 * @returns Promise with logout response
 */
export const logoutUser = async () => {
  try {
    // Clear the token from localStorage/sessionStorage
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');

    // Call backend logout endpoint (for potential server-side operations)
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    // Even if the backend logout fails, we still clear the local token
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Logout failed'
    );
  }
};

/**
 * Get current user profile
 * @returns Promise with user profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to get user profile'
    );
  }
};

/**
 * Check if user is authenticated
 * @returns boolean indicating authentication status
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  return !!token;
};

/**
 * Get stored authentication token
 * @returns Authentication token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};