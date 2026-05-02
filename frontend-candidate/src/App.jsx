import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SystemCheck from './pages/SystemCheck'
import WaitingRoom from './pages/WaitingRoom'
import Interview from './pages/Interview'
import DashboardResult from './pages/DashboardResult'
import FeedbackMain from './pages/FeedbackMain'
import DashboardUnderReview from './pages/DashboardUnderReview'
import AIAssistance from './pages/AIAssistance'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/system-check" element={<SystemCheck />} />
        <Route path="/waiting-room" element={<WaitingRoom />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<DashboardResult />} />
        <Route path="/feedback" element={<FeedbackMain />} />
        <Route path="/review" element={<DashboardUnderReview />} />
        <Route path="/help" element={<AIAssistance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
