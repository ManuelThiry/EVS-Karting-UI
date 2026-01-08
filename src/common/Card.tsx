import React from "react";
import { ScrollBar } from "./ScrollBar";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  imageUrl?: string;
  topRight?: React.ReactNode;
};

type CardHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Content: React.FC<CardContentProps>;
} = ({ children, className = "", imageUrl, topRight }) => {
  return (
    <div
      className={`relative rounded-xl border border-[#009FE3]/10 shadow-[0_0_10px_#009FE320] transition hover:shadow-[0_0_20px_#009FE340] flex flex-col max-h-full ${className}`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {topRight && (
        <div className="absolute top-2 right-2 z-10 flex items-center justify-end">
          <div className="bg-black/70 border border-[#222] rounded-lg px-3 py-1 shadow-lg flex items-center gap-1 backdrop-blur-sm whitespace-nowrap">
            {topRight}
          </div>
        </div>
      )}
      <div className="flex-1 min-h-0 flex flex-col">
        <ScrollBar>
              <div className="relative min-h-0 h-full max-h-[70vh] bg-[#0A0F1F]/60">
            {children}
          </div>
        </ScrollBar>
      </div>
    </div>
  );
};

Card.Header = ({ title, subtitle, className = "" }: CardHeaderProps) => (
  <div className={`p-5 border-b border-white/10 ${className}`}>
    <h3 className="text-lg font-semibold tracking-wide text-[#009FE3]">
      {title}
    </h3>
    {subtitle && (
      <p className="text-sm text-gray-300 mt-1 tracking-wide">{subtitle}</p>
    )}
  </div>
);

Card.Content = ({ children, className = "" }: CardContentProps) => (
  <div className={`p-5 text-white ${className}`}>{children}</div>
);
