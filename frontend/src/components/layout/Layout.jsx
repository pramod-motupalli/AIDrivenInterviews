import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        {/* Main Content Canvas */}
        <main className="flex-1 lg:ml-[260px] p-6 md:p-10 pb-24 md:pb-10 bg-surface">
          <div className="max-w-[1200px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
