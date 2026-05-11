import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/results');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Premium Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 flex items-center h-18 px-8 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">InterviewerAI</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Access your secure interview evaluation report</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-xl shadow-slate-200/40">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">Email or Tracking ID</label>
                <input 
                  type="text" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="candidate@company.com" 
                  required 
                  className="w-full h-13 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">Access Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="w-full h-13 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="group w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    View Evaluation
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Need assistance? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 flex flex-wrap justify-center gap-x-10 gap-y-4 px-6">
        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs font-semibold uppercase tracking-wider transition-colors">Privacy</a>
        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs font-semibold uppercase tracking-wider transition-colors">Terms</a>
        <a href="#" className="text-slate-400 hover:text-slate-600 text-xs font-semibold uppercase tracking-wider transition-colors">Security</a>
      </footer>
    </div>
  );
};

export default Login;
