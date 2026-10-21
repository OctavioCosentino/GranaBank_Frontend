"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { CardData } from "@/components/card-carousel";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CardData) => void;
}

// Modal para ingresar y validar los datos de una nueva tarjeta bancaria
export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
}) => {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isTouchedExpiry, setIsTouchedExpiry] = useState(false);

  // Cierra el modal y restablece los campos
  const handleClose = useCallback(() => {
    setCardholderName("");
    setCardNumber("");
    setExpiryDate("");
    setIsTouchedExpiry(false);
    onClose();
  }, [onClose]);

  // Cierre con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // Filtra solo letras y convierte automáticamente a mayúsculas
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upper = e.target.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "")
      .toUpperCase();
    setCardholderName(upper);
  };

  // Solo números, máximo 16 dígitos y separación automática cada 4 dígitos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  // Solo números, auto-barra con formato MM/YEAR
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 6);

    if (raw.length === 1 && parseInt(raw, 10) > 1) {
      raw = `0${raw}`;
    }

    let formatted = raw;
    if (raw.length >= 2) {
      const monthNum = parseInt(raw.slice(0, 2), 10);
      const safeMonth =
        monthNum > 12 ? "12" : monthNum === 0 ? "01" : raw.slice(0, 2);
      formatted = `${safeMonth}/${raw.slice(2)}`;
    }

    setExpiryDate(formatted);
  };

  // Permite borrar el slash y el mes con suavidad al presionar Backspace
  const handleExpiryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && expiryDate.endsWith("/")) {
      e.preventDefault();
      setExpiryDate(expiryDate.slice(0, -2));
    }
  };

  // Detección de franquicia (Visa o Mastercard)
  const cleanNumber = cardNumber.replace(/\s/g, "");
  const brand: "visa" | "mastercard" = cleanNumber.startsWith("4")
    ? "visa"
    : "mastercard";

  // Validación de fecha contra el año actual del sistema
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const parts = expiryDate.split("/");
  const monthStr = parts[0] || "";
  const yearStr = parts[1] || "";

  // Año vencido o menor al año actual
  const hasYearError =
    (yearStr.length === 4 &&
      (parseInt(yearStr, 10) < currentYear ||
        (parseInt(yearStr, 10) === currentYear &&
          parseInt(monthStr, 10) < currentMonth))) ||
    (isTouchedExpiry && yearStr.length > 0 && yearStr.length < 4);

  // Validez global del formulario
  const isFormValid =
    cardholderName.trim().length >= 3 &&
    cleanNumber.length === 16 &&
    yearStr.length === 4 &&
    !hasYearError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onAddCard({
      id: `card-${Date.now()}`,
      cardholderName: cardholderName.trim(),
      last4: cleanNumber.slice(-4),
      expiryDate,
      brand,
      balance: "0.00",
      currency: "USD",
    });

    toast("Tarjeta agregada exitosamente", {
      description: `Tarjeta terminada en ${cleanNumber.slice(-4)} vinculada.`,
      duration: 4000,
      style: {
        background: "#E4D2D5",
        backgroundColor: "#E4D2D5",
        border: "1px solid #000000",
        color: "#1A202C",
      },
    });

    handleClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-card-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] bg-[#FFFFFF] rounded-[24px] p-6 shadow-2xl border border-[#F0F2F5] relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Botón X de cierre */}
        <button
          type="button"
          onClick={handleClose}
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

        {/* Encabezado */}
        <h3
          id="add-card-title"
          className="text-[20px] font-bold text-[#1A202C] text-center mb-1"
        >
          Nueva tarjeta
        </h3>
        <p className="text-[13px] text-[#718096] text-center mb-4">
          Ingresa los datos para vincular tu tarjeta a GranaBank
        </p>

        {/* Vista previa en tiempo real */}
        <div className="w-full h-[150px] p-4 rounded-[20px] bg-[#7A1D2D] text-white flex flex-col justify-between shadow-md mb-5 select-none transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-white/80">
              GranaBank Card
            </span>
            {brand === "mastercard" ? (
              <Image
                src="/mastercard.png"
                alt="Mastercard"
                width={32}
                height={20}
                className="object-contain"
              />
            ) : (
              <Image
                src="/visa.png"
                alt="Visa"
                width={34}
                height={14}
                className="object-contain"
              />
            )}
          </div>

          <div className="text-[16px] font-medium tracking-[0.18em] text-white">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-white/70">
                Titular
              </span>
              <span className="text-[13px] font-medium truncate max-w-[200px]">
                {cardholderName || "NOMBRE DEL TITULAR"}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-wider text-white/70">
                Exp. Date
              </span>
              <span className="text-[13px] font-medium">
                {expiryDate || "MM/YEAR"}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Input Nombre del titular */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#4A5568]">
              Nombre del titular
            </label>
            <input
              type="text"
              value={cardholderName}
              onChange={handleNameChange}
              placeholder="EJ. JUAN PEREZ"
              className="w-full h-11 px-4 rounded-[14px] border border-[#E2E8F0] bg-white text-[14px] text-[#2D3748] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#7A1D2D] focus:ring-1 focus:ring-[#7A1D2D]"
              required
            />
          </div>

          {/* Input Número de tarjeta */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#4A5568]">
              Número de tarjeta
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={handleNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full h-11 px-4 pr-12 rounded-[14px] border border-[#E2E8F0] bg-white text-[14px] text-[#2D3748] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#7A1D2D] focus:ring-1 focus:ring-[#7A1D2D]"
                required
              />
              <div className="absolute right-3.5 pointer-events-none">
                {brand === "mastercard" ? (
                  <Image
                    src="/mastercard.png"
                    alt="Mastercard"
                    width={26}
                    height={16}
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src="/visa.png"
                    alt="Visa"
                    width={28}
                    height={12}
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Input Fecha de vencimiento */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#4A5568]">
              Fecha de vencimiento
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={expiryDate}
              onChange={handleExpiryChange}
              onKeyDown={handleExpiryKeyDown}
              onBlur={() => setIsTouchedExpiry(true)}
              placeholder="MM/YEAR"
              className={`w-full h-11 px-4 rounded-[14px] border bg-white text-[14px] outline-none transition-all ${
                hasYearError
                  ? "border-[#E53E3E] text-[#E53E3E] focus:border-[#E53E3E] focus:ring-1 focus:ring-[#E53E3E]"
                  : "border-[#E2E8F0] text-[#2D3748] placeholder-[#A0AEC0] focus:border-[#7A1D2D] focus:ring-1 focus:ring-[#7A1D2D]"
              }`}
              required
            />
            {hasYearError && (
              <span className="text-[12px] text-[#E53E3E] mt-0.5 font-medium">
                Ingrese un año correcto
              </span>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-[16px] border border-[#E2E8F0] text-[#4A5568] font-medium text-[14px] hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 py-2.5 px-4 rounded-[16px] bg-[#7A1D2D] hover:bg-[#601724] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed text-white font-medium text-[14px] transition-colors cursor-pointer shadow-sm text-center"
            >
              Agregar tarjeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
