import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20"> {/* Add padding bottom for bottom navigation */}
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};