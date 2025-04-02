import React from 'react';
import { useUser } from '../../context/UserContext';

const QuestStreakBar: React.FC<{ maxDays?: number }> = ({ maxDays = 7 }) => {
  const { user } = useUser();
  const streak = user?.streak ?? 0;
  const percent = Math.min((streak / maxDays) * 100, 100);

  return (
    <div className="w-full h-32 relative bg-[#453245] rounded-lg overflow-hidden p-4">
      <div className="absolute inset-0 bg-yellow-500 transition-all duration-700 ease-in-out" style={{ width: `${percent}%` }} />
      <div className="relative z-10 flex flex-col items-start space-y-1">
        <p className="text-white text-lg font-semibold">Quest Streak</p>
        <p className="text-yellow-300 text-3xl font-extrabold">{streak} / {maxDays} days</p>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        {Array.from({ length: maxDays }).map((_, i) => (
          <div key={i} className="w-px h-4 bg-white opacity-50" />
        ))}
      </div>
    </div>
  );
};

export default QuestStreakBar;
