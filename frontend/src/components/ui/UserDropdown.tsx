import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface UserDropdownProps {
  onClose: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onClose, onLogout }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!dropdownRef.current) return;

      const items = Array.from(dropdownRef.current.querySelectorAll('a, button'));
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number;
      let prevIndex: number;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = (currentIndex + 1) % items.length;
          (items[nextIndex] as HTMLElement).focus();
          break;
        case 'ArrowUp':
          event.preventDefault();
          prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          (items[prevIndex] as HTMLElement).focus();
          break;
        case 'Home':
          event.preventDefault();
          (items[0] as HTMLElement).focus();
          break;
        case 'End':
          event.preventDefault();
          (items[items.length - 1] as HTMLElement).focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 transform transition-all duration-300 ease-in-out animate-fadeInDown"
      role="menu"
      aria-orientation="vertical"
    >
      <Link
        to="/profile"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:bg-gray-200"
        onClick={onClose}
        role="menuitem"
        tabIndex={0}
      >
        Profile
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:bg-gray-200"
        onClick={onClose}
        role="menuitem"
        tabIndex={0}
      >
        Settings
      </Link>
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:bg-gray-200"
        role="menuitem"
        tabIndex={0}
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;