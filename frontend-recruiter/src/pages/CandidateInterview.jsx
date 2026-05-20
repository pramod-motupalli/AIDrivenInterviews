import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

/* ─── Status badge ───────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  connecting: { label: 'Connecting…', color: 'bg-yellow-100 text-yellow-700' },
  waiting:    { label: 'Ready',       color: 'bg-blue-100 text-blue-700' },
  active:     { label: 'Live',        color: 'bg-green-100 text-green-700' },
  completed:  { label: 'Completed',   color: 'bg-gray-100 text-gray-600' },
  error:      { label: 'Error',       color: 'bg-red-100 text-red-700' },
};

export default function CandidateInterview() {
  const { token } = useParams();

  // session info
  const [sessionInfo, setSessionInfo] = useState(null);
  const [sessionError, setSessionError] = useState(null);

  // interview state
  const [phase, setPhase] = useState('login');      // login | intro | interview | done
  const [wsStatus, setWsStatus] = useState('connecting');
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [totalQuestions] = useState(5);


  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  /* ── WebSocket connection ────────────────────────────────────────── */
  const connectWs = useCallback((jwt) => {
    setWsStatus('connecting');
    const ws = new WebSocket(`${WS_BASE}/ws/interview/${token}/?token=${jwt}`);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('waiting');

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === 'question') {
        setQuestion(msg.question_text);
        setQuestionIndex(msg.question_index);
        setAnswer('');
        setSubmitting(false);
        setWsStatus('active');
        setMessages(prev => [...prev, { role: 'ai', text: msg.question_text, index: msg.question_index }]);
      } else if (msg.type === 'end_session') {
        setPhase('done');
        setWsStatus('completed');
        ws.close();
      } else if (msg.type === 'error') {
        setWsStatus('error');
        setMessages(prev => [...prev, { role: 'system', text: `⚠ ${msg.message}` }]);
      }
    };

    ws.onerror = () => setWsStatus('error');
    ws.onclose = () => { if (wsRef.current?.readyState === WebSocket.CLOSED && phase !== 'done') setWsStatus('error'); };
  }, [token, phase]);

  useEffect(() => {
    fetch(`${API_BASE}/interviews/validate-session/${token}/`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setSessionInfo(data);
          if (data.access_token) {
            setPhase('intro');
            connectWs(data.access_token);
          }
        } else {
          setSessionError(data.error || 'Invalid or expired session link.');
        }
      })
      .catch(() => setSessionError('Could not reach the server. Please try again later.'));
  }, [token, connectWs]);

  /* ── Auto-scroll chat ─────────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  /* ── Start session ───────────────────────────────────────────────── */
  const startSession = () => {
    setPhase('interview');
    wsRef.current?.send(JSON.stringify({ type: 'session_start' }));
  };

  /* ── Submit answer ───────────────────────────────────────────────── */
  const submitAnswer = () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    setMessages(prev => [...prev, { role: 'candidate', text: answer }]);
    wsRef.current?.send(JSON.stringify({
      type: 'answer',
      question_index: questionIndex,
      question_text: question,
      answer_text: answer,
    }));
  };

  /* ─────────────────────────────────────── RENDER ─── */

  // Session validation error
  if (sessionError) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Session Unavailable</h2>
        <p className="text-slate-400 text-sm">{sessionError}</p>
      </div>
    </div>
  );

  if (!sessionInfo) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const status = STATUS_CONFIG[wsStatus] || STATUS_CONFIG.connecting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{sessionInfo.job_title}</p>
            <p className="text-slate-400 text-xs">AI Interview Session</p>
          </div>
        </div>
        {phase === 'interview' && (
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>{status.label}</span>
            <span className="text-slate-400 text-xs">{questionIndex} / {totalQuestions}</span>
          </div>
        )}
      </header>



      {/* ── INTRO PHASE ── */}
      {phase === 'intro' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 w-full max-w-lg text-center">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
            <p className="text-slate-400 text-sm mb-6">Interviewing for <span className="text-blue-400 font-semibold">{sessionInfo.job_title}</span></p>
            <div className="bg-white/5 rounded-xl p-5 mb-8 text-left space-y-3">
              {[
                `${totalQuestions} questions, dynamically adapted to your answers`,
                'Type your answer clearly and in full sentences',
                'Each question builds on your previous response',
                'Take your time — there is no time limit per question',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{tip}</p>
                </div>
              ))}
            </div>
            <button onClick={startSession} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/30">
              Start Interview
            </button>
          </div>
        </div>
      )}

      {/* ── INTERVIEW PHASE ── */}
      {phase === 'interview' && (
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 gap-4">

          {/* Progress */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < questionIndex ? 'bg-blue-500' : i === questionIndex - 1 ? 'bg-blue-400' : 'bg-white/10'}`} />
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  m.role === 'ai'
                    ? 'bg-white/10 border border-white/10 text-white'
                    : m.role === 'candidate'
                    ? 'bg-blue-600 text-white'
                    : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs'
                }`}>
                  {m.role === 'ai' && (
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Question {m.index}</p>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {submitting && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Answer input */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
            <textarea
              className="w-full bg-transparent text-white text-sm placeholder-slate-500 resize-none focus:outline-none"
              rows={4}
              placeholder="Type your answer here…"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) submitAnswer(); }}
              disabled={submitting || wsStatus !== 'active'}
            />
            <div className="flex items-center justify-between sm:justify-between mt-3">
              <p className="text-slate-500 text-xs hidden sm:block">Ctrl + Enter to submit</p>
              <button
                onClick={submitAnswer}
                disabled={!answer.trim() || submitting || wsStatus !== 'active'}
                className="w-full sm:w-auto justify-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-40 flex items-center gap-2"
              >
                Submit
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DONE PHASE ── */}
      {phase === 'done' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
            <p className="text-slate-400 text-sm">Thank you for completing the interview. Your responses have been submitted and will be reviewed shortly.</p>
            <div className="mt-8 bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs">You may now close this window.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
