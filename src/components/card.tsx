import React from "react";
import Image from "next/image";

export interface CardProps {
  balance?: number | string;
  currency?: string;
  last4?: string;
  cardholderName?: string;
  expiryDate?: string;
  brand?: "mastercard" | "visa" | string;
  className?: string;
  isMuted?: boolean;
}

// Tarjeta bancaria corporativa GranaBank con soporte para estado normal y tono apagado
export const Card: React.FC<CardProps> = ({
  balance = "0,00",
  currency = "USD",
  last4 = "••••",
  cardholderName = "TITULAR",
  expiryDate = "--/--",
  brand = "mastercard",
  className = "",
  isMuted = false,
}) => {
  const bgStyles = isMuted
    ? "bg-[#82444D] border border-dashed border-white/30 text-white/80 shadow-none"
    : "bg-[#7A1D2D] text-white shadow-md";

  return (
    <div
      className={`w-full h-[200px] p-5 rounded-[24px] flex flex-col justify-between select-none ${bgStyles} ${className}`}
    >
      {/* Fila superior: Balance y Logo de la marca */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[14px] font-normal leading-tight opacity-90">
            Balance
          </span>
          <div className="flex items-center gap-2.5 mt-1.5">
            {/* Badge de divisa */}
            <span
              className={`px-2 py-0.5 rounded-[7px] text-[12px] font-semibold shadow-xs ${
                isMuted
                  ? "bg-white/20 text-white/90"
                  : "bg-gradient-to-b from-[#E6BC5C] to-[#CA9333] text-white"
              }`}
            >
              {currency}
            </span>
            <span className="text-[26px] font-semibold tracking-tight leading-none">
              {balance}
            </span>
          </div>
        </div>

        {/* Logo de la franquicia */}
        <div className="flex items-center justify-center">
          {brand === "mastercard" ? (
            <Image
              src="/mastercard.webp"
              alt="Mastercard"
              width={38}
              height={24}
              className={`object-contain ${isMuted ? "opacity-60 grayscale-[30%]" : ""}`}
            />
          ) : brand === "visa" ? (
            <Image
              src="/visa.webp"
              alt="Visa"
              width={40}
              height={16}
              className={`object-contain ${isMuted ? "opacity-60 grayscale-[30%]" : ""}`}
            />
          ) : null}
        </div>
      </div>

      {/* Fila media: Número enmascarado */}
      <div className="text-[17px] font-medium tracking-[0.22em] my-auto">
        **** **** **** {last4}
      </div>

      {/* Fila inferior: Titular y Fecha de vencimiento */}
      <div className="flex items-end justify-between">
        <span className="text-[15px] font-medium leading-tight truncate max-w-[200px]">
          {cardholderName}
        </span>

        <div className="flex flex-col items-end text-right">
          <span className="text-[11px] font-normal opacity-85 leading-tight">
            Exp. Date
          </span>
          <span className="text-[14px] font-medium leading-tight mt-0.5">
            {expiryDate}
          </span>
        </div>
      </div>
    </div>
  );
};

// Skeleton animado para indicar estado de carga de una tarjeta bancaria
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`w-full h-[200px] p-5 rounded-[24px] bg-[#E2E8F0]/80 flex flex-col justify-between animate-pulse select-none ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="w-14 h-3.5 bg-[#CBD5E0] rounded" />
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-9 h-5 bg-[#CBD5E0] rounded-[7px]" />
            <div className="w-24 h-7 bg-[#CBD5E0] rounded" />
          </div>
        </div>
        <div className="w-10 h-6 bg-[#CBD5E0] rounded" />
      </div>

      <div className="w-48 h-4.5 bg-[#CBD5E0] rounded my-auto" />

      <div className="flex items-end justify-between">
        <div className="w-32 h-4 bg-[#CBD5E0] rounded" />
        <div className="flex flex-col items-end gap-1.5">
          <div className="w-12 h-2.5 bg-[#CBD5E0] rounded" />
          <div className="w-10 h-3.5 bg-[#CBD5E0] rounded" />
        </div>
      </div>
    </div>
  );
};

