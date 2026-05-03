import React from 'react';
import { 
  Wifi, Mic, Camera, Globe, CheckCircle2, Sliders 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../components/LayoutWrapper';


const CameraSection = () => (
  <div className="space-y-4 h-full flex flex-col">
    <div className="bg-slate-900 rounded-xl shadow overflow-hidden relative flex-1 min-h-[250px] md:min-h-[300px] w-full h-64">
      <img 
        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        alt="Camera preview" 
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="flex justify-between items-end">
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Face Detected
          </div>
          <button className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/70 transition-colors border border-white/10">
            <Sliders size={20} />
          </button>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-600 font-medium text-sm">Microphone level</span>
        <span className="text-green-600 font-bold text-sm">Optimal</span>
      </div>
      <div className="flex gap-1 h-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm ${i < 7 ? 'bg-green-500' : 'bg-slate-200'}`}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

const ChecklistCard = () => (
  <div className="bg-white rounded-xl shadow p-6 h-full border border-slate-100">
    <h3 className="font-bold text-xl text-slate-800 mb-6">System Status</h3>
    
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <Wifi size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Internet Connection</h4>
            <p className="text-sm text-slate-500">Speed: 45 Mbps</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full shrink-0">
          <CheckCircle2 size={16} /> Pass
        </div>
      </div>

      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <Mic size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Microphone</h4>
            <p className="text-sm text-slate-500">Default Audio Device</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full shrink-0">
          <CheckCircle2 size={16} /> Pass
        </div>
      </div>

      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <Camera size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Camera</h4>
            <p className="text-sm text-slate-500">HD Web Camera</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full shrink-0">
          <CheckCircle2 size={16} /> Pass
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <Globe size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Browser</h4>
            <p className="text-sm text-slate-500">Chrome (Supported)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full shrink-0">
          <CheckCircle2 size={16} /> Pass
        </div>
      </div>
    </div>
  </div>
);

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 tracking-tight">All systems look good!</h3>
        <p className="text-indigo-100 text-lg">
          You are ready to proceed to the waiting room.
        </p>
      </div>
      <button 
        onClick={() => navigate('/waiting-room')}
        className="relative z-10 bg-white text-indigo-700 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm text-lg whitespace-nowrap"
      >
        Proceed to Waiting Room
      </button>
    </div>
  );
};

const SystemCheck = () => {
  return (
    <LayoutWrapper title="System Check" breadcrumbs={["System Check", "Waiting Room"]} maxWidthClass="max-w-6xl" currentStep="system-check">
      <div className="text-center py-2">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Ready to start?</h1>
        <p className="text-slate-500 text-lg">Let's make sure your equipment is working properly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col h-full">
          <CameraSection />
        </div>
        <div className="flex flex-col h-full">
          <ChecklistCard />
        </div>
      </div>

      <CTASection />
    </LayoutWrapper>
  );
};


export default SystemCheck;

