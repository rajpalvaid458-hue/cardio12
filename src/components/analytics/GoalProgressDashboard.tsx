import React, { useState, useMemo } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { useLanguage } from '../../context/LanguageContext';
import { GoalSettingModal } from './GoalSettingModal';
import {
  Target,
  Scale,
  Dumbbell,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
  Clock,
  Activity,
  ArrowRight,
  Edit3,
  Check,
  ChevronRight,
  Zap,
  Layers,
  BarChart2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const GoalProgressDashboard: React.FC = () => {
  const { userProfile, updateUserProfile, workoutLogs } = useFitness();
  const { isHindi } = useLanguage();
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [quickWeightInput, setQuickWeightInput] = useState('');
  const [showQuickWeight, setShowQuickWeight] = useState(false);

  const goals = userProfile.goals || {
    startingWeightKg: 75.0,
    targetWeightKg: userProfile.targetWeightKg || 82.0,
    weightGoalType: 'gain',
    targetWeightDate: new Date(Date.now() + 75 * 86400000).toISOString().split('T')[0],
    weeklyRateKg: 0.35,
    targetMuscleGainKg: 3.5,
    startingMuscleMassKg: 33.5,
    targetMuscleGroups: ['Chest', 'Back', 'Quadriceps', 'Biceps', 'Triceps'],
    targetMonthlyVolumeKg: 45000,
    targetChestCm: 105,
    targetArmsCm: 39.5,
    targetThighsCm: 61,
    targetWorkoutsPerWeek: 4,
    targetActiveMinutesPerWeek: 200,
    preferredDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    targetMonthlyWorkouts: 16,
    motivationNotes: 'Focus on progressive overload, high protein intake, and consistent weekly frequency.',
  };

  const currentWeight = userProfile.weightKg;
  const targetWeight = goals.targetWeightKg;
  const startingWeight = goals.startingWeightKg;
  const unit = userProfile.weightUnit;

  // 1. Target Weight Progress Calculations
  const weightProgress = useMemo(() => {
    const totalDeltaNeeded = Math.abs(targetWeight - startingWeight);
    if (totalDeltaNeeded === 0) {
      return {
        percent: 100,
        completedDelta: 0,
        remainingDelta: 0,
        status: 'Achieved',
        isGain: false,
      };
    }

    const isGain = goals.weightGoalType === 'gain' || targetWeight > startingWeight;
    const isLose = goals.weightGoalType === 'lose' || targetWeight < startingWeight;

    let completed = 0;
    if (isGain) {
      completed = currentWeight - startingWeight;
    } else if (isLose) {
      completed = startingWeight - currentWeight;
    } else {
      // maintain
      const diff = Math.abs(currentWeight - targetWeight);
      const score = Math.max(0, 100 - diff * 25);
      return {
        percent: Math.min(100, Math.round(score)),
        completedDelta: 0,
        remainingDelta: diff,
        status: diff <= 1 ? 'In Maintenance Zone' : 'Adjusting',
        isGain: false,
      };
    }

    const percent = Math.min(120, Math.max(0, Math.round((completed / totalDeltaNeeded) * 100)));
    const remaining = Math.max(0, Math.abs(targetWeight - currentWeight));

    let status = 'In Progress';
    if (percent >= 100) status = 'Goal Surpassed!';
    else if (percent >= 75) status = 'Home Stretch';
    else if (percent >= 40) status = 'Solid Momentum';
    else status = 'Gaining Traction';

    // Estimated weeks remaining based on weekly rate
    const rate = goals.weeklyRateKg || 0.35;
    const estimatedWeeks = rate > 0 ? (remaining / rate).toFixed(1) : '—';

    return {
      percent,
      completedDelta: Math.abs(completed),
      remainingDelta: remaining,
      status,
      isGain,
      estimatedWeeks,
      totalDeltaNeeded,
    };
  }, [currentWeight, targetWeight, startingWeight, goals.weightGoalType, goals.weeklyRateKg]);

  // 2. Activity Frequency & Weekly Calculations
  const frequencyStats = useMemo(() => {
    const now = new Date();
    // Calculate start of current week (Monday)
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - dayOfWeek);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // This week's logs
    const thisWeekLogs = workoutLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek && logDate <= now;
    });

    // This month's logs
    const thisMonthLogs = workoutLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfMonth && logDate <= now;
    });

    const completedSessionsThisWeek = thisWeekLogs.length;
    const activeMinutesThisWeek = Math.round(
      thisWeekLogs.reduce((acc, l) => acc + l.durationSeconds, 0) / 60
    );

    const targetWorkouts = goals.targetWorkoutsPerWeek || 4;
    const targetMins = goals.targetActiveMinutesPerWeek || 200;

    const weeklySessionsPercent = Math.min(
      100,
      Math.round((completedSessionsThisWeek / targetWorkouts) * 100)
    );
    const weeklyMinutesPercent = Math.min(
      100,
      Math.round((activeMinutesThisWeek / targetMins) * 100)
    );

    // Day of week checkmarks
    const daysMap: Record<number, boolean> = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };
    thisWeekLogs.forEach((l) => {
      const d = (new Date(l.date).getDay() + 6) % 7;
      daysMap[d] = true;
    });

    return {
      completedSessionsThisWeek,
      targetWorkouts,
      weeklySessionsPercent,
      activeMinutesThisWeek,
      targetMins,
      weeklyMinutesPercent,
      completedSessionsThisMonth: thisMonthLogs.length,
      targetMonthlySessions: goals.targetMonthlyWorkouts || targetWorkouts * 4,
      daysMap,
      dayOfWeekIndex: dayOfWeek,
      thisMonthLogs,
    };
  }, [workoutLogs, goals.targetWorkoutsPerWeek, goals.targetActiveMinutesPerWeek, goals.targetMonthlyWorkouts]);

  // 3. Muscle Gain & Hypertrophy Calculations
  const muscleProgress = useMemo(() => {
    // Total volume in current calendar month
    const totalMonthVolume = frequencyStats.thisMonthLogs.reduce(
      (acc, l) => acc + (l.totalVolumeKg || 0),
      0
    );
    const targetMonthlyVolume = goals.targetMonthlyVolumeKg || 45000;
    const volumePercent = Math.min(100, Math.round((totalMonthVolume / targetMonthlyVolume) * 100));

    // Target muscle group completed sets across recent workouts
    const focusMuscles = goals.targetMuscleGroups || ['Chest', 'Back', 'Quadriceps'];
    const muscleSetCounts: Record<string, number> = {};
    focusMuscles.forEach((m) => (muscleSetCounts[m] = 0));

    // Check completed sets in logs for focus muscles
    workoutLogs.slice(0, 15).forEach((log) => {
      if (log.exercises) {
        log.exercises.forEach((ex) => {
          const muscle = ex.targetMuscle || '';
          focusMuscles.forEach((fm) => {
            if (muscle.toLowerCase().includes(fm.toLowerCase())) {
              const setsCount = ex.completedSets ? ex.completedSets.length : 3;
              muscleSetCounts[fm] = (muscleSetCounts[fm] || 0) + setsCount;
            }
          });
        });
      }
    });

    const targetGain = goals.targetMuscleGainKg || 3.5;
    // Estimated hypertrophic stimulus based on sets & volume adherence
    const stimulusScore = Math.min(100, Math.round((volumePercent * 0.6) + (frequencyStats.weeklySessionsPercent * 0.4)));

    return {
      totalMonthVolume,
      targetMonthlyVolume,
      volumePercent,
      targetGain,
      muscleSetCounts,
      focusMuscles,
      stimulusScore,
    };
  }, [frequencyStats.thisMonthLogs, frequencyStats.weeklySessionsPercent, goals.targetMonthlyVolumeKg, goals.targetMuscleGainKg, goals.targetMuscleGroups, workoutLogs]);

  // Overall Goal Completion Index
  const overallScore = Math.round(
    (weightProgress.percent * 0.35) +
    (muscleProgress.volumePercent * 0.35) +
    (frequencyStats.weeklySessionsPercent * 0.30)
  );

  const handleQuickWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickWeightInput);
    if (!val) return;
    updateUserProfile({ weightKg: val });
    setQuickWeightInput('');
    setShowQuickWeight(false);
  };

  const DAYS_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Goals Tracker */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सक्रिय फिटनेस लक्ष्य' : 'Active Fitness Targets'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isHindi ? 'लक्ष्य और प्रगति विश्लेषण' : 'Goals & Milestone Progression'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {goals.motivationNotes ||
                (isHindi
                  ? 'लगातार प्रयास और अनुशासन से ही स्थायी परिणाम मिलते हैं।'
                  : 'Track your bodyweight trajectory, hypertrophic volume stimulus, and weekly session frequency.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-2xl p-4 flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-slate-700"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * Math.min(100, overallScore)) / 100}
                    strokeLinecap="round"
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-base font-black text-white">{Math.min(100, overallScore)}%</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {isHindi ? 'समग्र लक्ष्य स्कोर' : 'Goal Completion'}
                </div>
                <div className="text-sm font-extrabold text-emerald-400 mt-0.5">
                  {overallScore >= 80 ? '🔥 On Fire' : overallScore >= 50 ? '⚡ Strong Pace' : '🌱 Progressing'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isHindi ? '3 प्रमुख आयाम सक्रिय' : '3 core targets tracked'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSettingModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isHindi ? 'लक्ष्य संपादित करें' : 'Edit Goals'}</span>
            </button>
          </div>
        </div>

        {/* Quick Goal Badges Pill Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-xl p-3 flex items-center gap-3 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {isHindi ? 'वजन लक्ष्य' : 'Weight Goal'}
              </div>
              <div className="text-xs font-bold text-white">
                {targetWeight} {unit} ({goals.weightGoalType.toUpperCase()})
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 flex items-center gap-3 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {isHindi ? 'मांसपेशी विकास' : 'Muscle Target'}
              </div>
              <div className="text-xs font-bold text-white">
                +{goals.targetMuscleGainKg} {unit} Lean Mass ({goals.targetMonthlyVolumeKg.toLocaleString()}kg)
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 flex items-center gap-3 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {isHindi ? 'कसरत आवृत्ति' : 'Frequency Target'}
              </div>
              <div className="text-xs font-bold text-white">
                {goals.targetWorkoutsPerWeek} Days / Week (~{goals.targetActiveMinutesPerWeek} mins)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 CORE PROGRESS CARDS: WEIGHT, MUSCLE GAIN, ACTIVITY FREQUENCY            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ----------------------------------------------------------------------- */}
        {/* CARD 1: TARGET WEIGHT PROGRESS                                          */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isHindi ? '1. लक्षित वजन प्रगति' : '1. Target Weight Progress'}
                  </h2>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {goals.weightGoalType.toUpperCase()} STRATEGY
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                {weightProgress.percent}%
              </span>
            </div>

            {/* Current vs Target vs Starting Stats */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  {isHindi ? 'प्रारंभ' : 'Start'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {startingWeight} {unit}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] font-semibold text-emerald-700 block">
                  {isHindi ? 'वर्तमान' : 'Current'}
                </span>
                <span className="text-sm font-mono font-black text-emerald-600">
                  {currentWeight} {unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  {isHindi ? 'लक्ष्य' : 'Target'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {targetWeight} {unit}
                </span>
              </div>
            </div>

            {/* Visual Segmented Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-600 font-semibold">
                <span>{startingWeight} {unit}</span>
                <span className="text-emerald-600 font-bold">
                  {weightProgress.remainingDelta.toFixed(1)} {unit} {weightProgress.isGain ? 'left to gain' : 'left to lose'}
                </span>
                <span>{targetWeight} {unit}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, weightProgress.percent)}%` }}
                />
              </div>
            </div>

            {/* Trajectory Details */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {isHindi ? 'अनुमानित समय' : 'Projected Completion'}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  ~{weightProgress.estimatedWeeks} weeks ({goals.targetWeightDate || 'On Track'})
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  {isHindi ? 'साप्ताहिक दर' : 'Target Weekly Rate'}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {goals.weeklyRateKg || 0.35} {unit}/week
                </span>
              </div>
            </div>
          </div>

          {/* Quick Update Scale Weight Form */}
          <div>
            {!showQuickWeight ? (
              <button
                type="button"
                onClick={() => setShowQuickWeight(true)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'आज का वजन दर्ज करें' : 'Log Today\'s Weight'}</span>
              </button>
            ) : (
              <form onSubmit={handleQuickWeightSubmit} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder={`New weight (${unit})`}
                    value={quickWeightInput}
                    onChange={(e) => setQuickWeightInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickWeight(false)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CARD 2: MUSCLE GAIN & HYPERTROPHY PROGRESS                               */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isHindi ? '2. मांसपेशी लाभ प्रगति' : '2. Muscle Gain & Tonnage'}
                  </h2>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    HYPERTROPHY STIMULUS
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                {muscleProgress.volumePercent}% Vol
              </span>
            </div>

            {/* Monthly Volume Progress Bar */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  {isHindi ? 'मासिक वॉल्यूम लक्ष्य:' : 'Monthly Tonnage Goal:'}
                </span>
                <span className="font-mono font-bold text-blue-600">
                  {muscleProgress.totalMonthVolume.toLocaleString()} / {muscleProgress.targetMonthlyVolume.toLocaleString()} kg
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, muscleProgress.volumePercent)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                <span>{isHindi ? 'लीन मास लक्ष्य:' : 'Lean Mass Target:'} +{goals.targetMuscleGainKg} {unit}</span>
                <span className="font-bold text-blue-700">
                  {muscleProgress.volumePercent >= 75 ? 'Optimal Stimulus' : 'Building Up'}
                </span>
              </div>
            </div>

            {/* Focus Muscle Sets Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{isHindi ? 'लक्षित मांसपेशियों के सेट्स' : 'Priority Muscles Sets Logged'}</span>
                <span className="text-[10px] text-slate-400 font-normal">Recent logs</span>
              </div>

              <div className="space-y-2">
                {muscleProgress.focusMuscles.slice(0, 4).map((muscle) => {
                  const sets = muscleProgress.muscleSetCounts[muscle] || 0;
                  // Benchmark: 10-20 direct sets is optimal
                  const targetSets = 16;
                  const percent = Math.min(100, Math.round((sets / targetSets) * 100));

                  return (
                    <div key={muscle} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{muscle}</span>
                        <span className="font-mono text-slate-500">
                          {sets} sets <span className="text-[10px] text-slate-400">/ {targetSets} opt</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Target Body Measurement Benchmarks */}
          <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100 text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">
              {isHindi ? 'परिधि लक्ष्य:' : 'Target Size:'}
            </span>
            <div className="flex items-center gap-2 font-mono font-bold text-blue-900">
              {goals.targetChestCm && <span>Chest: {goals.targetChestCm}cm</span>}
              {goals.targetArmsCm && <span>• Arms: {goals.targetArmsCm}cm</span>}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CARD 3: ACTIVITY FREQUENCY & WEEKLY CONSISTENCY                           */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {isHindi ? '3. गतिविधि और आवृत्ति' : '3. Activity Frequency'}
                  </h2>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    WEEKLY ADHERENCE
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                {frequencyStats.completedSessionsThisWeek} / {frequencyStats.targetWorkouts}d
              </span>
            </div>

            {/* Weekly Days Checkmarks Grid */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>{isHindi ? 'इस सप्ताह का शेड्यूल' : 'Current Week Adherence'}</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  {frequencyStats.weeklySessionsPercent}% Hitting Goal
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {DAYS_LABELS.map((day, idx) => {
                  const isCompleted = frequencyStats.daysMap[idx];
                  const isPreferred = goals.preferredDays?.includes(day);
                  const isToday = frequencyStats.dayOfWeekIndex === idx;

                  return (
                    <div
                      key={day}
                      className={`flex flex-col items-center justify-center py-2 rounded-xl border text-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                          : isToday
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-1 ring-amber-400'
                          : isPreferred
                          ? 'bg-slate-50 border-dashed border-slate-300 text-slate-600'
                          : 'bg-slate-50/50 border-transparent text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{day[0]}</span>
                      <div className="mt-1">
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block my-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Active Minutes Bar */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  {isHindi ? 'सक्रिय प्रशिक्षण समय:' : 'Active Gym Time:'}
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {frequencyStats.activeMinutesThisWeek} / {frequencyStats.targetMins} mins
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, frequencyStats.weeklyMinutesPercent)}%` }}
                />
              </div>
            </div>

            {/* Monthly Benchmark */}
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 text-slate-600">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                {isHindi ? 'मासिक पूर्ण सत्र' : 'Monthly Completed Sessions'}
              </span>
              <span className="font-mono font-bold text-slate-900">
                {frequencyStats.completedSessionsThisMonth} / {frequencyStats.targetMonthlySessions}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>{isHindi ? 'पसंदीदा प्रशिक्षण दिन:' : 'Scheduled Days:'}</span>
            <span className="font-bold text-slate-800">
              {goals.preferredDays?.join(', ') || 'Mon, Tue, Thu, Fri'}
            </span>
          </div>
        </div>
      </div>

      {/* Goal Setting Modal */}
      <GoalSettingModal
        isOpen={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}
      />
    </div>
  );
};
