import React from 'react';
import { 
  LogIn, MonitorCheck, Clock, Video, CheckCircle, MessageSquare, BarChart2, LogOut, Sparkles 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ icon: Icon, label, path, active, onClick }) => (
  <button
    onClick={() => onClick(path)}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <Icon size={22} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="text-sm tracking-wide">{label}</span>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const flowItems = [
    { icon: MonitorCheck, label: 'System Check', path: '/system-check' },
    { icon: Clock, label: 'Waiting Room', path: '/waiting-room' },
    { icon: Video, label: 'Interview', path: '/interview' },
    { icon: CheckCircle, label: 'Submission', path: '/submission' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
    { icon: BarChart2, label: 'Results', path: '/results' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white border-r border-slate-100 p-8 z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="font-black text-2xl text-slate-900 tracking-tighter">TalentAI</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Interview Flow</p>
        {flowItems.map((item) => (
          <NavItem 
            key={item.path}
            {...item}
            active={location.pathname === item.path}
            onClick={(path) => navigate(path)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div className="pt-8 border-t border-slate-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold group mt-2"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm tracking-wide">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
