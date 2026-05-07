import React, { useState } from 'react';
import UploadBox from '@/components/common/UploadBox';
import CandidateCard from '@/components/common/CandidateCard';
import { Card } from '@/components/ui/card';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';


export default function Jobs() {
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // New state for extracted data
  const [jobConfig, setJobConfig] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleUpload = async () => {
    if (!jdFile || !resumeFile) return;

    setLoading(true);
    setMessage(null);

    const token = localStorage.getItem('access');

    try {
      // Create FormData to send files directly
      const formData = new FormData();
      formData.append('jd', jdFile);
      formData.append('resume', resumeFile);
      
      // Optional metadata - can be expanded later with UI fields
      formData.append('candidate_name', 'Extracted Candidate'); 
      formData.append('candidate_email', 'extracted@example.com');

      setMessage({ type: 'info', text: 'Uploading files and starting AI analysis...' });

      const processRes = await fetch(`${API_BASE}/ai/screening/process/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Do NOT set Content-Type header for FormData, 
          // fetch will set it correctly with boundary
        },
        body: formData,
      });

      // Check if response is JSON
      const processContentType = processRes.headers.get("content-type");
      if (!processContentType || !processContentType.includes("application/json")) {
        const text = await processRes.text();
        console.error("Server returned non-JSON response:", text);
        throw new Error(`AI Service Error: Server returned HTML. Check backend logs.`);
      }

      const result = await processRes.json();
      if (!processRes.ok) {
        throw new Error(result.error || 'AI analysis failed');
      }
      
      // 3. Update state with real data
      setJobConfig(result.job_config);
      setAnalysisResult({
        ...result.candidate_details,
        filename: resumeFile.name
      });

      setMessage({ type: 'success', text: '✅ Analysis completed successfully!' });
      
      // Clear files but keep the results visible
      setJdFile(null);
      setResumeFile(null);

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadBox 
          icon="description"
          title={jdFile ? jdFile.name : "Upload Job Description"}
          description="PDF, DOCX, or text content"
          onFileSelect={setJdFile}
        />
        <UploadBox 
          icon="upload_file"
          title={resumeFile ? resumeFile.name : "Upload Candidate Resume"}
          description="PDF or DOCX supported"
          onFileSelect={setResumeFile}
        />
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold animate-in fade-in duration-300 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button 
          onClick={handleUpload}
          disabled={!jdFile || !resumeFile || loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Analyzing...
            </>
          ) : 'Start Screening'}
        </button>
      </div>

      {/* Job Details Section */}
      <section className={jobConfig ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-label-uppercase text-slate-500 uppercase tracking-widest text-[11px]">Active Job Configuration</h3>
          {jobConfig && (
            <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-sm">edit</span> Edit Details
            </button>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {jobConfig ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-3xl">work</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 leading-tight">{jobConfig.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{jobConfig.department} • Full-time • Remote</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-lg">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">EXTRACTED</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">REQUIRED SKILLS & STACK</p>
                <div className="flex flex-wrap gap-2">
                  {jobConfig.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">info</span>
              <p>Upload a JD to see configuration</p>
            </div>
          )}
        </div>
      </section>

      {/* Analysis Result */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Analysis Result</h3>
          {analysisResult && <span className="text-xs text-gray-400">Processed Just Now</span>}
        </div>
        
        {analysisResult ? (
          <CandidateCard candidate={analysisResult} jobTitle={jobConfig?.title} />
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
            <p>Upload files and click "Start Screening" to analyze candidate match.</p>
          </div>
        )}
      </section>

    </div>
  );
}
