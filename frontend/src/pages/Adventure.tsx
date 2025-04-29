import React, { useState, useEffect } from 'react';
import Navbar from '../components/ui/Navbar';
import ElongatedSection from '../components/ui/ElongatedCard';
import InputWithButton from '../components/ui/InputWithButton';
import CardCarousel, { CarouselItem } from '../components/CardCarousel';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTaskQuest } from '../context/TaskQuestContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Adventure: React.FC = () => {
  const [taskText, setTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { quests, createTaskAndQuest, completeQuest, deleteQuest } = useTaskQuest();

  const activeQuests = quests.filter((q) => !q.isComplete);
  const completedQuests = quests.filter((q) => q.isComplete);

  const activeCarouselItems: CarouselItem[] = activeQuests.map((quest) => ({
    id: quest._id,
    title: quest.questTitle,
    description: quest.questDescription,
    xp: quest.xpReward,
    createdAt: quest.createdAt,
  }));

  const completedCarouselItems: CarouselItem[] = completedQuests.map((quest) => ({
    id: quest._id,
    title: quest.questTitle,
    description: quest.questDescription,
    xp: quest.xpReward,
    createdAt: quest.createdAt,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<CarouselItem | null>(null);

  const handleQuestify = async () => {
    if (!taskText.trim()) {
      alert("Please enter a task.");
      return;
    }
    setIsLoading(true);
    try {
      await createTaskAndQuest({ title: taskText, description: taskText });
      setTaskText("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating quest:", error);
        alert("Error creating quest: " + error.message);
      } else {
        console.error("Error creating quest:", error);
        alert("An unexpected error occurred while creating the quest.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsClick = (item: CarouselItem) => {
    setSelectedQuest(item);
    setIsModalOpen(true);
  };

  const handleCompleteQuest = async () => {
    if (!selectedQuest) return;
    try {
      await completeQuest(selectedQuest.id);
      toast.success("Quest completed successfully.");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error completing quest:', error);
      alert('Failed to complete quest');
    }
  };

  const handleRemoveQuest = async () => {
    if (!selectedQuest) return;
    try {
      await deleteQuest(selectedQuest.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error removing quest:", error);
      alert("Failed to remove quest");
    }
  };

  const isSelectedQuestCompleted = selectedQuest
    ? completedQuests.some((q) => q._id === selectedQuest.id)
    : false;

  useEffect(() => {
    console.log("Adventure component mounted/updated. Token:", token);
  }, [token]);

  return (
    <div
      className="min-h-screen bg-cover bg-center px-12"
      style={{ backgroundImage: "url('/assets/dashboard-bg.jpg')" }}
    >
      {/* Main content container with fixed max-width and padding */}
      <div className="max-w-screen-xl mx-auto px-4">
        <Navbar currentPage="Adventure" />

        <div className="mt-16">
          <ElongatedSection>
            <div className="relative w-full h-full">
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center">
                <img
                  src="/icons/icons8-sword-50.svg"
                  alt="Sword Icon"
                  className="mr-4 h-8 w-8"
                />
                <h1 className="text-3xl font-bold text-white">Create a Quest</h1>
              </div>
              <div className="absolute top-20 left-0 right-0 px-6">
                <InputWithButton
                  placeholder="Speak your saga: detail your epic quest in full glory..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  fullWidth={true}
                  buttonText="Questify"
                  onButtonClick={handleQuestify}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </ElongatedSection>
        </div>

        <div
          className="mt-16 mx-auto flex items-center"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <img
            src="/icons/icons8-target.svg"
            alt="Active Quests Icon"
            className="mr-4 h-8 w-8"
          />
          <h2 className="text-2xl font-bold text-white">Active Quests</h2>
        </div>
        <div className="mt-8">
          {activeCarouselItems.length > 0 ? (
            <CardCarousel
              items={activeCarouselItems}
              autoSlideInterval={3000}
              onDetailsClick={handleDetailsClick}
            />
          ) : (
            <p className="text-center text-white">No active quests available.</p>
          )}
        </div>

        <div
          className="mt-16 mx-auto flex items-center"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <img
            src="/icons/icons8-trophy.svg"
            alt="Completed Quests Icon"
            className="mr-4 h-8 w-8"
          />
          <h2 className="text-2xl font-bold text-white">Completed Quests</h2>
        </div>
        <div className="mt-8">
          {completedCarouselItems.length > 0 ? (
            <CardCarousel
              items={completedCarouselItems}
              autoSlideInterval={3000}
              onDetailsClick={handleDetailsClick}
            />
          ) : (
            <p className="text-center text-white">No completed quests available.</p>
          )}
        </div>

        {isModalOpen && selectedQuest && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedQuest.title}
          >
            <div>
              <p>{selectedQuest.description}</p>
              <p className="mt-2">XP: {selectedQuest.xp}</p>
              <div className="flex justify-center mt-4 space-x-4">
              {!isSelectedQuestCompleted && (
                <Button className="text-[#453245]" onClick={handleCompleteQuest}>
                  Complete
                </Button>
              )}
                {isSelectedQuestCompleted && (
                  <Button className="text-[#453245]" onClick={handleRemoveQuest}>Remove Quest</Button>
                )}
              </div>
            </div>
          </Modal>
        )}
        <ToastContainer aria-label="Toast Notifications" />

      </div>
    </div>
  );
};

export default Adventure;
