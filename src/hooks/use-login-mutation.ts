"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { tokenManager } from "@/lib/token-manager";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { LoginCredentials, LoginResponseData } from "@/types/auth";
import type { ApiError } from "@/types/api";

interface LoginVariables extends LoginCredentials {
  rememberMe: boolean;
}

// Hook de mutación para autenticar usuario mediante TanStack Query
export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, rememberMe }: LoginVariables) => {
      const response = await authService.login({ email, password });

      // Permite respuestas tanto envueltas en data como directas
      const responseAny = response as unknown as Record<string, unknown>;
      const payload = (response?.data ||
        responseAny) as unknown as LoginResponseData;

      if (!payload?.session?.access_token) {
        const rawMessage =
          typeof response?.message === "string"
            ? response.message
            : "No se recibieron credenciales de sesión válidas.";
        throw {
          statusCode: 400,
          message: rawMessage,
        } satisfies ApiError;
      }

      return { data: payload, rememberMe };
    },
    onSuccess: ({ data, rememberMe }) => {
      tokenManager.saveSession(data, rememberMe);

      if (data.user) queryClient.setQueryData(QUERY_KEYS.auth.user, data.user);
      if (data.session)
        queryClient.setQueryData(QUERY_KEYS.auth.session, data.session);
      if (data.profile)
        queryClient.setQueryData(QUERY_KEYS.auth.profile, data.profile);

      router.push("/home");
    },
    onError: (err: unknown) => {
      const errorObj = err as Record<string, unknown> | null;
      const statusCode =
        typeof errorObj?.statusCode === "number" ? errorObj.statusCode : 500;
      const message =
        typeof errorObj?.message === "string"
          ? errorObj.message.toLowerCase()
          : "";

      const isConnectionOrServerError =
        statusCode >= 500 ||
        statusCode === 0 ||
        message.includes("network") ||
        message.includes("conexión") ||
        message.includes("fetch") ||
        message.includes("failed to fetch") ||
        message.includes("server error") ||
        message.includes("econnrefused");

      // Solo muestra error en el toast si es falla de conexión o servidor
      if (isConnectionOrServerError) {
        toast("Server error", {
          description: "No se pudo conectar con el servidor.",
          duration: 4500,
          style: {
            background: "#E4D2D5",
            backgroundColor: "#E4D2D5",
            border: "1px solid #000000",
            color: "#1A202C",
          },
        });
      }
    },
  });
}
