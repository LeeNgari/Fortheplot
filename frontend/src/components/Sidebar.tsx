import React from 'react';
import { cn } from '@/lib/utils';
import { X, Home, Search, Compass, Film, Tv, Clock, Bookmark, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentSection }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv-shows', label: 'TV Shows', icon: Tv },
    { id: 'recently-watched', label: 'Recently Watched', icon: Clock },
    { id: 'my-list', label: 'My List', icon: Bookmark }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full w-72 z-50 transform transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800",
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )}
      >
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg blur opacity-30 -z-10"></div>
              </div>
              <h2 className="text-xl font-bold text-white">
                StreamFlix
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                        currentSection === item.id
                          ? "bg-gray-800 text-white shadow-md"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        currentSection === item.id ? "text-red-400" : "text-gray-400"
                      )} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">John Doe</p>
                <p className="text-gray-400 text-xs truncate">Premium Member</p>
              </div>
              <div className="flex gap-1">
                <button 
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;