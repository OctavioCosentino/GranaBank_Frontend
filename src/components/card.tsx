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
}

// Tarjeta bancaria corporativa GranaBank con datos preparados para hidratar desde el backend
export const Card: React.FC<CardProps> = ({
  balance = "978.85",
  currency = "USD",
  last4 = "1234",
  cardholderName = "Soy Granate",
  expiryDate = "02/30",
  brand = "mastercard",
  className = "",
}) => {
  return (
    <div
      className={`w-full h-[200px] p-5 rounded-[24px] bg-[#7A1D2D] text-white flex flex-col justify-between shadow-md select-none ${className}`}
    >
      {/* Fila superior: Balance y Logo de la marca */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[14px] text-white font-normal leading-tight">
            Balance
          </span>
          <div className="flex items-center gap-2.5 mt-1.5">
            {/* Badge de divisa con degradado dorado */}
            <span className="px-2 py-0.5 rounded-[7px] bg-gradient-to-b from-[#E6BC5C] to-[#CA9333] text-white text-[12px] font-semibold shadow-xs">
              {currency}
            </span>
            <span className="text-[26px] font-semibold text-white tracking-tight leading-none">
              {balance}
            </span>
          </div>
        </div>

        {/* Logo de la franquicia */}
        <div className="flex items-center justify-center">
          {brand === "mastercard" ? (
            <Image
              src="/mastercard.png"
              alt="Mastercard"
              width={38}
              height={24}
              className="object-contain"
            />
          ) : brand === "visa" ? (
            <Image
              src="/visa.png"
              alt="Visa"
              width={40}
              height={16}
              className="object-contain"
            />
          ) : null}
        </div>
      </div>

      {/* Fila media: Número enmascarado */}
      <div className="text-[17px] font-medium tracking-[0.22em] text-white my-auto">
        **** **** **** {last4}
      </div>

      {/* Fila inferior: Titular y Fecha de vencimiento */}
      <div className="flex items-end justify-between">
        <span className="text-[15px] font-medium text-white leading-tight">
          {cardholderName}
        </span>

        <div className="flex flex-col items-end text-right">
          <span className="text-[11px] font-normal text-white/85 leading-tight">
            Exp. Date
          </span>
          <span className="text-[14px] font-medium text-white leading-tight mt-0.5">
            {expiryDate}
          </span>
        </div>
      </div>
    </div>
  );
};

