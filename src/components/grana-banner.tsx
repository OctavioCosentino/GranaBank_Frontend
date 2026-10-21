import React from "react";

interface GranaBannerProps {
  className?: string;
}

// Banner de marca GranaBank con isotipo, nombre y lema centrado
export const GranaBanner: React.FC<GranaBannerProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="w-12 h-12 bg-[#7A1D2D] rounded-[14px] mb-4 shadow-sm" />
      <h1 className="text-[32px] font-bold text-[#7A1D2D] tracking-tight leading-none">
        GranaBank
      </h1>
      <p className="text-[15px] text-[#718096] mt-2 font-normal">
        Con cada compra, sumás orgullo granate
      </p>
    </div>
  );
};
