import React from 'react';

export default function UploadBox({ icon, title, description }) {
  return (
    <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-400">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 text-center mb-6 max-w-[200px]">{description}</p>
      <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        Choose File
      </button>
    </div>
  );
}
