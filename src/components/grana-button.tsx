import React, { forwardRef } from "react";

export interface GranaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

// Botón corporativo GranaBank con variantes primary y outline
export const GranaButton = forwardRef<HTMLButtonElement, GranaButtonProps>(
  (
    { children, variant = "primary", className = "", disabled, ...props },
    ref,
  ) => {
    const baseStyles =
      "w-full h-13 px-6 rounded-[16px] text-[16px] font-semibold transition-all duration-200 flex items-center justify-center select-none outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]";

    const variantStyles = {
      primary:
        "bg-[#7A1D2D] text-white hover:bg-[#661825] active:bg-[#54141E] shadow-sm",
      outline:
        "border-2 border-[#7A1D2D] bg-transparent text-[#7A1D2D] hover:bg-[#7A1D2D]/5 active:bg-[#7A1D2D]/10",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

GranaButton.displayName = "GranaButton";
