import { useEffect, useState } from "react";

const ShootingStars = () => {
  const [shootingStars, setShootingStars] = useState<{ left: string; top: string; duration: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStars((prev) => [
        ...prev,
        {
          left: `${Math.random() * 80}vw`,
          top: `${Math.random() * 15}vh`,
          duration: `${Math.random() * 1.5 + 1}s`,
        },
      ]);

      setTimeout(() => {
        setShootingStars((prev) => prev.slice(1));
      }, 3000);
    }, Math.random() * 5000 + 5000);

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