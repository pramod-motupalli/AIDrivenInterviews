import React from 'react';
import { 
  CheckCircle2, Trophy, ArrowRight, Star, CheckSquare, Square, Mail 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../components/LayoutWrapper';


const HeroCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10 w-full md:w-2/3">
        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4 border border-white/10 uppercase">
          Application Complete
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Congratulations, Alex!</h2>
        <p className="text-indigo-100 text-lg mb-8 leading-relaxed max-w-xl">
          You've been successfully shortlisted for the Senior UX Designer position at TechCorp Innovations based on your excellent interview results.
        </p>
        <button 
          onClick={() => navigate('/feedback')}
          className="bg-white text-indigo-600 font-bold py-3.5 px-8 rounded-xl shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
        >
          View Full Report <ArrowRight size={18} />
        </button>
      </div>
      <div className="relative z-10 w-48 md:w-1/3 flex justify-center">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl">
          <Trophy size={64} className="text-white drop-shadow-md" />
        </div>
      </div>
    </div>
  );
};

const NextStepsCard = () => (
  <div className="bg-[#EEF2FF] rounded-xl p-8 border border-indigo-100 h-full flex flex-col">
    <h3 className="text-xl font-bold text-indigo-900 mb-6">Next Steps</h3>
    <div className="flex-1">
      <ul className="space-y-4 mb-8">
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
            <span className="text-xs font-bold">1</span>
          </div>
          <span className="text-slate-700 leading-relaxed font-medium">Schedule a 30-minute culture fit interview with the hiring manager.</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
            <span className="text-xs font-bold">2</span>
          </div>
          <span className="text-slate-700 leading-relaxed font-medium">Review the provided project brief prior to the call.</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
            <span className="text-xs font-bold">3</span>
          </div>
          <span className="text-slate-700 leading-relaxed font-medium">Submit your references via the portal.</span>
        </li>
      </ul>
    </div>
    <button className="w-full bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm">
      View Interview Brief
    </button>
  </div>
);

const SummaryCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
    <h3 className="text-xl font-bold text-slate-800 mb-6">Interview Summary</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-center">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">Communication</span>
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="fill-yellow-400 text-yellow-400" size={24} />
          <span className="text-3xl font-extrabold text-slate-800">4.8</span>
          <span className="text-slate-400 font-bold">/5</span>
        </div>
        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full inline-block mt-2">Top 10%</span>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-center flex flex-col justify-center">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">Proficiency</span>
        <div className="inline-flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold mx-auto w-max">
          <CheckCircle2 size={18} />
          Advanced Level
        </div>
        <span className="text-slate-500 text-xs mt-3">Exceeded benchmark expectations</span>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-center">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">Key Strengths</span>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> User-centered design focus
          </li>
          <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Clear cross-functional communication
          </li>
          <li className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Systematic problem solving
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ChecklistSection = () => (
  <div className="bg-[#EEF2FF] rounded-xl p-8 border border-indigo-100 mt-6">
    <h3 className="text-xl font-bold text-indigo-900 mb-6">Action Checklist</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <CheckSquare className="text-green-500" size={24} />
          <span className="font-semibold text-slate-700 line-through opacity-70">Complete AI interview</span>
        </div>
        <span className="text-xs font-bold text-green-600 uppercase">Done</span>
      </div>
      
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
        <div className="flex items-center gap-3">
          <Square className="text-slate-300" size={24} />
          <span className="font-semibold text-slate-800">Schedule Hiring Manager Interview</span>
        </div>
        <button className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors">
          Action Required
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <Square className="text-slate-300" size={24} />
          <span className="font-semibold text-slate-800">Submit 2 Professional References</span>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase">Pending</span>
      </div>
    </div>
  </div>
);

const DashboardResult = () => {
  return (
    <LayoutWrapper title="Candidate Dashboard" currentStep="decision">
      <HeroCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        <div className="md:col-span-2 flex flex-col h-full">
          <SummaryCard />
        </div>
        <div className="flex flex-col h-full">
          <NextStepsCard />
        </div>
      </div>

      <ChecklistSection />
    </LayoutWrapper>
  );
};


export default DashboardResult;

