import React, { type ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAddPage = location.pathname === '/add';
  const isHomePage = location.pathname === '/';
  const showBottomNav = !isAddPage;

  const containerClassName = `min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900${
    showBottomNav ? ' pb-24' : ''
  }`;

  const mainClassName = isAddPage ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto';

  return (
    <div className={containerClassName}>
      <main className={mainClassName}>
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
