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
  const avatarRef = useRef<HTMLImageElement | HTMLSpanElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false);
        avatarRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-transparent py-5" role="navigation" aria-label="Main navigation">
      <div className="w-full grid grid-cols-3 items-center px-8">
        <div className="text-4xl font-semibold text-white text-left">
          <Link
            to="/dashboard"
            className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg px-2"
          >
            Mythos
          </Link>
        </div>
        <div className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              className="text-2xl text-white hover:text-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg px-2"
              aria-current={currentPage === item.name ? 'page' : undefined}
            >
              <div className="inline-block text-center relative">
                <span>{item.label}</span>
                {currentPage === item.name && (
                  <img
                    src="/assets/Callout.svg"
                    alt=""
                    className="absolute left-0 right-0 w-full h-auto transition-all duration-300 ease-in-out"
                    aria-hidden="true"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-end relative" ref={dropdownRef}>
          {user && user.avatarUrl ? (
            <img
              ref={avatarRef as React.RefObject<HTMLImageElement>}
              src={user.avatarUrl}
              alt={`${user.username}'s profile`}
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-transparent hover:border-white focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-300 ease-in-out"
              onClick={() => setDropdownOpen((prev) => !prev)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            />
          ) : (
            <span
              ref={avatarRef as React.RefObject<HTMLSpanElement>}
              className="text-white text-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg px-2"
              onClick={() => setDropdownOpen((prev) => !prev)}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
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
