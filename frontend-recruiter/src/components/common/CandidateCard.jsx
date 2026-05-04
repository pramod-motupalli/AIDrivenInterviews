import React from 'react';

export default function CandidateCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                alt="Candidate Profile" 
                className="w-16 h-16 rounded-full object-cover border border-gray-100 shadow-sm" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiBa8UoBqmb-su6LRxfbmqEDvC3DCJooEikTTtrKleCo9FcG8ffDQVV73tDkyW7mpzQ9qHlE-zSOMiiFgV9uCWycp14EcgVyPh4-6WJihxorDFmxPmbL082nZUGLcr4gzmtg5TbmoIDRZ1dAll8kQuNCV1Tk7RHurOJL8by4UlK_6dXmrzhzoGvsAfU5rhrRQ0pr2vHZmc5yenq4qU5zdSXqMIkkMkNYRKjXhkV4r6Cu9UBnG9a4ptNsezowMlOUVkMmIq6ZVXJow"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm text-white">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 leading-tight">Sarah Jenkins</h4>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                sarah.jenkins@example.com
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Analyzed
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Match</p>
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">
                SUITABLE
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Workflow</p>
              <div className="text-sm font-semibold text-gray-700">Invite Sent</div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
              <div className="text-sm font-bold text-blue-600">94/100</div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Key Highlights</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                <span>6+ years React experience</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                <span>Previous Senior role at Tier 1 Tech</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Interview Focus</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">info</span>
                <span>Micro-frontend knowledge</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">info</span>
                <span>Leadership in Agile environments</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              View Full AI Report
            </button>
            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">attachment</span>
          sarah_resume_v2.pdf
        </span>
        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">ID: CAND-9902</span>
      </div>
    </div>
  );
}
