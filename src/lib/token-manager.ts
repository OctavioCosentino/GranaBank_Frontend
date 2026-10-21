import type {
  BackendProfile,
  BackendUser,
  LoginResponseData,
  StoredSession,
} from "@/types/auth";

const ACCESS_TOKEN_KEY = "granabank_access_token";
const REFRESH_TOKEN_KEY = "granabank_refresh_token";
const SESSION_DATA_KEY = "granabank_session";
const COOKIE_NAME = "granabank_token";

// Duración de 30 días para recordar sesión (en segundos)
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

// Gestor de almacenamiento de tokens y sesión con soporte para Recordarme
class TokenManager {
  private inMemoryToken: string | null = null;

  // Guarda la sesión en localStorage (persistente) o sessionStorage (temporal)
  saveSession(data: LoginResponseData, rememberMe: boolean): void {
    if (typeof window === "undefined" || !data) return;

    const user = data.user || { id: "", email: "" };
    const session = data.session || {
      access_token: "",
      refresh_token: "",
      expires_in: 3600,
      token_type: "bearer",
    };
    const profile = data.profile || { id: "", name: "" };

    this.inMemoryToken = session.access_token;

    const expiresAt = Date.now() + (session.expires_in || 3600) * 1000;
    const storedSession: StoredSession = {
      user,
      session,
      profile,
      rememberMe,
      expiresAt,
    };

    const sessionPayload = JSON.stringify(storedSession);

    if (rememberMe) {
      // Recordarme activo: persistencia en localStorage y cookie por 30 días
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(SESSION_DATA_KEY);

      localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
      localStorage.setItem(SESSION_DATA_KEY, sessionPayload);

      this.setCookie(COOKIE_NAME, session.access_token, THIRTY_DAYS_SECONDS);
      this.setCookie("granabank_remember", "true", THIRTY_DAYS_SECONDS);
    } else {
      // Recordarme inactivo: almacenamiento únicamente en la sesión del navegador
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(SESSION_DATA_KEY);

      sessionStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
      sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
      sessionStorage.setItem(SESSION_DATA_KEY, sessionPayload);

      this.setCookie(COOKIE_NAME, session.access_token);
      this.deleteCookie("granabank_remember");
    }
  }

  // Obtiene el token de acceso activo
  getAccessToken(): string | null {
    if (this.inMemoryToken) return this.inMemoryToken;
    if (typeof window === "undefined") return null;

    const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (sessionToken) {
      this.inMemoryToken = sessionToken;
      return sessionToken;
    }

    const localToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (localToken) {
      this.inMemoryToken = localToken;
      return localToken;
    }

    return null;
  }

  // Obtiene el refresh token activo
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
      localStorage.getItem(REFRESH_TOKEN_KEY)
    );
  }

  // Obtiene la sesión completa almacenada
  getSession(): StoredSession | null {
    if (typeof window === "undefined") return null;

    const raw =
      sessionStorage.getItem(SESSION_DATA_KEY) ||
      localStorage.getItem(SESSION_DATA_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      return null;
    }
  }

  // Obtiene el perfil del usuario autenticado
  getProfile(): BackendProfile | null {
    return this.getSession()?.profile || null;
  }

  // Obtiene el usuario autenticado
  getUser(): BackendUser | null {
    return this.getSession()?.user || null;
  }

  // Limpia todos los tokens y sesiones al desloguearse
  clearSession(): void {
    this.inMemoryToken = null;
    if (typeof window === "undefined") return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_DATA_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_DATA_KEY);

    this.deleteCookie(COOKIE_NAME);
    this.deleteCookie("granabank_remember");
  }

  private setCookie(name: string, value: string, maxAgeSeconds?: number): void {
    if (typeof document === "undefined") return;
    const maxAgeAttr = maxAgeSeconds ? `; max-age=${maxAgeSeconds}` : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${maxAgeAttr}`;
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
  }
}

export const tokenManager = new TokenManager();
