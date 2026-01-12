import React, { useState, useRef, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className = "" }) => {

  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{x: number, y: number}>({x: 0, y: 0});
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setVisible(true);
    updateCoords(e);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    updateCoords(e);
  };
  const handleMouseLeave = () => {
    setVisible(false);
  };
  const updateCoords = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8
    });
  };

  return (
    <span
      ref={triggerRef}
      className={"relative inline-block " + className}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {children}
      {visible && (
        <span
          className="fixed z-50 px-4 py-3 rounded-xl bg-[#0A0F1F]/95 text-[#009FE3] text-sm shadow-2xl border border-[#009FE3]/50 w-max min-w-[220px] max-w-[340px] font-medium flex flex-col items-start pointer-events-none"
          style={{
            whiteSpace: 'normal',
            left: coords.x,
            top: coords.y,
            transform: 'translate(-50%, 0)'
          }}
        >
          {content}
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4" style={{pointerEvents:'none'}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L16 16H0L8 0Z" fill="#0A0F1F" fillOpacity="0.95" stroke="#009FE3" strokeOpacity="0.5" />
            </svg>
          </span>
        </span>
      )}
    </span>
  );
};
