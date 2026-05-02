import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';

const Header = ({ title, breadcrumbs }) => {
  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-sm sticky top-0 z-40 w-full">
      <div className="flex items-center gap-3 text-lg font-bold text-slate-800 lg:hidden">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          AI
        </div>
        AI Interview
      </div>
      
      {breadcrumbs ? (
        <div className="hidden lg:flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className={idx === breadcrumbs.length - 1 ? "text-indigo-600 font-bold" : "text-slate-500"}>
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && <ChevronRight size={16} className="text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="hidden lg:block text-slate-800 font-bold text-lg">
          {title || "Candidate Dashboard"}
        </div>
      )}
      
      <div className="flex items-center gap-4 ml-auto">
        <button className="text-slate-500 hover:text-slate-800 transition-colors relative p-2">
          <Bell size={24} />
        </button>
        <img 
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
          alt="User avatar" 
          className="w-10 h-10 rounded-full border-2 border-slate-200 object-cover shadow-sm"
        />
      </div>
    </header>
  );
};

export default Header;
