// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  faded?: boolean;
}

const Card: React.FC<CardProps> = ({ title, description, faded = false }) => {
  return (
    <div
      className={`rounded-lg shadow-lg p-6 transition duration-300 ease-in-out bg-[#524456] h-64 flex flex-col overflow-hidden border-3 border-[#756A78] ${
        faded ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-white flex-grow overflow-y-auto">
        {description}
      </p>
    </div>
  );
};

export default Card;