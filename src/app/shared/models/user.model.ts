// Unified User interface compatible with components and API
export interface User {
  id?: string; // For component compatibility
  name?: string; // For component compatibility
  username?: string; // API format
  email: string;
  role?: UserRole; // For component compatibility
  emailConfirmed?: boolean; // API format
  createdAt?: Date;
}

export interface UserInfo {
  name: string;
  totalBovines: number;
  totalVaccinations: number;
  totalStables: number;
}

// API Request Models
export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

export interface SignInRequest {
  email?: string;
  userName?: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

// Auth Response
export interface AuthResponse {
  user: User;
  token: string;
}

export enum UserRole {
  ADMIN = 'admin',
  VETERINARIAN = 'veterinarian',
  ASSISTANT = 'assistant'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}