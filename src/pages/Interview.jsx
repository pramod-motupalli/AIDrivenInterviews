import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { 
  Bot, 
  Mic, 
  Video, 
  ChevronRight, 
  Clock, 
  User, 
  LogOut, 
  Circle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

const interviewStyles = `
  .interview-page {
    min-height: 100vh;
    background: #F8F9FB;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    color: #1A1C1E;
    overflow-x: hidden;
  }

  /* Top Navigation */
  .nav-bar {
    height: 72px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    border-bottom: 1px solid #E2E8F0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .nav-left { display: flex; align-items: center; gap: 20px; }
  .logo-text { font-size: 20px; font-weight: 800; color: #2563EB; letter-spacing: -0.02em; }
  
  .timer-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #EFF6FF;
    color: #2563EB;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
  }

  .nav-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 320px;
  }
  .progress-label { font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
  .progress-bar-wrap { width: 100%; height: 6px; background: #F1F5F9; border-radius: 10px; overflow: hidden; position: relative; }
  .progress-bar-fill { height: 100%; background: #2563EB; transition: width 0.6s ease; }
  .progress-text { font-size: 11px; font-weight: 600; color: #94A3B8; margin-top: 4px; }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .user-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748B;
    background: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .user-btn:hover { border-color: #2563EB; color: #2563EB; }

  /* Main Area */
  .conversation-container {
    flex: 1;
    margin-top: 72px;
    margin-bottom: 120px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }

  .timeline {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  /* Shared Block Components */
  .block-row { display: flex; gap: 24px; width: 100%; }
  .avatar-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ai-avatar { background: #EFF6FF; color: #2563EB; }
  .cand-avatar { background: #F1F5F9; color: #64748B; overflow: hidden; }
  .cand-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .content-card {
    flex: 1;
    background: #FFFFFF;
    border-radius: 20px;
    border: 1px solid #E2E8F0;
    padding: 32px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .author-label { font-size: 14px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
  .category-badge {
    background: #F8FAFC;
    color: #475569;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid #E2E8F0;
  }

  .question-text { font-size: 17px; line-height: 1.7; color: #334155; margin: 0; }
  
  /* Candidate Response Block */
  .response-card {
    background: #F8FAFC;
    border: none;
    border-radius: 20px;
    padding: 32px;
  }
  .candidate-meta { margin-bottom: 8px; }
  .candidate-name { font-size: 15px; font-weight: 700; color: #1E293B; }
  .response-label { font-size: 12px; font-weight: 600; color: #94A3B8; }

  /* Active Question Block */
  .active-block .content-card {
    background: #FFFFFF;
    border: 1.5px solid #2563EB;
    box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.08);
    position: relative;
  }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #2563EB;
    color: #FFFFFF;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 800;
    margin-left: 12px;
    text-transform: uppercase;
  }
  
  .active-question-text {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    color: #0F172A;
    margin-top: 10px;
  }

  /* Active Transcribing Block */
  .transcribing-card {
    border: 1.5px dashed #CBD5E1;
    background: #FFFFFF;
    min-height: 120px;
    display: flex;
    align-items: flex-start;
  }
  .transcribing-status {
    color: #2563EB;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 12px;
  }
  .dot-blink {
    width: 6px; height: 6px; background: #2563EB; border-radius: 50%;
    animation: blink 1.2s infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

  /* Waveform */
  .waveform-container {
    position: fixed;
    bottom: 96px;
    left: 0;
    right: 0;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 50;
  }
  .wave-svg { width: 600px; height: 40px; }
  .wave-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    font-size: 11px;
    font-weight: 800;
    color: #2563EB;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .wave-path {
    animation: wave-sway 4s ease-in-out infinite;
  }
  @keyframes wave-sway {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.5); }
  }

  /* Bottom Bar */
  .bottom-bar {
    height: 88px;
    background: #FFFFFF;
    border-top: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .finish-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94A3B8;
    font-weight: 600;
    font-size: 14px;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .finish-btn:hover { color: #64748B; }

  .mic-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #2563EB;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563EB;
    cursor: pointer;
    transition: all 0.2s;
  }
  .mic-btn:hover { background: #F8FAFC; transform: scale(1.05); }
  .mic-btn.active { background: #2563EB; color: #FFFFFF; }

  .next-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #2563EB;
    color: #FFFFFF;
    padding: 14px 28px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  .next-btn:hover { background: #1D4ED8; transform: translateY(-1px); }
  .next-btn:disabled { background: #CBD5E1; cursor: not-allowed; transform: none; box-shadow: none; }
`;

const ActiveInterview = () => {
  const navigate = useNavigate();
  const context = useInterview();
  
  // Destructure with safety
  const { 
    questions = [], 
    currentIndex = 0, 
    currentQuestion = null, 
    loading = false, 
    isComplete = false,
    startInterview,
    submitAnswer, 
    nextQuestion 
  } = context || {};
  
  const [transcript, setTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour mock
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [history, setHistory] = useState([]);

  // Auto-navigate to submission when complete
  useEffect(() => {
    if (isComplete) {
      navigate('/submission');
    }
  }, [isComplete, navigate]);

  // Auto-initialize interview if questions are empty
  useEffect(() => {
    if (questions.length === 0 && !loading && startInterview) {
      startInterview();
    }
  }, [questions.length, loading, startInterview]);

  // Timer logic - stabilized
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update history logic - robustly handle changes
  useEffect(() => {
    if (currentIndex > 0 && questions && questions[currentIndex - 1]) {
      const lastQ = questions[currentIndex - 1];
      
      // Prevent duplicates in history if effect runs multiple times
      setHistory(prev => {
        // Check if the last item in history is already this question
        const isAlreadyAdded = prev.some(h => h.type === 'ai' && h.question === lastQ.text);
        if (isAlreadyAdded) return prev;

        return [
          ...prev,
          {
            type: 'ai',
            question: lastQ.text,
            category: lastQ.category || 'EXPERIENCE'
          },
          {
            type: 'candidate',
            response: "I've led several complex React-based projects where performance was critical. We used custom hooks and code-splitting to ensure a smooth user experience even with heavy data loads."
          }
        ];
      });
    }
  }, [currentIndex, questions]);

  const formatTime = useMemo(() => (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  const handleNext = async () => {
    if (!transcript.trim()) return;
    try {
      if (currentQuestion && currentQuestion.id) {
        await submitAnswer(currentQuestion.id, transcript);
      }
      setTranscript('');
      nextQuestion();
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const progressPercent = useMemo(() => {
    if (!questions || questions.length === 0) return 0;
    const limit = Math.min(questions.length, 5);
    return Math.round(((currentIndex + 1) / limit) * 100);
  }, [currentIndex, questions]);

  // Handle loading or missing data state gracefully
  if (loading || !currentQuestion || !questions.length) {
    return (
      <div className="interview-page flex items-center justify-center min-h-screen">
        <style>{interviewStyles}</style>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initialising Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page">
      <style>{interviewStyles}</style>

      {/* Top Nav */}
      <nav className="nav-bar">
        <div className="nav-left">
          <span className="logo-text">InterviewAI</span>
          <div className="timer-pill">
            <Clock size={16} strokeWidth={2.5} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="nav-center">
          <span className="progress-label">Question {currentIndex + 1} of {Math.min(questions.length, 5)}</span>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="progress-text">{progressPercent}% Complete</span>
        </div>

        <div className="nav-right">
          <button className="user-btn">
            <User size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="conversation-container">
        <div className="timeline">
          
          {/* Previous Blocks */}
          {history.map((item, idx) => (
            <div key={`history-${idx}`} className="block-row">
              <div className={`avatar-circle ${item.type === 'ai' ? 'ai-avatar' : 'cand-avatar'}`}>
                {item.type === 'ai' ? <Bot size={22} strokeWidth={2.5} /> : <User size={22} />}
              </div>
              <div className={`content-card ${item.type === 'candidate' ? 'response-card' : ''}`}>
                {item.type === 'ai' ? (
                  <>
                    <div className="card-header">
                      <span className="author-label">AI Interviewer</span>
                      <span className="category-badge">{item.category}</span>
                    </div>
                    <p className="question-text">"{item.question}"</p>
                  </>
                ) : (
                  <>
                    <div className="candidate-meta">
                      <div className="candidate-name">Alex Thompson</div>
                      <div className="response-label">Candidate Response</div>
                    </div>
                    <p className="question-text">{item.response}</p>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Active Question Block */}
          <div className="block-row active-block">
            <div className="avatar-circle ai-avatar">
              <Bot size={22} strokeWidth={2.5} />
            </div>
            <div className="content-card">
              <div className="card-header">
                <div className="flex items-center">
                  <span className="author-label">AI Interviewer</span>
                  <div className="status-pill">Now Asking</div>
                </div>
                <span className="category-badge">{currentQuestion.category || 'TECHNICAL EXPERIENCE'}</span>
              </div>
              <h2 className="active-question-text">"{currentQuestion.text}"</h2>
            </div>
          </div>

          {/* Active Candidate Area */}
          <div className="block-row">
            <div className="flex flex-col items-center gap-3">
              <div className="avatar-circle cand-avatar">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
              </div>
              <div className="flex flex-col items-center">
                <span className="candidate-name text-xs">Alex Thompson</span>
                <div className="transcribing-status mt-1">
                  <div className="dot-blink" />
                  Transcribing...
                </div>
              </div>
            </div>
            <div className="content-card transcribing-card">
              <textarea
                className="w-full h-full bg-transparent border-none outline-none resize-none question-text p-0"
                placeholder="Listen carefully and respond to the interviewer..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Voice Wave Visualizer */}
      <div className="waveform-container">
        <svg className="wave-svg" viewBox="0 0 600 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
              <stop offset="50%" stopColor="rgba(37, 99, 235, 0.5)" />
              <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
            </linearGradient>
          </defs>
          {/* Static paths with CSS animations for better stability */}
          <path className="wave-path" d="M0,20 Q150,5 300,20 T600,20" fill="none" stroke="url(#waveGrad)" strokeWidth="3" strokeLinecap="round" />
          <path className="wave-path" d="M0,20 Q150,35 300,20 T600,20" fill="none" stroke="url(#waveGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.6" style={{ animationDelay: '-1s' }} />
        </svg>
        <div className="wave-label">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          Candidate Speaking
        </div>
      </div>

      {/* Bottom Control Bar */}
      <footer className="bottom-bar">
        <button className="finish-btn" onClick={() => navigate('/submission')}>
          <LogOut size={18} />
          Finish Interview
        </button>

        <div className="flex items-center gap-8">
          <button className={`mic-btn ${isSpeaking ? 'active shadow-lg shadow-blue-200' : ''}`}>
            <Mic size={24} />
          </button>
        </div>

        <button 
          className="next-btn"
          onClick={handleNext}
          disabled={!transcript.trim()}
        >
          Next Question
          <ChevronRight size={20} />
        </button>
      </footer>
    </div>
  );
};

export default ActiveInterview;
