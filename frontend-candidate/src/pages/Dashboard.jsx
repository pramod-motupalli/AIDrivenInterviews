import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Circle, AlertCircle, CheckCircle2, ChevronRight, MapPin, Clock, Calendar, HelpCircle, ExternalLink, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LayoutWrapper from '../components/LayoutWrapper';
import api from '../api/client';

const WelcomeSection = ({ userName, jobTitle }) => (
  <div className="mb-8">
    <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">Welcome back, {userName}</h2>
    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Ready for your next step?</h1>
    <p className="text-slate-500 text-lg max-w-2xl">Your application for the {jobTitle} position is progressing well. Complete your system check to prepare for the upcoming interview.</p>
  </div>
);

const AlertBanner = () => (
  <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between shadow-sm mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
        <AlertCircle size={20} />
      </div>
      <div>
        <h4 className="font-bold text-red-900 text-sm">System Check Pending</h4>
        <p className="text-red-700 text-sm">Action required before your interview</p>
      </div>
    </div>
  </div>
);

const HorizontalRoadmap = ({ currentStepId }) => {
  const steps = [
    { id: 'invitation', title: "Invitation", status: "completed" },
    { id: 'system-check', title: "System Check", status: "active" },
    { id: 'interview', title: "Interview", status: "upcoming" },
    { id: 'feedback', title: "Feedback", status: "upcoming" },
    { id: 'review', title: "Review", status: "upcoming" },
    { id: 'decision', title: "Decision", status: "upcoming" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 w-full mb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Application Roadmap</h3>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center relative">
            {index !== steps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-[60%] right-[-40%] h-[2px] bg-slate-100 z-0">
                {step.status === 'completed' && <div className="h-full bg-indigo-500 w-full"></div>}
              </div>
            )}
            
            <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white border-2 border-transparent">
              {step.status === 'completed' ? (
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm text-white border-2 border-white">
                  <CheckCircle2 size={16} />
                </div>
              ) : step.status === 'active' ? (
                <div className="w-10 h-10 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center shadow-md ring-4 ring-indigo-50">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="w-10 h-10 bg-slate-50 border-2 border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div>
                </div>
              )}
            </div>
            
            <h4 className={`font-bold text-sm ${step.status === 'active' ? 'text-indigo-600' : step.status === 'completed' ? 'text-slate-800' : 'text-slate-400'}`}>
              {step.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

const NextStepCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl w-full flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10 flex-1">
        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3 uppercase border border-white/10">
          Action Required
        </div>
        <h3 className="text-3xl font-bold mb-3 tracking-tight">System Check</h3>
        <p className="text-indigo-100 text-base leading-relaxed max-w-2xl">
          Please complete a quick system check to ensure your camera and microphone are working correctly before your interview.
        </p>
      </div>
      <button 
        onClick={() => navigate('/system-check')}
        className="w-full md:w-auto bg-white text-indigo-700 font-bold py-4 px-8 rounded-xl shadow-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 relative z-10 whitespace-nowrap text-lg"
      >
        Start System Check <ChevronRight size={20} />
      </button>
    </div>
  );
};

const InterviewDetailsCard = ({ interviewDate, interviewTime, interviewLocation }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-full flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-6">Interview Details</h3>
      <div className="space-y-5">
        <div className="flex items-center gap-4 text-slate-600">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <Calendar size={18} />
          </div>
          <span className="font-medium">{interviewDate}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <Clock size={18} />
          </div>
          <span className="font-medium">{interviewTime}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <MapPin size={18} />
          </div>
          <span className="font-medium">{interviewLocation}</span>
        </div>
      </div>
    </div>
  </div>
);

const ChecklistCard = ({ checklist }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-full">
    <h3 className="text-lg font-bold text-slate-800 mb-6">System Checklist</h3>
    <div className="space-y-4">
      {checklist.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div className="flex items-center gap-3">
            {item.status === 'completed' ? (
              <CheckSquare className="text-green-500 shrink-0" size={20} />
            ) : (
              <Circle className="text-slate-300 shrink-0" size={20} />
            )}
            <span className="font-semibold text-slate-700">{item.task}</span>
          </div>
          {item.status === 'completed' && <span className="text-xs font-bold text-green-600 uppercase">Done</span>}
        </div>
      ))}
    </div>
  </div>
);

const HelpCard = () => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate('/help')}
      className="bg-[#EEF2FF] rounded-xl shadow-sm p-6 border border-indigo-100 h-full flex flex-col justify-between cursor-pointer hover:bg-indigo-50 hover:shadow-md transition-all group"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
            <HelpCircle size={20} />
          </div>
          <h3 className="text-xl font-bold text-indigo-900">Need Help?</h3>
        </div>
        <p className="text-indigo-700 text-[15px] leading-relaxed mb-6">
          Having trouble with the setup or have questions about the AI interview process?
        </p>
      </div>
      <button className="text-indigo-600 font-bold flex items-center gap-2 group-hover:text-indigo-800 transition-colors">
        Contact Support Center <ExternalLink size={16} />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulated API Call: api.get('/candidate/dashboard')
        // In reality, this would be: const response = await api.get('/candidate/dashboard');
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

        const mockResponse = {
          user: { name: 'Alex' },
          job: { title: 'Senior UX Designer' },
          application: { status: 'System Check Pending', currentStep: 'system-check' },
          interview: {
            date: 'October 24, 2026',
            time: '10:00 AM - 11:30 AM EST',
            location: 'Virtual (Link provided after check)'
          },
          checklist: [
            { task: 'Internet connection test', status: 'pending' },
            { task: 'Camera permission', status: 'pending' },
            { task: 'Microphone check', status: 'pending' }
          ]
        };

        setDashboardData(mockResponse);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <LayoutWrapper title="Candidate Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
          <p className="font-medium text-lg">Loading your dashboard...</p>
        </div>
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper title="Candidate Dashboard">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center font-medium">
          {error}
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper title="Candidate Dashboard" maxWidthClass="max-w-7xl">
      <WelcomeSection userName={dashboardData.user.name} jobTitle={dashboardData.job.title} />
      <AlertBanner />
      
      {/* 1. Full Width Horizontal Roadmap */}
      <HorizontalRoadmap currentStepId={dashboardData.application.currentStep} />
      
      {/* 2. Prominent Full Width Next Step Card */}
      <NextStepCard />

      {/* 3. Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="flex flex-col h-full">
          <InterviewDetailsCard 
            interviewDate={dashboardData.interview.date}
            interviewTime={dashboardData.interview.time}
            interviewLocation={dashboardData.interview.location}
          />
        </div>
        <div className="flex flex-col h-full">
          <ChecklistCard checklist={dashboardData.checklist} />
        </div>
        <div className="flex flex-col h-full">
          <HelpCard />
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Dashboard;
