import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import './index.css';

import SystemCheck from './pages/SystemCheck';
import WaitingRoom from './pages/WaitingRoom';
import Interview from './pages/Interview';
import Submission from './pages/Submission';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <BrowserRouter>
          <Routes>
            {/* Interview Flow — Public (no auth required) */}
            <Route path="/system-check" element={<SystemCheck />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/submission" element={<Submission />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Results Access — Auth required */}
            <Route path="/login" element={<Login />} />
            <Route path="/results" element={
              <ProtectedRoute><Results /></ProtectedRoute>
            } />

            {/* Entry point is system-check */}
            <Route path="/" element={<Navigate to="/system-check" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;

