// src/components/Carousel.tsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Card from './ui/Card';

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  xp?: number;
}

interface CarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number; // in milliseconds
}

const Carousel: React.FC<CarouselProps> = ({ items, autoSlideInterval = 3000 }) => {
  // Define the CTA card.
  const ctaCard: CarouselItem = {
    id: 'cta',
    title: 'Start a New Quest!',
    description: 'Complete tasks to unlock new quests or click here to create one!',
  };

  // Compute render mode:
  // - 'staticCTA': no quests => show CTA only.
  // - 'staticTwo': exactly one quest => show quest and CTA statically.
  // - 'carousel': two or more quests => use carousel logic.
  const renderMode =
    items.length === 0 ? 'staticCTA' : items.length === 1 ? 'staticTwo' : 'carousel';
  console.log("Carousel renderMode:", renderMode);

  // Compute displayedItems based on renderMode.
  let displayedItems: CarouselItem[] = [];
  if (renderMode === 'staticCTA') {
    displayedItems = [ctaCard];
  } else if (renderMode === 'staticTwo') {
    // When exactly one quest, add the CTA card with isCTA flag.
    displayedItems = [...items, ctaCard];
  } else {
    // For carousel mode, if items are fewer than 3, append CTA; otherwise, take first 3.
    displayedItems = items.length < 3 ? [...items, ctaCard] : items.slice(0, 3);
  }
  console.log("Displayed items:", displayedItems);

  // Always call hooks at the top.
  const controls = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = displayedItems.length;

  // Layout constants.
  const cardWidth = 300;
  const cardHeight = 256;
  const gap = 16;
  const visibleWidth = cardWidth * 3 + gap * 2;

  // Auto-slide effect (only in carousel mode).
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

  // Calculate offset for centering the active card.
  const offset = activeIndex * (cardWidth + gap) - ((visibleWidth - cardWidth) / 2);
  console.log("Active index:", activeIndex, "Offset:", offset);

  // Animate the carousel (only in carousel mode).
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

  // Conditional rendering based on renderMode.
  if (renderMode === 'staticCTA') {
    // Only CTA card.
    return (
      <div className="flex justify-center items-center mt-8 mx-auto" style={{ width: cardWidth }}>
        <Card
          title={ctaCard.title}
          description={ctaCard.description}
          faded={false}
          isCTA={true}
        />
      </div>
    );
  } else if (renderMode === 'staticTwo') {
    // Exactly one quest: render the quest and CTA side by side with a gap.
    return (
      <div
        className="flex justify-center items-center mt-8 mx-auto"
        style={{ width: cardWidth * 2 + gap, gap: `${gap}px` }}
      >
        <div style={{ width: cardWidth, height: cardHeight }}>
          <Card
            title={items[0].title}
            description={items[0].description}
            xp={items[0].xp}
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
    // Carousel mode: render the animated carousel with dot navigation.
    return (
      <div className="mt-8 mx-auto" style={{ width: visibleWidth }}>
        <div className="overflow-hidden">
          <motion.div
            className="flex items-start"
            style={{ gap: `${gap}px` }}
            animate={controls}
            transition={{ type: 'tween', duration: 0.5 }}
          >
            {displayedItems.map((item, index) => (
              <div key={`${item.id}-${index}`} style={{ minWidth: `${cardWidth}px`, height: `${cardHeight}px` }}>
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
        <div className="flex justify-center mt-4">
          {displayedItems.map((_, index) => (
            <button
              key={`dot-${index}`}
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