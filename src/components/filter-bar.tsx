"use client";

import React from "react";

export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
}

export interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

// Pastilla de filtro individual reutilizable con radio de 16px
export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  isActive,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 px-5 rounded-[16px] text-[14px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none outline-none ${
        isActive
          ? "bg-[#7A1D2D] text-white shadow-xs"
          : "bg-white text-[#2D3748] border border-[#E2E8F0] hover:bg-[#F8FAFC] active:bg-[#EDF2F7]"
      } ${className}`}
    >
      {label}
    </button>
  );
};

export interface FilterBarProps<T extends string = string> {
  options: FilterOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  className?: string;
}

// Barra de filtros horizontal desplazable para vistas financieras
export function FilterBar<T extends string = string>({
  options,
  selectedId,
  onSelect,
  className = "",
}: FilterBarProps<T>) {
  return (
    <div
      className={`flex items-center gap-2.5 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {options.map((option) => (
        <FilterPill
          key={option.id}
          label={option.label}
          isActive={selectedId === option.id}
          onClick={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}

