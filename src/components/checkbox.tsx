"use client";

import React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

// Componente de casilla de verificación con esquinas suaves y color corporativo al activar
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label = "Recordarme",
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center gap-2.5 select-none cursor-pointer group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {/* Casilla visual */}
      <div
        className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-all duration-200 shrink-0 ${
          checked
            ? "bg-[#7A1D2D] text-white shadow-xs"
            : "bg-[#E2E8F0] group-hover:bg-[#CBD5E1]"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Etiqueta de texto */}
      {label && (
        <span className="text-[15px] text-[#718096] font-normal leading-tight">
          {label}
        </span>
      )}
    </label>
  );
};

