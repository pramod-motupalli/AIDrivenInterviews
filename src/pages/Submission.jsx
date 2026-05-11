import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Menu, 
  User, 
  Star, 
  RefreshCcw, 
  Copy,
  ChevronRight
} from 'lucide-react';
import './Submission.css';

const Submission = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Submission Successful | Interview Portal";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Your interview has been successfully submitted. Track your application status here.");
    }
  }, []);

  const [ratings, setRatings] = useState({
    'Overall Experience': 0,
    'AI Clarity': 0,
    'Ease of Use': 0,
    'Technical Stability': 0
  });
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const trackingUrl = "https://portal.interview.ai/track/INT-2024-X92";

  const handleFeedbackSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  const handleRating = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    'Overall Experience',
    'AI Clarity',
    'Ease of Use',
    'Technical Stability'
  ];

  return (
    <div className="submission-page">
      {/* Top Navigation */}
      <nav className="submission-nav">
        <div className="nav-left">
          <Menu className="menu-icon" size={24} />
        </div>
        <div className="nav-center">
          Interview Portal
        </div>
        <div className="nav-right">
          <div className="profile-avatar">
            <User size={20} color="#9ca3af" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="submission-container">
        {/* Success Hero */}
        <section className="success-hero">
          <div className="success-badge">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1>Interview Submitted Successfully!</h1>
          <p>
            Your responses have been securely transmitted to our evaluation team. 
            You will receive a notification once the review process is complete.
          </p>
        </section>

        {/* Tracking Module */}
        <section className="tracking-module">
          <RefreshCcw className="tracking-icon" size={32} />
          <h3>Track Your Application</h3>
          <div className="tracking-field-container">
            <div className="tracking-url">{trackingUrl}</div>
            <button 
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </section>

        {/* Feedback Card */}
        <div className="feedback-card">
          {!submitted ? (
            <>
              <h2>How was your experience?</h2>
              <div className="divider" />

              <div className="rating-grid">
                {categories.map((category) => (
                  <div key={category} className="rating-row">
                    <span className="rating-label">{category}</span>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`star ${ratings[category] >= star ? 'filled' : ''}`}
                          size={24}
                          fill={ratings[category] >= star ? 'currentColor' : 'none'}
                          onClick={() => handleRating(category, star)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="comment-section">
                <label className="comment-label">Any other comments?</label>
                <textarea
                  className="comment-textarea"
                  placeholder="Share your thoughts..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                />
                <div className="char-counter">{comment.length}/500</div>
              </div>

              <div className="action-area">
                <button className="primary-button" onClick={handleFeedbackSubmit}>
                  Submit feedback
                </button>
                <button className="secondary-action" onClick={() => navigate('/login')}>
                  Skip & Close
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="success-badge" style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', color: '#2563EB', marginBottom: '24px' }}>
                <Check size={32} />
              </div>
              <h2 style={{ marginBottom: '8px' }}>Thank You!</h2>
              <p style={{ color: '#6b7280' }}>Your feedback has been recorded. Redirecting to login...</p>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <footer className="submission-footer">
          © 2024 Interview Portal • All rights reserved
        </footer>
      </main>
    </div>
  );
};

export default Submission;
