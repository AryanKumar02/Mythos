import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Navbar from '../components/ui/Navbar';
import { useAuth } from '../context/AuthContext';
import AvatarSelectionModal from '../components/AvatarSelectionModal';
import CurrentDateTime from '../components/utills/CurrentDateTime';
import Carousel, { CarouselItem } from '../components/Carousel';
import { useTaskQuest } from '../context/TaskQuestContext';

const Dashboard: React.FC = () => {
  const { user, updateAvatar } = useAuth();
  const { quests } = useTaskQuest();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && (!user.avatarUrl || user.avatarUrl === '/assets/avatars/default.svg')) {
      setIsModalOpen(true);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    console.log("Quests from TaskQuestContext:", quests);
  }, [quests]);

  const carouselItems: CarouselItem[] = useMemo(() => {
    if (!Array.isArray(quests)) return [];
    return quests
      .filter((quest) => !quest.isComplete)
      .map((quest) => ({
        id: quest._id,
        title: quest.questTitle || "No Title",
        description: quest.questDescription || "",
        xp: quest.xpReward,
        completed: quest.isComplete,
      }));
  }, [quests]);

  const handleAvatarSelect = useCallback(
    async (selectedSeed: string) => {
      if (user) {
        try {
          await updateAvatar(selectedSeed);
          console.log("Avatar updated successfully.");
        } catch (err) {
          console.error("Failed to update avatar on backend:", err);
        }
      }
      setIsModalOpen(false);
    },
    [user, updateAvatar]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/dashboard-bg.jpg')" }}
    >
      <Navbar currentPage="Dashboard" />
      <div className="flex flex-col items-center justify-start pt-18">
        <h1 className="text-white text-6xl font-semibold">
          Welcome {user ? user.username : 'Guest'}
        </h1>
        <h2 className="text-white text-2xl mt-2">
          Let the quest for greatness begin!
        </h2>
        <CurrentDateTime />
        <div className="mt-20 w-full max-w-4xl px-4">
          <h3 className="text-white text-3xl font-bold mb-6 text-center">
            Recent Quests
          </h3>
          <Carousel items={carouselItems} autoSlideInterval={3000} />
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
