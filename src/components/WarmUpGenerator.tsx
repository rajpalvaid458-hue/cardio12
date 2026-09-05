import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Flame,
  Clock,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  Dumbbell,
  Check,
  Copy,
  ArrowRight,
  ShieldAlert,
  Activity,
  HeartPulse,
  Share2,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  playCountdownBeep,
  playWorkStartTone,
  playRestStartTone,
  playVictoryFanfare,
  playClickFeedback,
} from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { WorkoutPlan } from '../types';
import {
  generateWarmUpRoutine,
  WarmUpRoutine,
  DynamicStretch,
} from '../data/warmUpRoutines';

interface WarmUpGeneratorProps {
  plans: WorkoutPlan[];
  selectedPlanId?: string | null;
  onSelectPlan?: (plan: WorkoutPlan) => void;
  onStartWorkout?: (plan: WorkoutPlan) => void;
  onClose?: () => void;
}

const PRESET_FOCUS_CATEGORIES = [
  {
    id: 'Push / Chest & Shoulders',
    label: 'Push / Chest & Shoulders',
    labelHi: 'पुश (चेस्ट व शोल्डर्स)',
    icon: Dumbbell,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'Pull / Back & Biceps',
    label: 'Pull / Back & Biceps',
    labelHi: 'पुल (बैक व बाइसेप्स)',
    icon: Activity,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  },
  {
    id: 'Legs & Lower Body',
    label: 'Legs & Lower Body',
    labelHi: 'लेग्स (लोअर बॉडी व स्क्वाट)',
    icon: Flame,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'Core, Yoga & Calisthenics',
    label: 'Core, Yoga & Bodyweight',
    labelHi: 'कोर व कैलिस्थेनिक्स',
    icon: Sparkles,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
  {
    id: 'Cardio, HIIT & Endurance',
    label: 'Cardio & Conditioning',
    labelHi: 'कार्डियो व कंडीशनिंग',
    icon: HeartPulse,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
  {
    id: 'Full Body',
    label: 'Universal Full Body',
    labelHi: 'यूनिवर्सल फुल बॉडी',
    icon: Activity,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
];

export const WarmUpGenerator: React.FC<WarmUpGeneratorProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  onStartWorkout,
  onClose,
}) => {
  const { isHindi } = useLanguage();

  // Internal selected workout plan or preset category
  const [activePlanId, setActivePlanId] = useState<string>(
    selectedPlanId || (plans.length > 0 ? plans[0].id : '')
  );
  const [selectedPresetFocus, setSelectedPresetFocus] = useState<string>('Full Body');
  const [expandedStretchId, setExpandedStretchId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Guided 5-min interactive player states
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(50);
  const [isPaused, setIsPaused] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRoutineFinished, setIsRoutineFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize when parent passes down selectedPlanId
  useEffect(() => {
    if (selectedPlanId) {
      setActivePlanId(selectedPlanId);
    }
  }, [selectedPlanId]);

  const currentPlan = useMemo(() => {
    return plans.find((p) => p.id === activePlanId) || null;
  }, [plans, activePlanId]);

  // Generate customized 5-minute dynamic warm-up
  const warmUpRoutine: WarmUpRoutine = useMemo(() => {
    return generateWarmUpRoutine(currentPlan, selectedPresetFocus);
  }, [currentPlan, selectedPresetFocus]);

  const currentStretch: DynamicStretch | undefined =
    warmUpRoutine.stretches[currentStepIndex];
  const nextStretch: DynamicStretch | undefined =
    warmUpRoutine.stretches[currentStepIndex + 1];

  // Overall elapsed time in guided mode
  const totalElapsedSeconds = useMemo(() => {
    const previousCompletedTime = warmUpRoutine.stretches
      .slice(0, currentStepIndex)
      .reduce((sum, s) => sum + s.durationSeconds, 0);
    const currentDrillElapsed = currentStretch
      ? currentStretch.durationSeconds - timeRemaining
      : 0;
    return Math.min(300, previousCompletedTime + currentDrillElapsed);
  }, [currentStepIndex, timeRemaining, currentStretch, warmUpRoutine]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Timer Tick Mechanism
  useEffect(() => {
    if (isPlayerActive && !isPaused && !isRoutineFinished) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          // Audio cues for 3, 2, 1
          if (soundEnabled && prev <= 4 && prev > 1) {
            playCountdownBeep(700 + (4 - prev) * 100, 0.07);
          }

          if (prev <= 1) {
            // Move to next step or complete
            if (currentStepIndex < warmUpRoutine.stretches.length - 1) {
              if (soundEnabled) playRestStartTone();
              setCurrentStepIndex((next) => next + 1);
              const nextDrill = warmUpRoutine.stretches[currentStepIndex + 1];
              return nextDrill ? nextDrill.durationSeconds : 50;
            } else {
              // Routine complete!
              if (soundEnabled) playVictoryFanfare();
              setIsRoutineFinished(true);
              setIsPaused(true);
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isPlayerActive,
    isPaused,
    isRoutineFinished,
    currentStepIndex,
    warmUpRoutine.stretches,
    soundEnabled,
  ]);

  // Start Guided Player
  const handleStartGuidedWarmup = () => {
    playClickFeedback();
    setIsPlayerActive(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setTimeRemaining(warmUpRoutine.stretches[0]?.durationSeconds || 50);
    setIsRoutineFinished(false);
    if (soundEnabled) playWorkStartTone();
  };

  // Skip / Previous actions
  const handleNextStep = () => {
    playClickFeedback();
    if (currentStepIndex < warmUpRoutine.stretches.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setTimeRemaining(warmUpRoutine.stretches[currentStepIndex + 1]?.durationSeconds || 50);
      if (soundEnabled) playWorkStartTone();
    } else {
      setIsRoutineFinished(true);
      setIsPaused(true);
      if (soundEnabled) playVictoryFanfare();
    }
  };

  const handlePrevStep = () => {
    playClickFeedback();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setTimeRemaining(warmUpRoutine.stretches[currentStepIndex - 1]?.durationSeconds || 50);
      setIsRoutineFinished(false);
    }
  };

  const handleReset = () => {
    playClickFeedback();
    setIsPaused(true);
    setCurrentStepIndex(0);
    setTimeRemaining(warmUpRoutine.stretches[0]?.durationSeconds || 50);
    setIsRoutineFinished(false);
  };

  // Copy routine text for workout notes
  const handleCopyRoutine = () => {
    playClickFeedback();
    const textLines = [
      `🔥 5-MINUTE DYNAMIC WARM-UP: ${warmUpRoutine.title}`,
      `Target Workout: ${warmUpRoutine.matchedWorkoutTitle || warmUpRoutine.targetFocus}`,
      `Rationale: ${warmUpRoutine.rationale}`,
      '',
      ...warmUpRoutine.stretches.map(
        (s, i) =>
          `${i + 1}. ${s.name} (${s.durationSeconds}s)\n   • Cadence: ${s.cadence}\n   • Target: ${s.targetJoints.join(', ')}\n   • Key Cue: ${s.formCues[0]}`
      ),
    ];
    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div
      id="warmup-routine-generator"
      className="rounded-3xl bg-slate-900 border border-amber-500/30 text-white shadow-xl overflow-hidden transition-all"
    >
      {/* Top Header Banner */}
      <div className="relative px-5 py-5 sm:px-6 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-b border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {isHindi ? '5-मिनट डायनेमिक वॉर्म-अप' : '5-Min Dynamic Warm-Up'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <Clock className="w-3 h-3" />
                300s (5:00)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-500/30">
                <Sparkles className="w-3 h-3" />
                {isHindi ? 'साइंस-बेस्ड एक्टिवेशन' : 'Neuro-Muscular Activation'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 pt-1">
              <span>{isHindi ? warmUpRoutine.titleHi || warmUpRoutine.title : warmUpRoutine.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {isHindi ? warmUpRoutine.subtitleHi : warmUpRoutine.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={handleCopyRoutine}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Copy warm-up sequence"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isHindi ? 'कॉपी हो गया' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'रूटीन कॉपी करें' : 'Copy Routine'}</span>
                </>
              )}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Workout Selection Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-300/90 uppercase tracking-wider">
              {isHindi ? 'वर्कआउट चुनें:' : 'Selected Workout:'}
            </span>

            {plans.length > 0 ? (
              <select
                value={activePlanId}
                onChange={(e) => {
                  setActivePlanId(e.target.value);
                  const found = plans.find((p) => p.id === e.target.value);
                  if (found && onSelectPlan) onSelectPlan(found);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-hidden focus:border-amber-500 transition-colors max-w-[280px] sm:max-w-[320px] truncate"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.splitType})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-slate-400 italic">
                {isHindi ? 'कस्टम स्प्लिट चुनें' : 'Select a split category below'}
              </span>
            )}
          </div>

          {/* Preset Category Pills for Quick Switching */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {PRESET_FOCUS_CATEGORIES.map((cat) => {
              const isSelected =
                (!currentPlan && selectedPresetFocus === cat.id) ||
                (currentPlan &&
                  currentPlan.splitType.toLowerCase().includes(cat.id.toLowerCase().split('/')[0].trim()));
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickFeedback();
                    setSelectedPresetFocus(cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {isHindi ? cat.labelHi : cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Dynamic Biomechanical Rationale Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200 text-xs sm:text-sm space-y-1.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-amber-300">
              {isHindi
                ? 'यह वॉर्म-अप आपके चयनित वर्कआउट के लिए क्यों उपयुक्त है?'
                : 'Why this dynamic warm-up is generated for your workout:'}
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {isHindi ? warmUpRoutine.rationaleHi : warmUpRoutine.rationale}
            </p>
            <p className="text-[11px] text-amber-200/80 pt-0.5">
              ⚠️{' '}
              {isHindi
                ? 'नोट: वर्कआउट से पहले स्टैटिक स्ट्रेचिंग न करें (यह ताकत घटाती है)। हमेशा इन 5-मिनट डायनेमिक मूवमेंट्स से जोड़ों में साइनोवियल फ्लूइड और रक्त प्रवाह बढ़ाएं।'
                : 'Physiology Rule: Avoid prolonged static stretching before strength training (it dampens neural motor output). Dynamic stretches safely lubricate joints and potentiate muscle fibers.'}
            </p>
          </div>
        </div>

        {/* Guided Interactive Timer Player Mode */}
        {isPlayerActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 sm:p-6 rounded-2xl bg-slate-950 border-2 border-amber-500/40 space-y-5"
          >
            {/* Top Player Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-400">
                  {isHindi ? 'ड्रिल' : 'Drill'} {currentStepIndex + 1} of{' '}
                  {warmUpRoutine.stretches.length}
                </span>
                <span className="text-slate-400 font-mono">
                  {formatTime(totalElapsedSeconds)} / 5:00
                </span>
              </div>
              {/* 5-minute progress tracker */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
                {warmUpRoutine.stretches.map((s, idx) => {
                  const isDone = idx < currentStepIndex || isRoutineFinished;
                  const isCurrent = idx === currentStepIndex && !isRoutineFinished;
                  const drillProgress = isCurrent
                    ? ((s.durationSeconds - timeRemaining) / s.durationSeconds) * 100
                    : isDone
                    ? 100
                    : 0;
                  return (
                    <div
                      key={s.id}
                      className="h-full flex-1 bg-slate-800 rounded-full overflow-hidden"
                    >
                      <div
                        className={`h-full transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500'
                            : isCurrent
                            ? 'bg-amber-400'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${drillProgress}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Active Stretch Display */}
            {currentStretch && !isRoutineFinished && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
                <div className="space-y-2 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <Activity className="w-3 h-3" />
                    {currentStretch.category} • {currentStretch.intensity} Intensity
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isHindi ? currentStretch.nameHi || currentStretch.name : currentStretch.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {isHindi ? currentStretch.descriptionHi || currentStretch.description : currentStretch.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-200 border border-slate-700">
                      ⚡ {isHindi ? currentStretch.cadenceHi || currentStretch.cadence : currentStretch.cadence}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      🎯 {currentStretch.targetJoints.join(', ')}
                    </span>
                  </div>

                  {/* Key Form Cue */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 mt-2">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {isHindi ? 'सटीक फॉर्म निर्देश:' : 'Strict Biomechanical Cue:'}
                    </div>
                    <p>{currentStretch.formCues[0]}</p>
                  </div>
                </div>

                {/* Circular Active Countdown Timer */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-amber-400 transition-all duration-300"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          60 *
                          (1 - timeRemaining / currentStretch.durationSeconds)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black font-mono text-white tracking-tighter">
                        {timeRemaining}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        {isHindi ? 'सेकंड शेष' : 'Sec Remaining'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Finished Celebration View */}
            {isRoutineFinished && (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">
                    {isHindi ? 'वॉर्म-अप पूरा हुआ! आप वर्कआउट के लिए तैयार हैं' : 'Dynamic Warm-Up Complete! Your Body is Primed'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/90 max-w-md mx-auto">
                    {isHindi
                      ? 'जोड़ों में साइनोवियल फ्लूइड एक्टिव हो चुका है और केंद्रीय तंत्रिका तंत्र (CNS) पूरी तरह तैयार है।'
                      : 'Synovial fluid is circulating, core temperature is elevated, and motor units are potentiated.'}
                  </p>
                </div>

                {currentPlan && onStartWorkout && (
                  <button
                    onClick={() => onStartWorkout(currentPlan)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {isHindi
                        ? `${currentPlan.title} अभी शुरू करें`
                        : `Launch ${currentPlan.title} Now`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Next Up Drill Teaser */}
            {!isRoutineFinished && nextStretch && (
              <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">
                    {isHindi ? 'अगला:' : 'Up Next:'}
                  </span>
                  <span className="font-semibold text-slate-200 truncate">
                    {isHindi ? nextStretch.nameHi || nextStretch.name : nextStretch.name}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-slate-500">
                  {nextStretch.durationSeconds}s
                </span>
              </div>
            )}

            {/* Player Controls Bar */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    soundEnabled
                      ? 'bg-slate-800 text-amber-400 border-amber-500/30'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title={soundEnabled ? 'Mute sound cues' : 'Enable audio countdown chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Restart warm-up"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous drill"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    playClickFeedback();
                    setIsPaused((prev) => !prev);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isHindi ? 'रिज्यूम' : 'Resume'}</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>{isHindi ? 'पॉज़' : 'Pause'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextStep}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Skip to next drill"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsPlayerActive(false);
                  setIsPaused(true);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              >
                {isHindi ? 'प्लेयर बंद करें' : 'Exit Player'}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Normal Overview Call-to-Action Bar */
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800/80 to-slate-800/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>
                  {isHindi
                    ? 'गाइडेड 5-मिनट वॉर्म-अप टाइमर मोड'
                    : 'Interactive 5-Minute Guided Warm-Up'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {isHindi
                  ? 'टाइमर, ध्वनि संकेतों और सटीक फॉर्म गाइड के साथ 5-मिनट का निर्देशित वॉर्म-अप चलाएं।'
                  : 'Start an automated step-by-step timer with auditory beeps and seamless exercise transitions.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleStartGuidedWarmup}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isHindi ? '5-मिनट वॉर्म-अप शुरू करें' : 'Start 5-Min Warm-Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Stretches Sequence List (6 Steps = Exactly 5:00) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>{isHindi ? '6-स्टेप डायनेमिक स्ट्रेचिंग क्रम' : '6-Step Dynamic Stretch Sequence'}</span>
              <span className="text-[11px] font-normal text-amber-400">
                (6 × 50s = 300s / 5:00)
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              {isHindi ? 'कार्ड पर क्लिक करके फॉर्म गाइड देखें' : 'Click drill to inspect form cues'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warmUpRoutine.stretches.map((stretch, index) => {
              const isExpanded = expandedStretchId === stretch.id;

              return (
                <div
                  key={stretch.id}
                  onClick={() =>
                    setExpandedStretchId(isExpanded ? null : stretch.id)
                  }
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isExpanded
                      ? 'bg-slate-800/95 border-amber-500/50 shadow-md'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                            {stretch.category}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {stretch.durationSeconds}s
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {isHindi ? stretch.nameHi || stretch.name : stretch.name}
                        </h4>

                        <div className="text-xs text-slate-400 font-medium">
                          ⚡ {isHindi ? stretch.cadenceHi || stretch.cadence : stretch.cadence}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-slate-700 space-y-2.5 text-xs text-slate-300"
                    >
                      <p className="leading-relaxed">
                        {isHindi
                          ? stretch.descriptionHi || stretch.description
                          : stretch.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <div className="text-[11px] font-bold text-amber-300">
                          🎯 {isHindi ? 'लक्षित जोड़ व मांसपेशियां:' : 'Target Joints & Primary Tissues:'}
                        </div>
                        <div className="text-slate-300">
                          {stretch.targetJoints.join(' • ')} ({stretch.targetMuscles.join(', ')})
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <div className="text-[11px] font-bold text-emerald-400">
                          💡 {isHindi ? 'शारीरिक महत्व:' : 'Biomechanical Rationale:'}
                        </div>
                        <div className="text-slate-300">
                          {isHindi ? stretch.whyItMattersHi || stretch.whyItMatters : stretch.whyItMatters}
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {isHindi ? 'प्रमुख फॉर्म टिप्स:' : 'Key Execution Cues:'}
                        </div>
                        <ul className="space-y-1 list-disc list-inside text-slate-300 pl-1">
                          {stretch.formCues.map((cue, idx) => (
                            <li key={idx}>{cue}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
