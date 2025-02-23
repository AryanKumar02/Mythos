// src/components/Carousel.tsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Card from './ui/Card';
import ArrowIcon from './icons/ArrowIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number; // in milliseconds
}

const Carousel: React.FC<CarouselProps> = ({ items, autoSlideInterval = 3000 }) => {
  const originalCount = items.length;
  const renderedItems = items;
  const total = originalCount;

  const controls = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Constants for layout
  const cardWidth = 300; // each card's width (px)
  const gap = 16; // gap between cards (px)
  // Visible area: shows 3 cards side by side
  const visibleWidth = cardWidth * 3 + gap * 2;

  // Calculate offset to center the active card.
  // Formula: activeIndex * (cardWidth + gap) - ((visibleWidth - cardWidth) / 2)
  const offset = activeIndex * (cardWidth + gap) - ((visibleWidth - cardWidth) / 2);

  // Auto-slide: every autoSlideInterval, increment activeIndex if auto-scrolling is enabled.
  useEffect(() => {
    if (!isAutoScrolling) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev === total - 1 ? 0 : prev + 1));
    }, autoSlideInterval);
    return () => clearInterval(timer);
  }, [total, autoSlideInterval, isAutoScrolling]);

  // Animate x offset whenever activeIndex changes.
  useEffect(() => {
    controls.start({
      x: -offset,
      transition: { type: 'tween', duration: 0.5 }
    });
  }, [activeIndex, offset, controls]);

  // Manual navigation functions:
  const prevSlide = () => {
    setActiveIndex(prev => (prev === 0 ? total - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex(prev => (prev === total - 1 ? 0 : prev + 1));
  };

  // Toggle auto-scroll play/pause
  const toggleAutoScroll = () => {
    setIsAutoScrolling(prev => !prev);
  };

  return (
    <div className="mt-8" style={{ width: visibleWidth }}>
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: `${gap}px` }}
          animate={controls}
          transition={{ type: 'tween', duration: 0.5 }}
        >
          {renderedItems.map((item, index) => (
            <div key={index} style={{ minWidth: `${cardWidth}px` }}>
              <Card
                title={item.title}
                description={item.description}
                // Only the active (center) card is fully opaque.
                faded={ index !== activeIndex }
              />
            </div>
          ))}
        </motion.div>
      </div>
      {/* Navigation buttons placed right next to each other */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={prevSlide}
          className="w-10 h-10 flex justify-center items-center text-white focus:outline-none"
        >
          {/* Left arrow: rotate the icon 180 degrees */}
          <ArrowIcon rotate={180} />
        </button>
        <button
          onClick={toggleAutoScroll}
          className="w-10 h-10 flex justify-center items-center text-white focus:outline-none"
        >
          {isAutoScrolling ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 flex justify-center items-center text-white focus:outline-none"
        >
          {/* Right arrow: default rotation */}
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
};

export default Carousel;