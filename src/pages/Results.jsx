import React, { useState, useEffect } from 'react';
import { interviewService } from '../api/services/interviewService';
import { Award, ChevronDown, ChevronUp, Download, FileText, CheckCircle2, Star, TrendingUp, Circle } from 'lucide-react';

const rsStyles = `
  .rs-page {
    min-height: 100vh; background: #f8fafc;
    font-family: 'Inter', -apple-system, sans-serif;
    display: flex; flex-direction: column;
    color: #1e293b;
  }
  .rs-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 48px; background: #fff; border-bottom: 1px solid #e2e8f0;
  }
  .rs-brand { font-weight: 800; font-size: 19px; color: #0f172a; display: flex; align-items: center; gap: 10px; }
  .rs-head-btn {
    display: flex; align-items: center; gap: 8px; padding: 8px 16px;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;
  }

  .rs-main { flex: 1; padding: 48px; display: flex; justify-content: center; }
  .rs-container { width: 100%; max-width: 1000px; }

  /* Summary Hero */
  .rs-hero {
    background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%);
    border-radius: 24px; padding: 48px; color: #fff; margin-bottom: 40px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15);
  }
  .rs-hero-content { flex: 1; }
  .rs-hero-label { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
  .rs-hero-title { font-size: 32px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
  .rs-hero-sub { font-size: 16px; color: rgba(255,255,255,0.9); }
  
  .rs-hero-score {
    width: 140px; height: 140px; background: rgba(255,255,255,0.1);
    backdrop-filter: blur(12px); border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .rs-score-val { font-size: 40px; font-weight: 800; }
  .rs-score-lbl { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); }

  /* Metrics Grid */
  .rs-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
  .rs-metric-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px;
    display: flex; align-items: center; gap: 16px;
  }
  .rs-metric-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .rs-m-blue { background: #eff6ff; color: #2563EB; }
  .rs-m-green { background: #f0fdf4; color: #16a34a; }
  .rs-m-orange { background: #fff7ed; color: #c2410c; }
  
  .rs-metric-lbl { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 2px; }
  .rs-metric-val { font-size: 18px; font-weight: 700; color: #0f172a; }

  /* Q&A Section */
  .rs-section-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .rs-qa-list { display: flex; flex-direction: column; gap: 16px; }
  .rs-qa-item {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;
    transition: all 0.2s;
  }
  .rs-qa-item:hover { border-color: #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); }
  .rs-qa-head {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 24px 32px; background: none; border: none; cursor: pointer; text-align: left;
  }
  .rs-qa-q { font-size: 15px; font-weight: 700; color: #1e293b; padding-right: 20px; }
  .rs-qa-body { padding: 0 32px 32px; border-top: 1px dashed #e2e8f0; margin-top: -8px; padding-top: 24px; }
  .rs-qa-a { font-size: 14px; color: #475569; line-height: 1.7; background: #f8fafc; padding: 20px; border-radius: 12px; }

  .rs-summary-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 40px;
    margin-top: 48px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  }
  .rs-summary-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .rs-summary-content { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .rs-summary-main { grid-column: span 2; }
  
  .rs-s-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: block; }
  .rs-s-text { font-size: 15px; line-height: 1.7; color: #334155; }
  
  .rs-chip-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
  .rs-chip {
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 6px;
  }
  .rs-chip-pos { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
  .rs-chip-neg { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
  
  .rs-behavior-list { display: flex; flex-direction: column; gap: 16px; }
  .rs-behavior-item { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
  .rs-behavior-lbl { font-size: 14px; color: #64748b; font-weight: 500; }
  .rs-behavior-val { font-size: 14px; color: #0f172a; font-weight: 700; }

  .rs-recommendation {
    grid-column: span 2; background: #eff6ff; border: 1px solid #dbeafe;
    padding: 24px; border-radius: 16px; display: flex; align-items: center; justify-content: space-between;
  }
  .rs-rec-label { font-size: 15px; font-weight: 700; color: #1e40af; }
  .rs-rec-badge {
    background: #2563EB; color: #fff; padding: 8px 20px; border-radius: 8px;
    font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    .rs-hero { padding: 32px; flex-direction: column; text-align: center; gap: 24px; }
    .rs-metrics { grid-template-columns: 1fr; }
    .rs-main { padding: 24px; }
    .rs-summary-content { grid-template-columns: 1fr; }
    .rs-summary-main, .rs-recommendation { grid-column: span 1; }
  }
`;

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    interviewService.getResults()
      .then(d => { setResults(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rs-load-wrap">
        <style>{rsStyles}</style>
        <div className="rs-spinner" />
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="rs-page">
      <style>{rsStyles}</style>

      <header className="rs-header">
        <div className="rs-brand">
          <Award size={22} color="#2563EB" />
          <span>InterviewerAI</span>
        </div>
        <button className="rs-head-btn">
          <Download size={16} />
          Export Report
        </button>
      </header>

      <main className="rs-main">
        <div className="rs-container">
          {/* Summary Hero */}
          <div className="rs-hero">
            <div className="rs-hero-content">
              <div className="rs-hero-label">Evaluation Complete</div>
              <h1 className="rs-hero-title">Great work, {results.candidateName}!</h1>
              <p className="rs-hero-sub">Your interview for <strong>{results.role}</strong> has been processed.</p>
            </div>
            <div className="rs-hero-score">
              <span className="rs-score-val">{results.overallScore}%</span>
              <span className="rs-score-lbl">Overall Match</span>
            </div>
          </div>

          {/* Metric Snapshots */}
          <div className="rs-metrics">
            <div className="rs-metric-card">
              <div className="rs-metric-icon rs-m-blue"><Star size={20} /></div>
              <div>
                <div className="rs-metric-lbl">Confidence</div>
                <div className="rs-metric-val">{results.confidence || 'High'}</div>
              </div>
            </div>
            <div className="rs-metric-card">
              <div className="rs-metric-icon rs-m-green"><TrendingUp size={20} /></div>
              <div>
                <div className="rs-metric-lbl">Clarity</div>
                <div className="rs-metric-val">{results.clarity || 'Exceptional'}</div>
              </div>
            </div>
            <div className="rs-metric-card">
              <div className="rs-metric-icon rs-m-orange"><FileText size={20} /></div>
              <div>
                <div className="rs-metric-lbl">Response Time</div>
                <div className="rs-metric-val">{results.responseTime || 'Optimal'}</div>
              </div>
            </div>
          </div>

          {/* Interview Content */}
          <div className="rs-section-title">
            <CheckCircle2 size={22} color="#2563EB" />
            Interview Transcripts & Analysis
          </div>

          <div className="rs-qa-list">
            {(results.responses || []).map((resp, i) => (
              <div key={i} className="rs-qa-item">
                <button
                  className="rs-qa-head"
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                >
                  <span className="rs-qa-q">{resp.question}</span>
                  {expandedQ === i ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                </button>
                {expandedQ === i && (
                  <div className="rs-qa-body">
                    <div className="rs-qa-a">
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Candidate Response</div>
                      {resp.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall Interview Summary Section */}
          <div className="rs-summary-card">
            <div className="rs-summary-title">
              < Award size={22} color="#2563EB" />
              Overall Interview Summary
            </div>

            <div className="rs-summary-content">
              <div className="rs-summary-main">
                <span className="rs-s-label">Overall Performance Summary</span>
                <p className="rs-s-text">
                  {results.overallSummary || 
                    `${results.candidateName} demonstrated a high level of proficiency during the interview. Their communication was consistently clear and articulate, showing a strong grasp of technical concepts and practical application. They displayed significant confidence when tackling complex problem-solving scenarios and maintained professional engagement throughout the session.`}
                </p>
              </div>

              <div>
                <span className="rs-s-label">Strengths Identified</span>
                <div className="rs-chip-grid">
                  {(results.strengths || ['Strong React knowledge', 'Clear communication', 'Good problem-solving approach']).map((s, i) => (
                    <div key={i} className="rs-chip rs-chip-pos">
                      <CheckCircle2 size={14} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="rs-s-label">Improvement Areas</span>
                <div className="rs-chip-grid">
                  {(results.improvements || ['Could provide more architectural depth', 'Improve response structure']).map((s, i) => (
                    <div key={i} className="rs-chip rs-chip-neg">
                      <Circle size={14} style={{ opacity: 0.5 }} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rs-summary-main">
                <span className="rs-s-label">Behavioral Insights</span>
                <div className="rs-behavior-list">
                  <div className="rs-behavior-item">
                    <span className="rs-behavior-lbl">Communication Style</span>
                    <span className="rs-behavior-val">{results.behavioral?.communication || 'Articulate & Professional'}</span>
                  </div>
                  <div className="rs-behavior-item">
                    <span className="rs-behavior-lbl">Confidence Level</span>
                    <span className="rs-behavior-val">{results.behavioral?.confidence || 'High'}</span>
                  </div>
                  <div className="rs-behavior-item">
                    <span className="rs-behavior-lbl">Response Consistency</span>
                    <span className="rs-behavior-val">{results.behavioral?.consistency || 'Very Consistent'}</span>
                  </div>
                  <div className="rs-behavior-item">
                    <span className="rs-behavior-lbl">Engagement Quality</span>
                    <span className="rs-behavior-val">{results.behavioral?.engagement || 'Active Listener'}</span>
                  </div>
                </div>
              </div>

              <div className="rs-recommendation">
                <span className="rs-rec-label">AI Recommendation / Hiring Signal</span>
                <div className="rs-rec-badge">{results.hiringSignal || 'Strong Match'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
