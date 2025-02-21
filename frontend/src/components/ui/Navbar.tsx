import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();

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
              className="text-2xl text-white hover:text-gray-300"
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
        {/* Right: Avatar */}
        <div className="flex justify-end">
          {user && user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full cursor-pointer"
            />
          ) : (
            <span className="text-white text-2xl">Set Avatar</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;