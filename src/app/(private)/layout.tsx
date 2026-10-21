"use client";

import React, { useEffect, useState } from "react";
import { BottomBar } from "@/components/bottom-bar";
import { tokenManager } from "@/lib/token-manager";

// Layout para páginas privadas con validación de autenticación y barra inferior
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (!token) {
      tokenManager.clearSession();
      window.location.replace("/");
    } else {
      const timer = setTimeout(() => {
        setIsAuthenticated(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Evita mostrar vistas privadas si no está autenticado
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFC]">
        <div className="w-8 h-8 border-3 border-[#7A1D2D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
      <BottomBar />
    </div>
  );
}
