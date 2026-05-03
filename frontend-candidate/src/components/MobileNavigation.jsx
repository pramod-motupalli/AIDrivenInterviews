import React from 'react';
import { Home, Video, BarChart2, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  const renderTab = (activePaths, icon, label) => {
    const isActive = activePaths.includes(path);
    if (isActive) {
      return (
        <div className="flex flex-col items-center gap-1 p-2 text-indigo-600 min-w-[64px]">
          <div className="w-12 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <span className="text-[10px] font-bold mt-0.5">{label}</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 min-w-[64px]">
        <div className="h-8 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-medium mt-0.5">{label}</span>
      </div>
    );
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <Link to="/">{renderTab(['/'], <Home size={20} />, "Home")}</Link>
      <Link to="/system-check">{renderTab(['/system-check'], <Settings size={20} />, "Check")}</Link>
      <Link to="/waiting-room">{renderTab(['/waiting-room', '/interview'], <Video size={20} />, "Interviews")}</Link>
      <Link to="/result">{renderTab(['/result'], <BarChart2 size={20} />, "Results")}</Link>
    </nav>
  );
};

export default MobileNavigation;
