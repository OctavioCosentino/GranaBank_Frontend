"use client";

import React, { useRef, useState, useEffect } from "react";

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
      className={`h-10 px-5 rounded-[16px] text-[14px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none outline-none shrink-0 ${
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

// Barra de filtros horizontal desplazable con soporte de rueda de mouse e indicador slider
export function FilterBar<T extends string = string>({
  options,
  selectedId,
  onSelect,
  className = "",
}: FilterBarProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calcula el progreso de desplazamiento para el indicador visual tipo mini slider
  const updateScrollProgress = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 2) {
      setCanScroll(true);
      setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
    } else {
      setCanScroll(false);
    }
  };

  useEffect(() => {
    updateScrollProgress();
    const timer = setTimeout(updateScrollProgress, 60);
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.addEventListener("scroll", updateScrollProgress, { passive: true });
      window.addEventListener("resize", updateScrollProgress);
      return () => {
        clearTimeout(timer);
        scroller.removeEventListener("scroll", updateScrollProgress);
        window.removeEventListener("resize", updateScrollProgress);
      };
    }
    return () => clearTimeout(timer);
  }, [options]);

  // Desplazamiento horizontal con la rueda del mouse al pasar por encima
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const handleWheel = (e: WheelEvent) => {
      if (scroller.scrollWidth > scroller.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          scroller.scrollLeft += e.deltaY;
        }
      }
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Contenedor deslizable de las pastillas */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scroll-smooth select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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

      {/* Mini slider horizontal granate como indicador de desplazamiento */}
      {canScroll && (
        <div className="flex justify-center mt-2.5" aria-hidden="true">
          <div className="w-12 h-1 bg-[#E4D2D5] rounded-full overflow-hidden">
            <div
              className="h-full w-5 bg-[#7A1D2D] rounded-full transition-transform duration-100 ease-out"
              style={{
                transform: `translateX(${scrollProgress * 28}px)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

