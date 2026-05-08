import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-6 py-4 md:px-10 md:py-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="flex flex-col">
        <h1 className="font-black text-2xl text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-slate-900">{user?.name || 'Candidate'}</span>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Premium Member</span>
        </div>
        <img 
          src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} 
          alt="User Avatar" 
          className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-md"
        />
      </div>
    </header>
  );
};

export default Header;
