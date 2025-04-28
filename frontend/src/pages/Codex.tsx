import React from 'react';
import Navbar from '../components/ui/Navbar';
import { useAuth } from '../context/AuthContext';
import PlayerProgressionGraph from '../components/graphs/PlayerProgression';
import PieChart from '../components/graphs/PieChart';
import ProgressDonut from '../components/graphs/ProgressDonut';
import StreakMeter from "../components/graphs/StreakMeter";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Reusable Card component with the specified background colour and stroke
const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-[#524456] shadow border-2 border-[#756A78] rounded-lg p-4 flex flex-col ${className}`}>
    {title && <h2 className="text-white font-bold mb-2">{title}</h2>}
    <div className="flex items-center justify-center">
      {children}
    </div>
  </div>
);

const Codex: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { token } = useAuth();

  return (
    // Container with no scrolling and using the background from index.css
    <div className="min-h-screen px-12 py-6 overflow-hidden">
      <Navbar currentPage="Codex" />

      {/* Flex layout based on the size of visuals */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <Card title="Pie Chart">
          <PieChart width={200} height={300} />
        </Card>
        <Card title="Progress Donut">
          <ProgressDonut width={200} height={235} />
        </Card>
        <Card title="Streak Counter">
          <StreakMeter width={300} height={300} />
        </Card>

        {/* Player Progression spans full width beneath the above cards */}
        <div className="w-full flex justify-center">
          <Card title="Player Progression">
            <PlayerProgressionGraph width={840} height={500} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Codex;
