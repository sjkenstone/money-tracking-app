import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Plus, Calendar, User } from 'lucide-react';
import clsx from 'clsx';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: '明细' },
    { path: '/charts', icon: BarChart2, label: '图表' },
    { path: '/add', icon: Plus, label: '记账', isSpecial: true },
    { path: '/calendar', icon: Calendar, label: '日历' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 max-w-[480px] left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-end pb-4">
        {navItems.map((item) => (
          <div key={item.path} className="flex-1 flex justify-center">
            {item.isSpecial ? (
              <button
                onClick={() => navigate('/add')}
                className="bg-primary text-white rounded-full p-4 shadow-lg transform -translate-y-4 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <item.icon size={28} strokeWidth={2.5} />
              </button>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex flex-col items-center gap-1 text-xs transition-colors duration-200",
                    isActive ? "text-primary font-medium" : "text-gray-400 hover:text-gray-600"
                  )
                }
              >
                <item.icon size={24} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
