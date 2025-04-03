import React from 'react';

interface ArrowIconProps {
  rotate?: number; // rotation in degrees, default is 0 (right arrow)
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ rotate = 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <polyline points="9 5 16 12 9 19" />
  </svg>
);

export default ArrowIcon;