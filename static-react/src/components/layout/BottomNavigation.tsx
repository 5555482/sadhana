import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiTarget, FiBarChart, FiUsers, FiSettings } from 'react-icons/fi';

const navigationItems = [
  {
    path: '/',
    label: 'Home',
    icon: FiHome,
  },
  {
    path: '/practices',
    label: 'Practices',
    icon: FiTarget,
  },
  {
    path: '/charts',
    label: 'Charts',
    icon: FiBarChart,
  },
  {
    path: '/yatras',
    label: 'Groups',
    icon: FiUsers,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: FiSettings,
  },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-2 py-2">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-text hover:bg-surface-hover'
                }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};