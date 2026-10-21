"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  title?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  containerClassName?: string;
  error?: boolean;
}

// Componente de input con soporte para título, placeholder y toggle de visibilidad para passwords
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      title,
      placeholder,
      type = "text",
      className = "",
      containerClassName = "",
      disabled,
      error = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    // Determina el tipo real del input según el estado del toggle
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    // Estilos dinámicos de borde según estado de error
    const borderStyles = error
      ? "border-[#E53E3E] focus:border-[#E53E3E] focus:ring-1 focus:ring-[#E53E3E]"
      : "border-[#E2E8F0] focus:border-[#7A1D2D] focus:ring-1 focus:ring-[#7A1D2D]";

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {title && (
          <label className="text-[14px] font-medium text-[#4A5568]">
            {title}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            type={currentType}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full h-12 px-4 rounded-xl border bg-white text-[15px] text-[#2D3748] placeholder-[#A0AEC0] outline-none focus:outline-none transition-all disabled:bg-[#EDF2F7] disabled:cursor-not-allowed ${borderStyles} ${
              isPassword ? "pr-12" : ""
            } ${className}`}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-4 text-[#A0AEC0] hover:text-[#7A1D2D] transition-colors focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

