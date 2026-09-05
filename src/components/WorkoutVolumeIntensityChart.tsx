import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Zap,
  Dumbbell,
  Calendar,
  Layers,
  Award,
  Info,
  CheckCircle2,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import { CompletedWorkoutLog } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WorkoutVolumeIntensityChartProps {
  workoutLogs: CompletedWorkoutLog[];
  weightUnit?: string;
}

// Curated 8-session benchmark dataset to illustrate progressive overload when logs are few
const DEMO_BENCHMARK_LOGS: CompletedWorkoutLog[] = [
  {
    id: 'demo-w1',
    title: 'Push Power (Chest/Shoulders/Triceps)',
    date: '2026-07-20T09:30:00.000Z',
    durationSeconds: 2700,
    totalVolumeKg: 4800,
    completedSetsCount: 14,
    caloriesBurned: 340,
    exercises: [{ name: 'Barbell Bench Press', targetMuscle: 'Chest', completedSets: [{ weightKg: 70, reps: 8 }] }],
    rpeAverage: 7.5,
  },
  {
    id: 'demo-w2',
    title: 'Pull Hypertrophy (Back/Biceps)',
    date: '2026-07-23T10:00:00.000Z',
    durationSeconds: 2850,
    totalVolumeKg: 5200,
    completedSetsCount: 15,
    caloriesBurned: 360,
    exercises: [{ name: 'Barbell Row', targetMuscle: 'Back', completedSets: [{ weightKg: 65, reps: 8 }] }],
    rpeAverage: 7.8,
  },
  {
    id: 'demo-w3',
    title: 'Legs & Core Power',
    date: '2026-07-27T09:00:00.000Z',
    durationSeconds: 3100,
    totalVolumeKg: 5900,
    completedSetsCount: 16,
    caloriesBurned: 420,
    exercises: [{ name: 'Barbell Squat', targetMuscle: 'Quads', completedSets: [{ weightKg: 100, reps: 6 }] }],
    rpeAverage: 8.0,
  },
  {
    id: 'demo-w4',
    title: 'Push Hypertrophy',
    date: '2026-07-31T09:30:00.000Z',
    durationSeconds: 3000,
    totalVolumeKg: 6150,
    completedSetsCount: 16,
    caloriesBurned: 390,
    exercises: [{ name: 'Incline Dumbbell Press', targetMuscle: 'Chest', completedSets: [{ weightKg: 28, reps: 10 }] }],
    rpeAverage: 8.2,
  },
  {
    id: 'demo-w5',
    title: 'Pull & Rear Delts Overload',
    date: '2026-08-04T10:15:00.000Z',
    durationSeconds: 2950,
    totalVolumeKg: 6400,
    completedSetsCount: 16,
    caloriesBurned: 385,
    exercises: [{ name: 'Deadlift', targetMuscle: 'Posterior', completedSets: [{ weightKg: 140, reps: 5 }] }],
    rpeAverage: 8.5,
  },
  {
    id: 'demo-w6',
    title: 'Legs Quad & Hamstring Focus',
    date: '2026-08-08T09:00:00.000Z',
    durationSeconds: 3200,
    totalVolumeKg: 6850,
    completedSetsCount: 17,
    caloriesBurned: 430,
    exercises: [{ name: 'Leg Press', targetMuscle: 'Quads', completedSets: [{ weightKg: 220, reps: 10 }] }],
    rpeAverage: 8.6,
  },
  {
    id: 'demo-w7',
    title: 'Upper Body Deload & Quality',
    date: '2026-08-14T09:30:00.000Z',
    durationSeconds: 2400,
    totalVolumeKg: 5100,
    completedSetsCount: 14,
    caloriesBurned: 310,
    exercises: [{ name: 'Dumbbell Bench Press', targetMuscle: 'Chest', completedSets: [{ weightKg: 30, reps: 8 }] }],
    rpeAverage: 7.0,
  },
  {
    id: 'demo-w8',
    title: 'Peak Overload Push & Pull',
    date: '2026-08-20T10:00:00.000Z',
    durationSeconds: 3300,
    totalVolumeKg: 7350,
    completedSetsCount: 17,
    caloriesBurned: 450,
    exercises: [{ name: 'Barbell Flat Bench', targetMuscle: 'Chest', completedSets: [{ weightKg: 85, reps: 6 }] }],
    rpeAverage: 8.8,
  },
];

export const WorkoutVolumeIntensityChart: React.FC<WorkoutVolumeIntensityChartProps> = ({
  workoutLogs = [],
  weightUnit = 'kg',
}) => {
  const { isHindi } = useLanguage();

  // State
  const [viewMode, setViewMode] = useState<'both' | 'volume' | 'intensity'>('both');
  const [timeRange, setTimeRange] = useState<'all' | '7' | '14' | '30'>('all');
  const [useBenchmarkData, setUseBenchmarkData] = useState<boolean>((workoutLogs?.length || 0) < 2);

  // Active logs based on real vs benchmark toggle
  const activeLogs = useMemo(() => {
    if (useBenchmarkData || (workoutLogs?.length || 0) === 0) {
      return DEMO_BENCHMARK_LOGS;
    }
    return workoutLogs;
  }, [useBenchmarkData, workoutLogs]);

  // Sort logs chronologically (oldest -> newest for left-to-right timeline)
  const sortedLogs = useMemo(() => {
    return [...activeLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [activeLogs]);

  // Filter logs based on selected time range
  const filteredLogs = useMemo(() => {
    if (timeRange === 'all') return sortedLogs;
    const count = parseInt(timeRange, 10);
    return sortedLogs.slice(-count);
  }, [sortedLogs, timeRange]);

  // Process data for Recharts LineChart
  const chartData = useMemo(() => {
    return filteredLogs.map((log, index, arr) => {
      const logDate = new Date(log.date);
      const displayDate = logDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      const fullDate = logDate.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const volume = Math.round(log.totalVolumeKg);
      const sets = Math.max(1, log.completedSetsCount || 1);
      // Intensity: Average weight load per working set (kg/set)
      const intensity = Math.round(volume / sets);

      // Previous session comparison for volume delta
      let volumeDelta = 0;
      let volumeDeltaPercent = 0;
      if (index > 0) {
        const prevVolume = Math.round(arr[index - 1].totalVolumeKg);
        volumeDelta = volume - prevVolume;
        volumeDeltaPercent = prevVolume > 0 ? Math.round(((volume - prevVolume) / prevVolume) * 100) : 0;
      }

      return {
        id: log.id,
        sessionIndex: index + 1,
        displayDate,
        fullDate,
        title: log.title || `Workout #${index + 1}`,
        volume,
        intensity,
        sets,
        durationMinutes: Math.round((log.durationSeconds || 0) / 60),
        calories: log.caloriesBurned || 0,
        rpe: log.rpeAverage || 8.0,
        volumeDelta,
        volumeDeltaPercent,
      };
    });
  }, [filteredLogs]);

  // Statistical calculations
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalVolume: 0,
        avgVolume: 0,
        peakVolume: 0,
        avgIntensity: 0,
        peakIntensity: 0,
        progressiveOverloadRate: 0,
      };
    }

    const totalVol = chartData.reduce((acc, d) => acc + d.volume, 0);
    const avgVol = Math.round(totalVol / chartData.length);
    const peakVol = Math.max(...chartData.map((d) => d.volume));

    const totalInt = chartData.reduce((acc, d) => acc + d.intensity, 0);
    const avgInt = Math.round(totalInt / chartData.length);
    const peakInt = Math.max(...chartData.map((d) => d.intensity));

    // Overload comparison: first session vs last session
    const firstVol = chartData[0]?.volume || 0;
    const lastVol = chartData[chartData.length - 1]?.volume || 0;
    const overloadRate =
      firstVol > 0 ? Math.round(((lastVol - firstVol) / firstVol) * 100) : 0;

    return {
      totalVolume: totalVol,
      avgVolume: avgVol,
      peakVolume: peakVol,
      avgIntensity: avgInt,
      peakIntensity: peakInt,
      progressiveOverloadRate: overloadRate,
    };
  }, [chartData]);

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
      {/* Chart Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isHindi
                ? 'प्रोग्रेसिव ओवरलोड विश्लेषण'
                : 'Progressive Overload Analytics'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {isHindi
                ? 'वर्कआउट वॉल्यूम और तीव्रता का समय अनुसार चार्ट'
                : 'Workout Volume & Intensity Over Time'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {isHindi
              ? 'प्रत्येक कसरत सत्र के कुल भार (Volume in kg) और प्रति सेट की तीव्रता (Intensity in kg/set) का विश्लेषण। प्रोग्रेसिव ओवरलोड की निरंतर गति ट्रैक करें।'
              : 'Track cumulative tonnage (Volume in kg) alongside mechanical load per working set (Intensity in kg/set) across every session to ensure systematic progressive overload.'}
          </p>
        </div>

        {/* Real vs Benchmark Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {workoutLogs.length > 0 && (
            <button
              type="button"
              onClick={() => setUseBenchmarkData((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                useBenchmarkData
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle between your live logged workouts and an 8-week progressive overload benchmark"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {useBenchmarkData
                  ? isHindi
                    ? 'बेंचमार्क मॉडल चालू'
                    : 'Viewing Benchmark Model'
                  : isHindi
                    ? 'लाइव लॉग्स चालू'
                    : `My Live Logs (${workoutLogs.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
            {isHindi ? 'दृश्य:' : 'Metric:'}
          </span>
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'both'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isHindi ? 'दोनों (वॉल्यूम + तीव्रता)' : 'Dual (Volume & Intensity)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('volume')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'volume'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{isHindi ? 'केवल वॉल्यूम (kg)' : 'Volume Only (kg)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('intensity')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'intensity'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isHindi ? 'केवल तीव्रता (kg/set)' : 'Intensity Only (kg/set)'}</span>
          </button>
        </div>

        {/* Time Span Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
            <Calendar className="w-3 h-3 inline mr-0.5" />
            {isHindi ? 'सत्र:' : 'Sessions:'}
          </span>
          {(['all', '14', '7'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                timeRange === range
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {range === 'all'
                ? isHindi
                  ? 'सभी सत्र'
                  : 'All Sessions'
                : isHindi
                  ? `अंतिम ${range}`
                  : `Last ${range}`}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>{isHindi ? 'औसत वॉल्यूम' : 'Avg Session Volume'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-600 font-mono mt-1">
            {stats.avgVolume > 1000
              ? `${(stats.avgVolume / 1000).toFixed(1)}t`
              : `${stats.avgVolume.toLocaleString()} ${weightUnit}`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {stats.avgVolume.toLocaleString()} {weightUnit} / {isHindi ? 'सत्र' : 'session'}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>{isHindi ? 'औसत तीव्रता' : 'Avg Intensity'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono mt-1">
            {stats.avgIntensity} <span className="text-sm font-bold text-slate-500">{weightUnit}/set</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'प्रति सेट औसत भार' : 'Average working set load'}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'सर्वोच्च वॉल्यूम' : 'Peak Single Volume'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono mt-1">
            {stats.peakVolume > 1000
              ? `${(stats.peakVolume / 1000).toFixed(1)}t`
              : `${stats.peakVolume.toLocaleString()} ${weightUnit}`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'एकल सत्र का रिकॉर्ड' : 'Personal best in one workout'}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>{isHindi ? 'ओवरलोड प्रगति' : 'Overload Delta'}</span>
          </div>
          <div
            className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
              stats.progressiveOverloadRate >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {stats.progressiveOverloadRate >= 0 ? `+${stats.progressiveOverloadRate}%` : `${stats.progressiveOverloadRate}%`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'प्रारंभिक सत्र की तुलना में' : 'Vs. initial baseline session'}
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1 text-slate-500">
          <div className="flex items-center gap-3">
            {(viewMode === 'both' || viewMode === 'volume') && (
              <span className="flex items-center gap-1.5 font-bold text-blue-600">
                <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" />
                <span>{isHindi ? 'कुल वॉल्यूम (kg)' : 'Volume (kg Tonnage)'}</span>
              </span>
            )}
            {(viewMode === 'both' || viewMode === 'intensity') && (
              <span className="flex items-center gap-1.5 font-bold text-amber-600">
                <span className="w-3 h-1 bg-amber-600 rounded-full inline-block" />
                <span>{isHindi ? 'तीव्रता (kg/set)' : 'Intensity (kg/set)'}</span>
              </span>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {chartData.length} {isHindi ? 'सत्र प्लॉटेड' : 'sessions plotted'}
          </div>
        </div>

        <div className="h-80 sm:h-96 w-full pt-4 bg-slate-50/70 rounded-2xl border border-slate-100 p-2 sm:p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: viewMode === 'volume' ? 15 : 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <XAxis
                dataKey="displayDate"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />

              {/* Left Y-Axis: Workout Volume (kg) */}
              {(viewMode === 'both' || viewMode === 'volume') && (
                <YAxis
                  yAxisId="volume"
                  orientation="left"
                  stroke="#2563eb"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`)}
                  unit="kg"
                />
              )}

              {/* Right Y-Axis: Intensity / Average Set Load (kg/set) */}
              {(viewMode === 'both' || viewMode === 'intensity') && (
                <YAxis
                  yAxisId="intensity"
                  orientation="right"
                  stroke="#d97706"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  unit="kg"
                />
              )}

              {/* Interactive Tooltip with Rich Session Details */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 text-xs space-y-2 font-sans min-w-[220px]">
                        <div className="border-b border-slate-800 pb-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {data.fullDate}
                          </div>
                          <div className="font-bold text-white text-sm truncate">{data.title}</div>
                        </div>

                        <div className="space-y-1.5 font-mono">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Dumbbell className="w-3 h-3 text-blue-400" /> Volume:
                            </span>
                            <span className="text-blue-400 font-bold">
                              {data.volume.toLocaleString()} {weightUnit}
                              {data.volume > 1000 && ` (${(data.volume / 1000).toFixed(1)}t)`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" /> Intensity:
                            </span>
                            <span className="text-amber-400 font-bold">
                              {data.intensity} {weightUnit}/set
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                            <span>Sets Completed:</span>
                            <span className="font-bold text-white">{data.sets} sets</span>
                          </div>

                          {data.durationMinutes > 0 && (
                            <div className="flex items-center justify-between gap-3 text-[11px] text-slate-300">
                              <span>Gym Duration:</span>
                              <span className="font-bold text-white">{data.durationMinutes} min</span>
                            </div>
                          )}

                          {data.calories > 0 && (
                            <div className="flex items-center justify-between gap-3 text-[11px] text-slate-300">
                              <span>Energy Burned:</span>
                              <span className="font-bold text-rose-400">{data.calories} kcal</span>
                            </div>
                          )}

                          {data.volumeDelta !== 0 && (
                            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Overload Delta:</span>
                              <span
                                className={`font-bold ${
                                  data.volumeDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {data.volumeDelta > 0 ? `+${data.volumeDelta}kg (+${data.volumeDeltaPercent}%)` : `${data.volumeDelta}kg (${data.volumeDeltaPercent}%)`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 600 }}
                formatter={(value) => (
                  <span className="text-slate-700 capitalize font-medium">{value}</span>
                )}
              />

              {/* Baseline Reference Line for Average Volume */}
              {viewMode !== 'intensity' && stats.avgVolume > 0 && (
                <ReferenceLine
                  yAxisId="volume"
                  y={stats.avgVolume}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: `Avg: ${(stats.avgVolume / 1000).toFixed(1)}t`,
                    position: 'insideTopRight',
                    fill: '#64748b',
                    fontSize: 10,
                  }}
                />
              )}

              {/* Line 1: Workout Volume Line */}
              {(viewMode === 'both' || viewMode === 'volume') && (
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  name={isHindi ? 'कुल वॉल्यूम (kg)' : 'Workout Volume (kg)'}
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#1d4ed8' }}
                />
              )}

              {/* Line 2: Workout Intensity Line */}
              {(viewMode === 'both' || viewMode === 'intensity') && (
                <Line
                  yAxisId="intensity"
                  type="monotone"
                  dataKey="intensity"
                  name={isHindi ? 'तीव्रता (kg/set)' : 'Workout Intensity (kg/set)'}
                  stroke="#d97706"
                  strokeWidth={2.5}
                  strokeDasharray={viewMode === 'both' ? '4 4' : undefined}
                  dot={{ r: 4, fill: '#d97706', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#b45309' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sports Science Coaching Insight Card */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>{isHindi ? 'वैज्ञानिक विश्लेषण एवं सुझाव' : 'Sports Science Principle'}</span>
              <span className="text-[10px] px-2 py-0.2 bg-blue-200 text-blue-800 rounded-md font-mono font-semibold">
                Hypertrophy Selye General Adaptation
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {isHindi
                ? 'मांसपेशियों के विकास के लिए हर 3-4 सप्ताह में वॉल्यूम में 2.5% से 5% की क्रमिक वृद्धि (Progressive Overload) सबसे आदर्श मानी जाती है। यदि 4 सप्ताह तक तीव्रता लगातार 85%+ रहे तो 1 सप्ताह का डीलोड (Deload) अवश्य लें।'
                : 'For continuous muscle hypertrophy without central nervous system burnout, aim for a gradual 2.5%–5% weekly progression in volume or intensity. When high intensity persists over 4–6 consecutive weeks, schedule a planned deload.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isHindi ? 'सक्रिय ट्रैकिंग' : 'Optimal Trajectory'}</span>
        </div>
      </div>
    </div>
  );
};
