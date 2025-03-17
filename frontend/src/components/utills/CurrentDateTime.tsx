import React, { useEffect, useState } from 'react';

const CurrentDateTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const getFormattedDateTime = (date: Date): string => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${weekday.toLowerCase()} ${day}${getOrdinalSuffix(day)} ${month} | ${time}`;
  };

  return (
    <p className="text-white text-xl mt-2">
      {getFormattedDateTime(currentTime)}
    </p>
  );
};

export default CurrentDateTime;
