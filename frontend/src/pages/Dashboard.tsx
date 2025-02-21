import React, { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';
import { useAuth } from '../context/AuthContext';
import AvatarSelectionModal from '../components/AvatarSelectionModal';

const Dashboard: React.FC = () => {
  const { user, updateAvatar } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    console.log('Dashboard user:', user);
    // Open modal if user exists and has no custom avatar set.
    // Here, we check if avatarUrl is missing or set to the default.
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
        <div className="flex flex-col items-center justify-start pt-32">
          <h1 className="text-white text-4xl font-bold">
            Welcome {user ? user.username : 'Guest'}
          </h1>
          {/* Avatar image display removed */}
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