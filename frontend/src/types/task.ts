// Task-related type definitions

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number; // Foreign key to User
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface TaskCreateData {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentTask: Task | null;
}

export interface TaskFilters {
  completed?: boolean;
  searchTerm?: string;
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskResponse {
  data: Task | Task[] | null;
  message?: string;
  error?: string;
}