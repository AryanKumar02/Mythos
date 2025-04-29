import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Card from './ui/Card';

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  xp?: number;
  createdAt?: string | Date;
  completed?: boolean;
}

interface CarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ items, autoSlideInterval = 3000 }) => {
  const ctaCard: CarouselItem = {
    id: 'cta',
    title: 'Start a New Quest!',
    description: 'Complete tasks to unlock new quests or click here to create one!',
  };

  // Filter out completed quests
  const activeItems = items.filter(item => !item.completed);

  const renderMode =
    activeItems.length === 0 ? 'staticCTA' : activeItems.length === 1 ? 'staticTwo' : 'carousel';
  console.log("Carousel renderMode:", renderMode);

  let displayedItems: CarouselItem[] = [];
  if (renderMode === 'staticCTA') {
    displayedItems = [ctaCard];
  } else if (renderMode === 'staticTwo') {
    displayedItems = [...activeItems, ctaCard];
  } else {
    if (activeItems.length < 3) {
      displayedItems = [...activeItems, ctaCard];
    } else {
      const sortedItems = [...activeItems].sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
      displayedItems = sortedItems.slice(0, 3);
    }
  }
  console.log("Displayed items:", displayedItems);

  const controls = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = displayedItems.length;

  const cardWidth = 300;
  const cardHeight = 256;
  const gap = 16;
  const visibleWidth = cardWidth * 3 + gap * 2;

  useEffect(() => {
    if (renderMode !== 'carousel') {
      console.log("Skipping auto-slide because renderMode is not 'carousel'.");
      return;
    }
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev === total - 1 ? 0 : prev + 1));
    }, autoSlideInterval);
    console.log("Auto-slide timer started with interval:", autoSlideInterval);
    return () => {
      clearInterval(timer);
      console.log("Auto-slide timer cleared.");
    };
  }, [renderMode, total, autoSlideInterval]);

  const offset = activeIndex * (cardWidth + gap) - ((visibleWidth - cardWidth) / 2);
  console.log("Active index:", activeIndex, "Offset:", offset);

  useEffect(() => {
    if (renderMode !== 'carousel') {
      console.log("Skipping carousel animation because renderMode is not 'carousel'.");
      return;
    }
    controls.start({
      x: -offset,
      transition: { type: 'tween', duration: 0.5 },
    });
    console.log("Animating carousel to offset:", offset);
  }, [renderMode, activeIndex, offset, controls]);

  const goToSlide = (index: number) => {
    console.log("Dot clicked, going to slide:", index);
    setActiveIndex(index);
  };

  if (renderMode === 'staticCTA') {
    return (
      <div
        role="region"
        aria-label="Quest carousel"
        className="flex justify-center items-center mt-8 mx-auto"
        style={{ width: cardWidth }}
      >
        <Card
          title={ctaCard.title}
          description={ctaCard.description}
          faded={false}
          isCTA={true}
        />
      </div>
    );
  } else if (renderMode === 'staticTwo') {
    return (
      <div
        role="region"
        aria-label="Quest carousel"
        className="flex justify-center items-center mt-8 mx-auto"
        style={{ width: cardWidth * 2 + gap, gap: `${gap}px` }}
      >
        <div style={{ width: cardWidth, height: cardHeight }}>
          <Card
            title={activeItems[0].title}
            description={activeItems[0].description}
            xp={activeItems[0].xp}
            faded={false}
          />
        </div>
        <div style={{ width: cardWidth, height: cardHeight }}>
          <Card
            title={ctaCard.title}
            description={ctaCard.description}
            faded={false}
            isCTA={true}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        role="region"
        aria-label="Quest carousel"
        className="mt-8 mx-auto"
        style={{ width: visibleWidth }}
      >
        <div
          role="list"
          className="overflow-hidden"
        >
          <motion.div
            role="listitem"
            className="flex items-start"
            style={{ gap: `${gap}px` }}
            animate={controls}
            transition={{ type: 'tween', duration: 0.5 }}
          >
            {displayedItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                style={{ minWidth: `${cardWidth}px`, height: `${cardHeight}px` }}
                role="listitem"
                aria-label={`Quest: ${item.title}`}
              >
                <Card
                  title={item.title}
                  description={item.description}
                  xp={item.xp}
                  faded={index !== activeIndex}
                  isCTA={item.id === 'cta'}
                />
              </div>
            ))}
          </motion.div>
        </div>
        <div
          role="tablist"
          aria-label="Carousel navigation"
          className="flex justify-center mt-4"
        >
          {displayedItems.map((_, index) => (
            <button
              key={`dot-${index}`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`slide-${index}`}
              onClick={() => goToSlide(index)}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                margin: '0 4px',
                border: 'none',
                backgroundColor: index === activeIndex ? '#4A90E2' : '#fff',
                cursor: 'pointer',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default Carousel;
