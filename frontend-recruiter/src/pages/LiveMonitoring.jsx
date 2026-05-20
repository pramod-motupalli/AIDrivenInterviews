import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Mock data for initial states
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "ai",
    text: "Welcome to the interview! Can you please explain your experience with React and state management?",
    timestamp: "10:00 AM",
  },
];

const MOCK_SCORES = [
  { name: "Technical Knowledge", score: 84, trend: "up" },
  { name: "Communication", score: 92, trend: "steady" },
  { name: "Confidence", score: 88, trend: "up" },
  { name: "Problem Solving", score: 75, trend: "down" },
  { name: "Behavioral Analysis", score: 89, trend: "up" },
];

const MOCK_INSIGHTS = [
  "Candidate demonstrates strong React understanding.",
  "Communication clarity is above average.",
  "Response confidence detected.",
];

export default function LiveMonitoring() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState("Candidate Responding");
  const [scores, setScores] = useState(MOCK_SCORES);
  const [progress, setProgress] = useState(1);
  const [showAnalyticsMobile, setShowAnalyticsMobile] = useState(false);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Auto-scroll simulation
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock conversation simulation
  useEffect(() => {
    let timeoutId;
    let timeoutId2;
    let timeoutId3;

    // Simulate Candidate typing/responding
    timeoutId = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 2,
          role: "candidate",
          text: "Yes! I've been using React for about 3 years. For state management, I typically use Redux Toolkit for complex global state, and Zustand for lighter applications.",
          timestamp: "10:01 AM",
        },
      ]);
      setStatus("Processing Response");

      // Simulate AI processing and generating question
      timeoutId2 = setTimeout(() => {
        setStatus("AI Speaking");
        setProgress(2);
        setScores((prev) => prev.map(s => s.name === "Technical Knowledge" ? { ...s, score: 88 } : s));

        setMessages((prev) => [
          ...prev,
          {
            id: 3,
            role: "ai",
            text: "That's great. Can you elaborate on why you might choose Zustand over Redux for a specific project?",
            timestamp: "10:02 AM",
          },
        ]);

        // Back to candidate
        timeoutId3 = setTimeout(() => {
          setStatus("Candidate Responding");
        }, 3000);

      }, 4000);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, []);

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col font-sans overflow-hidden pb-[env(safe-area-inset-bottom)]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-bold text-red-600 tracking-widest uppercase">
              LIVE
            </span>
          </div>
          <div className="h-5 w-px bg-gray-300 mx-1 sm:mx-2"></div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
              Sarah Jenkins
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
              Frontend Developer • Session ID: {sessionId || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1.5 bg-gray-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[10px] sm:text-xs md:text-sm font-bold text-gray-700">
            <span className="material-symbols-outlined text-[14px] sm:text-[16px] md:text-[18px]">timer</span>
            {formatTime(elapsedTime)}
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-gray-200 text-gray-700 hover:bg-gray-100 font-bold px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:mr-2">
              exit_to_app
            </span>
            <span className="hidden md:inline">Exit Monitoring</span>
          </Button>
        </div>
      </header>

      {/* Main Split Screen Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-y-auto lg:overflow-hidden">
        {/* Left Column: Live Q&A Feed */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[500px] lg:min-h-0 lg:h-full">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[20px]">
                forum
              </span>
              Live Conversation Feed
            </h2>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 flex items-center gap-2 shadow-sm transition-all duration-300">
                {status === "Candidate Responding" && <span className="material-symbols-outlined text-[16px] animate-pulse">mic</span>}
                {status === "AI Speaking" && <span className="material-symbols-outlined text-[16px] animate-pulse">smart_toy</span>}
                {status === "Processing Response" && <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>}
                {status}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "ai" ? "items-start" : "items-end"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  {msg.role === "ai" ? (
                    <>
                      <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-indigo-600">
                          smart_toy
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        AI Interviewer
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-gray-500">
                        Candidate
                      </span>
                      <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-[10px]">
                        SJ
                      </div>
                    </>
                  )}
                  <span className="text-[10px] text-gray-400 font-medium">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === "ai"
                      ? "bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tl-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tr-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {status === "Candidate Responding" && (
              <div className="flex flex-col items-end animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-xs font-bold text-gray-500">Candidate</span>
                  <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-[10px]">SJ</div>
                </div>
                <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-tr-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {status === "Processing Response" && (
              <div className="flex flex-col items-start animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">smart_toy</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">AI Interviewer</span>
                </div>
                <div className="max-w-[80%] bg-indigo-50 border border-indigo-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-indigo-400 animate-spin">data_usage</span>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest animate-pulse">Analyzing Response</span>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>
          
          {/* Read Only Footer */}
          <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-200 text-center shrink-0">
             <p className="text-xs text-gray-500 font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                <span className="hidden sm:inline">Read-only mode. Recruiters cannot interact with the candidate.</span>
                <span className="sm:hidden">Read-only mode.</span>
             </p>
          </div>
        </div>

        {/* Mobile Analytics Toggle */}
        <div className="lg:hidden w-full pt-2">
          <Button 
            variant="outline" 
            className="w-full font-bold flex justify-between items-center bg-white border-gray-200 shadow-sm h-12"
            onClick={() => setShowAnalyticsMobile(!showAnalyticsMobile)}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">analytics</span>
              {showAnalyticsMobile ? 'Hide Live Analytics' : 'View Live Analytics'}
            </span>
            <span className="material-symbols-outlined text-gray-400">
              {showAnalyticsMobile ? 'expand_less' : 'expand_more'}
            </span>
          </Button>
        </div>

        {/* Right Column: Analytics & Info */}
        <div className={`lg:col-span-4 flex-col gap-6 lg:overflow-y-auto lg:pr-2 pb-6 ${showAnalyticsMobile ? 'flex animate-in slide-in-from-top-4' : 'hidden lg:flex'}`}>
          {/* Candidate Sidebar Profile */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 shrink-0">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                SJ
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 leading-tight">Sarah Jenkins</h3>
                <p className="text-xs text-gray-500 mt-0.5">sarah.jenkins@example.com</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">Round 1</span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">done_all</span> 92% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware Status */}
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100">
               <div className="flex flex-col items-center gap-1">
                 <span className="material-symbols-outlined text-[18px] text-gray-400">videocam</span>
                 <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="flex flex-col items-center gap-1">
                 <span className="material-symbols-outlined text-[18px] text-gray-400">mic</span>
                 <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active</span>
               </div>
               <div className="w-px h-8 bg-gray-200"></div>
               <div className="flex flex-col items-center gap-1">
                 <span className="material-symbols-outlined text-[18px] text-gray-400">wifi</span>
                 <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Stable</span>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                 <span className="text-xs font-bold text-gray-600">Interview Progress</span>
                 <span className="text-xs font-bold text-indigo-600">{progress} / 5</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(progress / 5) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* AI Scoring Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 shrink-0 relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
             
             <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
               <span className="material-symbols-outlined text-indigo-500 text-[20px]">analytics</span>
               Live AI Evaluation
             </h3>

             <div className="space-y-3 relative z-10">
               {scores.map((score, idx) => (
                 <div key={idx} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-100 hover:shadow-sm transition-all">
                   <span className="text-xs font-bold text-gray-700">{score.name}</span>
                   <div className="flex items-center gap-3">
                     <div className="flex items-center justify-end w-16">
                       {status === "Processing Response" ? (
                         <div className="h-5 w-10 bg-gray-200 rounded animate-pulse"></div>
                       ) : (
                         <span className="text-sm font-black text-indigo-900">{score.score}/100</span>
                       )}
                     </div>
                     {score.trend === "up" && <span className="material-symbols-outlined text-[16px] text-emerald-500">trending_up</span>}
                     {score.trend === "down" && <span className="material-symbols-outlined text-[16px] text-red-500">trending_down</span>}
                     {score.trend === "steady" && <span className="material-symbols-outlined text-[16px] text-gray-400">trending_flat</span>}
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-2xl shadow-lg border border-indigo-700 p-5 shrink-0 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl text-white">auto_awesome</span>
             </div>
             <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
               <span className="material-symbols-outlined text-indigo-300 text-[20px]">lightbulb</span>
               Real-Time Insights
             </h3>
             <div className="space-y-3 relative z-10">
                {MOCK_INSIGHTS.map((insight, idx) => (
                  <div key={idx} className="flex gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                    <span className="material-symbols-outlined text-indigo-300 text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <p className="text-xs text-indigo-50 leading-relaxed font-medium">{insight}</p>
                  </div>
                ))}
                {status === "Processing Response" && (
                   <div className="flex gap-3 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl p-3 animate-pulse">
                     <span className="material-symbols-outlined text-indigo-400/50 text-[18px] shrink-0 mt-0.5">sync</span>
                     <div className="h-3 bg-white/20 rounded w-3/4 mt-1"></div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
