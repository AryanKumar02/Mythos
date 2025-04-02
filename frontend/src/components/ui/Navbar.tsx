import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserDropdown from './UserDropdown';

interface NavbarProps {
  currentPage: string;
}

interface NavItem {
  name: string;
  label: string;
  route: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', label: 'Home', route: '/dashboard' },
  { name: 'Adventure', label: 'Adventure', route: '/adventure' },
  { name: 'Codex', label: 'Codex', route: '/codex' },
];

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="w-full grid grid-cols-3 items-center px-8">
        <div className="text-4xl font-semibold text-white text-left">
          <Link to="/dashboard">Mythos</Link>
        </div>
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
        <div className="flex justify-end items-center relative" ref={dropdownRef}>
          <img
            src="/icons/icons8-notification-50.svg"
            alt="Notifications"
            className="w-8 h-8 cursor-pointer mr-4"
          />
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
