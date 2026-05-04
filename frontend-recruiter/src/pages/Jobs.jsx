import React, { useState } from 'react';
import UploadBox from '@/components/common/UploadBox';
import CandidateCard from '@/components/common/CandidateCard';
import { Card } from '@/components/ui/card';
const API_BASE = 'http://127.0.0.1:8000/api/v1';


export default function Jobs() {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpload = async () => {
    if (!jdFile || !resumeFile) return;

    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem('access');

    try {
      // For MVP, we upload both separately using the existing endpoint
      // A more advanced version would use a single endpoint for JD + Resume comparison
      
      const uploadFile = async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type); // Optional: if backend supports it

        const res = await fetch(`${API_BASE}/upload/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `Failed to upload ${type}`);
        }
        return await res.json();
      };

      await Promise.all([
        uploadFile(jdFile, 'jd'),
        uploadFile(resumeFile, 'resume')
      ]);

      setMessage({ type: 'success', text: '✅ Files uploaded and screening started successfully!' });
      
      // Clear files after a short delay to allow the user to see success
      setTimeout(() => {
        setJdFile(null);
        setResumeFile(null);
        setMessage(null);
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

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
