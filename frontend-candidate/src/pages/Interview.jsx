import React from 'react';
import { GripVertical, HelpCircle, RotateCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => (
  <header className="flex justify-between items-center w-full px-6 py-4 lg:px-12 lg:py-6 z-40">
    <span className="text-slate-500 font-medium tracking-widest uppercase text-sm">Question 2 of 5</span>
    <span className="text-red-500 font-bold text-2xl tracking-tight animate-pulse">14:32</span>
  </header>
);

const WebcamOverlay = () => (
  <div className="absolute top-4 right-4 lg:top-8 lg:right-8 w-24 h-32 md:w-32 md:h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-white bg-slate-900 cursor-move z-50 transition-transform hover:scale-105">
    <img 
      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
      alt="Candidate camera" 
      className="w-full h-full object-cover opacity-90"
    />
    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-[9px] md:text-[10px] font-bold text-white tracking-widest backdrop-blur-sm">
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
      REC
    </div>
    <div className="absolute bottom-2 right-2 text-white/50 hover:text-white transition-colors cursor-grab">
      <GripVertical size={20} />
    </div>
  </div>
);

const QuestionCard = () => (
  <div className="bg-white border border-slate-100 rounded-2xl px-6 py-8 md:px-10 md:py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl text-center relative z-20 mx-auto w-full">
    <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 leading-tight tracking-tight">
      Tell me about a time when you had to manage conflicting priorities on a critical project.
    </h2>
  </div>
);

const VoiceVisualizer = () => {
  const heights = [30, 60, 100, 40, 80, 50, 90, 30, 70, 40, 60];
  
  return (
    <div className="flex flex-col items-center gap-8 mt-12 mb-8 relative z-20">
      <div className="flex items-end justify-center gap-1.5 h-16 md:h-24">
        {heights.map((h, i) => (
          <div 
            key={i} 
            className="w-2.5 md:w-3 bg-indigo-500 rounded-full animate-pulse"
            style={{ 
              height: `${h}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1.2s'
            }}
          ></div>
        ))}
      </div>
      <span className="text-indigo-600 font-bold tracking-[0.25em] uppercase text-sm md:text-base animate-pulse">
        Listening...
      </span>
    </div>
  );
};

const AssistantPanel = () => (
  <div className="hidden md:flex absolute bottom-8 left-8 flex-col bg-white border border-slate-100 rounded-xl p-4 shadow-xl z-40 min-w-[200px]">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">AI Assistant</p>
    <div className="flex flex-col gap-2">
      <button className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold w-full text-left">
        <RotateCw size={18} /> Repeat Question
      </button>
      <button className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold w-full text-left">
        <HelpCircle size={18} /> Request Hint
      </button>
    </div>
  </div>
);

const BottomControls = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center space-y-6 pb-8 md:pb-12 z-40 w-full px-6">
      <button 
        onClick={() => navigate('/feedback')}
        className="bg-indigo-600 text-white font-bold px-10 py-4 md:py-5 rounded-xl shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-3 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg w-full max-w-sm"
      >
        Next Question <ArrowRight size={20} />
      </button>
      <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide">
        Your response is being transcribed in real-time.
      </p>
    </div>
  );
};

const Interview = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden font-sans">
      <WebcamOverlay />
      <TopBar />
      <main className="flex flex-col items-center justify-center flex-1 space-y-8 px-6 lg:px-12 z-10">
        <QuestionCard />
        <VoiceVisualizer />
      </main>
      <AssistantPanel />
      <BottomControls />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </div>
  );
};

export default Interview;
