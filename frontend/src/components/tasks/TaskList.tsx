import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onTaskToggle: (id: number) => void;
  onTaskDelete: (id: number) => void;
  onTaskEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-900/30 p-4 border border-red-800">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-slate-100">No tasks</h3>
        <p className="mt-1 text-sm text-slate-400">
          Get started by creating a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onTaskToggle(task.id)}
          onDelete={() => onTaskDelete(task.id)}
          onEdit={() => onTaskEdit(task)}
        />
      ))}
    </div>
  );
};

export default TaskList;