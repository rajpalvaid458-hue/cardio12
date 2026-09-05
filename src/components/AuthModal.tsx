import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    quickLoginAsGuest,
  } = useAuth();
  const { isHindi } = useLanguage();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (!email.trim() || !password) {
          throw new Error(isHindi ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter email and password.');
        }
        if (password.length < 6) {
          throw new Error(
            isHindi
              ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
              : 'Password must be at least 6 characters long.'
          );
        }
        await signupWithEmail(email, password, name.trim() || undefined);
        setSuccessMsg(isHindi ? 'खाता सफलतापूर्वक बन गया!' : 'Account created successfully!');
      } else {
        if (!email.trim() || !password) {
          throw new Error(isHindi ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter email and password.');
        }
        await loginWithEmail(email, password);
        setSuccessMsg(isHindi ? 'सफलतापूर्वक लॉगिन हो गया!' : 'Signed in successfully!');
      }
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';

      if (code === 'auth/invalid-email') {
        setError(isHindi ? 'अमान्य ईमेल पता।' : 'Invalid email address.');
      } else if (code === 'auth/user-not-found') {
        setError(
          isHindi
            ? 'इस ईमेल पर कोई खाता नहीं मिला। कृपया "नया खाता बनाएं" पर क्लिक करें।'
            : 'No account found with this email. Please switch to Create Account.'
        );
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError(isHindi ? 'गलत ईमेल या पासवर्ड।' : 'Incorrect email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setError(
          isHindi
            ? 'इस ईमेल पर पहले से खाता मौजूद है। कृपया साइन इन करें।'
            : 'An account with this email already exists. Please sign in.'
        );
      } else {
        setError(message || (isHindi ? 'प्रमाणीकरण विफल रहा। पुनः प्रयास करें।' : 'Authentication failed. Please try again.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(
          err?.message ||
            (isHindi
              ? 'गूगल साइन-इन विफल रहा। आप नीचे ईमेल से सीधे लॉगिन या खाता बना सकते हैं।'
              : 'Google sign-in was blocked or not allowed. You can sign in or create an account with email below.')
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickGuest = () => {
    quickLoginAsGuest(name.trim() || (isHindi ? 'एथलीट' : 'Athlete'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isHindi ? 'पल्सफिट एकाउंट' : 'PulseFit Cloud & Account'}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isSignUp
              ? (isHindi ? 'नया खाता बनाएं' : 'Create your Account')
              : (isHindi ? 'अपने खाते में लॉगिन करें' : 'Welcome back')}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isHindi
              ? 'वर्कआउट्स, डाइट प्लान्स और प्रगति को सुरक्षित रखें।'
              : 'Save workouts, custom diets, and streaks securely across all devices.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {isHindi ? 'लॉग इन (Sign In)' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                isSignUp
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {isHindi ? 'नया खाता बनाएं' : 'Create Account'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogle}
            disabled={submitting}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs transition disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>{isHindi ? 'Google से जारी रखें' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isHindi ? 'या ईमेल से जारी रखें' : 'or with email'}
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'आपका पूरा नाम' : 'Your Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Alex Hunter'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isHindi ? 'कम से कम 6 अक्षर' : 'At least 6 characters'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <span>
                {submitting
                  ? (isHindi ? 'कृपया प्रतीक्षा करें...' : 'Please wait...')
                  : isSignUp
                  ? (isHindi ? 'खाता बनाएं (Create Account)' : 'Create Account')
                  : (isHindi ? 'लॉग इन करें (Sign In)' : 'Sign In with Email')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Instant Athlete Login Button */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleQuickGuest}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHindi ? '1-क्लिक में तुरंत शुरू करें (Instant Login)' : '1-Click Instant Athlete Login'}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>{isHindi ? 'बिना पासवर्ड के देखना है?' : 'Want to train without password?'}</span>
              <button
                type="button"
                onClick={closeAuthModal}
                className="font-semibold text-emerald-600 hover:underline"
              >
                {isHindi ? 'ऑफलाइन जारी रखें' : 'Continue as Guest'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

