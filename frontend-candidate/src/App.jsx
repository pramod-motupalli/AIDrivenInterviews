import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SystemCheck from './pages/SystemCheck'
import WaitingRoom from './pages/WaitingRoom'
import Interview from './pages/Interview'
import DashboardResult from './pages/DashboardResult'
import FeedbackMain from './pages/FeedbackMain'
import DashboardUnderReview from './pages/DashboardUnderReview'
import AIAssistance from './pages/AIAssistance'
import Settings from './pages/Settings'
import CandidateLogin from './pages/CandidateLogin'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<CandidateLogin />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/system-check" element={<SystemCheck />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/result" element={<DashboardResult />} />
          <Route path="/feedback" element={<FeedbackMain />} />
          <Route path="/review" element={<DashboardUnderReview />} />
          <Route path="/help" element={<AIAssistance />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
