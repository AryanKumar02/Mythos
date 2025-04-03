// src/components/ui/Card.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  description: string;
  xp?: number;
  faded?: boolean;
  isCTA?: boolean;
  onDetailsClick?: () => void; 
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  xp,
  faded = false,
  isCTA = false,
  onDetailsClick,
}) => {
  const shouldScroll = description.length > 100;
  const descriptionStyle: React.CSSProperties = shouldScroll
    ? { maxHeight: '6rem', overflowY: 'auto', paddingRight: '4px' }
    : {};

  return (
    <div
      className={`rounded-lg shadow-lg p-6 transition duration-300 ease-in-out bg-[#524456] flex flex-col border border-[#756A78] ${
        faded ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ height: '16rem' }}
    >
      <h3 className="text-xl font-bold mb-2 text-white text-center">{title}</h3>
      <div className="flex-grow" style={descriptionStyle}>
        <p className="text-white text-center">{description}</p>
      </div>
      {xp !== undefined && (
        <p className="text-white text-sm mt-2 text-center">XP: {xp}</p>
      )}
      {/* Details Button */}
      <div className="mt-4">
        <button
          onClick={onDetailsClick}
          className="w-full bg-white text-[#453245] py-1 px-3 font-semibold rounded-full hover:bg-gray-200 transition duration-200"
        >
          Details
        </button>
      </div>
      {/* Optional CTA button */}
      {isCTA && (
        <div className="mt-4 flex justify-center">
          <Link to="/create-quest">
            <button className="bg-white text-[#453245] py-1 px-3 font-semibold rounded-full hover:bg-gray-200 transition duration-200">
              Create
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;
