import React from 'react';
import UploadBox from '@/components/common/UploadBox';
import CandidateCard from '@/components/common/CandidateCard';

export default function Jobs() {
  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Jobs & Candidates</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your job requirements and analyze incoming candidate resumes.</p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox 
          icon="description"
          title="Upload Job Description"
          description="Drag and drop your JD here or browse files."
        />
        <UploadBox 
          icon="upload_file"
          title="Upload Candidate Resume"
          description="Supports PDF, DOCX and text formats."
        />
      </div>

      {/* Job Details Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Active Job Configuration</h3>
          <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-sm">edit</span> Edit
          </button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-3xl">developer_mode_tv</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 leading-tight">Senior Frontend Engineer</h4>
                <p className="text-sm text-gray-500 mt-1">Engineering • Full-time • Remote (US)</p>
              </div>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-lg">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">REQ-2024-081</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">REQUIRED SKILLS & STACK</p>
            <div className="flex flex-wrap gap-2">
              {['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'System Design'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Result */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Analysis Result</h3>
          <span className="text-xs text-gray-400">Processed 2 mins ago</span>
        </div>
        
        <CandidateCard />
      </section>

    </div>
  );
}
