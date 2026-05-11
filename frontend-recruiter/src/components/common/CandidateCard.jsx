import React from 'react';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export default function CandidateCard({ candidate, jobTitle }) {
  if (!candidate) return null;

  const [scheduling, setScheduling] = React.useState(false);
  const [scheduled, setScheduled] = React.useState(false);
  const [error, setError] = React.useState(null);

  const {
    name = "Pending Analysis",
    email = "Not available",
    ats_score = 0,
    highlights = [],
    filename = "resume.pdf"
  } = candidate;

  const handleSchedule = async () => {
    setScheduling(true);
    setError(null);
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`${API_BASE}/interviews/invite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          job_title: jobTitle,
          name: name
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setScheduled(true);
      } else {
        setError(data.error || 'Failed to schedule');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-200 shadow-sm">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm text-white">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 leading-tight">{name}</h4>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                {email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {scheduled ? 'Scheduled' : 'Analyzed'}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Match</p>
              <div className={`text-xs font-bold px-2 py-0.5 rounded border inline-block ${ats_score >= 70 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                {ats_score >= 80 ? 'EXCELLENT' : ats_score >= 60 ? 'SUITABLE' : 'POTENTIAL'}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Workflow</p>
              <div className="text-sm font-semibold text-gray-700">{scheduled ? 'Invited' : 'Ready'}</div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
              <div className="text-sm font-bold text-blue-600">{ats_score}/100</div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Key Highlights</h5>
            <ul className="space-y-2">
              {highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                  <span>{highlight}</span>
                </li>
              ))}
              {highlights.length === 0 && <li className="text-xs text-gray-400">No highlights extracted</li>}
            </ul>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Next Step</h5>
            <p className="text-sm text-gray-600">
              {scheduled 
                ? "Interview scheduled! The candidate has received a unique session link valid for 24 hours."
                : "Review the full report and schedule a technical screening interview."
              }
            </p>
            {error && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">{error}</p>}
          </div>
          <div className="flex flex-col justify-center gap-3">
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
              View Full AI Report
            </button>
            <button 
              onClick={handleSchedule}
              disabled={scheduling || scheduled}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                scheduled 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {scheduling ? (
                <>
                  <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  Scheduling...
                </>
              ) : scheduled ? (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Invite Sent
                </>
              ) : 'Schedule Interview'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">attachment</span>
          {filename}
        </span>
        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">REAL-TIME ANALYSIS</span>
      </div>
    </div>
  );
}
