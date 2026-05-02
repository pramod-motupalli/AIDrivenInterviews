import React from 'react';
import UploadBox from '@/components/common/UploadBox';
import CandidateCard from '@/components/common/CandidateCard';
import { Card } from '@/components/ui/card';

export default function Jobs() {
  return (
    <div className="space-y-8">
      {/* Upload Section: Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox 
          icon="description"
          title="Upload Job Description"
          description="PDF, DOCX, or text content"
        />
        <UploadBox 
          icon="upload_file"
          title="Upload Candidate Resume"
          description="PDF or DOCX supported"
        />
      </div>

      {/* Job Details Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-label-uppercase text-slate-500 uppercase tracking-widest text-[11px]">Active Job Configuration</h3>
          <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm">edit</span> Edit Details
          </button>
        </div>
        
        <Card className="bg-white border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">developer_mode_tv</span>
              </div>
              <div>
                <h4 className="text-headline-md text-slate-900">Senior Frontend Engineer</h4>
                <p className="text-body-base text-slate-500">Engineering • Full-time • Remote (US)</p>
              </div>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full">
              <span className="text-[11px] font-bold text-slate-600 uppercase">REQ-2024-081</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-label-uppercase text-slate-400 mb-3">REQUIRED SKILLS & STACK</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">React.js</span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">TypeScript</span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">Tailwind CSS</span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">Node.js</span>
              <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">GraphQL</span>
              <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">System Design</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Consolidated Candidate Result */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-label-uppercase text-slate-500 uppercase tracking-widest text-[11px]">Analysis Result</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Processed 2 mins ago</span>
          </div>
        </div>
        
        <CandidateCard />
      </section>
    </div>
  );
}
