// src/components/ui/InputWithButton.tsx
import React, { useState } from 'react';

interface InputWithButtonProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  buttonText: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  fullWidth = false,
  buttonText,
  onButtonClick,
  isLoading = false,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    if (onButtonClick) {
      setIsClicked(true);
      onButtonClick();
      setTimeout(() => setIsClicked(false), 200);
    }
  };

  return (
    <div
      style={{ width: fullWidth ? "100%" : "383px", height: "63px" }}
      className="mt-4 relative"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(174,167,176,0.7)",
          border: "3px solid #635667",
          borderRadius: "30px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ height: "100%", color: "#FFFBFF" }}
          className="px-4 bg-transparent focus:outline-none w-full placeholder-[#FFFBFF]/50"
        />
      </div>
      <button
        onClick={handleButtonClick}
        style={{
          width: "120px",
          height: "63px",
          backgroundColor: isClicked ? "#E0E0E0" : "#FFFFFF",
          border: "3px solid #635667",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          right: "0",
          top: "0",
          transition: "background-color 0.2s ease",
        }}
        className="text-[#453245] font-bold"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="rgba(174,167,176,0.7)"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default InputWithButton;