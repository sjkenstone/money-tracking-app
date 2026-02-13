import React, { type ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  // Hide bottom nav on the Add Transaction page if we want it to be full screen
  // But requirement says "half screen or full screen page", keeping nav might be distracting or useful.
  // Let's hide it for /add to focus on "Fast Entry".
  const showBottomNav = location.pathname !== '/add';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-24">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
