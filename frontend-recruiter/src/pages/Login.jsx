import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const API_BASE = 'http://127.0.0.1:8000/api/v1/auth';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirm: '' });

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage(null);
  };

  /* ── LOGIN ─────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.role === 'candidate') {
          setMessage({ type: 'error', text: 'Access denied. Candidates cannot access the recruiter portal.' });
          return;
        }
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('role', data.role);
        navigate('/dashboard');
      } else {
        setMessage({ type: 'error', text: data.detail || 'Invalid credentials. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unable to reach the server. Please try later.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER ───────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirm) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/register/recruiter/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerForm.email, password: registerForm.password }),
      });
      const data = await res.json();
      if (res.ok || res.status === 201) {
        setMessage({ type: 'success', text: '✅ Request submitted! You will receive an email once the admin reviews your account.' });
        setRegisterForm({ email: '', password: '', confirm: '' });
      } else {
        const errText = data.email?.[0] || data.password?.[0] || data.detail || 'Registration failed.';
        setMessage({ type: 'error', text: errText });
      }
    } catch {
      setMessage({ type: 'error', text: 'Unable to reach the server. Please try later.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-surface-container-low border-outline-variant/60 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary font-body-base text-on-surface placeholder:text-outline/60 h-auto';

  return (
    <div className="font-body-base text-on-background min-h-screen flex flex-col items-center justify-center p-6 md:p-gutter relative overflow-hidden">
      <main className="w-full max-w-md flex flex-col justify-center relative z-10">
        <Card className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] border-outline-variant/30 flex flex-col overflow-hidden p-0">

          {/* ── HEADER ── */}
          <CardHeader className="px-10 pt-10 pb-6 text-center border-none">
            <div className="mb-5 flex justify-center">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-on-primary text-3xl">neurology</span>
              </div>
            </div>

            {/* Tab Toggle */}
            <div className="flex rounded-xl bg-surface-container p-1 gap-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'register'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Request Access
              </button>
            </div>

            {/* Subtitle */}
            <p className="mt-4 text-on-surface-variant font-body-base">
              {mode === 'login'
                ? 'Enter your credentials to access your dashboard.'
                : 'Submit a request — the admin will review and approve your account.'}
            </p>
          </CardHeader>

          {/* ── FORM ── */}
          <CardContent className="px-10 pb-10">

            {/* Status message */}
            {message && (
              <div
                className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {mode === 'login' && (
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="flex flex-col gap-2">
                  <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="login-email">
                    Email Address
                  </label>
                  <Input
                    id="login-email"
                    placeholder="recruiter@company.ai"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="login-password">
                      Password
                    </label>
                    <a className="font-body-sm text-body-sm text-primary font-medium hover:underline transition-colors" href="#">
                      Forgot Password?
                    </a>
                  </div>
                  <Input
                    id="login-password"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 mt-2 bg-primary text-on-primary font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all h-auto"
                >
                  {loading ? 'Signing in…' : 'Sign In →'}
                </Button>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {mode === 'register' && (
              <form className="space-y-5" onSubmit={handleRegister}>
                <div className="flex flex-col gap-2">
                  <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="reg-email">
                    Work Email
                  </label>
                  <Input
                    id="reg-email"
                    placeholder="recruiter@company.ai"
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="reg-password">
                    Create Password
                  </label>
                  <Input
                    id="reg-password"
                    placeholder="Min. 8 characters"
                    type="password"
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="reg-confirm">
                    Confirm Password
                  </label>
                  <Input
                    id="reg-confirm"
                    placeholder="Re-enter password"
                    type="password"
                    required
                    value={registerForm.confirm}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 mt-2 bg-primary text-on-primary font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all h-auto"
                >
                  {loading ? 'Submitting…' : 'Submit Access Request →'}
                </Button>

                <p className="text-center text-xs text-on-surface-variant pt-1">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')} className="text-primary font-semibold hover:underline">
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-primary-fixed-dim/30 blur-[150px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-1/2 h-1/2 bg-tertiary-fixed-dim/20 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
