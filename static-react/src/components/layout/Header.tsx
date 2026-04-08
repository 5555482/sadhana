import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-surface border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-text">Sadhana Pro</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-text-secondary">Welcome, {user?.name}</span>

          <Link
            to="/settings"
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
            aria-label="Settings"
          >
            <FiSettings className="w-5 h-5 text-text-secondary" />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
            aria-label="Logout"
          >
            <FiLogOut className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
};