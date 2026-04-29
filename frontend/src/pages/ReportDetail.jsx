import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams, Link } from 'react-router-dom';

export default function ReportDetail() {
  const { id } = useParams();

  return (
    <>
      {/* Report Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
            <img alt="Candidate profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwUVvBVlpecY4XCZlLDAQXUttnFpV_sw9nezenMDNIzPvKkEwN5vJ-vmdy4icDNrf_tXYes-w7A0PS0mwcBrHpyn1VMUo1iJfi4tOYsYagF723GaaURyPjjjV202Y0aRO_DKX4WqxuzfABjhrICN_uG_cRe2tw_s9R5AegOTKXm3JZIe60PlylWQusimAxua7D8KiJHSAdFNSmyYpgMcv8FTLYeqnHB5uU5_UWZ4df-A7wZJP_UW809Jljf9-DmGmnUpRedvYdtzE" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Jordan Devereaux</h2>
            <p className="text-sm text-on-surface-variant">Senior Full-Stack Engineer Candidate • Interviewed Dec 12, 2023</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex-1 md:flex-none h-auto py-2.5 px-6 border-error text-error hover:bg-error-container/20 hover:text-error">
            Reject Candidate
          </Button>
          <Button className="flex-1 md:flex-none h-auto py-2.5 px-6 bg-primary text-white hover:opacity-90">
            Accept Candidate
          </Button>
        </div>
      </div>

      {/* Bento Grid Report */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* AI Recommendation Summary (High Importance) */}
        <Card className="md:col-span-8 bg-white p-6 rounded-xl border-outline-variant shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">AI Recommendation</span>
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border-emerald-100">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="text-xs font-bold uppercase tracking-wider">Recommended</span>
            </Badge>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">
            Jordan demonstrates exceptional technical depth in distributed systems and React architecture. Their ability to articulate complex trade-offs between SQL and NoSQL environments was a standout moment. Based on the technical screening and communication assessment, they are a high-potential fit for the Senior Engineering role.
          </p>
        </Card>

        {/* Scores Grid */}
        <div className="md:col-span-4 grid grid-cols-1 gap-4">
          {/* Technical Score */}
          <Card className="bg-white p-4 rounded-xl border-outline-variant shadow-sm flex justify-between items-center border">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Technical</p>
              <p className="text-2xl font-bold text-on-surface">94<span className="text-sm font-normal text-slate-400">/100</span></p>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-primary rotate-45"></div>
          </Card>

          {/* Communication Score */}
          <Card className="bg-white p-4 rounded-xl border-outline-variant shadow-sm flex justify-between items-center border">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Communication</p>
              <p className="text-2xl font-bold text-on-surface">88<span className="text-sm font-normal text-slate-400">/100</span></p>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-primary rotate-[120deg]"></div>
          </Card>

          {/* Relevance Score */}
          <Card className="bg-white p-4 rounded-xl border-outline-variant shadow-sm flex justify-between items-center border">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Relevance</p>
              <p className="text-2xl font-bold text-on-surface">91<span className="text-sm font-normal text-slate-400">/100</span></p>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-primary rotate-[30deg]"></div>
          </Card>
        </div>

        {/* Strengths & Weaknesses */}
        <Card className="md:col-span-6 bg-white p-6 rounded-xl border-outline-variant shadow-sm border">
          <div className="flex items-center gap-2 mb-4 text-emerald-700">
            <span className="material-symbols-outlined">thumb_up</span>
            <h3 className="text-lg font-bold">Key Strengths</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-1">add_circle</span>
              <div>
                <p className="font-semibold text-sm">System Design Mastery</p>
                <p className="text-sm text-on-surface-variant">Explained horizontal scaling strategies with precise detail on data consistency.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-1">add_circle</span>
              <div>
                <p className="font-semibold text-sm">Pragmatic Problem Solving</p>
                <p className="text-sm text-on-surface-variant">Balanced theoretical "best practices" with realistic business constraints.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="material-symbols-outlined text-emerald-500 mt-1">add_circle</span>
              <div>
                <p className="font-semibold text-sm">Cultural Alignment</p>
                <p className="text-sm text-on-surface-variant">Demonstrated high levels of empathy and collaborative spirit in scenario tests.</p>
              </div>
            </li>
          </ul>
        </Card>

        <Card className="md:col-span-6 bg-white p-6 rounded-xl border-outline-variant shadow-sm border">
          <div className="flex items-center gap-2 mb-4 text-amber-700">
            <span className="material-symbols-outlined">report_problem</span>
            <h3 className="text-lg font-bold">Areas for Growth</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="material-symbols-outlined text-amber-500 mt-1">remove_circle</span>
              <div>
                <p className="font-semibold text-sm">Verbose Explanations</p>
                <p className="text-sm text-on-surface-variant">Can occasionally go too deep into technical tangents, losing sight of the core question.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="material-symbols-outlined text-amber-500 mt-1">remove_circle</span>
              <div>
                <p className="font-semibold text-sm">DevOps Tooling Depth</p>
                <p className="text-sm text-on-surface-variant">Familiar with Kubernetes but lacks hands-on experience with advanced mesh networking.</p>
              </div>
            </li>
          </ul>
        </Card>

        {/* Expandable Transcript */}
        <Card className="md:col-span-12 bg-white rounded-xl border-outline-variant shadow-sm overflow-hidden p-0 border">
          <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500">description</span>
              <h3 className="text-lg font-bold">Full Interview Transcript</h3>
            </div>
            <span className="material-symbols-outlined text-slate-400">expand_more</span>
          </button>
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/30">
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-blue-700">AI</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">AI Interviewer • 02:14</p>
                  <p className="text-sm text-on-surface italic">"Can you describe a situation where you had to lead a technical migration under a tight deadline?"</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-700">JD</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Jordan Devereaux • 02:30</p>
                  <p className="text-sm text-on-surface">"Absolutely. At my previous role, we were moving from a monolithic Ruby on Rails application to a microservices architecture. We had a three-month window before our peak seasonal traffic..."</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-blue-700">AI</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">AI Interviewer • 04:45</p>
                  <p className="text-sm text-on-surface italic">"How did you manage the data integrity during the cutover phase?"</p>
                </div>
              </div>
              {/* Subtle Fade */}
              <div className="h-12 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none sticky bottom-0"></div>
            </div>
            <button className="mt-4 text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View Full Transcript <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
