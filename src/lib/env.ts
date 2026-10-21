// Variables de entorno tipadas
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  },
  app: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    isProduction: process.env.NODE_ENV === "production",
  },
} as const;

// Validador de variables de entorno requeridas
export function validateClientEnv(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!env.supabase.url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!env.supabase.anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return {
    isValid: missing.length === 0,
    missing,
  };
}
