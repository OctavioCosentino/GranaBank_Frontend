import { apiClient } from "@/services/api-client";
import type { LoginCredentials, LoginResponseData } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

// Servicio de autenticación conectado al backend externo
export const authService = {
  // Inicia sesión con email y contraseña en /auth/login
  login: async (
    credentials: LoginCredentials,
  ): Promise<ApiResponse<LoginResponseData>> => {
    return apiClient.post<LoginResponseData>("/auth/login", credentials);
  },
};
