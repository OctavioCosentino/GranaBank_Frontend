"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { tokenManager } from "@/lib/token-manager";

// Página 404 personalizada con estética minimalista GranaBank
export default function NotFound() {
  const [destination, setDestination] = useState("/");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tokenManager.getAccessToken()) {
        setDestination("/home");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-[100dvh] bg-[#F9FAFC] flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-[390px] flex flex-col items-center text-center">
        {/* Badge circular con isotipo en tono granate suave */}
        <div className="w-20 h-20 rounded-full bg-[#E4D2D5]/50 border border-[#7A1D2D]/10 flex items-center justify-center text-[#7A1D2D] mb-4 shadow-xs">
          <Compass className="w-9 h-9 stroke-[1.8]" />
        </div>

        {/* Número 404 estilizado */}
        <span className="text-[72px] font-black tracking-tighter text-[#7A1D2D] leading-none">
          404
        </span>

        {/* Título de estado */}
        <h1 className="text-[22px] font-bold text-[#1A202C] mt-3 tracking-tight">
          Página no encontrada
        </h1>

        {/* Mensaje descriptivo */}
        <p className="text-[14px] text-[#718096] max-w-[280px] mt-2 leading-relaxed mb-8">
          La pantalla a la que intentas acceder no existe o fue reubicada.
        </p>

        {/* Botón de retorno al inicio ajustado al ancho del texto */}
        <Link
          href={destination}
          className="h-[48px] px-7 rounded-[18px] bg-[#7A1D2D] text-white font-medium text-[15px] hover:bg-[#661624] active:scale-[0.98] transition-all shadow-sm inline-flex items-center justify-center cursor-pointer"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
