import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ActiveWorkoutSession, WorkoutIntensity } from '../types';
import {
  DynamicStretch,
  INTENSITY_WARMUP_CONFIGS,
  getWarmUpForIntensity,
} from '../data/warmUpRoutines';
import {
  Flame,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Activity,
  HeartPulse,
  Zap,
  Check,
  ShieldAlert,
  Sparkles,
  Timer,
} from 'lucide-react';
import {
  playClickFeedback,
  playCountdownBeep,
  playWorkStartTone,
  playVictoryFanfare,
} from '../utils/audio';

interface ActiveWorkoutWarmUpProps {
  activeWorkout: ActiveWorkoutSession;
  onUpdateIntensity: (intensity: WorkoutIntensity) => void;
  isHindi?: boolean;
}

export const ActiveWorkoutWarmUp: React.FC<ActiveWorkoutWarmUpProps> = ({
  activeWorkout,
  onUpdateIntensity,
  isHindi = false,
}) => {
  // Infer initial intensity if not yet saved on activeWorkout
  const initialIntensity: WorkoutIntensity = useMemo(() => {
    if (activeWorkout.intensity) return activeWorkout.intensity;
    const title = (activeWorkout.title || '').toLowerCase();
    if (title.includes('strength') || title.includes('heavy') || title.includes('5x5') || title.includes('max')) {
      return 'High';
    }
    if (title.includes('hiit') || title.includes('explosive') || title.includes('tabata') || title.includes('sprint')) {
      return 'Peak';
    }
    if (title.includes('recovery') || title.includes('mobility') || title.includes('deload') || title.includes('light')) {
      return 'Light';
    }
    return 'Moderate';
  }, [activeWorkout.intensity, activeWorkout.title]);

  const [currentIntensity, setCurrentIntensity] = useState<WorkoutIntensity>(initialIntensity);

  // Sync if activeWorkout.intensity changes externally
  useEffect(() => {
    if (activeWorkout.intensity && activeWorkout.intensity !== currentIntensity) {
      setCurrentIntensity(activeWorkout.intensity);
    }
  }, [activeWorkout.intensity]);

  // Collapsed state: user can fold the warm-up section once reviewed or completed
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Completed stretches tracking per workout session
  const storageKey = `warmup-completed-${activeWorkout.id}`;
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Extract target muscles from active workout exercises
  const targetMuscles = useMemo(() => {
    const muscles: string[] = [];
    activeWorkout.exercises.forEach((ex) => {
      if (ex.targetMuscle && !muscles.includes(ex.targetMuscle)) {
        muscles.push(ex.targetMuscle);
      }
    });
    return muscles;
  }, [activeWorkout.exercises]);

  // Generate dynamic stretches based on selected intensity and target muscles
  const { config, stretches } = useMemo(() => {
    return getWarmUpForIntensity(currentIntensity, activeWorkout.title, targetMuscles);
  }, [currentIntensity, activeWorkout.title, targetMuscles]);

  // Save completed stretches
  const toggleStretchCompleted = (id: string) => {
    playClickFeedback();
    setCompletedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const markAllComplete = () => {
    playVictoryFanfare();
    const next: Record<string, boolean> = {};
    stretches.forEach((s) => {
      next[s.id] = true;
    });
    setCompletedMap(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const handleIntensityChange = (intensity: WorkoutIntensity) => {
    playClickFeedback();
    setCurrentIntensity(intensity);
    onUpdateIntensity(intensity);
  };

  // Interactive stretch countdown timer state
  const [activeTimer, setActiveTimer] = useState<{
    stretchId: string;
    remainingSeconds: number;
    totalSeconds: number;
    isRunning: boolean;
  } | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeTimer && activeTimer.isRunning) {
      timerRef.current = window.setInterval(() => {
        setActiveTimer((prev) => {
          if (!prev) return null;
          if (prev.remainingSeconds <= 1) {
            // Timer finished!
            playWorkStartTone();
            // Automatically mark stretch complete
            toggleStretchCompleted(prev.stretchId);
            return null;
          }
          if (prev.remainingSeconds <= 4 && prev.remainingSeconds >= 2) {
            playCountdownBeep(880, 0.08);
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTimer?.isRunning, activeTimer?.stretchId]);

  const startStretchTimer = (stretch: DynamicStretch) => {
    playClickFeedback();
    setActiveTimer({
      stretchId: stretch.id,
      remainingSeconds: stretch.durationSeconds,
      totalSeconds: stretch.durationSeconds,
      isRunning: true,
    });
  };

  const togglePauseTimer = () => {
    playClickFeedback();
    setActiveTimer((prev) => (prev ? { ...prev, isRunning: !prev.isRunning } : null));
  };

  const resetTimer = (stretch: DynamicStretch) => {
    playClickFeedback();
    setActiveTimer({
      stretchId: stretch.id,
      remainingSeconds: stretch.durationSeconds,
      totalSeconds: stretch.durationSeconds,
      isRunning: false,
    });
  };

  // Completed count for current stretches
  const completedCount = stretches.filter((s) => completedMap[s.id]).length;
  const isAllComplete = stretches.length > 0 && completedCount === stretches.length;
  const progressPercent = stretches.length > 0 ? Math.round((completedCount / stretches.length) * 100) : 0;

  const intensities: WorkoutIntensity[] = ['Light', 'Moderate', 'High', 'Peak'];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-all">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-md">
                  {isHindi ? 'वार्म-अप व मोबिलिटी' : 'Warm-up & Mobility'}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {Math.round(config.suggestedDurationSeconds / 60)} {isHindi ? 'मिनट प्रोटोकॉल' : 'Min Protocol'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                {isHindi ? 'डायनेमिक वार्म-अप रूटीन' : 'Dynamic Warm-up & Muscle Prep'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${isAllComplete ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              <span>
                {completedCount}/{stretches.length} {isHindi ? 'पूरे' : 'Done'}
              </span>
            </div>

            {/* Collapse/Expand button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors shadow-2xs"
              title={isCollapsed ? (isHindi ? 'विस्तार करें' : 'Expand') : (isHindi ? 'छोटा करें' : 'Collapse')}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3.5 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAllComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Collapsed summary strip if minimized */}
      {isCollapsed && (
        <div className="px-4 py-3 bg-slate-50/70 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">
              {isHindi ? 'चुनी गई तीव्रता:' : 'Selected Intensity:'}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold ${config.colorClass}`}>
              {isHindi ? config.labelHi : config.label}
            </span>
            <span className="text-slate-400">•</span>
            <span>{config.focusSummary}</span>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
          >
            {isHindi ? 'देखें व शुरू करें' : 'Open Warm-up'}
          </button>
        </div>
      )}

      {/* Expanded Main Body */}
      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Intensity Selection Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-600" />
                <span>{isHindi ? 'वर्कआउट तीव्रता का चयन करें:' : 'Select Workout Intensity:'}</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {isHindi ? 'स्ट्रेच सुझाव तीव्रता के अनुसार बदलते हैं' : 'Stretches adapt to your training load'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {intensities.map((intensityKey) => {
                const item = INTENSITY_WARMUP_CONFIGS[intensityKey];
                const isSelected = currentIntensity === intensityKey;

                return (
                  <button
                    key={intensityKey}
                    onClick={() => handleIntensityChange(intensityKey)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? `${item.colorClass} ${item.borderColor} ring-2 ring-orange-500/20 shadow-xs`
                        : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs sm:text-sm">
                        {isHindi ? item.labelHi : item.label}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-current opacity-70" />
                      <span>{item.badge}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intensity Rationale & Guidance Panel */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 shrink-0 mt-0.5">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">
                    {isHindi ? config.labelHi : config.label}:
                  </span>
                  <span className="text-slate-600">
                    {isHindi ? config.focusSummaryHi : config.focusSummary}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  {isHindi ? config.rationaleHi : config.rationale}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {isHindi ? 'टारगेट धड़कन' : 'Target BPM'}
                </div>
                <div className="font-mono font-bold text-slate-800">{config.targetBpm}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {isHindi ? 'आर.पी.ई.' : 'RPE'}
                </div>
                <div className="font-mono font-bold text-slate-800">{config.rpeRange}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Stretches List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {isHindi
                    ? 'सुझाए गए डायनेमिक स्ट्रेचेस'
                    : 'Recommended Dynamic Stretches'} ({stretches.length})
                </span>
              </h4>
              <button
                onClick={markAllComplete}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isHindi ? 'सभी को पूरा मार्क करें' : 'Mark All Done'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {stretches.map((stretch, index) => {
                const isDone = Boolean(completedMap[stretch.id]);
                const isTimerActiveForThis = activeTimer?.stretchId === stretch.id;

                const intensityBadgeColor =
                  stretch.intensity === 'Gentle'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : stretch.intensity === 'Moderate'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <div
                    key={stretch.id}
                    className={`rounded-xl border p-3.5 transition-all ${
                      isDone
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white hover:bg-slate-50/60 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Completion toggle + Title */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleStretchCompleted(stretch.id)}
                          className={`mt-0.5 p-1 rounded-lg transition-colors shrink-0 ${
                            isDone
                              ? 'text-emerald-600 hover:text-emerald-700 bg-emerald-100'
                              : 'text-slate-300 hover:text-slate-400 bg-slate-100'
                          }`}
                          title={isDone ? (isHindi ? 'अपूर्ण मार्क करें' : 'Mark incomplete') : (isHindi ? 'पूर्ण मार्क करें' : 'Mark completed')}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              #{index + 1}
                            </span>
                            <h5
                              className={`text-sm font-bold truncate ${
                                isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                              }`}
                            >
                              {isHindi && stretch.nameHi ? stretch.nameHi : stretch.name}
                            </h5>
                            {isHindi && stretch.nameHi && (
                              <span className="text-[11px] text-slate-400">({stretch.name})</span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${intensityBadgeColor}`}
                            >
                              {stretch.intensity}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {stretch.category}
                            </span>
                          </div>

                          {/* Cadence & timing */}
                          <div className="text-xs text-slate-600 font-medium flex items-center gap-2 flex-wrap mb-2">
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold">
                              ⏱️ {isHindi && stretch.cadenceHi ? stretch.cadenceHi : stretch.cadence}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 text-[11px]">
                              {isHindi ? 'लक्ष्य जोड़:' : 'Joints:'} {stretch.targetJoints.slice(0, 3).join(', ')}
                            </span>
                          </div>

                          {/* Actionable Form cues */}
                          <ul className="space-y-1 mb-2">
                            {stretch.formCues.slice(0, 2).map((cue, cIdx) => (
                              <li
                                key={cIdx}
                                className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-snug"
                              >
                                <span className="text-orange-500 font-bold">•</span>
                                <span>{cue}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Physiological Rationale */}
                          <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                            💡{' '}
                            {isHindi && stretch.whyItMattersHi
                              ? stretch.whyItMattersHi
                              : stretch.whyItMatters}
                          </div>
                        </div>
                      </div>

                      {/* Right: Interactive Timer Widget */}
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {isTimerActiveForThis ? (
                          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 flex flex-col items-center gap-1.5 shadow-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-black text-orange-700">
                                {activeTimer.remainingSeconds}s
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={togglePauseTimer}
                                  className="p-1 rounded-md bg-white hover:bg-orange-100 text-orange-700 border border-orange-200"
                                  title={activeTimer.isRunning ? 'Pause' : 'Resume'}
                                >
                                  {activeTimer.isRunning ? (
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  )}
                                </button>
                                <button
                                  onClick={() => resetTimer(stretch)}
                                  className="p-1 rounded-md bg-white hover:bg-orange-100 text-slate-600 border border-slate-200"
                                  title="Reset Timer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="w-20 h-1.5 bg-orange-200/80 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-600 transition-all duration-300"
                                style={{
                                  width: `${
                                    ((activeTimer.totalSeconds - activeTimer.remainingSeconds) /
                                      activeTimer.totalSeconds) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => startStretchTimer(stretch)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800 text-xs font-bold transition-colors border border-slate-200 hover:border-orange-300"
                            title={`Start ${stretch.durationSeconds}s timer`}
                          >
                            <Timer className="w-3.5 h-3.5 text-orange-600" />
                            <span>{stretch.durationSeconds}s</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Footer Action: Collapse when ready to begin exercises */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
            <span>
              {isAllComplete
                ? (isHindi ? '🎉 वार्म-अप पूरा हुआ! अब मुख्य व्यायाम शुरू करें।' : '🎉 Warm-up complete! You are ready for working sets.')
                : (isHindi ? 'वार्म-अप समाप्त होने के बाद इसे छोटा कर सकते हैं।' : 'You can collapse this once your dynamic warm-up is completed.')}
            </span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              {isHindi ? 'वार्म-अप छुपाएं' : 'Minimize Section'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
