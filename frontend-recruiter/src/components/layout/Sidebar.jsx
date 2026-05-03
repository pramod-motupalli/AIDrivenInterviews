import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    navigate('/');
  };

  const getNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 p-3 bg-gray-100 h-full z-30">
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-4">

          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">work</span>
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight text-gray-900 leading-tight">Recruiter Portal</div>
              <div className="text-[10px] text-blue-500 font-medium tracking-wide">AI-Driven Hiring</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 flex-1">
            <NavLink to="/dashboard" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center">dashboard</span>
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/jobs" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center">work</span>
              <span>Jobs & Candidates</span>
            </NavLink>
            <NavLink to="/reports" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center">analytics</span>
              <span>Reports</span>
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200 text-sm font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 z-50 flex justify-around items-center px-4 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center justify-center px-4 py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => `flex flex-col items-center justify-center px-4 py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined mb-1">work</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Jobs</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `flex flex-col items-center justify-center px-4 py-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Reports</span>
        </NavLink>
      </nav>
    </>
  );
}
