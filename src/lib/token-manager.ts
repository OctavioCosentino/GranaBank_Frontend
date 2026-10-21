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
      // Recordarme inactivo: almacenamiento únicamente en la sesión temporal del navegador
      this.clearLocalStorage();

      sessionStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
      sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
      sessionStorage.setItem(SESSION_DATA_KEY, sessionPayload);

      this.setCookie(COOKIE_NAME, session.access_token);
      this.deleteCookie("granabank_remember");
    }
  }

  // Obtiene el token de acceso activo
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    // 1. Pestaña activa: sessionStorage siempre tiene prioridad
    const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (sessionToken) {
      this.inMemoryToken = sessionToken;
      return sessionToken;
    }

    // 2. Persistencia en localStorage SOLO si el usuario seleccionó Recordarme
    const session = this.getSession();
    if (session && session.rememberMe === true) {
      const localToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (localToken) {
        this.inMemoryToken = localToken;
        return localToken;
      }
    }

    // Si no marcó Recordarme o la sesión se cerró, no existe token válido
    this.inMemoryToken = null;
    return null;
  }

  // Obtiene el refresh token activo
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;

    const sessionToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    if (sessionToken) return sessionToken;

    const session = this.getSession();
    if (session && session.rememberMe === true) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    return null;
  }

  // Obtiene la sesión completa almacenada verificando Recordarme y expiración
  getSession(): StoredSession | null {
    if (typeof window === "undefined") return null;

    // 1. Busca en sessionStorage de la pestaña activa
    const sessionRaw = sessionStorage.getItem(SESSION_DATA_KEY);
    if (sessionRaw) {
      try {
        return JSON.parse(sessionRaw) as StoredSession;
      } catch {
        sessionStorage.removeItem(SESSION_DATA_KEY);
      }
    }

    // 2. Si no está en sessionStorage, solo recupera de localStorage si el usuario marcó Recordarme
    const localRaw = localStorage.getItem(SESSION_DATA_KEY);
    if (!localRaw) {
      this.clearLocalStorage();
      return null;
    }

    try {
      const parsed = JSON.parse(localRaw) as StoredSession;
      if (parsed.rememberMe === true) {
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          this.clearSession();
          return null;
        }
        return parsed;
      }

      // Si no tenía rememberMe habilitado, no debe persistir en localStorage
      this.clearLocalStorage();
      return null;
    } catch {
      this.clearLocalStorage();
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

    this.clearLocalStorage();

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_DATA_KEY);

    this.deleteCookie(COOKIE_NAME);
    this.deleteCookie("granabank_remember");
  }

  private clearLocalStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(SESSION_DATA_KEY);
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
