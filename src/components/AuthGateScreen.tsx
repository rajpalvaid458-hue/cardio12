import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Flame,
  UtensilsCrossed,
  Languages,
  CalendarCheck,
  Cloud,
} from 'lucide-react';

export const AuthGateScreen: React.FC = () => {
  const {
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    quickLoginAsGuest,
  } = useAuth();
  const { language, setLanguage, isHindi } = useLanguage();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

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
        setSuccessMsg(isHindi ? 'खाता तैयार हो गया! आपका डेटा अब सुरक्षित रहेगा।' : 'Account created! Your fitness data will be securely synced.');
      } else {
        if (!email.trim() || !password) {
          throw new Error(isHindi ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter email and password.');
        }
        await loginWithEmail(email, password);
        setSuccessMsg(isHindi ? 'सफलतापूर्वक लॉगिन हो गया! डेटा लोड हो रहा है...' : 'Signed in! Loading your workouts & diet history...');
      }
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';

      if (code === 'auth/invalid-email') {
        setError(isHindi ? 'अमान्य ईमेल पता दर्ज किया गया है।' : 'Invalid email address provided.');
      } else if (code === 'auth/user-not-found') {
        setError(
          isHindi
            ? 'इस ईमेल पर कोई खाता नहीं मिला। कृपया "नया खाता बनाएं" चुनें।'
            : 'No account found with this email. Please switch to Create Account.'
        );
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError(isHindi ? 'गलत पासवर्ड या क्रेडेंशियल।' : 'Incorrect password or credentials.');
      } else if (code === 'auth/email-already-in-use') {
        setError(
          isHindi
            ? 'इस ईमेल पर पहले से खाता मौजूद है। कृपया साइन इन करें।'
            : 'An account with this email already exists. Please sign in.'
        );
      } else {
        setError(message || (isHindi ? 'प्रमाणीकरण विफल रहा। कृपया पुनः प्रयास करें।' : 'Authentication failed. Please try again.'));
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
              ? 'Google साइन-इन पूरा नहीं हो सका। आप नीचे सीधे ईमेल से लॉगिन या खाता बना सकते हैं।'
              : 'Google sign-in was canceled or restricted. You can sign in or sign up with email below.')
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestDemo = () => {
    quickLoginAsGuest(name.trim() || (isHindi ? 'अतिथि एथलीट' : 'Guest Athlete'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased relative overflow-x-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  PULSE<span className="text-emerald-400">FIT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {isHindi ? 'प्रमाणित वर्कआउट, डाइट और प्रोग्रेस ट्रैकर' : 'Evidence-Based Training, Diet & Health Engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Medical Standards Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'डॉक्टर व ट्रेनर सत्यापित' : 'Doctor & Trainer Verified'}</span>
            </div>

            {/* Direct Instant Enter Button */}
            <button
              onClick={handleGuestDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 transition cursor-pointer"
              title={isHindi ? 'सीधे ऐप खोलें' : 'Open App Directly'}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'सीधे ऐप खोलें' : 'Open Directly'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold transition shadow-xs group"
              title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <div className="flex items-center text-[11px] font-mono">
                <span className={!isHindi ? 'text-emerald-400 font-black' : 'text-slate-400'}>EN</span>
                <span className="text-slate-600 mx-0.5">/</span>
                <span className={isHindi ? 'text-emerald-400 font-black' : 'text-slate-400'}>हिं</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Hero & Auth Card */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Value Proposition & Feature Highlights */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'व्यक्तिगत फिटनेस क्लाउड प्लेटफॉर्म' : 'Personal Cloud Fitness Engine'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {isHindi ? (
              <>
                अपनी ट्रेनिंग, डाइट और प्रगति को{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                  हमेशा के लिए सुरक्षित रखें
                </span>
              </>
            ) : (
              <>
                Track workouts, master nutrition, and{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                  save your progress forever
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {isHindi
              ? 'PulseFit Pro में साइन इन करें ताकि आपके सेट्स, पर्सनल रिकॉर्ड्स (PRs), डाइट मैक्रोज़, और डेली रूटीन का डेटा सीधे आपके खाते में सेव रहे — किसी भी डिवाइस पर कभी डिलीट नहीं होगा।'
              : 'Sign in to PulseFit Pro so your custom workouts, exercise logs, daily diet macros, and routines sync seamlessly to your personal account on any device.'}
          </p>

          {/* 3 Pillars Bento Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Flame className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-bold text-sm text-white">
                {isHindi ? 'लाइव ट्रेनिंग व वार्म-अप' : 'Live Workout & Warm-up'}
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isHindi ? 'इंटेंसिटी आधारित डायनामिक स्ट्रेच और ऑटो रेस्ट टाइमर।' : 'Intensity-based dynamic stretches and precise rest timers.'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-bold text-sm text-white">
                {isHindi ? 'डाइट और मैक्रोज़' : 'Diet & Macro Tracker'}
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isHindi ? 'कैलोरी, प्रोटीन, कार्ब्स और वॉटर लॉगिंग।' : 'Accurate calories, protein, carbs, fats & hydration goals.'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                <Cloud className="w-4 h-4 text-blue-400" />
              </div>
              <div className="font-bold text-sm text-white">
                {isHindi ? 'व्यक्तिगत क्लाउड सिंक' : 'Personal Cloud Sync'}
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isHindi ? 'हर यूज़र का डेटा अलग और 100% सुरक्षित रहता है।' : 'Isolated, encrypted database for every athlete profile.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Conversion Auth Card */}
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isSignUp
                ? (isHindi ? 'नया खाता बनाएं' : 'Create Your Account')
                : (isHindi ? 'अपने खाते में लॉगिन करें' : 'Welcome Back')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isHindi
                ? 'जारी रखने के लिए लॉगिन करें या 1-क्लिक में नया खाता बनाएं'
                : 'Sign in to access your workout plans and saved statistics'}
            </p>

            {/* Quick Guest Access Pill */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleGuestDemo}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-emerald-500/20 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isHindi
                    ? 'बिना लॉगिन सीधे वर्कआउट शुरू करें (Guest Mode)'
                    : 'Start Directly as Guest / Try Demo'}
                </span>
                <ArrowRight className="w-3 h-3 text-emerald-400 ml-0.5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isSignUp
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isHindi ? 'साइन इन (Sign In)' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSignUp
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isHindi ? 'नया खाता (Sign Up)' : 'Create Account'}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80 flex items-start gap-2.5 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={submitting}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>{isHindi ? 'Google से 1-क्लिक में शुरू करें' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'या ईमेल से जारी रखें' : 'or continue with email'}
            </span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isHindi ? 'आपका नाम' : 'Your Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Alex Hunter'}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isHindi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isHindi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isHindi ? 'कम से कम 6 अक्षर' : 'At least 6 characters'}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <span>
                {submitting
                  ? (isHindi ? 'कृपया प्रतीक्षा करें...' : 'Please wait...')
                  : isSignUp
                  ? (isHindi ? 'खाता बनाएं (Create Account)' : 'Create Account & Start')
                  : (isHindi ? 'लॉग इन करें (Sign In)' : 'Sign In with Email')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guest / Demo Athlete Option */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-center">
            <button
              type="button"
              onClick={handleGuestDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-700 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isHindi
                  ? 'अतिथि के रूप में आज़माएं (Try Demo Mode)'
                  : 'Try Demo Mode / Continue as Guest'}
              </span>
            </button>
            <p className="text-[11px] text-slate-500">
              {isHindi
                ? 'नोट: लॉगिन करने पर आपका डेटा हमेशा सुरक्षित क्लाउड में सेव रहता है।'
                : 'Note: Logging in ensures your workouts & calories sync to the cloud permanently.'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PULSEFIT PRO • {isHindi ? 'प्रमाणित स्पोर्ट्स साइंस एवं न्यूट्रिशन' : 'Evidence-Based Sports Science & Nutrition'}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'क्लाउड डेटाबेस सक्रिय' : 'Secure Cloud Database Active'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
