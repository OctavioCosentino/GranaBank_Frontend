"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GranaBanner } from "@/components/grana-banner";
import { Input } from "@/components/input";
import { Checkbox } from "@/components/checkbox";
import { GranaButton } from "@/components/grana-button";

// Página pública de inicio de sesión con espaciado amplio y opción de recordar sesión
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Permite continuar incluso con campos vacíos por el momento
    router.push("/home");
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col gap-3">
            <Input
              title="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Casilla de verificación para recordar sesión */}
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Recordarme"
              className="mt-1"
            />
          </div>

          <GranaButton type="submit" className="mt-4">
            Continuar
          </GranaButton>
        </form>
      </div>
    </main>
  );
}
