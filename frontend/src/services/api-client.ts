// Centralized API client with automatic JWT token attachment
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from wherever it's stored (localStorage, cookies, etc.)
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear tokens and optionally redirect to login
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');

      // Check if we're in a browser environment before redirecting
      if (typeof window !== 'undefined') {
        // Redirect to login page, preserving the original destination
        const currentPath = window.location.pathname;
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectUrl;
      }
    }
    return Promise.reject(error);
  }
);

// Import auth functions to use in the api object
import { registerUser, loginUser, logoutUser, getCurrentUser } from './auth';

// Export the configured API client
export default apiClient;

// Convenience methods for common operations
export const api = {
  // Authentication endpoints - using dedicated auth service functions
  auth: {
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    me: getCurrentUser,
  },

  // Task endpoints (using the same API client for consistency)
  tasks: {
    getAll: () => apiClient.get('/api/v1/tasks'),
    getById: (id: number) => apiClient.get(`/api/v1/tasks/${id}`),
    create: (taskData: any) => apiClient.post('/api/v1/tasks', taskData),
    update: (id: number, taskData: any) => apiClient.put(`/api/v1/tasks/${id}`, taskData),
    delete: (id: number) => apiClient.delete(`/api/v1/tasks/${id}`),
  },
};