import React from "react";

type ScrollBarProps = {
  children: React.ReactNode;
};

export const ScrollBar: React.FC<ScrollBarProps> = ({ children }) => {
  return (
    <div className="overflow-auto scrollbar scrollbar-thumb-[#009FE3]/50 scrollbar-track-[#0A0F1F]/30">
      {children}
    </div>
  );
};
