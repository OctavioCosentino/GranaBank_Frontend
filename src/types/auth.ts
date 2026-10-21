import type { User as SupabaseUser, Session as SupabaseSession } from "@supabase/supabase-js";

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
