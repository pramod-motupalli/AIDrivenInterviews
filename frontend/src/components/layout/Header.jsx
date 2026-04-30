import React from 'react';

export default function Header() {
  return (
    <header className="backdrop-blur-md flex justify-between items-center px-8 h-16 w-full border-b border-outline-variant shadow-sm bg-white flex-shrink-0 z-40">
      <div className="flex items-center gap-4">
        <span className="lg:hidden material-symbols-outlined text-on-surface-variant cursor-pointer mr-2">menu</span>
        <div className="flex items-start">
          <div className="w-0.5 h-8 bg-[#7B61FF] rounded-full mr-2 lg:hidden"></div>
          <div>
            <div className="text-lg font-bold tracking-tight text-[#001D3D] leading-none">Recruiter Portal</div>
            <div className="text-[9px] text-[#4A90E2] font-medium tracking-wide">AI-Driven Hiring</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-surface-container transition-colors rounded-full relative group">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-outline-variant">
          <span className="hidden md:block text-sm font-semibold text-on-surface">Alex Thompson</span>
          <div className="h-9 w-9 rounded-full overflow-hidden border border-outline-variant shadow-soft ring-2 ring-white cursor-pointer">
            <img alt="Recruiter profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmvBX-647LA6O6SIxndP35O-gyyWWjhbQDE5zZU-AprQZijFLPhOU7d6TNzZLX7MA5S1pXbrPZNawPbMdwUMhudKoaKDHiR-liCZ9yCDmQw6JNMy6Qqw8152Ym-mQ6VOnCKm3EUgkExjSXurU23AFGCfDgynLfxUYMKyNWlYWS-EfTjZjYEzKNNiiX8OpSW4oIfQ3okofRLPTOHLrbRrQQIHivtX0-8vbQIaKshHJDeKENclpRaQafLg5vnppQpf9cuifRg_PaqxE" />
          </div>
        </div>
      </div>
    </header>
  );
}
