import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ApplicationRoadmap = ({ currentStep }) => {
  const steps = [
    { id: 'invitation', title: 'Invitation' },
    { id: 'system-check', title: 'System Check' },
    { id: 'interview', title: 'Interview' },
    { id: 'feedback', title: 'Feedback' },
    { id: 'review', title: 'Review' },
    { id: 'decision', title: 'Decision' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const isFuture = index > currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center min-w-[100px] relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 shadow-md scale-110' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-[11px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                    isActive ? 'text-indigo-600' :
                    isCompleted ? 'text-slate-800' :
                    'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>

                {index !== steps.length - 1 && (
                  <div className="flex-1 min-w-[20px] h-[2px] bg-slate-100 mx-2 -mt-6">
                    <div className={`h-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500 w-full' : 
                      (isActive ? 'bg-slate-100 w-0' : 'bg-slate-100 w-0')
                    }`}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationRoadmap;
