import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Zap,
  Target,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Dumbbell,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Activity,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CompletedWorkoutLog } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WeeklyConsistencyTrendsChartProps {
  workoutLogs?: CompletedWorkoutLog[];
  weeklyTargetSessions?: number;
  weightUnit?: string;
}

interface WeekDataPoint {
  weekLabel: string;
  shortLabel: string;
  startDateStr: string;
  endDateStr: string;
  sessionsCompleted: number;
  targetSessions: number;
  adherencePercent: number;
  totalVolumeKg: number;
  totalDurationMinutes: number;
  totalCalories: number;
  completedSets: number;
  averageRpe: number;
  volumeDeltaPercent: number;
  isTargetMet: boolean;
}

// 8-week progressive overload benchmark dataset for new users or demoing trends
const BENCHMARK_WEEKLY_DATA: WeekDataPoint[] = [
  {
    weekLabel: 'Week 1 (Base)',
    shortLabel: 'Wk 1',
    startDateStr: 'Jul 6',
    endDateStr: 'Jul 12',
    sessionsCompleted: 3,
    targetSessions: 4,
    adherencePercent: 75,
    totalVolumeKg: 14200,
    totalDurationMinutes: 135,
    totalCalories: 1020,
    completedSets: 42,
    averageRpe: 7.2,
    volumeDeltaPercent: 0,
    isTargetMet: false,
  },
  {
    weekLabel: 'Week 2 (Habit)',
    shortLabel: 'Wk 2',
    startDateStr: 'Jul 13',
    endDateStr: 'Jul 19',
    sessionsCompleted: 4,
    targetSessions: 4,
    adherencePercent: 100,
    totalVolumeKg: 16800,
    totalDurationMinutes: 180,
    totalCalories: 1380,
    completedSets: 54,
    averageRpe: 7.5,
    volumeDeltaPercent: 18.3,
    isTargetMet: true,
  },
  {
    weekLabel: 'Week 3 (Overload)',
    shortLabel: 'Wk 3',
    startDateStr: 'Jul 20',
    endDateStr: 'Jul 26',
    sessionsCompleted: 4,
    targetSessions: 4,
    adherencePercent: 100,
    totalVolumeKg: 18500,
    totalDurationMinutes: 195,
    totalCalories: 1490,
    completedSets: 58,
    averageRpe: 7.8,
    volumeDeltaPercent: 10.1,
    isTargetMet: true,
  },
  {
    weekLabel: 'Week 4 (Deload)',
    shortLabel: 'Wk 4',
    startDateStr: 'Jul 27',
    endDateStr: 'Aug 2',
    sessionsCompleted: 3,
    targetSessions: 4,
    adherencePercent: 75,
    totalVolumeKg: 13900,
    totalDurationMinutes: 130,
    totalCalories: 980,
    completedSets: 40,
    averageRpe: 6.8,
    volumeDeltaPercent: -24.8,
    isTargetMet: false,
  },
  {
    weekLabel: 'Week 5 (Ramp Up)',
    shortLabel: 'Wk 5',
    startDateStr: 'Aug 3',
    endDateStr: 'Aug 9',
    sessionsCompleted: 4,
    targetSessions: 4,
    adherencePercent: 100,
    totalVolumeKg: 19800,
    totalDurationMinutes: 205,
    totalCalories: 1560,
    completedSets: 60,
    averageRpe: 8.0,
    volumeDeltaPercent: 42.4,
    isTargetMet: true,
  },
  {
    weekLabel: 'Week 6 (Hypertrophy)',
    shortLabel: 'Wk 6',
    startDateStr: 'Aug 10',
    endDateStr: 'Aug 16',
    sessionsCompleted: 5,
    targetSessions: 4,
    adherencePercent: 125,
    totalVolumeKg: 22400,
    totalDurationMinutes: 235,
    totalCalories: 1820,
    completedSets: 70,
    averageRpe: 8.2,
    volumeDeltaPercent: 13.1,
    isTargetMet: true,
  },
  {
    weekLabel: 'Week 7 (Peak Strength)',
    shortLabel: 'Wk 7',
    startDateStr: 'Aug 17',
    endDateStr: 'Aug 23',
    sessionsCompleted: 4,
    targetSessions: 4,
    adherencePercent: 100,
    totalVolumeKg: 24100,
    totalDurationMinutes: 215,
    totalCalories: 1680,
    completedSets: 66,
    averageRpe: 8.5,
    volumeDeltaPercent: 7.6,
    isTargetMet: true,
  },
  {
    weekLabel: 'Week 8 (Current Surge)',
    shortLabel: 'Wk 8',
    startDateStr: 'Aug 24',
    endDateStr: 'Aug 30',
    sessionsCompleted: 5,
    targetSessions: 4,
    adherencePercent: 125,
    totalVolumeKg: 26200,
    totalDurationMinutes: 245,
    totalCalories: 1950,
    completedSets: 72,
    averageRpe: 8.6,
    volumeDeltaPercent: 8.7,
    isTargetMet: true,
  },
];

export const WeeklyConsistencyTrendsChart: React.FC<WeeklyConsistencyTrendsChartProps> = ({
  workoutLogs = [],
  weeklyTargetSessions = 4,
  weightUnit = 'kg',
}) => {
  const { isHindi } = useLanguage();

  // Mode: 'consistency' (Sessions vs Target) | 'volume' (Overload & Tonnage) | 'duration' (Time & Calories) | 'days' (Day of week)
  const [activeChartTab, setActiveChartTab] = useState<'consistency' | 'volume' | 'duration' | 'days'>('consistency');

  // Time window: 4, 8, or 12 weeks
  const [timeWindow, setTimeWindow] = useState<4 | 8 | 12>(8);

  // Fallback to progressive benchmark data if user has fewer than 2 logged sessions
  const [useBenchmark, setUseBenchmark] = useState<boolean>(() => (workoutLogs?.length || 0) < 3);

  // Celebration state
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // Group user's actual logs into weeks
  const computedWeeklyData = useMemo<WeekDataPoint[]>(() => {
    if (useBenchmark || (workoutLogs?.length || 0) === 0) {
      return BENCHMARK_WEEKLY_DATA.slice(-timeWindow);
    }

    // Sort logs chronologically
    const sorted = [...workoutLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group logs into 7-day windows starting from the earliest log or rolling backwards from now
    const now = new Date();
    const weeks: WeekDataPoint[] = [];
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    for (let w = timeWindow - 1; w >= 0; w--) {
      const end = new Date(now.getTime() - w * oneWeekMs);
      const start = new Date(end.getTime() - oneWeekMs);

      const logsInWeek = sorted.filter((l) => {
        const d = new Date(l.date).getTime();
        return d >= start.getTime() && d < end.getTime();
      });

      const sessionsCompleted = logsInWeek.length;
      const targetSessions = weeklyTargetSessions;
      const adherencePercent = Math.round((sessionsCompleted / targetSessions) * 100);
      const totalVolumeKg = logsInWeek.reduce((acc, l) => acc + (l.totalVolumeKg || 0), 0);
      const totalDurationMinutes = logsInWeek.reduce(
        (acc, l) => acc + Math.round((l.durationSeconds || 0) / 60),
        0
      );
      const totalCalories = logsInWeek.reduce((acc, l) => acc + (l.caloriesBurned || 0), 0);
      const completedSets = logsInWeek.reduce((acc, l) => acc + (l.completedSetsCount || 0), 0);
      const rpeLogs = logsInWeek.filter((l) => l.rpeAverage && l.rpeAverage > 0);
      const averageRpe =
        rpeLogs.length > 0
          ? Number((rpeLogs.reduce((acc, l) => acc + (l.rpeAverage || 0), 0) / rpeLogs.length).toFixed(1))
          : 7.5;

      const weekNumber = timeWindow - w;
      const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      weeks.push({
        weekLabel: `Week ${weekNumber} (${startStr})`,
        shortLabel: `Wk ${weekNumber}`,
        startDateStr: startStr,
        endDateStr: endStr,
        sessionsCompleted,
        targetSessions,
        adherencePercent,
        totalVolumeKg,
        totalDurationMinutes,
        totalCalories,
        completedSets,
        averageRpe,
        volumeDeltaPercent: 0,
        isTargetMet: sessionsCompleted >= targetSessions,
      });
    }

    // Calculate volume delta week-over-week
    for (let i = 0; i < weeks.length; i++) {
      if (i === 0 || weeks[i - 1].totalVolumeKg === 0) {
        weeks[i].volumeDeltaPercent = 0;
      } else {
        const prevVol = weeks[i - 1].totalVolumeKg;
        const curVol = weeks[i].totalVolumeKg;
        const delta = Math.round(((curVol - prevVol) / prevVol) * 100);
        weeks[i].volumeDeltaPercent = delta;
      }
    }

    return weeks;
  }, [useBenchmark, workoutLogs, timeWindow, weeklyTargetSessions]);

  // Day-of-week frequency breakdown for Habit Analysis
  const dayOfWeekDistribution = useMemo(() => {
    const counts = [
      { dayEn: 'Mon', dayHi: 'सोम', sessions: 0, color: '#10b981' },
      { dayEn: 'Tue', dayHi: 'मंगल', sessions: 0, color: '#06b6d4' },
      { dayEn: 'Wed', dayHi: 'बुध', sessions: 0, color: '#3b82f6' },
      { dayEn: 'Thu', dayHi: 'गुरु', sessions: 0, color: '#6366f1' },
      { dayEn: 'Fri', dayHi: 'शुक्र', sessions: 0, color: '#a855f7' },
      { dayEn: 'Sat', dayHi: 'शनि', sessions: 0, color: '#ec4899' },
      { dayEn: 'Sun', dayHi: 'रवि', sessions: 0, color: '#f59e0b' },
    ];

    const sourceLogs = useBenchmark ? [] : workoutLogs;
    if (sourceLogs.length > 0) {
      sourceLogs.forEach((l) => {
        const d = new Date(l.date);
        const dayIdx = (d.getDay() + 6) % 7; // Monday = 0
        if (counts[dayIdx]) counts[dayIdx].sessions += 1;
      });
    } else {
      // Realistic representative frequency for benchmark
      counts[0].sessions = 7; // Mon
      counts[1].sessions = 6; // Tue
      counts[2].sessions = 5; // Wed
      counts[3].sessions = 6; // Thu
      counts[4].sessions = 7; // Fri
      counts[5].sessions = 4; // Sat
      counts[6].sessions = 1; // Sun
    }

    return counts;
  }, [useBenchmark, workoutLogs]);

  // Aggregate Consistency & Overload Metrics
  const aggregateMetrics = useMemo(() => {
    if (computedWeeklyData.length === 0) {
      return {
        overallAdherence: 0,
        weeksTargetMet: 0,
        totalWeeks: 0,
        consecutiveConsistentWeeks: 0,
        averageWeeklyVolume: 0,
        latestVolumeDelta: 0,
        peakVolumeWeek: null as WeekDataPoint | null,
        totalSessionsLogged: 0,
      };
    }

    const totalWeeks = computedWeeklyData.length;
    const weeksTargetMet = computedWeeklyData.filter((w) => w.isTargetMet).length;
    const overallAdherence = Math.round(
      computedWeeklyData.reduce((acc, w) => acc + w.adherencePercent, 0) / totalWeeks
    );
    const totalSessionsLogged = computedWeeklyData.reduce((acc, w) => acc + w.sessionsCompleted, 0);
    const averageWeeklyVolume = Math.round(
      computedWeeklyData.reduce((acc, w) => acc + w.totalVolumeKg, 0) / totalWeeks
    );

    // Calculate current consecutive weeks meeting target from latest backwards
    let streak = 0;
    for (let i = computedWeeklyData.length - 1; i >= 0; i--) {
      if (computedWeeklyData[i].isTargetMet) {
        streak++;
      } else {
        break;
      }
    }

    const latest = computedWeeklyData[computedWeeklyData.length - 1];
    const latestVolumeDelta = latest ? latest.volumeDeltaPercent : 0;

    let peakWeek = computedWeeklyData[0];
    for (const w of computedWeeklyData) {
      if (w.totalVolumeKg > peakWeek.totalVolumeKg) {
        peakWeek = w;
      }
    }

    return {
      overallAdherence,
      weeksTargetMet,
      totalWeeks,
      consecutiveConsistentWeeks: streak,
      averageWeeklyVolume,
      latestVolumeDelta,
      peakVolumeWeek: peakWeek,
      totalSessionsLogged,
    };
  }, [computedWeeklyData]);

  // Interactive Confetti Celebration trigger
  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const msg = isHindi
      ? `शानदार निरंतरता! आपने पिछले ${aggregateMetrics.totalWeeks} हफ़्तों में ${aggregateMetrics.overallAdherence}% लक्ष्य हासिल किया है!`
      : `Outstanding Dedication! You've maintained ${aggregateMetrics.overallAdherence}% consistency over the past ${aggregateMetrics.totalWeeks} weeks!`;

    setCelebrationMessage(msg);
    setTimeout(() => setCelebrationMessage(null), 4500);
  };

  // Custom Recharts Tooltip with high contrast and readable typography
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: WeekDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[210px] animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-extrabold text-white text-sm">{data.weekLabel}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {data.startDateStr} – {data.endDateStr}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                {isHindi ? 'सत्र (लक्ष्य)' : 'Sessions (Goal)'}:
              </span>
              <span className="font-bold text-white font-mono">
                <strong className={data.isTargetMet ? 'text-emerald-400' : 'text-amber-400'}>
                  {data.sessionsCompleted}
                </strong>{' '}
                / {data.targetSessions}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                {isHindi ? 'कुल वजन' : 'Volume'}:
              </span>
              <span className="font-bold text-blue-300 font-mono">
                {data.totalVolumeKg > 1000
                  ? `${(data.totalVolumeKg / 1000).toFixed(1)}t`
                  : `${data.totalVolumeKg} ${weightUnit}`}
              </span>
            </div>

            {data.volumeDeltaPercent !== 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isHindi ? 'प्रगति वृद्धि' : 'Overload Delta'}:</span>
                <span
                  className={`font-mono font-bold ${
                    data.volumeDeltaPercent > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {data.volumeDeltaPercent > 0 ? `+${data.volumeDeltaPercent}%` : `${data.volumeDeltaPercent}%`}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {isHindi ? 'प्रशिक्षण समय' : 'Duration'}:
              </span>
              <span className="font-bold text-slate-200 font-mono">{data.totalDurationMinutes} min</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {isHindi ? 'कैलोरी' : 'Energy'}:
              </span>
              <span className="font-bold text-orange-300 font-mono">{data.totalCalories} kcal</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">{isHindi ? 'निरंतरता दर' : 'Adherence'}:</span>
            <span
              className={`font-black font-mono px-2 py-0.5 rounded-full ${
                data.isTargetMet
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {data.adherencePercent}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Motivational Banner / Top Header */}
      <div className="p-6 md:p-8 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                {isHindi ? 'साप्ताहिक निरंतरता व प्रगति चार्ट' : 'Weekly Consistency & Progress Trends'}
              </span>

              {aggregateMetrics.consecutiveConsistentWeeks > 0 && (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {aggregateMetrics.consecutiveConsistentWeeks}{' '}
                  {isHindi ? 'हफ़्तों की निरंतर स्ट्रीक' : 'Week Target Streak'}
                </span>
              )}

              {useBenchmark && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-semibold">
                  {isHindi ? 'प्रगतिशील ओवरलोड बेंचमार्क' : '8-Week Overload Benchmark'}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{isHindi ? 'साप्ताहिक कसरत निरंतरता व रुझान' : 'Workout Consistency & Overload Trends'}</span>
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {isHindi
                ? 'मांसपेशियों के विकास और ताकत के लिए निरंतरता सबसे बड़ा नियम है। अपने साप्ताहिक लक्ष्यों, वॉल्यूम ओवरलोड और प्रशिक्षण आदतों को रीचार्ट्स के जीवंत विज़ुअलाइज़ेशन द्वारा ट्रैक करें।'
                : 'Progressive overload and consistency are the foundation of muscle hypertrophy. Visualize your weekly sessions against goal, tonnage progression, and habit streaks.'}
            </p>
          </div>

          {/* Controls: Time Window, Benchmark Toggle & Celebrate Button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Time Window (4, 8, 12 weeks) */}
            <div className="flex items-center bg-slate-800/90 rounded-2xl border border-slate-700 p-1">
              {[4, 8, 12].map((w) => (
                <button
                  key={w}
                  onClick={() => setTimeWindow(w as 4 | 8 | 12)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timeWindow === w
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w} {isHindi ? 'हफ़्ते' : 'Wks'}
                </button>
              ))}
            </div>

            {/* Toggle Real vs Benchmark Data if user has few logs */}
            <button
              onClick={() => setUseBenchmark((prev) => !prev)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                useBenchmark
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Toggle between your logged data and standard 8-week progressive benchmark"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>{useBenchmark ? (isHindi ? 'बेंचमार्क डेटा' : 'Benchmark') : isHindi ? 'मेरा डेटा' : 'My Logs'}</span>
            </button>

            {/* Celebrate Momentum Button with Confetti */}
            <button
              onClick={handleCelebrate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Award className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{isHindi ? 'जश्न मनाएं' : 'Celebrate Streak'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Motivational Celebration Toast */}
      <AnimatePresence>
        {celebrationMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-3 flex items-center justify-between text-xs text-emerald-200 font-bold"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
              <span>{celebrationMessage}</span>
            </div>
            <button
              onClick={() => setCelebrationMessage(null)}
              className="text-emerald-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational KPI Metric Cards with Animated SVG Circular Adherence */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 sm:p-6 bg-slate-950/60 border-b border-slate-800/80">
        {/* Adherence Rate with Animated Circular Progress Ring */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 flex items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              {isHindi ? 'लक्ष्य निरंतरता' : 'Target Consistency'}
            </div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {aggregateMetrics.overallAdherence}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {aggregateMetrics.weeksTargetMet}/{aggregateMetrics.totalWeeks}{' '}
              {isHindi ? 'हफ़्ते पूर्ण' : 'weeks on target'}
            </div>
          </div>

          {/* Animated Circular SVG Ring */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-emerald-400"
                strokeDasharray={`${Math.min(100, aggregateMetrics.overallAdherence)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-emerald-300">
              {aggregateMetrics.overallAdherence}%
            </span>
          </div>
        </div>

        {/* Weekly Overload Trend Delta */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 shadow-xs">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            {isHindi ? 'प्रोग्रेसिव ओवरलोड' : 'Overload Momentum'}
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1 flex items-center gap-1">
            <span>
              {aggregateMetrics.latestVolumeDelta > 0
                ? `+${aggregateMetrics.latestVolumeDelta}%`
                : `${aggregateMetrics.latestVolumeDelta}%`}
            </span>
            {aggregateMetrics.latestVolumeDelta >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isHindi ? 'पिछले सप्ताह की तुलना में' : 'Week-over-week tonnage surge'}
          </div>
        </div>

        {/* Current Active Week Streak */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 shadow-xs">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {isHindi ? 'लगातार स्ट्रीक' : 'Consistency Streak'}
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            {aggregateMetrics.consecutiveConsistentWeeks}
            <span className="text-xs font-sans text-slate-400 ml-1.5 font-normal">
              {isHindi ? 'हफ़्ते' : 'weeks'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isHindi ? 'नियमित लक्ष्य पूर्ति' : 'Consistent goal hit rate'}
          </div>
        </div>

        {/* Peak Record Week */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 shadow-xs">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            {isHindi ? 'सर्वश्रेष्ठ सप्ताह' : 'Peak Week Volume'}
          </div>
          <div className="text-2xl font-black font-mono text-purple-300 mt-1">
            {aggregateMetrics.peakVolumeWeek
              ? aggregateMetrics.peakVolumeWeek.totalVolumeKg > 1000
                ? `${(aggregateMetrics.peakVolumeWeek.totalVolumeKg / 1000).toFixed(1)}t`
                : `${aggregateMetrics.peakVolumeWeek.totalVolumeKg} ${weightUnit}`
              : '0t'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {aggregateMetrics.peakVolumeWeek
              ? `${aggregateMetrics.peakVolumeWeek.shortLabel} (${aggregateMetrics.peakVolumeWeek.sessionsCompleted} sessions)`
              : 'Personal Best Record'}
          </div>
        </div>
      </div>

      {/* Chart Navigation Tabs */}
      <div className="px-5 sm:px-6 pt-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveChartTab('consistency')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'consistency'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'साप्ताहिक निरंतरता (सत्र vs लक्ष्य)' : 'Weekly Consistency (Sessions)'}</span>
          </button>

          <button
            onClick={() => setActiveChartTab('volume')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'volume'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isHindi ? 'वॉल्यूम ओवरलोड रुझान' : 'Progressive Volume Overload'}</span>
          </button>

          <button
            onClick={() => setActiveChartTab('duration')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'duration'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isHindi ? 'समय व कैलोरी खर्च' : 'Duration & Energy Burn'}</span>
          </button>

          <button
            onClick={() => setActiveChartTab('days')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'days'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isHindi ? 'दिनवार आदत विश्लेषण' : 'Day-of-Week Habit'}</span>
          </button>
        </div>

        {/* Legend / Info Helper */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>{isHindi ? 'लक्ष्य पूर्ण (≥ 4 सत्र)' : 'Target Met (≥ 4 sessions)'}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2" />
          <span>{isHindi ? 'अपूर्ण (< 4 सत्र)' : 'Below Target'}</span>
        </div>
      </div>

      {/* Main Recharts Visualizer Stage */}
      <div className="p-5 sm:p-7 min-h-[380px] w-full">
        <AnimatePresence mode="wait">
          {/* TAB 1: COMPOSED SESSIONS & CONSISTENCY ADHERENCE */}
          {activeChartTab === 'consistency' && (
            <motion.div
              key="tab-consistency"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[320px] sm:h-[360px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={computedWeeklyData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                  <defs>
                    {/* Emerald Gradient for Successful Weeks */}
                    <linearGradient id="emeraldSuccessGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                    </linearGradient>

                    {/* Amber Gradient for Partial Weeks */}
                    <linearGradient id="amberPartialGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.4} />
                    </linearGradient>

                    {/* Adherence Line Glow */}
                    <linearGradient id="adherenceLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    domain={[0, 7]}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                    unit=" ses"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#06b6d4"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 150]}
                    unit="%"
                  />

                  <Tooltip content={<CustomRechartsTooltip />} />

                  {/* Target Reference Line */}
                  <ReferenceLine
                    yAxisId="left"
                    y={weeklyTargetSessions}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: `Target Goal: ${weeklyTargetSessions}/wk`,
                      fill: '#10b981',
                      position: 'top',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />

                  {/* Animated Bar of Completed Sessions */}
                  <Bar
                    yAxisId="left"
                    dataKey="sessionsCompleted"
                    name={isHindi ? 'पूर्ण सत्र' : 'Sessions Completed'}
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {computedWeeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isTargetMet
                            ? 'url(#emeraldSuccessGradient)'
                            : 'url(#amberPartialGradient)'
                        }
                      />
                    ))}
                  </Bar>

                  {/* Animated Adherence % Line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="adherencePercent"
                    name={isHindi ? 'निरंतरता दर (%)' : 'Consistency %'}
                    stroke="url(#adherenceLineGrad)"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 7, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* TAB 2: PROGRESSIVE OVERLOAD & TONNAGE VOLUME (AREA + LINE) */}
          {activeChartTab === 'volume' && (
            <motion.div
              key="tab-volume"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[320px] sm:h-[360px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={computedWeeklyData} margin={{ top: 20, right: 20, left: -5, bottom: 10 }}>
                  <defs>
                    <linearGradient id="volumeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}t` : `${val}`)}
                  />

                  <Tooltip content={<CustomRechartsTooltip />} />

                  {/* Volume Area with Animated Entry */}
                  <Area
                    type="monotone"
                    dataKey="totalVolumeKg"
                    name={isHindi ? 'कुल वजन मात्रा (kg)' : 'Tonnage Volume (kg)'}
                    stroke="#60a5fa"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#volumeAreaGradient)"
                    isAnimationActive={true}
                    animationDuration={1300}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* TAB 3: DURATION MINUTES & CALORIES (DUAL AXIS) */}
          {activeChartTab === 'duration' && (
            <motion.div
              key="tab-duration"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[320px] sm:h-[360px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={computedWeeklyData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="durationBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#b45309" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    unit="m"
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#fb923c"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit=" kcal"
                  />

                  <Tooltip content={<CustomRechartsTooltip />} />

                  <Bar
                    yAxisId="left"
                    dataKey="totalDurationMinutes"
                    name={isHindi ? 'प्रशिक्षण समय (मिनट)' : 'Training Duration (mins)'}
                    fill="url(#durationBarGradient)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalCalories"
                    name={isHindi ? 'कैलोरी खर्च' : 'Calories (kcal)'}
                    stroke="#fb923c"
                    strokeWidth={3}
                    dot={{ fill: '#fb923c', r: 4 }}
                    isAnimationActive={true}
                    animationDuration={1400}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* TAB 4: DAY OF WEEK HABIT FREQUENCY */}
          {activeChartTab === 'days' && (
            <motion.div
              key="tab-days"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[320px] sm:h-[360px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekDistribution} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                  <XAxis
                    dataKey={isHindi ? 'dayHi' : 'dayEn'}
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    unit=" ses"
                    axisLine={{ stroke: '#334155' }}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white text-sm">
                              {isHindi ? d.dayHi : d.dayEn}
                            </div>
                            <div className="text-emerald-400 font-mono font-bold">
                              {d.sessions} {isHindi ? 'कुल सत्र संपन्न' : 'Total Sessions Completed'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {d.sessions >= 5
                                ? isHindi
                                  ? 'अति सक्रिय प्रशिक्षण दिवस 🔥'
                                  : 'High-frequency training day 🔥'
                                : isHindi
                                ? 'संतुलित प्रशिक्षण या सक्रिय आराम'
                                : 'Moderate or rest day'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    name={isHindi ? 'सत्रों की संख्या' : 'Session Count'}
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {dayOfWeekDistribution.map((entry, index) => (
                      <Cell key={`day-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Motivational Coach Takeaway Footer */}
      <div className="p-5 sm:p-6 bg-slate-950/70 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isHindi ? 'एआई कोच निरंतरता विश्लेषण' : 'AI Consistency Coach Insight'}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              {aggregateMetrics.overallAdherence >= 80
                ? isHindi
                  ? 'असाधारण निरंतरता! आप शीर्ष 5% एथलीट्स की तरह नियमितता बनाए हुए हैं। प्रोग्रेसिव ओवरलोड सीधे आपकी मांसपेशियों में हाइपरट्रॉफी ला रहा है।'
                  : 'Exceptional consistency! You are maintaining a target adherence rate above 80%. Progressive overload is compounding your strength and hypertrophy adaptation.'
                : aggregateMetrics.overallAdherence >= 50
                ? isHindi
                  ? 'स्थिर प्रगति! अपनी मांसपेशियों के पूर्ण विकास के लिए इस सप्ताह केवल 1 अतिरिक्त वर्कआउट सत्र जोड़ें।'
                  : 'Steady progression! Adding just 1 focused session this week will maximize your weekly muscle protein synthesis frequency.'
                : isHindi
                ? 'हर वर्कआउट महत्वपूर्ण है! परफेक्शन से ज्यादा निरंतरता मायने रखती है। आज अपने अगले 3 ट्रेनिंग दिनों को शेड्यूल करें।'
                : 'Every rep matters! Consistency beats intensity. Commit to scheduling your next 3 training sessions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setActiveChartTab('consistency')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <span>{isHindi ? 'सभी रुझान देखें' : 'View Full Breakdown'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
