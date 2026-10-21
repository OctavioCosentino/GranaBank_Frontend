"use client";

import React, { useEffect } from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Modal de confirmación para cerrar sesión con estética GranaBank
export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  // Cierra con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Contenedor del modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[360px] bg-[#FFFFFF] rounded-[24px] p-6 shadow-xl border border-[#F0F2F5] relative animate-in zoom-in-95 duration-200"
      >
        {/* Botón de cierre X */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#A0AEC0] hover:text-[#1A202C] hover:bg-[#F8FAFC] rounded-full transition-colors cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icono de cerrar sesión */}
        <div className="w-14 h-14 rounded-full bg-[#E4D2D5]/50 flex items-center justify-center mx-auto mb-4 text-[#7A1D2D]">
          <svg
            width="26"
            height="26"
            viewBox="0 0 27 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 4.5H7.5C5.5 4.5 4 6 4 8V23C4 25 5.5 26.5 7.5 26.5H13.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 15.5H23"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 10.5L23 15.5L18 20.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Título y descripción */}
        <h3
          id="logout-modal-title"
          className="text-lg font-semibold text-[#1A202C] text-center mb-1.5"
        >
          ¿Cerrar sesión?
        </h3>
        <p className="text-sm text-[#718096] text-center mb-6 leading-relaxed">
          ¿Estás seguro de que deseas salir? Tendrás que volver a iniciar sesión para ingresar.
        </p>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-[16px] border border-[#E2E8F0] text-[#4A5568] font-medium text-sm hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-[16px] bg-[#7A1D2D] hover:bg-[#601724] text-white font-medium text-sm transition-colors cursor-pointer shadow-sm text-center"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

