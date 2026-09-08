import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Dumbbell,
  Sparkles,
  Calendar,
  Activity,
  Award,
  Users,
  CheckCircle2,
  Play,
  Crown,
  Zap,
  Shield,
} from 'lucide-react';

interface AthleteTopBarProps {
  onOpenAiGenerator: () => void;
  onOpenPlanCreator: () => void;
  onOpenActiveWorkout: () => void;
  onOpenAthleteProfiles: () => void;
}

export const AthleteTopBar: React.FC<AthleteTopBarProps> = ({
  onOpenAiGenerator,
  onOpenPlanCreator,
  onOpenActiveWorkout,
  onOpenAthleteProfiles,
}) => {
  const { userProfile, activeProfile, workoutLogs, activeWorkout, plans } = useFitness();
  const { isHindi } = useLanguage();
  const { currentUser } = useAuth();

  const athleteName = activeProfile?.name || userProfile.name || currentUser?.displayName || 'Athlete';
  const streak = userProfile.streakDays || 0;
  const totalWorkouts = workoutLogs.length;

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (isHindi) {
      if (hour < 12) return 'शुभ प्रभात';
      if (hour < 17) return 'शुभ दोपहर';
      return 'शुभ संध्या';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Formatted today date
  const todayFormatted = new Intl.DateTimeFormat(isHindi ? 'hi-IN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const firstLetter = athleteName.charAt(0).toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/85 dark:bg-[#070C1A]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.09] p-5 sm:p-6 mb-8 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Top micro specular highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 via-emerald-400/50 to-transparent" />

      {/* Subtle luxury ambient gradient aura */}
      <div className="absolute top-0 right-0 -mt-14 -mr-14 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-teal-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Ultra-Luxury Athlete Monogram & Status */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            {/* Multi-layered luxury avatar ring */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-400 to-teal-300 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden group">
                <span className="font-black text-2xl font-mono tracking-tight text-white group-hover:scale-110 transition-transform">
                  {firstLetter}
                </span>
                <div className="absolute bottom-1 w-2 h-0.5 rounded-full bg-emerald-400" />
              </div>
            </div>
            {/* VIP Crown indicator */}
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-950 border border-amber-400/60 flex items-center justify-center shadow-md">
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400/30" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {getGreeting()},
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {athleteName}
              </span>

              {/* VIP Protocol Pill */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest shadow-2xs">
                <Crown className="w-2.5 h-2.5" />
                <span>ELITE VIP</span>
              </span>

              <button
                onClick={onOpenAthleteProfiles}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer hover:scale-105"
                title={isHindi ? 'सेक्शन बदलें' : 'Switch Athlete Section'}
              >
                <Users className="w-3 h-3" />
                <span>{isHindi ? 'अलग सेक्शन' : 'Switch Section'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono tracking-tight">{todayFormatted}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isHindi ? 'बायोमेट्रिक रेडीनेस 98% (सर्वोत्तम)' : 'Biometric Readiness 98% (Optimal)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Luxury Mechanical Chronograph Metrics & CTA */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Gold Luxury Streak Gauge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-amber-600 dark:text-amber-300 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[9px] font-black uppercase tracking-widest text-amber-600/90 dark:text-amber-400/90">
                {isHindi ? 'दैनिक स्ट्रीक' : 'Active Streak'}
              </div>
              <div className="text-sm font-black font-mono tracking-tight">
                {streak} <span className="text-[11px] font-semibold text-amber-500/80">{isHindi ? 'दिन' : 'DAYS'}</span>
              </div>
            </div>
          </div>

          {/* Emerald Volume / Workouts Logged Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600/90 dark:text-emerald-400/90">
                {isHindi ? 'सत्र संपन्न' : 'Workouts'}
              </div>
              <div className="text-sm font-black font-mono tracking-tight">
                {totalWorkouts} <span className="text-[11px] font-semibold text-emerald-500/80">{isHindi ? 'सत्र' : 'LOGGED'}</span>
              </div>
            </div>
          </div>

          {/* Active Workout or AI Smart Coach Ultra-Luxury Button */}
          {activeWorkout ? (
            <button
              onClick={onOpenActiveWorkout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-102 transition-all cursor-pointer animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="tracking-wide uppercase">{isHindi ? 'वर्कआउट जारी रखें' : 'Resume Workout'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAiGenerator}
              className="relative overflow-hidden group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-102 transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span className="tracking-wide uppercase">{isHindi ? 'AI स्मार्ट कोच' : 'AI Smart Coach'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
