import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import NavBar from './NavBar';

export const ExternalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <AnnouncementBar />
    <NavBar />
    <main className="flex-1 bg-gray-smoke">
      {children}
    </main>
  </div>
);

export default ExternalLayout;
