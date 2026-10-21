import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Middleware para proteger rutas privadas y redirigir al login si no hay sesión
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("granabank_token")?.value;
  const isRemembered = request.cookies.get("granabank_remember")?.value === "true";

  const isPrivateRoute =
    pathname.startsWith("/home") || pathname.startsWith("/transactions");
  const isLoginRoute = pathname === "/";

  // Redirige al login si intenta acceder a rutas privadas sin sesión activa
  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirige a /home solo si el usuario tiene sesión persistente activa (Recordarme)
  if (isLoginRoute && token && isRemembered) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  const { response } = await updateSession(request);
  return response;
}

export const config = {
  // Aplica a todas las rutas excepto assets estáticos e imágenes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
