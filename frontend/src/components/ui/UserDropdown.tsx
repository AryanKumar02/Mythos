import React from 'react';
import { Link } from 'react-router-dom';

interface UserDropdownProps {
  onClose: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onClose, onLogout }) => {
  return (
    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 transform transition-all duration-300 ease-in-out animate-fadeInDown">
      <Link
        to="/profile"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
        onClick={onClose}
      >
        Profile
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
        onClick={onClose}
      >
        Settings
      </Link>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;