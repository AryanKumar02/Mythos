import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Stars = () => {
  const [stars, setStars] = useState<
    { left: string; top: string; delay: string; size: string; blur: string }[]
  >([]);

  useEffect(() => {
    const newStars = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 15}vh`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 1.5 + 0.5}px`,
      blur: `${Math.random() * 2}px`,
    }));

    setStars(newStars);
  }, []);

  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            boxShadow: `0 0 ${star.blur} rgba(255, 255, 255, 0.6)`,
            position: "absolute",
          }}
          animate={{
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  );
};

export default Stars;