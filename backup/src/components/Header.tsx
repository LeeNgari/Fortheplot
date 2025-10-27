
import React from 'react';
import { Menu, Search, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  currentSection: string;
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentSection, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          {/* Menu Button */}
          <button 
            onClick={onMenuClick}
            className="group relative w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <Menu className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/25">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-2xl blur opacity-20"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              StreamFlix
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button 
            onClick={() => onNavigate('search')}
            className="group w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            <Search className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white font-medium text-sm">John Doe</p>
              <p className="text-white/60 text-xs">Premium</p>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
