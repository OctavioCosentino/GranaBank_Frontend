"use client";

import React from "react";

export type EmptyStateType = "no-transactions" | "no-results" | "generic";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// Componente de estado vacío con estética GranaBank para listados y filtros sin resultados
export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "no-transactions",
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  const isNoResults = type === "no-results";

  const defaultTitle = isNoResults
    ? "No se encontraron coincidencias"
    : "Aún no hay movimientos";

  const defaultDescription = isNoResults
    ? "No encontramos transacciones para el filtro seleccionado. Prueba con otra categoría o término."
    : "Tus pagos, transferencias e ingresos aparecerán registrados en este apartado.";

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-sm border border-[#F0F2F5] my-2 select-none animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      {/* Icono temático con fondo suave de marca */}
      <div className="w-14 h-14 rounded-full bg-[#E4D2D5]/40 flex items-center justify-center text-[#7A1D2D] mb-3">
        {isNoResults ? (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="7" y1="15" x2="7.01" y2="15" />
            <line x1="11" y1="15" x2="13" y2="15" />
          </svg>
        )}
      </div>

      {/* Título y descripción */}
      <h3 className="text-[16px] font-semibold text-[#1A202C] mb-1">
        {title || defaultTitle}
      </h3>
      <p className="text-[13px] text-[#718096] max-w-[280px] leading-relaxed mb-1">
        {description || defaultDescription}
      </p>

      {/* Botón de acción opcional */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 px-4 py-2 rounded-xl text-[13px] font-semibold bg-[#7A1D2D]/10 text-[#7A1D2D] hover:bg-[#7A1D2D]/20 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

