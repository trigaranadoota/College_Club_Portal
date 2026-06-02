import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  Sparkles,
  Info
} from 'lucide-react';
import { supabaseMock } from '../supabase';

interface AuthPageProps {
  onLoginSuccess: (session: any) => void;
  onTabChange: (tab: string) => void;
}

export default function AuthPage({ onLoginSuccess, onTabChange }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (loginMethod === 'password') {
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
    } else {
      // OTP Authentication Mode
      if (!isOtpSent) {
        if (!email.trim()) {
          setErrorMsg('Please enter your email address to receive a secure code.');
          return;
        }
        setLoading(true);
        try {
          const res = await supabaseMock.sendOTP(email);
          if (res.success) {
            setIsOtpSent(true);
            setSimulatedCode(res.code);
            setSuccessMsg(`We simulated sending a 6-digit confirmation code.`);
          } else {
            setErrorMsg(res.error || 'Failed to dispatch verification code.');
          }
        } catch (err: any) {
          setErrorMsg('An error occurred. Please verify your internet connection.');
        } finally {
          setLoading(false);
        }
      } else {
        if (!otpCode.trim()) {
          setErrorMsg('Please enter the 6-digit OTP code to continue.');
          return;
        }
        setLoading(true);
        try {
          const response = await supabaseMock.verifyOTP(email, otpCode);
          if (response.error) {
            setErrorMsg(response.error);
          } else {
            onLoginSuccess(response);
          }
        } catch (err: any) {
          setErrorMsg('Invalid code entered. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleResetOtpState = () => {
    setIsOtpSent(false);
    setOtpCode('');
    setSimulatedCode(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          PESCE College Portal
        </h2>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in using your autonomous university credentials to manage memberships.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Core Glassmorphic Card */}
        <div className="bg-gradient-to-br from-white via-[#faf6ec] to-[#f4e8cf] text-slate-900 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-[#e1d3bc] transition-all duration-300">
          
          {/* Authentic tab controller */}
          <div className="flex p-1 bg-[#ecdcb9]/55 rounded-2xl mb-6 border border-[#cca785]/20">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); handleResetOtpState(); }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                loginMethod === 'password'
                  ? 'bg-[#3c2214] text-white shadow-md'
                  : 'text-[#3c2214]/70 hover:text-[#3c2214] hover:bg-white/30'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); handleResetOtpState(); }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                loginMethod === 'otp'
                  ? 'bg-[#3c2214] text-white shadow-md'
                  : 'text-[#3c2214]/70 hover:text-[#3c2214] hover:bg-white/30'
              }`}
            >
              Email OTP Login
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            
            {errorMsg && (
              <div className="p-3.5 bg-red-50/70 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start space-x-2 text-xs font-medium">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50/80 border-l-4 border-emerald-500 text-emerald-800 rounded-lg flex items-start space-x-2 text-xs font-semibold">
                <Sparkles className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5 animate-bounce" />
                <div>{successMsg}</div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#3c2214]">
                  Email Address
                </label>
                {isOtpSent && (
                  <button
                    type="button"
                    onClick={handleResetOtpState}
                    className="text-[10px] text-amber-800 hover:underline font-bold cursor-pointer"
                  >
                    Change Email
                  </button>
                )}
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={isOtpSent}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-white border border-[#cca785]/50 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c3e21]/30 focus:border-[#5c3e21] transition-all text-slate-950 font-mono shadow-sm ${
                    isOtpSent ? 'opacity-60 bg-slate-100/50' : ''
                  }`}
                  placeholder="yourname@gmail.com"
                />
              </div>
            </div>

            {/* Conditional Input based on Method and State */}
            {loginMethod === 'password' ? (
              // PASSWORD LOGIN
              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-white border border-[#cca785]/50 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c3e21]/30 focus:border-[#5c3e21] transition-all text-slate-950 font-mono shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Seed user details reminder */}
                <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-600/20 text-[#5c3e21] text-[11px] leading-relaxed flex items-start space-x-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">GDSC / Ennovate Admin account:</span><br />
                    Email: <code className="font-bold font-mono">s.ubbarao78925@gmail.com</code> (Password: <code className="font-bold font-mono">123456789</code>)
                  </div>
                </div>
              </div>
            ) : (
              // EMAIL OTP LOGIN
              isOtpSent && (
                <div>
                  <label htmlFor="otpCode" className="block text-xs font-bold uppercase tracking-wider text-[#3c2214] mb-1.5">
                    verification Code (OTP)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      id="otpCode"
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 bg-white border border-[#cca785]/50 rounded-xl text-sm text-[#3c2214] font-bold tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c3e21]/30 focus:border-[#5c3e21] transition-all font-mono shadow-sm text-center"
                      placeholder="000000"
                    />
                  </div>

                  {/* Simulator Box displaying the code gracefully */}
                  {simulatedCode && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-600/30 text-amber-950 flex flex-col space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                        <KeyRound className="w-4 h-4 text-amber-800" />
                        <span>Supabase Email OTP Mock (Demo Only)</span>
                      </div>
                      <p className="text-[11px] font-medium leading-normal text-slate-600">
                        Since this application operates in sandbox, we bypass real SMTP mailers. Please enter this verification code directly:
                      </p>
                      <div className="flex justify-between items-center bg-white border border-amber-600/25 p-2 rounded-lg mt-1 font-mono text-center">
                        <span className="text-xs text-slate-500">Verification OTP:</span>
                        <span className="text-sm font-black text-amber-900 tracking-wider bg-amber-50 px-2 py-0.5 rounded">{simulatedCode}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}

            {/* Sign in Trigger */}
            <div>
              <button
                type="submit"
                disabled={loading}
                id="submit-auth-btn"
                className="w-full flex justify-center items-center space-x-1.5 py-3 px-4 bg-gradient-to-br from-[#4a2e1b] to-[#2b160a] hover:from-[#3c2214] hover:to-[#1c0e06] text-white rounded-xl text-sm font-bold shadow-md shadow-amber-955/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5c3e21] transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {loading 
                    ? (loginMethod === 'otp' && !isOtpSent ? 'Sending verification code...' : 'Authenticating securely...') 
                    : (loginMethod === 'otp' && !isOtpSent ? 'Send Verification Code' : 'Secure Log In')
                  }
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Guidelines on auto registration */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-600 font-medium font-mono">
              * Any new email address will auto-register as a Student for easy testing.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
