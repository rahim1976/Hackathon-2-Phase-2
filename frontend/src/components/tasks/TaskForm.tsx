import React, { useState, useEffect } from 'react';
import { Task, TaskCreateData, TaskUpdateData } from '../../types/task';
import { validateTaskForm } from '../../utils/validators';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: TaskCreateData | TaskUpdateData) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TaskCreateData>({
    title: '',
    description: '',
    completed: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        completed: task.completed
      });
      setIsEditing(true);
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateTaskForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit the form data
    onSubmit(formData);
  };

  return (
    <div className="bg-slate-900 shadow px-4 py-5 sm:rounded-xl sm:p-6 border border-slate-800">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-slate-100">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {isEditing
              ? 'Update the task details below.'
              : 'Fill out the form to create a new task.'}
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-200"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-md bg-slate-800 text-slate-200 border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400 ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-200"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-slate-800 text-slate-200 border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm placeholder-slate-400"
                />
              </div>

              <div className="col-span-6">
                <div className="flex items-center">
                  <input
                    id="completed"
                    name="completed"
                    type="checkbox"
                    checked={formData.completed}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-600 rounded"
                  />
                  <label
                    htmlFor="completed"
                    className="ml-2 block text-sm text-slate-200"
                  >
                    Mark as completed
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-700 pt-5">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md border border-slate-600 bg-slate-800 py-2 px-4 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  {isEditing ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;