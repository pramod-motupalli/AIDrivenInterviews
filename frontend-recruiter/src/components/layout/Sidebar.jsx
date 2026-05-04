import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const getNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full z-30">
      
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">work</span>
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-bold tracking-tight text-gray-900 leading-tight truncate">Recruiter Portal</div>
            <div className="text-[11px] text-gray-500 font-medium">AI Hiring</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
        <NavLink to="/dashboard" className={getNavClass}>
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/jobs" className={getNavClass}>
          <span className="material-symbols-outlined text-[20px]">work</span>
          <span>Jobs & Candidates</span>
        </NavLink>
        <NavLink to="/reports" className={getNavClass}>
          <span className="material-symbols-outlined text-[20px]">analytics</span>
          <span>Reports</span>
        </NavLink>
      </nav>

    </aside>
  );
}
