// frontend/src/components/AvatarSelectionModal.tsx
import React, { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button"; // Adjust the path if needed

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarSelect: (avatarUrl: string) => void;
}

// List of preselected avatar filenames
const availableAvatars = [
  "avatar1.svg",
  "avatar2.svg",
  "avatar3.svg",
  "avatar4.svg",
  "avatar5.svg",
  "avatar6.svg",
  "avatar7.svg",
  "avatar8.svg",
  "avatar9.svg",
  "avatar10.svg",
  "avatar11.svg",
  "avatar12.svg",
  "avatar13.svg",
  "avatar14.svg",
  "avatar15.svg",
  "avatar16.svg",
  "avatar17.svg",
  "avatar18.svg",
  "avatar19.svg",
  "avatar20.svg",
  "avatar21.svg",
  // Add more as needed
];

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  isOpen,
  onClose,
  onAvatarSelect,
}) => {
  const baseUrl = "/assets/avatars/"; // Assuming your avatars are stored here
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < availableAvatars.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleConfirm = () => {
    const selectedAvatarUrl = `${baseUrl}${availableAvatars[selectedIndex]}`;
    onAvatarSelect(selectedAvatarUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Avatar">
      <div className="flex flex-col items-center">
        {/* Header */}
        <h2 className="text-xl font-bold mb-4">Choose Your Avatar</h2>
        {/* Carousel */}
        <div className="flex items-center">
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="mr-4 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <img
            src={`${baseUrl}${availableAvatars[selectedIndex]}`}
            alt={`Avatar ${selectedIndex + 1}`}
            className="w-32 h-32 rounded-full border border-transparent hover:border-blue-500"
          />
          <button
            onClick={handleNext}
            disabled={selectedIndex === availableAvatars.length - 1}
            className="ml-4 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        {/* Confirm Button */}
        <div className="mt-6">
          <Button onClick={handleConfirm} text="Confirm" />
        </div>
      </div>
    </Modal>
  );
};

export default AvatarSelectionModal;