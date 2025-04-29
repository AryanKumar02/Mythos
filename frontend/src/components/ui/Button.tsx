// src/components/ui/Button.tsx
import React from "react";

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  textColor?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  text,
  children,
  onClick,
  className = "",
  textColor = "text-[#453245]",
  disabled = false,
  loading = false,
  ariaLabel,
  type = "button",
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyPress}
      disabled={disabled || loading}
      className={`w-[140px] h-[65px] rounded-full bg-white ${textColor} font-semibold shadow-lg hover:bg-gray-300 hover:scale-105 transition duration-300 flex items-center justify-center text-xl ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={ariaLabel || text}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {loading ? (
        <span className="sr-only">Loading...</span>
      ) : (
        children || text
      )}
    </button>
  );
};

export default Button;
