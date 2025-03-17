import React, { useState, useEffect, useRef } from 'react';
import Card from './ui/Card';

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  xp: number;
  createdAt?: string;
}

interface CardCarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number;
  onDetailsClick?: (item: CarouselItem) => void;
}

const CardCarousel: React.FC<CardCarouselProps> = ({
  items,
  autoSlideInterval = 10000,
  onDetailsClick,
}) => {
  const totalItems = items.length;
  const slideRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 384;
  const horizontalPadding = 16;
  const itemOffset = cardWidth + horizontalPadding;

  useEffect(() => {
    if (totalItems >= 3) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      }, autoSlideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlideInterval, totalItems]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  if (totalItems === 0) {
    return <div className="text-center py-4 text-white">No items available.</div>;
  }

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{ width: "calc(100% - 10vw)", maxWidth: "1623px" }}
    >
      <div
        ref={slideRef}
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * itemOffset}px)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-96 px-2">
            <Card
              title={item.title}
              description={item.description}
              xp={item.xp}
              faded={false}
              onDetailsClick={() => onDetailsClick && onDetailsClick(item)}
            />
          </div>
        ))}
      </div>
      {totalItems >= 3 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-[#453245] p-2 rounded-full"
          >
            {"<"}
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-[#453245] p-2 rounded-full"
          >
            {">"}
          </button>
        </>
      )}
    </div>
  );
};

export default CardCarousel;
