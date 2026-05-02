import React from 'react';
import { 
  Bot, Settings, Clock, Video, FileText, UserCheck, CheckCircle2 
} from 'lucide-react';
import LayoutWrapper from '../components/LayoutWrapper';

const AIAssistance = () => {
  const steps = [
    {
      id: 1,
      title: 'Dashboard: Start',
      description: 'Your central hub. Click "Start System Check" when you are ready to begin.',
      icon: <CheckCircle2 className="text-indigo-600" size={24} />,
      color: 'bg-indigo-100'
    },
    {
      id: 2,
      title: 'System Check: Verify Devices',
      description: 'The platform ensures your camera, microphone, and internet are optimized.',
      icon: <Settings className="text-blue-600" size={24} />,
      color: 'bg-blue-100'
    },
    {
      id: 3,
      title: 'Waiting Room: Prepare',
      description: 'Take a breath. Review final tips before the AI interviewer connects.',
      icon: <Clock className="text-purple-600" size={24} />,
      color: 'bg-purple-100'
    },
    {
      id: 4,
      title: 'Interview: Answer Questions',
      description: 'The AI will ask behavioral and technical questions based on the role.',
      icon: <Video className="text-pink-600" size={24} />,
      color: 'bg-pink-100'
    },
    {
      id: 5,
      title: 'Feedback: Submit',
      description: 'Share your experience. Let us know how the AI interviewer performed.',
      icon: <FileText className="text-orange-600" size={24} />,
      color: 'bg-orange-100'
    },
    {
      id: 6,
      title: 'Review: Under Evaluation',
      description: 'Our AI processes your responses to summarize your strengths for the human reviewer.',
      icon: <Bot className="text-teal-600" size={24} />,
      color: 'bg-teal-100'
    },
    {
      id: 7,
      title: 'Decision: Final Result',
      description: 'View your final evaluation insights, scores, and next steps in the process.',
      icon: <UserCheck className="text-green-600" size={24} />,
      color: 'bg-green-100'
    }
  ];

  return (
    <LayoutWrapper title="AI Assistance Guide" breadcrumbs={['Dashboard', 'AI Assistance Guide']}>
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Understanding the Process</h1>
        <p className="text-slate-500 text-lg">
          The AI interview platform is designed to make your interview process seamless and objective. Here is the step-by-step guide on what to expect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color}`}>
              {step.icon}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Step {step.id}</div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </LayoutWrapper>
  );
};

export default AIAssistance;
