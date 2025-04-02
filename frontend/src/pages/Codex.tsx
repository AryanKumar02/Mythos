import React from 'react';
import Navbar from '../components/ui/Navbar';
import { useAuth } from '../context/AuthContext';
import PlayerProgressionGraph from '../components/graphs/PlayerProgression';
import PieChart from '../components/graphs/PieChart';
import ProgressDonut from '../components/graphs/ProgressDonut';
import QuestStreakBar from '../components/graphs/StreakIndicator';

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-[#524456] border-2 border-[#756A78] rounded-lg p-4 flex flex-col items-center ${className}`}>
    <h2 className="text-white font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const Codex: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="min-h-screen px-12 py-6 overflow-hidden">
      <Navbar currentPage="Codex" />

      <div className="mt-8 space-y-6">
        {/* Top row: fixed-size cards, left-aligned */}
        <div className="flex space-x-4">
          <Card title="Pie Chart" className="max-w-xs">
            <PieChart width={200} height={200} />
          </Card>

          <Card title="Progress Donut" className="max-w-xs">
            <ProgressDonut width={200} height={200} />
          </Card>

          <Card title="Quest Streak" className="max-w-xs">
            <QuestStreakBar maxDays={7} />
          </Card>
        </div>

        {/* Full-width Player Progression */}
        <Card title="Player Progression" className="w-full">
          <PlayerProgressionGraph width={600} height={400} />
        </Card>
      </div>
    </div>
  );
};

export default Codex;
