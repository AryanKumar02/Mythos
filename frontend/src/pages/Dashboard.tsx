// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';
import { useAuth } from '../context/AuthContext';
import AvatarSelectionModal from '../components/AvatarSelectionModal';
import CurrentDateTime from '../components/utills/CurrentDateTime';
import Carousel from '../components/Carousel';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const { user, updateAvatar } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data for the carousel; replace with your actual tasks/quests data.
  const carouselItems: CarouselItem[] = [
    {
      id: '1',
      title: 'Daily Quest: The Lost Scroll',
      description: 'Venture into the ancient ruins beyond the Whispering Woods to recover the lost scroll that holds the secrets of a forgotten era.',
    },
    {
      id: '2',
      title: 'Task: Dragon Slayer',
      description: 'Gather your strongest allies and prepare for an epic showdown. Strategize and defeat the mighty dragon that has terrorized the kingdom for centuries.',
    },
    {
      id: '3',
      title: 'Mission: Herbal Remedies',
      description: 'Explore the Enchanted Forest and collect 10 rare herbs. These vital ingredients are needed to brew a potent healing potion to save the ailing villagers.',
    },
  ];

  useEffect(() => {
    setIsLoading(false);
    console.log('Dashboard user:', user);
    // Open avatar modal if user exists and they haven't set a custom avatar.
    if (user && (!user.avatarUrl || user.avatarUrl === '/assets/avatars/default.svg')) {
      setIsModalOpen(true);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAvatarSelect = async (selectedSeed: string) => {
    if (user) {
      try {
        await updateAvatar(selectedSeed);
      } catch (err) {
        console.error("Failed to update avatar on backend:", err);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/dashboard-bg.jpg')" }}
    >
      <div className="min-h-screen">
        <Navbar currentPage="Dashboard" />
        <div className="flex flex-col items-center justify-start pt-18">
          <h1 className="text-white text-6xl font-semibold">
            Welcome {user ? user.username : 'Guest'}
          </h1>
          <h2 className="text-white text-2xl mt-2">
            Let the quest for greatness begin!
          </h2>
          <CurrentDateTime />
          {/* Increased top margin for extra white space */}
          <div className="mt-32 w-full max-w-4xl px-4">
            <h3 className="text-white text-3xl font-bold mb-6 text-center">
              Recent Quests
            </h3>
            <Carousel items={carouselItems} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AvatarSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAvatarSelect={handleAvatarSelect}
        />
      )}
    </div>
  );
};

export default Dashboard;