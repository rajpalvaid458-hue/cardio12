import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { Play, Pause, X, Plus, Minus, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RestTimerBanner: React.FC = () => {
  const { restTimer, pauseResumeRestTimer, adjustRestTimer, stopRestTimer } = useFitness();

  if (!restTimer || !restTimer.active) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((restTimer.totalSeconds - restTimer.remainingSeconds) / restTimer.totalSeconds) * 100)
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 bg-white/95 backdrop-blur-md border border-emerald-300 rounded-2xl p-3.5 shadow-xl shadow-slate-900/10"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-lg">
              <Timer className="w-4 h-4 absolute -top-1 -right-1 text-emerald-600 opacity-80" />
              <span>{formatTime(restTimer.remainingSeconds)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Rest Timer</span>
                {restTimer.isPaused && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                    Paused
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 truncate max-w-[160px]">
                {restTimer.exerciseName ? `After ${restTimer.exerciseName}` : 'Catch your breath & hydrate'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => adjustRestTimer(-15)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="-15s"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => adjustRestTimer(30)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold"
              title="+30s"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={pauseResumeRestTimer}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              title={restTimer.isPaused ? 'Resume' : 'Pause'}
            >
              {restTimer.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={stopRestTimer}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <motion.div
            className="bg-emerald-600 h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
