import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 responses and token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear tokens and optionally redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');

        // Redirect to login page, preserving the original destination
        const currentPath = window.location.pathname;
        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectUrl;
      }
    }
    return Promise.reject(error);
  }
);

// Export the configured API client
export default apiClient;

// Convenience methods for common operations
export const api = {
  // Authentication endpoints
  auth: {
    register: (userData: { email: string; password: string; name?: string }) =>
      apiClient.post('/auth/register', userData),
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    logout: () =>
      apiClient.post('/auth/logout'),
    me: () =>
      apiClient.get('/auth/me'),
  },

  // Task endpoints
  tasks: {
    getAll: () => apiClient.get('/api/v1/tasks'),
    getById: (id: number) => apiClient.get(`/api/v1/tasks/${id}`),
    create: (taskData: { title: string; description?: string; completed?: boolean }) =>
      apiClient.post('/api/v1/tasks', taskData),
    update: (id: number, taskData: { title?: string; description?: string; completed?: boolean }) =>
      apiClient.put(`/api/v1/tasks/${id}`, taskData),
    delete: (id: number) => apiClient.delete(`/api/v1/tasks/${id}`),
  },
};