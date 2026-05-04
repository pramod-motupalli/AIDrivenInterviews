import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ReportDetail() {
  const { id } = useParams();

  const scores = [
    { label: 'Technical', value: 94, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Communication', value: 88, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Relevance', value: 91, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="flex flex-col">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/reports" className="hover:text-blue-600 transition-colors">Reports</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-gray-900 font-medium">Candidate Report</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          <Link to="/reports" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="h-16 w-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              alt="Candidate Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwUVvBVlpecY4XCZlLDAQXUttnFpV_sw9nezenMDNIzPvKkEwN5vJ-vmdy4icDNrf_tXYes-w7A0PS0mwcBrHpyn1VMUo1iJfi4tOYsYagF723GaaURyPjjjV202Y0aRO_DKX4WqxuzfABjhrICN_uG_cRe2tw_s9R5AegOTKXm3JZIe60PlylWQusimAxua7D8KiJHSAdFNSmyYpgMcv8FTLYeqnHB5uU5_UWZ4df-A7wZJP_UW809Jljf9-DmGmnUpRedvYdtzE" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jordan Devereaux</h1>
            <p className="text-sm text-gray-500 mt-0.5">Senior Full-Stack Engineer • Dec 12, 2023</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
            Reject
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            Hire Candidate
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* AI Summary Card */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Recommendation</h3>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold uppercase tracking-wide">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Recommended
            </span>
          </div>
          <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
            Jordan demonstrates exceptional technical depth in distributed systems and React architecture. Their ability to articulate complex trade-offs between SQL and NoSQL environments was a standout moment. Based on the technical screening and communication assessment, they are a high-potential fit for the Senior Engineering role.
          </p>
        </div>

        {/* Scores Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {scores.map((score, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{score.label}</p>
                <p className="text-2xl font-bold text-gray-900">{score.value}<span className="text-sm font-normal text-gray-300">/100</span></p>
              </div>
              <div className={`w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center ${score.color}`}>
                 <span className="text-xs font-bold">{score.value}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Growth */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="material-symbols-outlined">thumb_up</span>
            <h3 className="text-lg font-bold">Key Strengths</h3>
          </div>
          <div className="space-y-6">
            {[
              { t: 'System Design Mastery', d: 'Explained horizontal scaling strategies with precise detail on data consistency.' },
              { t: 'Pragmatic Problem Solving', d: 'Balanced theoretical "best practices" with realistic business constraints.' },
              { t: 'Cultural Alignment', d: 'Demonstrated high levels of empathy and collaborative spirit in scenario tests.' }
            ].map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="material-symbols-outlined text-emerald-500 shrink-0">add_circle</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{s.t}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-amber-700">
            <span className="material-symbols-outlined">report_problem</span>
            <h3 className="text-lg font-bold">Areas for Growth</h3>
          </div>
          <div className="space-y-6">
            {[
              { t: 'Verbose Explanations', d: 'Can occasionally go too deep into technical tangents, losing sight of the core question.' },
              { t: 'DevOps Tooling Depth', d: 'Familiar with Kubernetes but lacks hands-on experience with advanced mesh networking.' }
            ].map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="material-symbols-outlined text-amber-500 shrink-0">remove_circle</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{s.t}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">description</span>
              <h3 className="text-lg font-bold text-gray-900">Full Interview Transcript</h3>
            </div>
            <button className="text-sm font-bold text-blue-600 hover:underline">Download PDF</button>
          </div>
          <div className="p-6 space-y-6 bg-gray-50/30">
            {[
              { q: "Can you describe a situation where you had to lead a technical migration under a tight deadline?", t: "AI Interviewer", time: "02:14", role: "AI" },
              { q: "Absolutely. At my previous role, we were moving from a monolithic Ruby on Rails application to a microservices architecture. We had a three-month window before our peak seasonal traffic...", t: "Jordan Devereaux", time: "02:30", role: "Candidate" }
            ].map((m, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${m.role === 'AI' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                  {m.role === 'AI' ? 'AI' : 'JD'}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{m.t} • {m.time}</div>
                  <p className={`text-sm leading-relaxed ${m.role === 'AI' ? 'text-gray-500 italic' : 'text-gray-800'}`}>{m.q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  </div>
  );
}
