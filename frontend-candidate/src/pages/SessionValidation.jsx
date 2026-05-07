import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';

const SessionValidation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/interviews/validate-session/${token}/`);
        const data = await res.json();

        if (res.ok && data.valid) {
          // Store session info
          localStorage.setItem('candidate_token', token);
          localStorage.setItem('candidate_name', data.candidate_name);
          localStorage.setItem('job_title', data.job_title);

          // Redirect to dashboard after a short delay for smooth transition
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError(data.error || `Server error: ${res.status}`);
          setLoading(false);
        }
      } catch (err) {
        setError('Connection failed. Please check your internet.');
        setLoading(false);
      }
    };

    validateSession();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FF] p-4 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 animate-pulse">
          <Sparkles className="text-indigo-600 w-8 h-8" />
        </div>
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Validating Interview Link</h1>
        <p className="text-slate-500">Preparing your personalized interview dashboard...</p>
      </div>
    );
  }

  if (error) {
    const isExpired = error.toLowerCase().includes('expired');

    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${isExpired ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'}`}>
            {isExpired ? <Clock size={40} /> : <AlertCircle size={40} />}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isExpired ? 'Link Expired' : 'Access Denied'}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              {isExpired
                ? "This interview session link was only valid for 24 hours. Please contact your recruiter to request a new invitation."
                : error
              }
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => window.location.href = 'mailto:support@aiinterview.app'}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Contact Support <ArrowRight size={20} />
            </button>
          </div>

          <p className="text-sm text-slate-400 font-medium pt-8">
            TalentAI • Secure Interview Platform
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FF] p-4 text-center">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200 scale-110 transition-transform animate-bounce">
        <Sparkles size={32} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Success!</h1>
      <p className="text-slate-500 text-lg">Entering your dashboard...</p>
    </div>
  );
};

export default SessionValidation;
