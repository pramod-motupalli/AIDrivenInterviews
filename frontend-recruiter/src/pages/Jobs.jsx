import React, { useState } from 'react';
import UploadBox from '@/components/common/UploadBox';
import CandidateCard from '@/components/common/CandidateCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload Section: Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox 
          icon="description"
          title="Upload Job Description"
          description="PDF or DOCX supported"
          onFileSelect={(file) => setJdFile(file)}
          success={jdFile?.name}
          loading={loading}
        />
        <UploadBox 
          icon="upload_file"
          title="Upload Candidate Resume"
          description="PDF or DOCX supported"
          onFileSelect={(file) => setResumeFile(file)}
          success={resumeFile?.name}
          loading={loading}
        />
      </div>

      {/* Action Button */}
      {(jdFile && resumeFile) && (
        <div className="flex justify-center">
          <Button 
            onClick={handleUpload} 
            disabled={loading}
            className="px-12 py-6 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all h-auto font-bold"
          >
            {loading ? 'Processing Files...' : 'Analyze Candidate Match →'}
          </Button>
        </div>
      )}

      {/* Job Details Section (Mockup) */}
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
