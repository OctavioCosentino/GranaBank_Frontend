// Definición de tipos de tablas de Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          account_number: string;
          account_type: "checking" | "savings" | "investment";
          currency: string;
          balance: number;
          status: "active" | "frozen" | "closed";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_number: string;
          account_type: "checking" | "savings" | "investment";
          currency?: string;
          balance?: number;
          status?: "active" | "frozen" | "closed";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_number?: string;
          account_type?: "checking" | "savings" | "investment";
          currency?: string;
          balance?: number;
          status?: "active" | "frozen" | "closed";
        };
      };
      transactions: {
        Row: {
          id: string;
          account_id: string;
          amount: number;
          type: "income" | "expense" | "transfer";
          category: string;
          description: string;
          reference: string | null;
          status: "completed" | "pending" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          amount: number;
          type: "income" | "expense" | "transfer";
          category: string;
          description: string;
          reference?: string | null;
          status?: "completed" | "pending" | "failed";
          created_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          amount?: number;
          type?: "income" | "expense" | "transfer";
          category?: string;
          description?: string;
          reference?: string | null;
          status?: "completed" | "pending" | "failed";
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
