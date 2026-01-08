import React from "react";

export const ButtonColors = {
  default: "bg-[#009FE3] text-white hover:bg-[#00b5ff]",
  outline: "border border-[#009FE3] text-[#009FE3] hover:bg-[#009FE3]/10",
  ghost: "text-white/70 hover:text-[#009FE3]",
  selected: "bg-[#00b5ff] text-white",
} as const;

type ButtonColor = keyof typeof ButtonColors;

type Props = {
  onClick: () => void;
  color?: ButtonColor;
  selected?: boolean;
  children: React.ReactNode;
  className?: string;
};

export const Button: React.FC<Props> = ({
  onClick,
  color = "default",
  selected = false,
  children,
  className,
}) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition";

  const appliedColor = selected ? ButtonColors.selected : ButtonColors[color];

  return (
    <button
      className={`${base} ${appliedColor} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
