import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  BarChart2, 
  HelpCircle, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const getLinkClasses = (activePaths) => {
    const isActive = activePaths.includes(path);
    if (isActive) {
      return "flex items-center gap-3 px-4 py-3 text-indigo-700 bg-indigo-50 border-l-4 border-indigo-500 font-semibold transition-all";
    }
    return "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all border-l-4 border-transparent font-medium";
  };

  const handleLogout = () => {
    // Navigate to login page
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white h-screen border-r border-slate-200 fixed left-0 top-0 z-50 shadow-sm">
      {/* Header / Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold text-indigo-900 tracking-tight">TalentAI</span>
        </div>

        {/* User Profile Summary (Optional, kept from existing) */}
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
            AR
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-800 text-sm truncate">Alex Rivers</h3>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">ID: CND-8942</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <Link to="/" className={getLinkClasses(['/'])}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/system-check" className={getLinkClasses(['/system-check'])}>
            <ShieldCheck size={20} />
            <span>System Check</span>
          </Link>

          <Link to="/result" className={getLinkClasses(['/result'])}>
            <BarChart2 size={20} />
            <span>Results</span>
          </Link>

          <Link to="/help" className={getLinkClasses(['/help'])}>
            <HelpCircle size={20} />
            <span>Help Center</span>
          </Link>

          <Link to="/settings" className={getLinkClasses(['/settings'])}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto p-6 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
