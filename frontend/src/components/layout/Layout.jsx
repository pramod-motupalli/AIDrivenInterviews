import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="bg-gray-100 text-gray-900 h-full w-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header only visible on mobile */}
        <div className="lg:hidden">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
