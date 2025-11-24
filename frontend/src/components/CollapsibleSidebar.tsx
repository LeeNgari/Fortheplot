import React from 'react';
import { Home, Search, Compass, Video, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CollapsibleSidebarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  onNavigate,
  currentSection,
}) => {
  const { userRoles, logout } = useAuth();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'explore', label: 'Movies & TV', icon: Compass },
    { id: 'rooms', label: 'Watch Together', icon: Users },
  ];

  if (userRoles.includes('ROLE_ADMIN')) {
    navigationItems.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <>
      {/* Sidebar - Always visible, either collapsed or expanded */}
      <div 
        className={`
          fixed top-0 left-0 h-full bg-gray-950 z-50 transition-all duration-300 ease-out
          w-16 mr-2
        `}
      >

        {/* Navigation */}
        <nav className="px-2 mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-4 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-2 group relative
                  ${isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }
                `}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                
                {/* Tooltip for collapsed state */}
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-60">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-2 group relative text-gray-300 hover:text-white hover:bg-gray-800"
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-60">
              Logout
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default CollapsibleSidebar;
