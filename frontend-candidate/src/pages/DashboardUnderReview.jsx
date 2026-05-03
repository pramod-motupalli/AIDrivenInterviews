import React, { useEffect } from 'react';
import { 
  CheckCircle2, Clock, Briefcase, Bot, UserCheck, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../components/LayoutWrapper';


const ApplicationCard = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-indigo-500 w-full">
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Active Application
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Senior UX Designer</h2>
        <div className="flex items-center gap-2 text-slate-500">
          <Briefcase size={16} />
          <span>TechCorp Innovations</span>
        </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-4 flex flex-col items-center justify-center min-w-[160px]">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Status</span>
        <span className="text-indigo-700 font-bold text-lg">Under Review</span>
      </div>
    </div>
    
    <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 border border-slate-100">
      <Clock className="text-slate-400 shrink-0 mt-0.5" size={18} />
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        Your interview responses and feedback have been successfully submitted. Our team is currently reviewing your application. You can expect an update within the next 3-5 business days.
      </p>
    </div>
  </div>
);

const InsightsCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-full flex flex-col">
    <h3 className="text-xl font-bold text-slate-800 mb-6">Evaluation Insights</h3>
    <div className="space-y-6 flex-1">
      <div className="border-l-4 border-indigo-500 pl-5">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={18} className="text-indigo-500" />
          <h4 className="font-bold text-slate-800">AI Processing Status</h4>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          Initial analysis of your interview responses is complete. The system has prepared a summary of your technical and soft skills alignment for the human reviewer.
        </p>
      </div>

      <div className="border-l-4 border-green-500 pl-5">
        <div className="flex items-center gap-2 mb-2">
          <UserCheck size={18} className="text-green-500" />
          <h4 className="font-bold text-slate-800">Human Reviewer</h4>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          Assigned to hiring manager. The review is currently in progress. Final evaluation will combine both technical assessment and cultural fit.
        </p>
      </div>
    </div>
  </div>
);

const NextStepsCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#4F46E5] rounded-2xl p-8 text-white shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-4">What's Next?</h3>
        <p className="text-indigo-100 text-[15px] leading-relaxed mb-8">
          We're carefully reviewing your entire application package. If your profile is a strong match for this role, our recruiting team will reach out to schedule a final round interview.
        </p>
      </div>
      <button 
        onClick={() => navigate('/result')}
        className="bg-white text-indigo-600 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm w-max relative z-10 text-sm"
      >
        View Final Decision <ArrowRight size={18} />
      </button>
    </div>
  );
};

const DashboardUnderReview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/result');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <LayoutWrapper title="Candidate Dashboard" currentStep="review">
      <ApplicationCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pt-2">
        <div className="flex flex-col h-full">
          <InsightsCard />
        </div>
        <div className="flex flex-col h-full">
          <NextStepsCard />
        </div>
      </div>
    </LayoutWrapper>
  );
};


export default DashboardUnderReview;

