import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Middleware para refrescar la sesión activa de Supabase
export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  // Aplica a todas las rutas excepto assets estáticos e imágenes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
