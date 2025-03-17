// src/components/ui/ElongatedCard.tsx
import React from 'react';

interface ElongatedSectionProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  height?: string;
}

const ElongatedSection: React.FC<ElongatedSectionProps> = ({
  children,
  backgroundColor = "rgba(82,68,86,0.4)",
  borderColor = "rgba(117,106,120,0.4)",
  borderWidth = "8px",
  borderRadius = "30px",
  height = "200px",
}) => {
  return (
    <div
      className="max-w-[1623px] mx-auto shadow-lg flex flex-col items-center justify-center"
      style={{
        backgroundColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius,
        height,
        width: "calc(100% - 10vw)",
      }}
    >
      {children}
    </div>
  );
};

export default ElongatedSection;
