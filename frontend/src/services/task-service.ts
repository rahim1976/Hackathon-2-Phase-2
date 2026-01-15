import { api } from './api-client';

// Task service functions
export const taskService = {
  /**
   * Get all tasks for the authenticated user
   * @returns Promise with array of tasks
   */
  getAllTasks: async () => {
    try {
      const response = await api.tasks.getAll();
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to fetch tasks'
      );
    }
  },

  /**
   * Get a specific task by ID
   * @param id - Task ID
   * @returns Promise with task data
   */
  getTaskById: async (id: number) => {
    try {
      const response = await api.tasks.getById(id);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to fetch task'
      );
    }
  },

  /**
   * Create a new task
   * @param taskData - Task data to create
   * @returns Promise with created task
   */
  createTask: async (taskData: { title: string; description?: string; completed?: boolean }) => {
    try {
      const response = await api.tasks.create(taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to create task'
      );
    }
  },

  /**
   * Update an existing task
   * @param id - Task ID
   * @param taskData - Task data to update
   * @returns Promise with updated task
   */
  updateTask: async (id: number, taskData: { title?: string; description?: string; completed?: boolean }) => {
    try {
      const response = await api.tasks.update(id, taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to update task'
      );
    }
  },

  /**
   * Delete a task
   * @param id - Task ID to delete
   * @returns Promise with deletion result
   */
  deleteTask: async (id: number) => {
    try {
      const response = await api.tasks.delete(id);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to delete task'
      );
    }
  },

  /**
   * Mark a task as complete
   * @param id - Task ID to mark as complete
   * @returns Promise with updated task
   */
  markTaskComplete: async (id: number) => {
    try {
      const response = await api.tasks.update(id, { completed: true });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to mark task as complete'
      );
    }
  },

  /**
   * Mark a task as incomplete
   * @param id - Task ID to mark as incomplete
   * @returns Promise with updated task
   */
  markTaskIncomplete: async (id: number) => {
    try {
      const response = await api.tasks.update(id, { completed: false });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to mark task as incomplete'
      );
    }
  }
};