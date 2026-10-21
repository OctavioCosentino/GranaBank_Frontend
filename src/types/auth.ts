import type {
  User as SupabaseUser,
  Session as SupabaseSession,
} from "@supabase/supabase-js";

// Tipos de usuario y sesión de autenticación
export type User = SupabaseUser;
export type Session = SupabaseSession;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: "customer" | "admin" | "support";
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Credenciales para inicio de sesión en el backend externo
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BackendUser {
  id: string;
  email: string;
}

export interface BackendSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface BackendProfile {
  id: string;
  name: string;
}

export interface LoginResponseData {
  user: BackendUser;
  session: BackendSession;
  profile: BackendProfile;
}

export interface StoredSession {
  user: BackendUser;
  session: BackendSession;
  profile: BackendProfile;
  rememberMe: boolean;
  expiresAt: number;
}
