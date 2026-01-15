// Authentication-related type definitions

export interface User {
  id: number;
  email: string;
  name?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  is_active?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends RegisterData {}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
  checkAuthStatus: () => void;
}

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  jti?: string; // JWT ID for potential revocation
}