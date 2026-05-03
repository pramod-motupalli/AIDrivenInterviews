import React, { useState } from 'react';
import { Star, Home, Video, BarChart2, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApplicationRoadmap from '../components/ApplicationRoadmap';
import api from '../api/client';

const FeedbackMain = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [difficulty, setDifficulty] = useState('Medium');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide an overall rating.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Simulated API Call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      navigate('/review');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const renderTopNav = () => (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
      <div className="font-bold text-xl text-indigo-600 tracking-tight">
        AI Interview
      </div>
      <img 
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
        alt="User Avatar" 
        className="w-9 h-9 rounded-full object-cover border border-slate-200"
      />
    </header>
  );

  const renderMobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center z-50">
      <button className="flex flex-col items-center gap-1 p-2 text-indigo-600 min-w-[64px]">
        <div className="w-12 h-8 bg-indigo-50 rounded-[12px] flex items-center justify-center">
          <Home size={20} />
        </div>
        <span className="text-[10px] font-bold mt-0.5">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 min-w-[64px] transition-colors">
        <div className="h-8 flex items-center justify-center">
          <Video size={20} />
        </div>
        <span className="text-[10px] font-medium mt-0.5">Interviews</span>
      </button>
      <button 
        onClick={() => navigate('/result')}
        className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 min-w-[64px] transition-colors"
      >
        <div className="h-8 flex items-center justify-center">
          <BarChart2 size={20} />
        </div>
        <span className="text-[10px] font-medium mt-0.5">Results</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 min-w-[64px] transition-colors">
        <div className="h-8 flex items-center justify-center">
          <User size={20} />
        </div>
        <span className="text-[10px] font-medium mt-0.5">Profile</span>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FF] font-sans flex flex-col">
      {renderTopNav()}
      <ApplicationRoadmap currentStep="feedback" />

      <main className="flex-1 px-6 pt-8 pb-32 max-w-xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Almost Done!</h1>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm mx-auto">
            Your interview has been successfully recorded. Please take a moment to share your feedback about the experience.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center font-medium text-sm">
            {error}
          </div>
        )}

        {/* Feedback Form Container */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 md:p-8 space-y-8 mb-8 border border-slate-50">
          
          {/* Section 1: Overall Rating */}
          <div className="flex flex-col items-center">
            <label className="font-bold text-slate-800 text-lg mb-4">How was your experience?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Star 
                    size={40} 
                    strokeWidth={1.5}
                    className={`transition-colors ${
                      star <= (hoveredRating || rating) 
                        ? 'fill-indigo-500 text-indigo-500' 
                        : 'fill-slate-100 text-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Difficulty Level */}
          <div>
            <label className="block font-bold text-slate-800 mb-4">Interview Difficulty</label>
            <div className="flex bg-slate-100 p-1 rounded-[12px]">
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 text-sm font-bold rounded-[10px] transition-all disabled:opacity-70 ${
                    difficulty === level 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Open Feedback */}
          <div>
            <label className="block font-bold text-slate-800 mb-4">Any additional comments?</label>
            <textarea 
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isSubmitting}
              placeholder="Type your thoughts here..."
              className="w-full border border-slate-200 rounded-[12px] p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
            ></textarea>
          </div>

        </div>

        {/* Primary Action Section */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-[12px] shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </div>

      </main>

      {renderMobileNav()}
    </div>
  );
};

export default FeedbackMain;

