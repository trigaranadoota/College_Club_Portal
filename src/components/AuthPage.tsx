import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { supabaseMock } from '../supabase';

interface AuthPageProps {
  onLoginSuccess: (session: any) => void;
  onTabChange: (tab: string) => void;
}

export default function AuthPage({ onLoginSuccess, onTabChange }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your college email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await supabaseMock.login(email, password);
      if (response.error) {
        setErrorMsg(response.error);
      } else {
        onLoginSuccess(response);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please confirm database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  // Automated Login Helpers for Testing
  const handleQuickLogin = async (roleEmail: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await supabaseMock.login(roleEmail, 'password123');
      if (response.error) {
        setErrorMsg(response.error);
      } else {
        onLoginSuccess(response);
      }
    } catch (err: any) {
      setErrorMsg('Failed to trigger quick-login session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Crest representation */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/10 mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          PESCE College Portal
        </h2>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in using your autonomous university credentials to manage memberships.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Core Glassmorphic Card */}
        <div className="glass-effect py-8 px-6 sm:px-10 rounded-3xl card-shadow border border-slate-205/40 dark:border-slate-800/45 transition-all duration-300">
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            
            {errorMsg && (
              <div className="p-3.5 bg-red-50/70 dark:bg-red-950/25 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg flex items-start space-x-2 text-xs font-medium">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                College Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/60 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-mono"
                  placeholder="name@pesce.ac.in"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/60 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Sign in Trigger */}
            <div>
              <button
                type="submit"
                disabled={loading}
                id="submit-auth-btn"
                className="w-full flex justify-center items-center space-x-1.5 py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Authenticating with Supabase...' : 'Secure Log In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Guidelines on auto registration */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400">
              * Any new email ending in <span className="font-semibold text-slate-500 font-mono">@pesce.ac.in</span> will auto-register as a Student for easy testing.
            </p>
          </div>

        </div>

        {/* Dynamic Sandbox Role Quick-Switch Panel */}
        <div className="mt-8 p-6 glass-effect border border-slate-205/40 dark:border-slate-800/45 rounded-3xl card-shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Evaluator Quick-Login Roles (One-Click)
            </h3>
          </div>

          <p className="text-xs text-slate-505 dark:text-slate-405 mb-4 leading-normal">
            We pre-seeded role credentials so you can play with <strong>Student</strong>, <strong>Club Admin</strong> and <strong>Super Admin</strong> dashboards immediately! Click any profile card to authenticate instantly:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Student Role */}
            <button 
              onClick={() => handleQuickLogin('student@pesce.ac.in')}
              id="quick-login-student"
              className="flex items-start text-left p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-blue-105/10 dark:bg-slate-700 rounded-lg text-blue-700 dark:text-blue-300 mr-2.5 shrink-0">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Student Account
                </span>
                <span className="block text-[10px] font-mono text-slate-500 truncate">
                  student@pesce.ac.in
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] bg-blue-50/50 dark:bg-slate-800/80 text-blue-700 dark:text-blue-400 font-bold mt-1 uppercase tracking-wider">
                  Student view
                </span>
              </div>
            </button>

            {/* Club Admin: GDSC */}
            <button 
              onClick={() => handleQuickLogin('gdsc_admin@pesce.ac.in')}
              id="quick-login-gdsc"
              className="flex items-start text-left p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-teal-100/30 dark:bg-slate-700 rounded-lg text-teal-700 dark:text-teal-300 mr-2.5 shrink-0">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  GDSC Club Admin
                </span>
                <span className="block text-[10px] font-mono text-slate-500 truncate">
                  gdsc_admin@pesce.ac.in
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] bg-teal-50/50 dark:bg-slate-800/80 text-teal-750 dark:text-teal-400 font-bold mt-1 uppercase tracking-wider">
                  Club Leader
                </span>
              </div>
            </button>

            {/* Club Admin: Cultural */}
            <button 
              onClick={() => handleQuickLogin('cultural_admin@pesce.ac.in')}
              id="quick-login-cultural"
              className="flex items-start text-left p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-indigo-100/30 dark:bg-slate-700 rounded-lg text-indigo-700 dark:text-indigo-300 mr-2.5 shrink-0">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Cultural Admin
                </span>
                <span className="block text-[10px] font-mono text-slate-500 truncate">
                  cultural_admin@pesce.ac.in
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] bg-indigo-50/50 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-400 font-bold mt-1 uppercase tracking-wider">
                  Samsthruthi Lead
                </span>
              </div>
            </button>

            {/* Super Admin */}
            <button 
              onClick={() => handleQuickLogin('superadmin@pesce.ac.in')}
              id="quick-login-super"
              className="flex items-start text-left p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white/80 dark:hover:bg-slate-800 transition-all group cursor-pointer"
            >
              <div className="p-2 bg-red-100/30 dark:bg-slate-700 rounded-lg text-red-700 dark:text-red-300 mr-2.5 shrink-0">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Super Admin
                </span>
                <span className="block text-[10px] font-mono text-slate-500 truncate">
                  superadmin@pesce.ac.in
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] bg-red-50/50 dark:bg-slate-805/80 text-red-600 dark:text-rose-400 font-bold mt-1 uppercase tracking-wider">
                  Dean of Students
                </span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
