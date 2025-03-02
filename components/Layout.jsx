import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark-primary">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      <div className="flex justify-center pt-16">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex gap-8">
            <div className="hidden md:block w-64 fixed h-[calc(100vh-4rem)] bg-white dark:bg-dark-primary border-r border-gray-100 dark:border-dark-border overflow-y-auto no-scrollbar"
                 style={{ left: 'calc(50% - 360px - 256px)' }}>
              <LeftSidebar />
            </div>

            <div className="flex-1 min-w-0 md:ml-72 md:mr-80 overflow-y-auto no-scrollbar h-[calc(100vh-4rem)]">
              {children}
            </div>

            <div className="hidden md:block w-80 fixed h-[calc(100vh-4rem)] bg-white dark:bg-dark-primary border-l border-gray-100 dark:border-dark-border overflow-y-auto no-scrollbar" 
                 style={{ left: 'calc(50% + 330px)' }}>
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
