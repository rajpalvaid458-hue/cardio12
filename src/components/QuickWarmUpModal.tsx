import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Flame,
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  Dumbbell,
  ShieldCheck,
  Zap,
  Activity,
  Copy,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { WorkoutPlan } from '../types';
import { WarmUpRoutine, DynamicStretch } from '../data/warmUpRoutines';
import {
  playClickFeedback,
  playCountdownBeep,
  playWorkStartTone,
  playVictoryFanfare,
} from '../utils/audio';

interface QuickWarmUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutPlan | null;
  availablePlans: WorkoutPlan[];
  onStartWorkout: (plan: WorkoutPlan) => void;
  isHindi?: boolean;
}

export const QuickWarmUpModal: React.FC<QuickWarmUpModalProps> = ({
  isOpen,
  onClose,
  workout,
  availablePlans,
  onStartWorkout,
  isHindi = false,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    workout?.id || availablePlans[0]?.id || ''
  );

  const activePlan = useMemo(() => {
    return (
      availablePlans.find((p) => p.id === selectedPlanId) ||
      workout ||
      availablePlans[0] ||
      null
    );
  }, [availablePlans, selectedPlanId, workout]);

  // Sync selectedPlanId when prop changes
  useEffect(() => {
    if (workout?.id) {
      setSelectedPlanId(workout.id);
    } else if (availablePlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(availablePlans[0].id);
    }
  }, [workout?.id, availablePlans]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [routine, setRoutine] = useState<WarmUpRoutine | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(50);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedDrillIndex, setExpandedDrillIndex] = useState<number | null>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch AI Dynamic Warm-Up Sequence
  const fetchAiWarmUp = async (planToUse: WorkoutPlan) => {
    setIsLoading(true);
    setGenerationError(null);
    setIsPlaying(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);

    try {
      const response = await fetch('/api/ai/quick-warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: {
            id: planToUse.id,
            title: planToUse.title,
            splitType: planToUse.splitType,
            level: planToUse.level,
            durationMinutes: planToUse.durationMinutes,
            exercises: planToUse.exercises.map((e) => ({
              name: e.name,
              targetMuscle: e.targetMuscle,
              category: e.category,
              sets: e.defaultSets,
            })),
          },
          userContext: {
            experienceLevel: planToUse.level || 'intermediate',
          },
          language: isHindi ? 'hi' : 'en',
        }),
      });

      const data = await response.json();
      if (data.success && data.warmUpRoutine) {
        setRoutine(data.warmUpRoutine);
        const firstDrillDuration = data.warmUpRoutine.stretches?.[0]?.durationSeconds || 50;
        setTimeRemaining(firstDrillDuration);
      } else {
        throw new Error('Could not generate warm-up sequence');
      }
    } catch (err: any) {
      console.warn('AI Quick Warm-Up fetch error:', err?.message || err);
      setGenerationError(isHindi ? 'ऑटोमैटिक वॉर्म-अप लोड हुआ।' : 'Loaded baseline warm-up protocol.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger generation when modal opens or plan changes
  useEffect(() => {
    if (isOpen && activePlan) {
      fetchAiWarmUp(activePlan);
    }
  }, [isOpen, activePlan?.id]);

  // Current Stretch
  const currentStretch: DynamicStretch | undefined = routine?.stretches?.[currentStepIndex];
  const totalStretches = routine?.stretches?.length || 0;

  // Calculate elapsed time
  const totalElapsedSeconds = useMemo(() => {
    if (!routine?.stretches) return 0;
    const completedStretchesTime = routine.stretches
      .slice(0, currentStepIndex)
      .reduce((acc, s) => acc + (s.durationSeconds || 50), 0);
    const currentDrillDuration = currentStretch?.durationSeconds || 50;
    const currentDrillElapsed = Math.max(0, currentDrillDuration - timeRemaining);
    return Math.min(300, completedStretchesTime + currentDrillElapsed);
  }, [routine, currentStepIndex, timeRemaining, currentStretch]);

  // Timer Tick
  useEffect(() => {
    if (isPlaying && !isCompleted && currentStretch) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playCountdownBeep(700, 0.08);
          } else if (prev === 1 && soundEnabled) {
            playCountdownBeep(920, 0.15);
          }

          if (prev <= 1) {
            // Advance to next stretch or complete
            if (currentStepIndex < totalStretches - 1) {
              const nextIndex = currentStepIndex + 1;
              setCurrentStepIndex(nextIndex);
              setExpandedDrillIndex(nextIndex);
              const nextDuration = routine?.stretches?.[nextIndex]?.durationSeconds || 50;
              if (soundEnabled) playWorkStartTone();
              return nextDuration;
            } else {
              setIsPlaying(false);
              setIsCompleted(true);
              if (soundEnabled) playVictoryFanfare();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isCompleted, currentStretch, currentStepIndex, totalStretches, routine, soundEnabled]);

  // Handlers
  const handleTogglePlay = () => {
    playClickFeedback();
    if (isCompleted) {
      // Restart
      setIsCompleted(false);
      setCurrentStepIndex(0);
      setExpandedDrillIndex(0);
      setTimeRemaining(routine?.stretches?.[0]?.durationSeconds || 50);
      setIsPlaying(true);
      if (soundEnabled) playWorkStartTone();
    } else {
      setIsPlaying(!isPlaying);
      if (!isPlaying && soundEnabled) playWorkStartTone();
    }
  };

  const handleSkipForward = () => {
    playClickFeedback();
    if (currentStepIndex < totalStretches - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setExpandedDrillIndex(nextIndex);
      setTimeRemaining(routine?.stretches?.[nextIndex]?.durationSeconds || 50);
      if (soundEnabled) playClickFeedback();
    } else {
      setIsPlaying(false);
      setIsCompleted(true);
      if (soundEnabled) playVictoryFanfare();
    }
  };

  const handleSkipBack = () => {
    playClickFeedback();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setExpandedDrillIndex(prevIndex);
      setTimeRemaining(routine?.stretches?.[prevIndex]?.durationSeconds || 50);
    } else {
      setTimeRemaining(routine?.stretches?.[0]?.durationSeconds || 50);
    }
  };

  const handleReset = () => {
    playClickFeedback();
    setIsPlaying(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setExpandedDrillIndex(0);
    setTimeRemaining(routine?.stretches?.[0]?.durationSeconds || 50);
  };

  const handleJumpToStep = (index: number) => {
    playClickFeedback();
    setCurrentStepIndex(index);
    setExpandedDrillIndex(index);
    setTimeRemaining(routine?.stretches?.[index]?.durationSeconds || 50);
    setIsCompleted(false);
  };

  const handleCopyRoutine = () => {
    if (!routine) return;
    const text = [
      `🔥 5-MINUTE DYNAMIC WARM-UP (AI COACH)`,
      `Workout: ${activePlan?.title || 'Selected Workout'}`,
      `Target Focus: ${routine.targetFocus}`,
      `Rationale: ${routine.rationale}`,
      ``,
      ...routine.stretches.map(
        (s, i) =>
          `${i + 1}. ${s.name} (${s.durationSeconds}s)\n   • Target: ${s.targetMuscles.join(', ')}\n   • Cue: ${s.formCues[0] || s.description}`
      ),
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLaunchWorkout = () => {
    playClickFeedback();
    onClose();
    if (activePlan) {
      onStartWorkout(activePlan);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header with Warm Gradient Accent */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/20">
                  {isHindi ? 'AI कोच पावर्ड' : 'AI Coach Powered'}
                </span>
                <span className="text-[11px] font-bold text-amber-100 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> 5-Min Dynamic Sequence
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
                {isHindi ? 'क्विक 5-मिनट वॉर्म-अप' : 'Quick 5-Minute Warm-Up'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workout Plan Selector Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              {isHindi ? 'लक्षित वर्कआउट:' : 'Target Workout:'}
            </span>
            <div className="relative flex-1 sm:w-80">
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                disabled={isLoading || isPlaying}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-xs cursor-pointer truncate disabled:opacity-60"
              >
                {availablePlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.splitType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => activePlan && fetchAiWarmUp(activePlan)}
              disabled={isLoading || isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300/80 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              title="Regenerate dynamic sequence with AI Coach"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? (isHindi ? 'बना रहे हैं...' : 'Generating...') : (isHindi ? 'री-जेनरेट' : 'Regenerate')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyRoutine}
              disabled={!routine}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Copy warm-up sequence to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'कॉपी' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi
                    ? `AI कोच ${activePlan?.title || 'वर्कआउट'} का विश्लेषण कर रहा है...`
                    : `AI Coach is analyzing ${activePlan?.title || 'workout'}...`}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {isHindi
                    ? 'लक्षित मांसपेशियों और जोड़ों के लिए 5-मिनट की सटीक मोबिलिटी और एक्टिवेशन तैयार की जा रही है।'
                    : 'Targeting specific stabilizers, joint angles, and movement pathways for optimal preparation.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {activePlan?.exercises.slice(0, 4).map((ex) => (
                  <span
                    key={ex.id}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    {ex.name}
                  </span>
                ))}
              </div>
            </div>
          ) : routine ? (
            <>
              {/* AI Rationale & Target Muscles Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-slate-50 p-4 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                      {isHindi ? 'फिजियोलॉजी और कोच का तर्क' : 'Physiology & Coach Rationale'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-300/60 font-mono">
                    {routine.targetFocus}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {routine.rationale}
                </p>
                {activePlan?.exercises && (
                  <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800 overflow-x-auto no-scrollbar">
                    <span className="font-bold shrink-0">{isHindi ? 'संबद्ध व्यायाम:' : 'Priming for:'}</span>
                    {activePlan.exercises.slice(0, 5).map((e) => (
                      <span key={e.id} className="bg-white/80 px-2 py-0.5 rounded border border-amber-200 font-medium shrink-0">
                        {e.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 5-Minute Guided Active Player Card */}
              <div className="rounded-2xl bg-slate-900 text-white p-5 sm:p-6 shadow-md relative overflow-hidden space-y-5">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Player Top Meta */}
                <div className="flex items-center justify-between text-xs relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Drill {currentStepIndex + 1} of {totalStretches}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {currentStretch?.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-slate-300">
                    <span className="text-amber-400 font-bold">
                      {Math.floor(totalElapsedSeconds / 60)}:
                      {String(totalElapsedSeconds % 60).padStart(2, '0')}
                    </span>
                    <span className="text-slate-500">/ 5:00</span>
                  </div>
                </div>

                {/* Overall 5-Minute Progress Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative z-10">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                    animate={{ width: `${(totalElapsedSeconds / 300) * 100}%` }}
                    transition={{ ease: 'linear', duration: 0.5 }}
                  />
                </div>

                {/* Current Active Drill Showcase */}
                {isCompleted ? (
                  <div className="py-6 text-center space-y-3 relative z-10">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {isHindi ? '5-मिनट वॉर्म-अप पूरा हुआ!' : '5-Minute Warm-Up Complete!'}
                      </h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                        {isHindi
                          ? 'आपके जोड़ लुब्रिकेट हो चुके हैं और मांसपेशियां पूरी तरह सक्रिय हैं। अब वर्कआउट शुरू करें!'
                          : 'Synovial fluid is circulating, core temperature is elevated, and stabilizers are activated. You are primed to perform!'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLaunchWorkout}
                      className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isHindi ? 'वर्कआउट शुरू करें' : 'Start Workout Now'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {currentStretch?.name}
                        </h3>
                        <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                          {currentStretch?.cadence}
                        </p>
                      </div>

                      {/* Large Countdown Display */}
                      <div className="flex items-baseline gap-1 text-right">
                        <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-tight">
                          {timeRemaining}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">sec</span>
                      </div>
                    </div>

                    {/* Drill Target Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400 font-bold mr-1">Joints:</span>
                      {currentStretch?.targetJoints.map((j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-medium"
                        >
                          {j}
                        </span>
                      ))}
                      <span className="text-slate-400 font-bold ml-2 mr-1">Muscles:</span>
                      {currentStretch?.targetMuscles.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Form Cue & Description */}
                    <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-1.5 text-xs text-slate-200">
                      <p className="leading-relaxed">{currentStretch?.description}</p>
                      {currentStretch?.formCues && currentStretch.formCues.length > 0 && (
                        <div className="pt-2 border-t border-slate-700 flex items-start gap-2 text-amber-200/90 text-[11px]">
                          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                          <span>
                            <strong>Key Cue:</strong> {currentStretch.formCues[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Player Controls Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleSkipBack}
                          disabled={currentStepIndex === 0}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                          title="Previous drill"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                          title="Restart sequence"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span>Pause Drill</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Start 5-Min Warm-Up</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSkipForward}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                        title="Skip to next drill"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Complete 5-Minute Drill Breakdown List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {isHindi ? '5-मिनट वॉर्म-अप ड्रिल क्रम (6 अभ्यास)' : '5-Minute Sequence Breakdown'}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Total: 300s (5:00)
                  </span>
                </div>

                <div className="space-y-2">
                  {routine.stretches.map((stretch, idx) => {
                    const isCurrent = idx === currentStepIndex;
                    const isExpanded = expandedDrillIndex === idx;

                    return (
                      <div
                        key={stretch.id || idx}
                        className={`rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-amber-50/60 border-amber-400/80 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          onClick={() => {
                            setExpandedDrillIndex(isExpanded ? null : idx);
                            if (!isPlaying) {
                              handleJumpToStep(idx);
                            }
                          }}
                          className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJumpToStep(idx);
                              }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                                isCurrent
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : idx < currentStepIndex
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                              }`}
                              title={`Jump to drill ${idx + 1}`}
                            >
                              {idx < currentStepIndex ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                            </button>

                            <div className="truncate">
                              <h5
                                className={`text-xs font-bold truncate ${
                                  isCurrent ? 'text-amber-950' : 'text-slate-800'
                                }`}
                              >
                                {stretch.name}
                              </h5>
                              <p className="text-[11px] text-slate-500 truncate">
                                {stretch.targetMuscles.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {stretch.durationSeconds}s
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Expanded Drill Details */}
                        {isExpanded && (
                          <div className="px-4 pb-3.5 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                            <p className="leading-relaxed">{stretch.description}</p>
                            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 text-[11px] space-y-1">
                              <div>
                                <strong className="text-slate-800">Cadence:</strong>{' '}
                                <span className="text-slate-600">{stretch.cadence}</span>
                              </div>
                              <div>
                                <strong className="text-slate-800">Why it matters:</strong>{' '}
                                <span className="text-slate-600">{stretch.whyItMatters}</span>
                              </div>
                              {stretch.formCues && stretch.formCues.length > 0 && (
                                <div>
                                  <strong className="text-slate-800">Form Cues:</strong>
                                  <ul className="list-disc list-inside mt-0.5 text-slate-600 space-y-0.5">
                                    {stretch.formCues.map((cue, cIdx) => (
                                      <li key={cIdx}>{cue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              {generationError || 'No warm-up routine loaded.'}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {isHindi
              ? 'वॉर्म-अप के बाद सीधे वर्कआउट ट्रैकर में जाएं'
              : 'Jump straight into real-time tracking when ready'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              {isHindi ? 'बंद करें' : 'Close'}
            </button>

            <button
              type="button"
              onClick={handleLaunchWorkout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isHindi
                  ? `${activePlan?.title || 'वर्कआउट'} शुरू करें`
                  : `Start ${activePlan?.title || 'Workout'} Now`}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
