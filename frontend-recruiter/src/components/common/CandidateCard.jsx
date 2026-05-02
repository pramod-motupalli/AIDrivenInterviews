import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CandidateCard() {
  return (
    <Card className="bg-white border-slate-200 rounded-xl overflow-hidden shadow-sm p-0">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img alt="Candidate Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white ring-1 ring-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiBa8UoBqmb-su6LRxfbmqEDvC3DCJooEikTTtrKleCo9FcG8ffDQVV73tDkyW7mpzQ9qHlE-zSOMiiFgV9uCWycp14EcgVyPh4-6WJihxorDFmxPmbL082nZUGLcr4gzmtg5TbmoIDRZ1dAll8kQuNCV1Tk7RHurOJL8by4UlK_6dXmrzhzoGvsAfU5rhrRQ0pr2vHZmc5yenq4qU5zdSXqMIkkMkNYRKjXhkV4r6Cu9UBnG9a4ptNsezowMlOUVkMmIq6ZVXJow"/>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 leading-tight">Sarah Jenkins</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-slate-500 text-sm">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  sarah.jenkins@example.com
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resume Status</p>
              <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Analyzed
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Match Result</p>
              <Badge variant="outline" className="bg-green-50 text-green-700 font-bold border-green-100 rounded">
                SUITABLE
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Workflow</p>
              <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                Invite Sent
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
              <div className="text-primary font-bold text-sm">94/100</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h5 className="text-[11px] font-bold text-slate-500 uppercase mb-2">Key Highlights</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="material-symbols-outlined text-green-600 text-sm mt-0.5">verified</span>
                6+ years React experience
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="material-symbols-outlined text-green-600 text-sm mt-0.5">verified</span>
                Previous Senior role at Tier 1 Tech
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h5 className="text-[11px] font-bold text-slate-500 uppercase mb-2">Interview Focus</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">info</span>
                Depth of Micro-frontend knowledge
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">info</span>
                Leadership in Agile environments
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Button className="w-full bg-primary text-white hover:bg-primary-container h-auto py-2.5">
              View Full AI Report
            </Button>
            <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-auto py-2.5">
              Schedule Interview
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">attachment</span>
            sarah_resume_v2.pdf
          </span>
        </div>
        <div className="flex gap-4">
          <span className="text-xs font-medium text-slate-400">ID: CAND-9902</span>
        </div>
      </div>
    </Card>
  );
}
