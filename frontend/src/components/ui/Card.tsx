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
  loading?: boolean;
  ariaLabel?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  xp,
  faded = false,
  isCTA = false,
  onDetailsClick,
  loading = false,
  ariaLabel,
}) => {
  const shouldScroll = description.length > 100;
  const descriptionStyle: React.CSSProperties = shouldScroll
    ? { maxHeight: '6rem', overflowY: 'auto', paddingRight: '4px' }
    : {};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onDetailsClick?.();
    }
  };

  return (
    <article
      className={`rounded-lg shadow-lg p-6 transition duration-300 ease-in-out bg-[#524456] flex flex-col border border-[#756A78] ${
        faded ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ height: '16rem' }}
      aria-label={ariaLabel || title}
      aria-busy={loading}
      role="article"
    >
      <h3 className="text-xl font-bold mb-2 text-white text-center" tabIndex={0}>{title}</h3>
      <div
        className="flex-grow"
        style={descriptionStyle}
        aria-label={`Description for ${title}`}
        role="region"
      >
        <p className="text-white text-center">{description}</p>
      </div>
      {xp !== undefined && (
        <p className="text-white text-sm mt-2 text-center" aria-label={`Experience points: ${xp}`}>
          XP: {xp}
        </p>
      )}
      {/* Details Button */}
      {!isCTA && (
        <div className="mt-4">
          <button
            onClick={onDetailsClick}
            onKeyDown={handleKeyPress}
            className="w-full bg-white text-[#453245] py-1 px-3 font-semibold rounded-full hover:bg-gray-200 transition duration-200"
            aria-label={`View details for ${title}`}
            disabled={loading}
            tabIndex={loading ? -1 : 0}
          >
            {loading ? (
              <span className="sr-only">Loading details...</span>
            ) : (
              'Details'
            )}
          </button>
        </div>
      )}
      {/* Optional CTA button */}
      {isCTA && (
        <div className="mt-4 flex justify-center">
          <Link to="/adventure">
            <button className="bg-white text-[#453245] py-1 px-3 font-semibold rounded-full hover:bg-gray-200 transition duration-200">
              Create
            </button>
          </Link>
        </div>
      )}
    </article>
  );
};

export default Card;
