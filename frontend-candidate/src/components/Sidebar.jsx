import React from 'react';
import { LayoutDashboard, FileText, Settings, HelpCircle, Clock, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClasses = (activePaths) => {
    const isActive = activePaths.includes(path);
    if (isActive) {
      return "flex items-center gap-3 px-4 py-3 text-indigo-700 bg-indigo-50 border-l-4 border-indigo-500 font-medium";
    }
    return "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors border-l-4 border-transparent font-medium";
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white min-h-screen border-r border-slate-200 fixed left-0 top-0 z-50 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            AI
          </div>
          <span className="text-xl font-bold text-indigo-900 tracking-tight">AI Interview</span>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
            AR
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Alex Rivers</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">ID: CND-8942</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link to="/" className={getLinkClasses(['/'])}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/system-check" className={getLinkClasses(['/system-check'])}>
            <Settings size={20} />
            <span>System Check</span>
          </Link>
          <Link to="/waiting-room" className={getLinkClasses(['/waiting-room', '/interview'])}>
            <Clock size={20} />
            <span>Waiting Room</span>
          </Link>
          <Link to="/result" className={getLinkClasses(['/result'])}>
            <BarChart2 size={20} />
            <span>Results</span>
          </Link>
          <Link to="/help" className={getLinkClasses(['/help'])}>
            <HelpCircle size={20} />
            <span>Help Center</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
