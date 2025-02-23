import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserDropdown from './UserDropdown';

interface NavbarProps {
  currentPage: string;
}

interface NavItem {
  name: string; // used to compare with currentPage
  label: string; // text displayed on the link
  route: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', label: 'Home', route: '/dashboard' },
  { name: 'Adventure', label: 'Adventure', route: '/adventure' },
  { name: 'Rewards', label: 'Rewards', route: '/rewards' },
];

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside the container.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Optional: close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      setDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-transparent py-5">
      <div className="container mx-auto grid grid-cols-3 items-center">
        {/* Left: Brand */}
        <div className="text-4xl font-bold text-white">Mythos</div>
        {/* Center: Navigation Links */}
        <div className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              className="text-2xl text-white hover:text-gray-300 transition duration-300 ease-in-out"
            >
              <div className="inline-block text-center relative">
                <span>{item.label}</span>
                {currentPage === item.name && (
                  <img
                    src="/assets/Callout.svg"
                    alt="Callout"
                    className="absolute left-0 right-0 w-full h-auto transition-all duration-300 ease-in-out"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
        {/* Right: Avatar with Dropdown on Click */}
        <div className="flex justify-end relative" ref={dropdownRef}>
          {user && user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-transparent hover:border-white transition duration-300 ease-in-out"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
          ) : (
            <span
              className="text-white text-2xl cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Set Avatar
            </span>
          )}
          {dropdownOpen && (
            <UserDropdown
              onClose={() => setDropdownOpen(false)}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;