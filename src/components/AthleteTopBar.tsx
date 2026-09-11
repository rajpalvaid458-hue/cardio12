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
  HelpCircle,
} from 'lucide-react';

interface AthleteTopBarProps {
  onOpenAiGenerator: () => void;
  onOpenPlanCreator: () => void;
  onOpenActiveWorkout: () => void;
  onOpenAthleteProfiles: () => void;
  onOpenHowToUse?: () => void;
}

export const AthleteTopBar: React.FC<AthleteTopBarProps> = ({
  onOpenAiGenerator,
  onOpenPlanCreator,
  onOpenActiveWorkout,
  onOpenAthleteProfiles,
  onOpenHowToUse,
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
    <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.06] p-4 sm:p-5 mb-6 shadow-xs transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Athlete Avatar & Welcome */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-sm shrink-0">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-white font-black text-lg">
              {firstLetter}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {getGreeting()},
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {athleteName}
              </span>
              <button
                onClick={onOpenAthleteProfiles}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold transition-colors cursor-pointer"
                title={isHindi ? 'अलग सेक्शन बदलें' : 'Switch Athlete Profile'}
              >
                <Users className="w-3 h-3 text-emerald-500" />
                <span>{isHindi ? 'सेक्शन' : 'Profile'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="font-mono text-[11px]">{todayFormatted}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {totalWorkouts} {isHindi ? 'वर्कआउट संपन्न' : 'completed'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Clean streak and main action */}
        <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak} {isHindi ? 'दिन स्ट्रीक' : 'day streak'}</span>
            </div>
          )}

          {activeWorkout ? (
            <button
              onClick={onOpenActiveWorkout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isHindi ? 'वर्कआउट जारी रखें' : 'Resume Workout'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200/60 dark:border-white/[0.06] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isHindi ? 'AI कोच' : 'AI Coach'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
