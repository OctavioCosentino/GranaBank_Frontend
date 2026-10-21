"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { BottomBar } from "@/components/bottom-bar";
import { tokenManager } from "@/lib/token-manager";

function subscribe(callback: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }
  return () => {};
}

function getSnapshot(): string | null {
  return tokenManager.getAccessToken();
}

function getServerSnapshot(): string | null {
  return null;
}

// Layout para páginas privadas con validación de autenticación y barra inferior
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!tokenManager.getAccessToken()) {
      tokenManager.clearSession();
      window.location.replace("/");
    }
  }, []);

  // Evita mostrar vistas privadas si no está autenticado
  if (!token) {
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
