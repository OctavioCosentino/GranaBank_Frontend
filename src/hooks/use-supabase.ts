"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

// Hook para acceder al cliente de Supabase en Client Components
export function useSupabase() {
  const supabase = useMemo(() => createClient(), []);
  return supabase;
}
