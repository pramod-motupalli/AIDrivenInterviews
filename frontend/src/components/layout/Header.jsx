import React from 'react';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 h-16 w-full bg-white border-b border-gray-200 flex-shrink-0 z-40">
      <div className="flex items-center gap-3">
        <span className="lg:hidden material-symbols-outlined text-gray-500 cursor-pointer">menu</span>
        <div className="lg:hidden">
          <div className="text-base font-bold tracking-tight text-gray-900 leading-none">Recruiter Portal</div>
          <div className="text-[9px] text-blue-500 font-medium tracking-wide">AI-Driven Hiring</div>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="p-2 hover:bg-gray-100 transition-colors rounded-full relative group">
          <span className="material-symbols-outlined text-gray-500 group-hover:text-blue-600">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <span className="hidden md:block text-sm font-semibold text-gray-800">Alex Thompson</span>
          <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer">
            <img alt="Recruiter profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmvBX-647LA6O6SIxndP35O-gyyWWjhbQDE5zZU-AprQZijFLPhOU7d6TNzZLX7MA5S1pXbrPZNawPbMdwUMhudKoaKDHiR-liCZ9yCDmQw6JNMy6Qqw8152Ym-mQ6VOnCKm3EUgkExjSXurU23AFGCfDgynLfxUYMKyNWlYWS-EfTjZjYEzKNNiiX8OpSW4oIfQ3okofRLPTOHLrbRrQQIHivtX0-8vbQIaKshHJDeKENclpRaQafLg5vnppQpf9cuifRg_PaqxE" />
          </div>
        </div>
      </div>
    </header>
  );
}
