import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const getNavClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all duration-200 ${
      isActive 
        ? "text-primary bg-primary-container font-bold" 
        : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
    }`;

  return (
    <>
      <aside className="hidden lg:flex flex-col gap-2 p-6 bg-white fixed left-0 top-0 h-screen w-[260px] border-r border-outline-variant z-30">
        <div className="mb-10 py-3">
          <div className="flex items-start">
            <div className="w-1 h-12 bg-[#7B61FF] rounded-full mr-3"></div>
            <div>
              <div className="text-[22px] font-bold tracking-tight text-[#001D3D] leading-tight">Recruiter Portal</div>
              <div className="text-[11px] text-[#4A90E2] font-medium tracking-wide">AI-Driven Hiring</div>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={getNavClass}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/jobs" className={getNavClass}>
            <span className="material-symbols-outlined">work</span>
            <span>Jobs & Candidates</span>
          </NavLink>
          <NavLink to="/reports" className={getNavClass}>
            <span className="material-symbols-outlined">analytics</span>
            <span>Reports</span>
          </NavLink>
        </nav>
      </aside>

      {/* BottomNavBar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 z-50 flex justify-around items-center px-4 bg-white border-t border-outline-variant shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <NavLink to="/dashboard" className={({isActive}) => `flex flex-col items-center justify-center px-4 py-1 transition-colors ${isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}>
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </NavLink>
        <NavLink to="/jobs" className={({isActive}) => `flex flex-col items-center justify-center px-4 py-1 transition-colors ${isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}>
          <span className="material-symbols-outlined mb-1">work</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Jobs</span>
        </NavLink>
        <NavLink to="/reports" className={({isActive}) => `flex flex-col items-center justify-center px-4 py-1 transition-colors ${isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}>
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Reports</span>
        </NavLink>
      </nav>
    </>
  );
}
