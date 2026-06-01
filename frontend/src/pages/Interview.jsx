import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import {
  Bot, User, Clock, Mic, Pin, MoreVertical
} from 'lucide-react';
import VoiceInit from '../components/VoiceInit';
import useVoiceStream from '../hooks/useVoiceStream';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ActiveInterview = () => {
  const navigate = useNavigate();
  const context = useInterview();

  const {
    questions = [],
    currentIndex = 0,
    currentQuestion = null,
    answers = {},
    isComplete = false,
    loading = false,
    submitAnswer,
    startInterview,
    finishInterview
  } = context || {};

  const [transcript, setTranscript] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState(null);
  const [terminationMessage, setTerminationMessage] = useState(null);
  const [model, setModel] = useState(null);

  const videoRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initX: 0, initY: 0 });

  // Stable ref so silence callback always calls the latest handleSilenceSubmit
  const handleSilenceSubmitRef = useRef(null);
  const utteranceRef = useRef(null);

  const { isListening, amplitude, startListening, stopListening, transcript: voiceTranscript } = useVoiceStream({
    onSilenceDetected: useCallback((text) => handleSilenceSubmitRef.current?.(text), []),
  });

  const candidateName = localStorage.getItem('candidate_name') || 'MACHA MADHAVI';

  useEffect(() => {
    if (voiceTranscript !== undefined) setTranscript(voiceTranscript);
  }, [voiceTranscript]);

  useEffect(() => {
    // If the page is refreshed, state is lost. 
    // This auto-resumes the session from the backend if it's not already loading.
    if (questions.length === 0 && !loading && startInterview) {
      startInterview();
    }
  }, [questions.length, loading, startInterview]);

  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => {
        setWarningMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage]);

  // Camera & Timer
  useEffect(() => {
    const initCamera = async () => {
      try {
        // Request audio alongside video to guarantee microphone permissions are granted upfront.
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera failed:", err);
      }
    };
    initCamera();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isComplete) navigate('/submission');
  }, [isComplete, navigate]);

  // Mobile Detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const reportAnomaly = async (eventType, severity, terminate = false, imageBlob = null) => {
    try {
      const token = localStorage.getItem('interview_session_token');
      if (!token) return;

      const formData = new FormData();
      formData.append('token', token);
      formData.append('event_type', eventType);
      formData.append('severity', severity);
      formData.append('terminate', terminate);
      
      if (imageBlob) {
        formData.append('image', imageBlob, 'snapshot.png');
      }

      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      await fetch(`${API_BASE}/interviews/anomaly/`, {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.error("Failed to report anomaly", err);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isComplete && !terminationMessage) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        
        const willTerminate = newCount >= 3;
        const captureAndReport = () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
              reportAnomaly('Tab Switch Warning', willTerminate ? 'high' : 'medium', willTerminate, blob);
            }, 'image/png');
          } else {
            reportAnomaly('Tab Switch Warning', willTerminate ? 'high' : 'medium', willTerminate);
          }
        };
        captureAndReport();
        
        if (willTerminate) {
          setTerminationMessage("Interview Terminated due to Malpractice: Tab Switching limit exceeded.");
          // Wait briefly before ending
          setTimeout(() => {
            navigate('/submission');
          }, 3000);
        } else {
          setWarningMessage({
            title: "Warning: Tab Switched",
            message: `Please do not switch tabs or minimize the window during the interview. Doing this ${3 - newCount} more time(s) will terminate your interview.`
          });
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isComplete, terminationMessage, navigate, tabSwitchCount]);

  useEffect(() => {
    cocoSsd.load().then(loadedModel => {
      setModel(loadedModel);
    }).catch(err => console.error("Failed to load COCO-SSD model", err));
  }, []);

  // Object Detection Loop
  useEffect(() => {
    let animationId;
    let lastDetectionTime = 0;
    // Debounce alerts so we don't spam the UI
    let lastAlertTime = 0;

    const detectFrame = async () => {
      if (!model || !videoRef.current || videoRef.current.readyState !== 4 || isComplete || terminationMessage) {
        animationId = requestAnimationFrame(detectFrame);
        return;
      }

      const now = Date.now();
      if (now - lastDetectionTime > 1500) { // Check every 1.5 seconds
        lastDetectionTime = now;
        try {
          const predictions = await model.detect(videoRef.current);
          let phones = 0;
          let people = 0;
          
          predictions.forEach(p => {
            if (p.class === 'cell phone') phones++;
            if (p.class === 'person') people++;
          });

          if (phones > 0 || people > 1) {
            const timeSinceAlert = now - lastAlertTime;
            if (timeSinceAlert > 10000) { // Only alert once every 10 seconds max
              lastAlertTime = now;
              const canvas = document.createElement('canvas');
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              
              canvas.toBlob(blob => {
                if (blob) {
                  const violationType = phones > 0 ? "Tech Object Detected (Cell Phone)" : "Multiple People Detected";
                  reportAnomaly(violationType, 'high', false, blob);
                  setWarningMessage({
                    title: `Warning: ${violationType}`,
                    message: "Please maintain a clean environment. This incident has been recorded."
                  });
                }
              }, 'image/png');
            }
          }
        } catch (err) {
          console.error("Detection error:", err);
        }
      }
      animationId = requestAnimationFrame(detectFrame);
    };

    if (model) {
      detectFrame();
    }

    return () => cancelAnimationFrame(animationId);
  }, [model, isComplete, terminationMessage]);

  const progress = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Drag Handlers
  const handleDragStart = (e) => {
    if (isPinned) return;
    dragRef.current.isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.initX = position.x;
    dragRef.current.initY = position.y;
  };

  const handleDragMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 280, dragRef.current.initX + dx)),
      y: Math.max(10, Math.min(window.innerHeight - 260, dragRef.current.initY + dy))
    });
  };

  const handleDragEnd = () => dragRef.current.isDragging = false;

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, []);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      // Cancel any ongoing TTS before mic activates to avoid feedback
      window.speechSynthesis?.cancel();
      startListening();
    }
  };

  const handleSilenceSubmit = (text) => {
    const cleanText = (text || transcript || '').trim();
    if (!cleanText || loading) return;
    submitAnswer(currentIndex, cleanText);
    setTranscript('');
    stopListening();
  };

  // Keep ref pointing to latest handleSilenceSubmit (captures fresh loading/transcript state)
  handleSilenceSubmitRef.current = handleSilenceSubmit;

  // ── TTS: speak each new question automatically ────────────────────────────
  // Runs whenever currentQuestion changes (new question arrives from Groq)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!currentQuestion?.text) return;
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    // Start mic automatically after TTS finishes speaking the question
    utterance.onend = () => {
      startListening();
    };
    utteranceRef.current = utterance; // Keep strong reference so Chrome doesn't GC mid-speech
    window.speechSynthesis?.speak(utterance);
  }, [currentQuestion?.text]); // eslint-disable-line

  const handleFinish = () => finishInterview?.();
  if (terminationMessage) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
        </div>
        <h2 className="text-2xl font-bold text-red-900 mb-2">Interview Terminated</h2>
        <p className="text-red-700 max-w-md">{terminationMessage}</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">Loading Interview...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] overflow-hidden relative">
      {/* Enhanced Gradient Background when Listening */}
      {isListening && (
        <div className="absolute bottom-0 left-0 right-0 h-[520px] pointer-events-none">
          <div
            className="absolute bottom-0 left-0 right-0 h-full"
            style={{
              background: `linear-gradient(to top, 
                #f9a8d4 0%, 
                #e0b3ff 18%, 
                #c4b5fd 35%, 
                #a5f3fc 55%, 
                #67e8f9 75%, 
                #bae6fd 100%)`,
              opacity: 0.25 + amplitude * 0.08,
              filter: 'blur(85px)',
              borderRadius: '50% 50% 0 0',
            }}
          />

          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px]"
            style={{
              background: `radial-gradient(circle at center, 
                rgba(236, 72, 153, 0.18) 0%, 
                rgba(139, 92, 246, 0.12) 50%, 
                transparent 80%)`,
              filter: 'blur(60px)',
            }}
          />

          <div
            className="absolute bottom-[98px] left-0 right-0 h-[4px]"
            style={{
              background: `linear-gradient(90deg, 
                transparent 5%, 
                #ec4899 15%, 
                #d946ef 32%, 
                #8b5cf6 50%, 
                #6366f1 68%, 
                #22d3ee 82%, 
                #67e8f9 95%, 
                transparent 100%)`,
              opacity: 0.82 + amplitude * 0.22,
              filter: 'blur(16px)',
              animation: `voiceWave ${1.5 - amplitude * 0.4}s ease-in-out infinite alternate`,
            }}
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-blue-600">InterviewAI</div>
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Clock size={18} /> {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm font-semibold text-slate-600 text-center">
              QUESTION {currentIndex + 1} OF {Math.min(questions.length, 5)}
            </div>
            <div className="w-64 sm:w-72 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-slate-400 mt-1">{progress}% Complete</div>
          </div>
        </div>
      </header>

            {/* Warnings & Malpractice Alerts */}
            {warningMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl shadow-2xl flex items-start gap-4 max-w-md animate-in slide-in-from-top-4">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
                    <div>
                        <h4 className="font-bold mb-1">{warningMessage.title}</h4>
                        <p className="text-sm">{warningMessage.message}</p>
                        <button onClick={() => setWarningMessage(null)} className="mt-3 text-xs font-bold text-amber-700 underline">Dismiss</button>
                    </div>
                </div>
            )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-32 relative z-10">
        <div className={`relative rounded-3xl p-5 sm:p-8 transition-all duration-700 
          ${isListening
            ? 'bg-white shadow-2xl shadow-blue-500/50 border border-blue-300'
            : 'bg-white shadow border-0'}`}   // ΓåÉ Removed white border when mic off
        >
          {/* Previous Questions */}
          {currentIndex > 0 && (
            <div className="mb-10 sm:mb-12 space-y-10">
              {questions.slice(0, currentIndex).map((q, idx) => {
                const answer = answers[idx];
                return (
                  <div key={idx} className="space-y-6">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
                          <div className="px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full w-fit mb-4">ASKED</div>
                          <p className="text-[19px] sm:text-[20px] leading-relaxed text-slate-800">{q.text}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center self-start mt-1">
                        <Bot size={24} className="text-blue-600" />
                      </div>
                    </div>
                    {answer && (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow">
                          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={candidateName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100">
                            <p className="text-[16px] sm:text-[17px] leading-relaxed text-slate-700 whitespace-pre-wrap">{answer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Current Question */}
          <div className="flex gap-3 mb-10">
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-5 sm:p-8 shadow border border-blue-100">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="px-5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">NOW ASKING</div>
                  <div className="px-5 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                    {currentQuestion.category || 'BEHAVIORAL'}
                  </div>
                </div>
                <p className="text-[21px] sm:text-[22px] leading-relaxed text-slate-800">
                  {currentQuestion.text}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center self-start mt-2">
              <Bot size={26} className="text-blue-600" />
            </div>
          </div>

          {/* Answer Area */}
          <div className="flex gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={candidateName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-3xl p-5 sm:p-8 min-h-[140px] border border-slate-100">
                <textarea
                  className="w-full h-full resize-none outline-none text-[16px] sm:text-[17px] leading-relaxed placeholder-slate-400"
                  placeholder="Listen carefully and respond to the interviewer..."
                  value={transcript}
                  readOnly={true}
                />
              </div>
              {isListening && (
                <div className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Listening & Transcribing...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mic Button */}
      <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={toggleMic}
          disabled={loading}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4 
            ${isListening ? 'bg-blue-50 border-blue-500 scale-110 shadow-blue-500/40' : 'bg-white border-slate-200 hover:border-blue-400'}`}
        >
          {isListening ?
            <Mic size={38} className="text-blue-500 animate-pulse" /> :
            <Mic size={38} className="text-slate-700" />
          }
        </button>
      </div>

      {/* Bottom Bar - White line removed when mic is ON */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md py-4 px-4 sm:px-6 flex justify-center items-center z-50"
        style={{
          background: `radial-gradient(ellipse 80% 160% at 50% 100%, 
            rgba(249,168,212,0.25) 0%, 
            rgba(224,179,255,0.2) 20%, 
            rgba(196,181,253,0.15) 40%, 
            rgba(165,243,252,0.1) 60%, 
            rgba(103,232,249,0.05) 80%, 
            transparent 100%)`,
        }}>

        {/* Wavy white line - Only show when mic is OFF */}
        {!isListening && (
          <div className="absolute top-[-4px] left-[5%] right-[5%] h-[8px] overflow-visible pointer-events-none">
            <svg width="100%" height="8" viewBox="0 0 1000 8" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <path
                d="M0,4 Q50,0 100,4 Q150,8 200,4 Q250,0 300,4 Q350,8 400,4 Q450,0 500,4 Q550,8 600,4 Q650,0 700,4 Q750,8 800,4 Q850,0 900,4 Q950,8 1000,4"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                  animation: 'waveShake 2s ease-in-out infinite',
                }}
              />
            </svg>
          </div>
        )}

        <button
          onClick={handleFinish}
          disabled={loading}
          className="px-6 py-3.5 text-red-600 hover:bg-red-50 font-semibold rounded-2xl transition text-sm sm:text-base"
        >
          Finish Interview
        </button>
      </div>

      {/* Draggable Video Feed */}
      <div
        className="fixed bg-black rounded-2xl overflow-hidden shadow-2xl z-50"
        style={{
          top: `${position.y || (isMobile ? 80 : 120)}px`,
          left: `${position.x || window.innerWidth - (isMobile ? 260 : 320)}px`,
          width: isMobile ? '240px' : '300px',
          aspectRatio: '16 / 9',
          cursor: isPinned ? 'default' : 'move'
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 flex gap-1 text-white z-10">
          <button onClick={() => setIsPinned(!isPinned)} className="p-1.5 hover:bg-white/20 rounded-lg">
            <Pin size={16} className={isPinned ? "fill-current" : ""} />
          </button>
          <button className="p-1.5 hover:bg-white/20 rounded-lg"><MoreVertical size={16} /></button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-0.5 rounded-full">You</div>
      </div>

      <VoiceInit />

      <style>{`
        @keyframes voiceWave {
          0% { transform: translateY(0px) scaleX(0.9); }
          100% { transform: translateY(-24px) scaleX(1.1); }
        }
        @keyframes waveShake {
          0% { transform: translateY(0px) scaleY(1); }
          25% { transform: translateY(-1px) scaleY(1.3); }
          50% { transform: translateY(1px) scaleY(0.7); }
          75% { transform: translateY(-0.5px) scaleY(1.2); }
          100% { transform: translateY(0px) scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default ActiveInterview;
