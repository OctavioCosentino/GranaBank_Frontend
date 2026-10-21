"use client";

import React from "react";
import Link from "next/link";

interface HomeHeaderProps {
  userName?: string;
  onNotificationClick?: () => void;
}

// Encabezado de la página de inicio con saludo, nombre del usuario y accesos rápidos
export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = "Granate",
  onNotificationClick,
}) => {
  return (
    <header className="w-full flex items-center justify-between mb-6 pt-2">
      {/* Saludo y nombre de usuario */}
      <div className="flex flex-col">
        <span className="text-[14px] text-[#718096] font-normal leading-tight">
          Hola
        </span>
        <h1 className="text-[24px] font-bold text-[#1A202C] tracking-tight leading-tight mt-0.5">
          {userName}
        </h1>
      </div>

      {/* Botones de acción: Búsqueda y Notificaciones */}
      <div className="flex items-center gap-3">
        {/* Botón de búsqueda (redirige a la pestaña /transactions) */}
        <Link
          href="/transactions?focus=true"
          className="w-10 h-10 flex items-center justify-center text-[#200E32] hover:text-[#7A1D2D] active:text-[#7A1D2D] focus:text-[#7A1D2D] transition-colors cursor-pointer outline-none"
          aria-label="Buscar transacciones"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.89342 17.0368C13.3909 17.0368 17.0368 13.3909 17.0368 8.89342C17.0368 4.39593 13.3909 0.75 8.89342 0.75C4.39593 0.75 0.75 4.39593 0.75 8.89342C0.75 13.3909 4.39593 17.0368 8.89342 17.0368Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
            <path
              d="M14.5573 14.9803L17.75 18.1646"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
          </svg>
        </Link>

        {/* Botón de notificaciones */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="w-10 h-10 flex items-center justify-center text-[#200E32] hover:text-[#7A1D2D] active:text-[#7A1D2D] focus:text-[#7A1D2D] transition-colors cursor-pointer outline-none"
          aria-label="Notificaciones"
        >
          <svg
            width="18"
            height="21"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.750784 11.9478V11.7397C0.781304 11.1242 0.978569 10.5279 1.32224 10.0121C1.89428 9.39259 2.28587 8.63339 2.45593 7.81418C2.45593 7.18103 2.45593 6.53883 2.51123 5.90567C2.79696 2.8575 5.81091 0.75 8.788 0.75H8.86174C11.8388 0.75 14.8528 2.8575 15.1477 5.90567C15.203 6.53883 15.1477 7.18103 15.1938 7.81418C15.3662 8.63529 15.7574 9.39685 16.3275 10.0212C16.6737 10.5323 16.8713 11.1265 16.899 11.7397V11.9387C16.9195 12.7656 16.6347 13.572 16.0971 14.209C15.3866 14.9539 14.4225 15.4173 13.3873 15.5115C10.3516 15.8371 7.28888 15.8371 4.25324 15.5115C3.21919 15.4132 2.25647 14.9505 1.54345 14.209C1.0141 13.5715 0.733129 12.77 0.750784 11.9478Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
            <path
              d="M6.5022 18.6592C6.97651 19.2545 7.67303 19.6398 8.43763 19.7298C9.20222 19.8198 9.97182 19.607 10.5761 19.1386C10.762 19 10.9292 18.8389 11.0738 18.6592"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
