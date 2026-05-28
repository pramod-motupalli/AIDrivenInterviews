import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Contexts (Candidate-specific)
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';

// Styles
import './index.css';

// Candidate Pages & Components
import SystemCheck from './pages/SystemCheck';
import WaitingRoom from './pages/WaitingRoom';
import Interview from './pages/Interview';
import Submission from './pages/Submission';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';
import SessionHandler from './components/SessionHandler';

// Recruiter Pages & Components
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Reports from './pages/Reports';
import RecruiterProtectedRoute from './components/auth/ProtectedRoute';
import ReportDetail from './pages/ReportDetail';
import Profile from './pages/Profile';
import LiveMonitoring from './pages/LiveMonitoring';
import Notifications from './pages/Notifications';

// Candidate Context Wrapper to isolate candidate state
const CandidateWrapper = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Outlet />
      </InterviewProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ========================================================= */}
        {/* CANDIDATE FLOW (Wrapped in Candidate Auth/Interview Contexts) */}
        {/* ========================================================= */}
        <Route element={<CandidateWrapper />}>
          {/* Session Initializer */}
          <Route path="/interview/:token" element={<SessionHandler />} />

          {/* Interview flow pages */}
          <Route path="/system-check" element={<SystemCheck />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>

        {/* ========================================================= */}
        {/* RECRUITER FLOW (Default Root / dashboard pages) */}
        {/* ========================================================= */}
        {/* Recruiter Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Recruiter Pages */}
        <Route element={<RecruiterProtectedRoute />}>
          {/* Full-screen protected routes */}
          <Route path="/live-monitoring/:sessionId" element={<LiveMonitoring />} />
          {/* Redirect /recruiter/interviews/:sessionId/track links to Live Monitoring */}
          <Route path="/recruiter/interviews/:sessionId/track" element={<LiveMonitoring />} />

          {/* Main dashboard layout routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/report/:id" element={<ReportDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* ========================================================= */}
        {/* GLOBAL 404 ROUTE */}
        {/* ========================================================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
