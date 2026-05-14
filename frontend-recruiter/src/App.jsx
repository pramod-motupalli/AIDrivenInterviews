import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Reports from './pages/Reports';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ReportDetail from './pages/ReportDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import React, { useEffect } from 'react';

const RedirectToCandidate = () => {
  useEffect(() => {
    window.location.replace('http://localhost:5174' + window.location.pathname);
  }, []);
  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect old session links to Candidate Portal */}
        <Route path="/interview/:token" element={<RedirectToCandidate />} />
        <Route path="/" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/report/:id" element={<ReportDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
