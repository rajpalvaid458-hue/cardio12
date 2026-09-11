import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Zap,
  Flame,
  BatteryCharging,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  Dumbbell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playClickFeedback } from '../utils/audio';

interface ReadinessRecoveryHubProps {
  onStartRecommendedWorkout?: () => void;
}

export const ReadinessRecoveryHub: React.FC<ReadinessRecoveryHubProps> = () => {
  const { userProfile, workoutLogs } = useFitness();
  const { isHindi } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const streak = userProfile.streakDays || 1;
  const recentLogsCount = workoutLogs.slice(0, 5).length;
  const baseReadiness = Math.min(96, Math.max(72, 88 + (streak % 4) * 2 - (recentLogsCount > 4 ? 6 : 0)));
  const strainCapacity = Math.round(baseReadiness * 0.95);

  const recentMusclesWorked = new Set<string>();
  workoutLogs.slice(0, 3).forEach((log) => {
    log.exercises?.forEach((ex) => {
      recentMusclesWorked.add(ex.targetMuscle.toLowerCase());
    });
  });

  const muscleRecovery = [
    {
      group: isHindi ? 'छाती और ट्राइसेप्स' : 'Chest & Triceps',
      score: recentMusclesWorked.has('chest') ? 72 : 98,
      status: recentMusclesWorked.has('chest') ? (isHindi ? 'रिकवर हो रहा है' : 'Rebuilding') : (isHindi ? 'पूरी तरह तैयार' : 'Fresh & Ready'),
      color: recentMusclesWorked.has('chest') ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: recentMusclesWorked.has('chest') ? 'bg-amber-500' : 'bg-emerald-500',
    },
    {
      group: isHindi ? 'पीठ और बाइसेप्स' : 'Back & Biceps',
      score: recentMusclesWorked.has('back') ? 78 : 95,
      status: recentMusclesWorked.has('back') ? (isHindi ? 'रिकवर हो रहा है' : 'Rebuilding') : (isHindi ? 'पूरी तरह तैयार' : 'Optimal'),
      color: recentMusclesWorked.has('back') ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: recentMusclesWorked.has('back') ? 'bg-amber-500' : 'bg-emerald-500',
    },
    {
      group: isHindi ? 'कंधे और ट्रैप्स' : 'Shoulders & Delts',
      score: 92,
      status: isHindi ? 'पूरी तरह तैयार' : 'Fresh & Ready',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: 'bg-emerald-500',
    },
    {
      group: isHindi ? 'पैर (क्वाड्स और ग्लूट्स)' : 'Legs & Glutes',
      score: recentMusclesWorked.has('quadriceps') || recentMusclesWorked.has('legs') ? 68 : 94,
      status: recentMusclesWorked.has('quadriceps') || recentMusclesWorked.has('legs') ? (isHindi ? 'रीस्टोरेशन जारी' : 'Recovering') : (isHindi ? 'पूरी तरह तैयार' : 'Prime Power'),
      color: recentMusclesWorked.has('quadriceps') || recentMusclesWorked.has('legs') ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: recentMusclesWorked.has('quadriceps') || recentMusclesWorked.has('legs') ? 'bg-amber-500' : 'bg-emerald-500',
    },
    {
      group: isHindi ? 'कोर और एब्स' : 'Core & Midsection',
      score: 89,
      status: isHindi ? 'तैयार' : 'Ready',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: 'bg-emerald-500',
    },
  ];

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/[0.08] p-3.5 sm:p-4 shadow-2xs transition-all">
      {/* Compact Single-Row Executive Recovery Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <BatteryCharging className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isHindi ? 'रिकवरी स्कोर' : 'Readiness'}:
              </span>
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                {baseReadiness}%
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {isHindi ? 'भारी लिफ्टिंग व प्रोग्रेसिव ओवरलोड के लिए तैयार' : 'Optimal capacity for heavy compound sets'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{strainCapacity}/100</span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickFeedback();
              setShowDetails((prev) => !prev);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>{showDetails ? (isHindi ? 'कम करें' : 'Hide') : (isHindi ? 'मसल हीटमैप' : 'Muscle Freshness')}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Heatmap details only when user wants it */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-3.5 mt-3 border-t border-slate-200/80 dark:border-white/[0.06]"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {muscleRecovery.map((item) => (
                <div
                  key={item.group}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/[0.05] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{item.group}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className={`h-full ${item.barColor} rounded-full`} style={{ width: `${item.score}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
