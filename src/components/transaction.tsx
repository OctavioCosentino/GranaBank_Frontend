import React from "react";

export type TransactionType = "SUS" | "CASH_IN" | "CASH_OUT";

interface TransactionCardProps {
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: string;
}

const transactionStyles = {
  SUS: {
    bgIcon: "bg-[#F3E4FF]",
    textPrincipal: "text-[#B946FF]",
  },
  CASH_IN: {
    bgIcon: "bg-[#E4D2D5]",
    textPrincipal: "text-[#7A1D2D]",
  },
  CASH_OUT: {
    bgIcon: "bg-[#FEE9D4]",
    textPrincipal: "text-[#EF9C54]",
  },
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  title,
  subtitle,
  amount,
}) => {
  const currentStyle = transactionStyles[type];

  const renderIcon = () => {
    switch (type) {
      case "SUS":
        return (
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 6H8V12H3V6H0L5.5 0L11 6ZM12.5 20L18 14H15V8H10V14H7L12.5 20Z"
              fill="#B946FF"
            />
          </svg>
        );
      case "CASH_IN":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.99997 4H15V12H19.84L12 19.84L4.15997 12H8.99997V4Z"
              fill="#7A1D2D"
            />
          </svg>
        );
      case "CASH_OUT":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 20L9.00003 20L9.00003 12L4.16003 12L12 4.16L19.84 12L15 12L15 20Z"
              fill="#EF9C55"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-5 py-4 bg-[#FFFFFF] rounded-2xl shadow-sm mb-4">
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-[14px] ${currentStyle.bgIcon} ${currentStyle.textPrincipal}`}
        >
          {renderIcon()}
        </div>

        <div className="flex flex-col">
          <span className="text-[16px] font-medium text-[#4A5568] leading-tight">
            {title}
          </span>
          <span className="text-[13px] text-[#A0AEC0] mt-0.5">{subtitle}</span>
        </div>
      </div>

      <div className={`text-[15px] font-medium whitespace-nowrap ml-3 shrink-0 ${currentStyle.textPrincipal}`}>
        {amount}
      </div>
    </div>
  );
};


// Skeleton animado para indicar estado de carga de un movimiento financiero
export const TransactionSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-between w-full px-5 py-4 bg-[#FFFFFF] rounded-2xl shadow-sm mb-4 animate-pulse select-none ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Icono skeleton */}
        <div className="w-12 h-12 rounded-[14px] bg-[#E2E8F0]" />

        {/* Textos skeleton */}
        <div className="flex flex-col gap-2">
          <div className="w-28 h-4 bg-[#E2E8F0] rounded" />
          <div className="w-36 h-3 bg-[#EDF2F7] rounded" />
        </div>
      </div>

      {/* Monto skeleton */}
      <div className="w-12 h-4 bg-[#E2E8F0] rounded" />
    </div>
  );
};
