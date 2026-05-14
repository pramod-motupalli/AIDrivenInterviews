import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Video, Settings, Wifi, ChevronRight, Shield } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';

const wrStyles = `
  .wr-page {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    color: #1e293b;
  }
  .wr-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 48px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .wr-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 800; font-size: 19px; color: #0f172a; letter-spacing: -0.03em;
  }
  .wr-badge {
    padding: 6px 16px; border-radius: 20px;
    font-size: 12px; font-weight: 700;
    background: #eff6ff; color: #2563EB;
    border: 1px solid #dbeafe;
  }

  .wr-main {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 64px 48px;
  }
  .wr-container {
    width: 100%; max-width: 1200px;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 40px;
    align-items: start;
  }

  /* Left: Preview Card */
  .wr-preview-card {
    background: #fff;
    border-radius: 24px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .wr-video-wrap {
    position: relative;
    background: #020617;
    aspect-ratio: 16/10;
    width: 100%;
  }
  .wr-video-wrap video {
    width: 100%; height: 100%; object-fit: cover;
  }
  .wr-video-overlay {
    position: absolute; top: 20px; left: 20px;
  }
  .wr-status-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 16px;
    font-size: 12px; font-weight: 600;
    background: rgba(22, 163, 74, 0.1); color: #16a34a;
    border: 1px solid rgba(22, 163, 74, 0.2);
    backdrop-filter: blur(12px);
  }
  
  .wr-video-controls {
    position: absolute; bottom: 24px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 14px;
  }
  .wr-ctrl-btn {
    width: 50px; height: 50px; border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .wr-ctrl-btn:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }

  /* Right: Info Cards */
  .wr-info-stack { display: flex; flex-direction: column; gap: 20px; }
  .wr-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    padding: 28px 32px;
  }
  
  .wr-countdown-label {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px;
  }
  .wr-countdown-val {
    font-size: 48px; font-weight: 800; color: #0f172a;
    letter-spacing: -0.04em; line-height: 1;
  }
  .wr-countdown-sub { font-size: 14px; color: #64748b; margin-top: 10px; }
  
  .wr-role-name { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .wr-role-dept { font-size: 15px; color: #64748b; }
  .wr-role-meta {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 16px; padding: 6px 12px; border-radius: 8px;
    background: #f1f5f9; font-size: 12px; font-weight: 600; color: #475569;
  }
  
  .wr-int-row { display: flex; align-items: center; gap: 18px; }
  .wr-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: #eff6ff; display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    color: #2563EB; font-weight: 800; font-size: 16px;
  }
  .wr-int-name { font-size: 16px; font-weight: 700; color: #0f172a; }
  .wr-int-role { font-size: 13px; color: #64748b; margin-top: 1px; }

  .wr-join-btn {
    width: 100%; height: 60px; background: #2563EB; color: #fff;
    font-weight: 700; font-size: 17px; border: none; border-radius: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 12px; transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
  }
  .wr-join-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
  .wr-join-btn:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }
  .wr-join-note { text-align: center; font-size: 13px; color: #94a3b8; margin-top: 12px; }

  @media (max-width: 1024px) {
    .wr-container { grid-template-columns: 1fr; max-width: 640px; }
  }
`;

// Mock session start time (e.g., 1 minute from now)
const MOCK_SESSION_START = new Date(Date.now() + 1 * 60 * 1000);

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { startInterview } = useInterview();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Retrieve dynamic data from localStorage
  const jobTitle = localStorage.getItem('job_title') || 'Software Engineer';
  const interviewId = localStorage.getItem('interview_id') || 'IV-000-000';
  const recruiterName = localStorage.getItem('recruiter_name') || 'Recruiter';
  const displayInitials = recruiterName.substring(0, 2).toUpperCase();

  const handleJoin = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (startInterview) await startInterview();
    navigate('/interview');
  };

  useEffect(() => {
    const init = async () => {
      try {
        const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = ms;
        setStream(ms);
        if (videoRef.current) videoRef.current.srcObject = ms;
      } catch (err) { console.error(err); }
    };
    init();

    // Calculate initial countdown
    const calculateRemaining = () => {
      const now = new Date();
      const diff = Math.floor((MOCK_SESSION_START - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    setCountdown(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setReady(true); // Automatically set ready when timer hits zero
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="wr-page">
      <style>{wrStyles}</style>

      <header className="wr-header">
        <div className="wr-brand">
          <Shield size={20} color="#2563EB" strokeWidth={2.5} />
          <span>InterviewerAI</span>
        </div>
        <div className="wr-badge">Waiting Room</div>
      </header>

      <main className="wr-main">
        <div className="wr-container">
          {/* Left: Video Card */}
          <div className="wr-preview-card">
            <div className="wr-video-wrap">
              <video ref={videoRef} autoPlay muted playsInline />
              <div className="wr-video-overlay">
                <div className="wr-status-chip">
                  <Wifi size={14} />
                  Stable Connection
                </div>
              </div>
              <div className="wr-video-controls">
                <button className="wr-ctrl-btn"><Mic size={20} /></button>
                <button className="wr-ctrl-btn"><Video size={20} /></button>
                <button className="wr-ctrl-btn"><Settings size={20} /></button>
              </div>
            </div>
          </div>

          {/* Right: Info Panels */}
          <div className="wr-info-stack">
            <div className="wr-card">
              <div className="wr-countdown-label">
                {ready ? 'Admission Active' : 'Interview Starts In'}
              </div>
              {ready ? (
                <div className="wr-countdown-val" style={{ color: '#16a34a' }}>Ready to join</div>
              ) : (
                <>
                  <div className="wr-countdown-val">{fmtTime(countdown)}</div>
                  <div className="wr-countdown-sub">Please stay on this page to be admitted</div>
                </>
              )}
            </div>

            <div className="wr-card">
              <div className="wr-role-name">{jobTitle}</div>
              <div className="wr-role-dept">Talent Acquisition Team</div>
              <div className="wr-role-meta">ID: {interviewId} • 90 Minutes</div>
            </div>

            <div className="wr-card">
              <div className="wr-int-row">
                <div className="wr-avatar">{displayInitials}</div>
                <div>
                  <div className="wr-int-name">{recruiterName}</div>
                  <div className="wr-int-role">Interviewer</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                className="wr-join-btn"
                onClick={handleJoin}
                disabled={!ready}
              >
                Join Interview Session
                <ChevronRight size={20} />
              </button>
              <p className="wr-join-note">Make sure your hardware is still functioning correctly.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitingRoom;
