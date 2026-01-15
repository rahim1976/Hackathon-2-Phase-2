import { useState, useEffect } from 'react';
import { taskService } from '../services/task-service';
import { Task, TaskCreateData, TaskUpdateData } from '../types/task';

interface UseTasksReturn {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  createTask: (taskData: TaskCreateData) => Promise<void>;
  updateTask: (id: number, taskData: TaskUpdateData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  markTaskComplete: (id: number) => Promise<void>;
  markTaskIncomplete: (id: number) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all tasks for the authenticated user
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: TaskCreateData) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (id: number, taskData: TaskUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      if (currentTask && currentTask.id === id) {
        setCurrentTask(updatedTask);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      if (currentTask && currentTask.id === id) {
        setCurrentTask(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark task as complete
  const markTaskComplete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.markTaskComplete(id);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      if (currentTask && currentTask.id === id) {
        setCurrentTask(updatedTask);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark task as complete');
      console.error('Error marking task as complete:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark task as incomplete
  const markTaskIncomplete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.markTaskIncomplete(id);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      if (currentTask && currentTask.id === id) {
        setCurrentTask(updatedTask);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to mark task as incomplete');
      console.error('Error marking task as incomplete:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when the hook is first used
  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    currentTask,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    markTaskComplete,
    markTaskIncomplete
  };
};