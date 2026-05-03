import React, { useState } from 'react';
import { Mail, Lock, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }

    // Success: Navigate to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F9FF] to-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900">TalentAI</h1>
          <p className="text-gray-500 text-sm">Calmly navigate your career journey.</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Email address
            </label>
            <div className="flex items-center bg-[#F1F5F9] rounded-lg px-3 py-2">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Password
            </label>
            <div className="flex items-center bg-[#F1F5F9] rounded-lg px-3 py-2">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="text-gray-400 hover:text-gray-600">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {/* Login Button */}
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateLogin;
