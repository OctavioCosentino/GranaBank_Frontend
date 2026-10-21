"use client";

import React, { useState } from "react";
import { GranaBanner } from "@/components/grana-banner";
import { Input } from "@/components/input";
import { Checkbox } from "@/components/checkbox";
import { GranaButton } from "@/components/grana-button";
import { useLoginMutation } from "@/hooks/use-login-mutation";

// Página pública de inicio de sesión conectada al backend mediante TanStack Query
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [hasCredentialsError, setHasCredentialsError] = useState(false);

  const loginMutation = useLoginMutation();

  // Limpia el borde rojo en ambos inputs al empezar a editar o borrar
  const handleClearError = () => {
    if (hasCredentialsError) {
      setHasCredentialsError(false);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setHasCredentialsError(true);
      return;
    }

    loginMutation.mutate(
      {
        email: email.trim(),
        password,
        rememberMe,
      },
      {
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

          // Si es error de credenciales inválidas, pinta ambos bordes de rojo
          if (!isConnectionOrServerError) {
            setHasCredentialsError(true);
          }
        },
      }
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        {/* Banner institucional con mayor margen inferior */}
        <GranaBanner className="mb-12" />

        {/* Formulario de acceso con espaciado vertical distribuido */}
        <form onSubmit={handleContinue} className="w-full flex flex-col gap-6">
          <Input
            title="Email"
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            error={hasCredentialsError}
            onChange={(e) => {
              setEmail(e.target.value);
              handleClearError();
            }}
            required
            autoComplete="email"
          />

          <div className="flex flex-col gap-3">
            <Input
              title="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              error={hasCredentialsError}
              onChange={(e) => {
                setPassword(e.target.value);
                handleClearError();
              }}
              required
              autoComplete="current-password"
            />

            {/* Indicador visual de credenciales incorrectas */}
            {hasCredentialsError && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-[#FDF2F2] border border-[#FCA5A5]/60 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg
                  className="w-4 h-4 text-[#E53E3E] shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[13px] font-medium text-[#C53030]">
                  Email o contraseña incorrectos
                </span>
              </div>
            )}

            {/* Casilla de verificación para recordar sesión */}
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Recordarme"
              className="mt-1"
            />
          </div>

          <GranaButton
            type="submit"
            className="mt-4"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Iniciando sesión..." : "Continuar"}
          </GranaButton>
        </form>
      </div>
    </main>
  );
}
