import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock,
  User, 
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GoogleSignInModal: React.FC = () => {
  const { 
    isGoogleModalOpen, 
    closeGoogleModal, 
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    authError,
    clearAuthError
  } = useAuth();

  const [authTab, setAuthTab] = useState<'google' | 'email' | 'signup'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [inlineInfo, setInlineInfo] = useState<string | null>(null);

  if (!isGoogleModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    setStatusMessage('Opening Google Authentication...');
    clearAuthError();
    setInlineInfo(null);

    // Safety timeout to ensure spinner NEVER gets stuck indefinitely
    const timeoutId = setTimeout(() => {
      setIsConnecting(false);
      setStatusMessage('');
    }, 12000);

    try {
      await loginWithGoogle();
      clearTimeout(timeoutId);
      closeGoogleModal();
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Google sign-in completed with status:', err?.message || err);
    } finally {
      setIsConnecting(false);
      setStatusMessage('');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    clearAuthError();
    setResetSent(false);
    setInlineInfo(null);

    try {
      if (authTab === 'signup') {
        await signupWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
      closeGoogleModal();
    } catch (err: any) {
      console.warn('Email auth notice:', err?.message || err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleForgotPassword = async () => {
    setInlineInfo(null);
    if (!email.trim() || !email.includes('@')) {
      setInlineInfo('Please enter your email in the field below to receive the password reset link.');
      return;
    }
    try {
      setIsConnecting(true);
      await resetPassword(email.trim());
      setResetSent(true);
      setInlineInfo(`Password reset link sent to ${email.trim()}! Check your inbox or spam folder.`);
    } catch (err: any) {
      console.warn('Reset password error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const isDomainError = authError?.toLowerCase().includes('domain') || authError?.toLowerCase().includes('authorized');

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={closeGoogleModal}
    >
      <div 
        className="relative w-full max-w-[460px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-slate-100 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google 4-Color Top Brand Indicator Line */}
        <div className="h-1.5 w-full flex">
          <div className="w-1/4 bg-[#4285F4]" />
          <div className="w-1/4 bg-[#EA4335]" />
          <div className="w-1/4 bg-[#FBBC05]" />
          <div className="w-1/4 bg-[#34A853]" />
        </div>

        {/* Close Button */}
        <button
          id="close-google-modal-btn"
          onClick={closeGoogleModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Content Area */}
        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-md mb-2 p-2.5">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-white tracking-tight">
              Sign In to Continue
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Secure client & owner portal for <span className="text-amber-400 font-semibold">ELA Digital World</span>
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => { setAuthTab('google'); clearAuthError(); setInlineInfo(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                authTab === 'google'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('email'); clearAuthError(); setInlineInfo(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                authTab === 'email'
                  ? 'bg-amber-500 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthTab('signup'); clearAuthError(); setInlineInfo(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                authTab === 'signup'
                  ? 'bg-amber-500 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Active Connecting Feedback */}
          {isConnecting && statusMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs flex items-center justify-center gap-2.5 text-center animate-in fade-in">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400 flex-shrink-0" />
              <span className="font-medium">{statusMessage}</span>
            </div>
          )}

          {/* Error Message & Quick Action */}
          {authError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>

              {/* Helpful 1-Click Action if domain issue or wrong password */}
              {isDomainError && authTab === 'google' && (
                <div className="pt-2 border-t border-red-500/20 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('email');
                      clearAuthError();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Switch to Email Login / Register</span>
                  </button>
                  <p className="text-[10px] text-red-300/80 font-mono">
                    💡 Tip: Add your Netlify URL to Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized Domains to enable Google 1-Click login.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Inline Information / Success */}
          {inlineInfo && (
            <div className="mb-4 p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs flex items-center gap-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>{inlineInfo}</span>
            </div>
          )}

          {/* Password Reset Sent Confirmation */}
          {resetSent && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Password reset email dispatched! Please check your inbox and spam folder.</span>
            </div>
          )}

          {/* TAB 1: Real Google Sign-In */}
          {authTab === 'google' && (
            <div className="space-y-4">
              <button
                id="google-modal-direct-launch-btn"
                type="button"
                disabled={isConnecting}
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Instant Google Sign-In</span>
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-2 leading-relaxed">
                <p className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real Google Firebase Authentication</span>
                </p>
                <p>
                  Clicking opens your Google Account picker. If you prefer to sign in without popups or your domain is newly deployed, click the <button type="button" onClick={() => { setAuthTab('email'); clearAuthError(); }} className="text-amber-400 underline font-semibold">Email Login</button> or <button type="button" onClick={() => { setAuthTab('signup'); clearAuthError(); }} className="text-amber-400 underline font-semibold">Register</button> tab.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: Email & Password Sign In / Sign Up */}
          {(authTab === 'email' || authTab === 'signup') && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {authTab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ELA Digital World"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eladigitalw@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase text-slate-300 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password</span>
                  </label>
                  {authTab === 'email' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Forgot / Reset Password?</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (minimum 6 characters)"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md mt-2 disabled:opacity-60"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing Authentication...</span>
                  </>
                ) : (
                  <>
                    <span>{authTab === 'signup' ? 'Create Account & Sign In' : 'Sign In with Password'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Bottom helper prompt */}
              <div className="pt-2 text-center text-[11px] text-slate-400">
                {authTab === 'email' ? (
                  <p>
                    Don't have a password yet?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthTab('signup'); clearAuthError(); setInlineInfo(null); }}
                      className="text-amber-400 hover:underline font-bold ml-1"
                    >
                      Create Account
                    </button>
                    {' '}or{' '}
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-blue-400 hover:underline font-bold ml-1"
                    >
                      Reset Password
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthTab('email'); clearAuthError(); setInlineInfo(null); }}
                      className="text-amber-400 hover:underline font-bold ml-1"
                    >
                      Sign In here
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Security & Verification Footer */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Google Firebase Auth</span>
              </span>
              <span>•</span>
              <span className="text-amber-400/90">Strict Access Control</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
