// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps {
  text?: string; // now optional
  onClick?: () => void; // now optional
  className?: string;
  textColor?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  text,
  children,
  onClick,
  className = "",
  textColor = "text-white",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-[140px] h-[65px] rounded-full bg-white ${textColor} font-semibold shadow-lg hover:bg-gray-300 hover:scale-105 transition duration-300 flex items-center justify-center text-xl ${className}`}
    >
      {children || text}
    </button>
  );
};

export default Button;