import { useEffect, useState } from "react";

const ShootingStars = () => {
  const [shootingStars, setShootingStars] = useState<{ left: string; top: string; duration: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStars((prev) => [
        ...prev,
        {
          left: `${Math.random() * 80}vw`, // Random horizontal position
          top: `${Math.random() * 15}vh`, // Keep them in the top 15% of the screen
          duration: `${Math.random() * 1.5 + 1}s`, // Random speed (1s to 2.5s)
        },
      ]);

      setTimeout(() => {
        setShootingStars((prev) => prev.slice(1)); // Remove oldest shooting star after animation ends
      }, 3000); // Ensure they disappear smoothly
    }, Math.random() * 5000 + 5000); // Shooting stars appear every 5-10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {shootingStars.map((star, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            left: star.left,
            top: star.top,
            animationDuration: star.duration,
          }}
        />
      ))}
    </>
  );
};

export default ShootingStars;