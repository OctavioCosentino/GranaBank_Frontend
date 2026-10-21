"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card } from "@/components/card";

export interface CardData {
  id?: string;
  balance?: number | string;
  currency?: string;
  last4?: string;
  cardholderName?: string;
  expiryDate?: string;
  brand?: "mastercard" | "visa" | string;
}

interface CardCarouselProps {
  cards?: CardData[];
  onAddCard?: () => void;
  className?: string;
}

// Datos de ejemplo para desarrollo antes de conectar con el backend
const defaultCards: CardData[] = [
  {
    id: "card-1",
    balance: "978.85",
    currency: "USD",
    last4: "1234",
    cardholderName: "Soy Granate",
    expiryDate: "02/30",
    brand: "mastercard",
  },
  {
    id: "card-2",
    balance: "1.450.00",
    currency: "USD",
    last4: "8821",
    cardholderName: "Soy Granate",
    expiryDate: "11/28",
    brand: "visa",
  },
];

// Carrusel de tarjetas bancarias con scroll táctil, arrastre con mouse y botones de navegación
export const CardCarousel: React.FC<CardCarouselProps> = ({
  cards = defaultCards,
  onAddCard,
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Estados para soportar arrastre con mouse en computadoras
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  // Comprueba la posición del scroll para habilitar/deshabilitar flechas
  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.addEventListener("scroll", checkScrollPosition, { passive: true });
      return () => scroller.removeEventListener("scroll", checkScrollPosition);
    }
  }, [cards]);

  // Desplaza el carrusel hacia la izquierda o derecha
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 356; // 340px ancho de tarjeta + 16px gap
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Manejadores para arrastre de mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Botón flecha izquierda */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/90 text-[#7A1D2D] shadow-md border border-[#E2E8F0] hover:bg-white active:scale-95 transition-all cursor-pointer"
          aria-label="Tarjeta anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Contenedor desplazable con soporte de snap y scrollbar oculto */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-1 px-1 -mx-1 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
      >
        {/* Renderizado del array de tarjetas del back */}
        {cards.map((card, index) => (
          <div key={card.id || index} className="snap-start shrink-0">
            <Card
              balance={card.balance}
              currency={card.currency}
              last4={card.last4}
              cardholderName={card.cardholderName}
              expiryDate={card.expiryDate}
              brand={card.brand}
            />
          </div>
        ))}

        {/* Tarjeta final para añadir una nueva tarjeta */}
        <div className="snap-start shrink-0">
          <button
            type="button"
            onClick={onAddCard}
            className="w-[340px] h-[200px] p-5 rounded-[24px] bg-[#F9B7B6] flex flex-col items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.98] shadow-sm cursor-pointer border border-[#E8A0A0]"
            aria-label="Agregar nueva tarjeta"
          >
            <div className="w-13 h-13 rounded-full bg-white/60 flex items-center justify-center text-[#7A1D2D] shadow-xs">
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-[15px] font-semibold text-[#7A1D2D]">
              Agregar tarjeta
            </span>
          </button>
        </div>
      </div>

      {/* Botón flecha derecha */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/90 text-[#7A1D2D] shadow-md border border-[#E2E8F0] hover:bg-white active:scale-95 transition-all cursor-pointer"
          aria-label="Siguiente tarjeta"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

