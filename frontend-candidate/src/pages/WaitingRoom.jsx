import React from 'react';
import { 
  CheckCircle2, AlertCircle, Wifi, Mic, Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../components/LayoutWrapper';

const ChecklistSection = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 mb-1">Quiet Environment</h4>
        <p className="text-slate-500 text-sm leading-relaxed">Ensure you are in a quiet, well-lit room free from distractions and background noise.</p>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
        <Wifi size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 mb-1">Stable Internet</h4>
        <p className="text-slate-500 text-sm leading-relaxed">Your connection is stable. Please avoid downloading large files during the interview.</p>
      </div>
    </div>

    <div className="bg-[#EFF6FF] rounded-xl p-5 border border-blue-100 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
        <AlertCircle size={20} />
      </div>
      <div>
        <h4 className="font-bold text-blue-900 mb-1">Pro Tip</h4>
        <p className="text-blue-700 text-sm leading-relaxed">Look directly at the camera when speaking to maintain good eye contact with the interviewer.</p>
      </div>
    </div>
  </div>
);

const CameraSection = () => (
  <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden relative w-full h-64">
    <img 
      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
      alt="Camera preview" 
      className="w-full h-full object-cover opacity-80"
    />
    <div className="absolute inset-0 flex flex-col justify-end p-4">
      <div className="flex justify-between items-end">
        <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/10">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Live Preview
        </div>
        <div className="flex gap-2">
          <button className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors border border-white/10">
            <Mic size={20} />
          </button>
          <button className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors border border-white/10">
            <Sliders size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CountdownCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 text-center flex flex-col items-center justify-center">
      <h3 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-3">Starting Soon</h3>
      <div className="text-4xl md:text-5xl font-extrabold text-indigo-600 tracking-tight mb-2">
        04:59
      </div>
      <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
        Please wait while the interviewer joins the session. Do not close this tab.
      </p>
      {/* Changed to active for flow demonstration */}
      <button 
        onClick={() => navigate('/interview')}
        className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
      >
        Join Interview
      </button>
      <p className="text-xs text-slate-400 mt-4">
        (Enabled for demo purposes to proceed to interview)
      </p>
    </div>
  );
};

const WaitingRoom = () => {
  return (
    <LayoutWrapper title="Waiting Room" breadcrumbs={["System Check", "Waiting Room"]} maxWidthClass="max-w-6xl">
      <div className="text-center py-2">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Getting Ready</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Your setup is complete. Please review these final tips while you wait for your interview to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col">
          <ChecklistSection />
        </div>
        
        <div className="flex flex-col space-y-6">
          <CameraSection />
          <CountdownCard />
        </div>
      </div>

      <div className="text-center pt-6">
        <a href="#" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-all">
          Need help? Contact support
        </a>
      </div>
    </LayoutWrapper>
  );
};

export default WaitingRoom;
