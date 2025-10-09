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

// API Request Models para coincidir exactamente con tu backend
export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

export interface SignInRequest {
  email?: string;
  userName: string; // Cambiado de userName? a userName (requerido)
  password: string;
}

// Request models para los componentes
export interface LoginRequest {
  userName: string; // Cambiado de email a userName
  password: string;
}

export interface RegisterRequest {
  username: string; // Para el backend
  email: string;
  password: string;
  name?: string; // Para compatibilidad con componentes
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
