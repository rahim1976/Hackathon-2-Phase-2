'use client';

import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import TaskList from '../../components/tasks/TaskList';
import TaskForm from '../../components/tasks/TaskForm';
import { Task } from '../../types/task';

const TasksPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    markTaskComplete,
    markTaskIncomplete
  } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;

    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      if (task.completed) {
        await markTaskIncomplete(id);
      } else {
        await markTaskComplete(id);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSubmit = (taskData: any) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 shadow border-b border-slate-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-100">Tasks</h1>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-slate-300">
                Welcome, {user?.name || user?.email || 'User'}!
              </span>
              <button
                onClick={() => {
                  // Logout functionality would go here
                  localStorage.removeItem('access_token');
                  sessionStorage.removeItem('access_token');
                  window.location.href = '/login';
                }}
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="lg:flex lg:items-center lg:justify-between mb-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-slate-100 sm:truncate sm:text-3xl sm:tracking-tight">
                  My Tasks
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Manage your tasks efficiently
                </p>
              </div>
              <div className="mt-5 flex lg:mt-0 lg:ml-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                  className="inline-flex items-center rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>

            {showTaskForm ? (
              <TaskForm
                task={editingTask || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            ) : (
              <div className="bg-slate-900 shadow overflow-hidden sm:rounded-xl border border-slate-800">
                <ul className="divide-y divide-slate-700">
                  <TaskList
                    tasks={tasks}
                    loading={tasksLoading}
                    error={error}
                    onTaskToggle={handleToggleTask}
                    onTaskDelete={handleDeleteTask}
                    onTaskEdit={handleEditTask}
                  />
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasksPage;