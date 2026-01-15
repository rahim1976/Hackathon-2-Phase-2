import React from 'react';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${
      task.completed
        ? 'bg-emerald-900/20 border-emerald-800'
        : 'bg-slate-800 border-slate-700'
    }`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="h-4 w-4 mt-1 text-emerald-500 rounded border-slate-600 focus:ring-emerald-500 bg-slate-700"
        />
        <div className="ml-3 flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${
            task.completed
              ? 'text-slate-400 line-through'
              : 'text-slate-100'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${
              task.completed
                ? 'text-slate-500'
                : 'text-slate-400'
            }`}>
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;