import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="font-body-base text-on-background min-h-screen flex flex-col items-center justify-center p-6 md:p-gutter relative overflow-hidden">
      {/* Login Container */}
      <main className="w-full max-w-md flex flex-col justify-center relative z-10">
        {/* Card Shell */}
        <Card className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03)] border-outline-variant/30 flex flex-col overflow-hidden p-0">
          {/* Header Section */}
          <CardHeader className="px-10 pt-10 pb-8 text-center border-none">
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-on-primary text-3xl">neurology</span>
              </div>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-on-surface-variant font-body-base">Please enter your details to sign in</p>
          </CardHeader>
          
          {/* Form Content */}
          <CardContent className="px-10 pb-12">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <Input 
                    id="email" 
                    placeholder="recruiter@company.ai" 
                    type="email" 
                    className="w-full px-4 py-3.5 bg-surface-container-low border-outline-variant/60 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary font-body-base text-on-surface placeholder:text-outline/60 h-auto"
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider" htmlFor="password">Password</label>
                  <a className="font-body-sm text-body-sm text-primary font-medium hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    className="w-full px-4 py-3.5 bg-surface-container-low border-outline-variant/60 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary font-body-base text-on-surface placeholder:text-outline/60 h-auto"
                  />
                </div>
              </div>
              
              {/* Login Button (Primary) */}
              <Button 
                type="submit" 
                className="w-full py-6 mt-4 bg-primary text-on-primary font-body-base font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 h-auto"
              >
                Sign In
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-body-sm text-on-surface-variant">
                  Don't have an account? <a className="text-primary font-semibold hover:underline" href="#">Request access</a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-1/2 h-1/2 bg-primary-fixed-dim/30 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-1/2 h-1/2 bg-tertiary-fixed-dim/20 blur-[150px] rounded-full"></div>
      </div>
    </div>
  );
}
