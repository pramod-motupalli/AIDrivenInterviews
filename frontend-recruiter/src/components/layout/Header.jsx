import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-14 flex items-center justify-end gap-3 px-6 bg-white border-b border-gray-200 w-full flex-shrink-0 z-40">
      {/* Notifications */}
      <div className="relative cursor-pointer p-1 text-gray-600 hover:text-gray-900 transition-colors">
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </div>

      {/* Profile / Avatar */}
      <div className="relative">
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-8 w-8 rounded-full border border-gray-200 cursor-pointer overflow-hidden transition-opacity hover:opacity-80"
        >
          <img 
            alt="User avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmvBX-647LA6O6SIxndP35O-gyyWWjhbQDE5zZU-AprQZijFLPhOU7d6TNzZLX7MA5S1pXbrPZNawPbMdwUMhudKoaKDHiR-liCZ9yCDmQw6JNMy6Qqw8152Ym-mQ6VOnCKm3EUgkExjSXurU23AFGCfDgynLfxUYMKyNWlYWS-EfTjZjYEzKNNiiX8OpSW4oIfQ3okofRLPTOHLrbRrQQIHivtX0-8vbQIaKshHJDeKENclpRaQafLg5vnppQpf9cuifRg_PaqxE" 
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-100 p-2 z-50">
              <Link 
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Profile
              </Link>
              <Link 
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Settings
              </Link>
              <div className="my-1 border-t border-gray-100"></div>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

