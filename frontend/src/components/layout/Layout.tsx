
import React from 'react';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userRoles, logout, loading } = useAuth();

  const currentSection = location.pathname.split('/')[1] || 'home'; // Derive current section from path

  const handleNavigate = (section: string) => {
    navigate(`/${section}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-24 w-24 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {isAuthenticated && (
        <div className="h-full w-16 fixed z-20">
          <CollapsibleSidebar 
            isOpen={false}
            onToggle={() => {}} // Disabled toggle
            onNavigate={handleNavigate}
            currentSection={currentSection}
            userRoles={userRoles}
            onLogout={logout}
          />
        </div>
      )}

      <main className={`flex-1 min-h-screen ${isAuthenticated ? 'ml-16' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
