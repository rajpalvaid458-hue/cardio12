import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Dumbbell,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  CheckCircle2,
} from 'lucide-react';
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
import { useFitness } from '../../context/FitnessContext';
import { useLanguage } from '../../context/LanguageContext';
import { CompletedWorkoutLog } from '../../types';

export type IntensityMetricType = 'avg_load' | 'density' | 'rpe';
export type TimeRangeFilter = 'all' | '30d' | '14d' | '7d';
export type ViewMode = 'both' | 'volume' | 'intensity';

interface ChartPoint {
  id: string;
  rawDate: string;
  displayDate: string;
  fullDate: string;
  title: string;
  volumeKg: number;
  totalReps: number;
  completedSetsCount: number;
  durationMinutes: number;
  caloriesBurned: number;
  avgLoadKg: number;
  densityKgPerMin: number;
  rpe: number;
  intensityValue: number;
}

export const WorkoutVolumeIntensityChart: React.FC = () => {
  const { workoutLogs } = useFitness();
  const { isHindi } = useLanguage();

  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [intensityMetric, setIntensityMetric] = useState<IntensityMetricType>('avg_load');

  // Format date helper
  const formatDateLabel = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return isoDate;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoDate;
    }
  };

  const formatFullDate = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return isoDate;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  // Transform and sort workout logs chronologically
  const sortedLogs = useMemo(() => {
    const logsCopy = [...workoutLogs];
    return logsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [workoutLogs]);

  // Filter logs based on selected time range
  const filteredLogs = useMemo(() => {
    if (timeRange === 'all') return sortedLogs;

    const now = Date.now();
    const daysMap: Record<TimeRangeFilter, number> = {
      '7d': 7,
      '14d': 14,
      '30d': 30,
      all: Infinity,
    };

    const days = daysMap[timeRange];
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const filtered = sortedLogs.filter((l) => new Date(l.date).getTime() >= cutoff);
    // If filtering yields less than 2 items but more exist in all time, keep at least the last few
    if (filtered.length < 2 && sortedLogs.length >= 2) {
      return sortedLogs.slice(-Math.min(sortedLogs.length, timeRange === '7d' ? 3 : 5));
    }
    return filtered;
  }, [sortedLogs, timeRange]);

  // Generate chart data items with volume & calculated intensity
  const chartData: ChartPoint[] = useMemo(() => {
    return filteredLogs.map((log: CompletedWorkoutLog, index: number) => {
      // Calculate total reps across completed sets
      let totalReps = 0;
      if (log.exercises && Array.isArray(log.exercises)) {
        for (const ex of log.exercises) {
          if (ex.completedSets && Array.isArray(ex.completedSets)) {
            for (const s of ex.completedSets) {
              totalReps += Number(s.reps) || 0;
            }
          }
        }
      }
      if (totalReps === 0) {
        totalReps = (log.completedSetsCount || 10) * 8; // fallback estimate
      }

      const volumeKg = Number(log.totalVolumeKg) || 0;
      const durationMinutes = Math.max(1, Math.round((log.durationSeconds || 1800) / 60));

      // 1. Average load per rep (kg / rep) - fundamental sports science intensity metric
      const avgLoadKg = totalReps > 0 ? Math.round((volumeKg / totalReps) * 10) / 10 : 0;

      // 2. Work density (Volume lifted per minute of workout duration)
      const densityKgPerMin = Math.round(volumeKg / durationMinutes);

      // 3. RPE rating (1-10)
      const rpe = log.rpeAverage || 8.0;

      let intensityValue = avgLoadKg;
      if (intensityMetric === 'density') {
        intensityValue = densityKgPerMin;
      } else if (intensityMetric === 'rpe') {
        intensityValue = rpe;
      }

      return {
        id: log.id || `log-${index}`,
        rawDate: log.date,
        displayDate: formatDateLabel(log.date),
        fullDate: formatFullDate(log.date),
        title: log.title || 'Workout Session',
        volumeKg,
        totalReps,
        completedSetsCount: log.completedSetsCount || 12,
        durationMinutes,
        caloriesBurned: log.caloriesBurned || 350,
        avgLoadKg,
        densityKgPerMin,
        rpe,
        intensityValue,
      };
    });
  }, [filteredLogs, intensityMetric]);

  // Aggregate Metrics
  const totalVolumeInView = useMemo(
    () => chartData.reduce((acc, pt) => acc + pt.volumeKg, 0),
    [chartData]
  );
  const avgVolumePerSession = useMemo(
    () => (chartData.length > 0 ? Math.round(totalVolumeInView / chartData.length) : 0),
    [chartData, totalVolumeInView]
  );

  const avgIntensityInView = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, pt) => acc + pt.intensityValue, 0);
    return Math.round((sum / chartData.length) * 10) / 10;
  }, [chartData]);

  const peakVolume = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map((pt) => pt.volumeKg));
  }, [chartData]);

  // Progressive overload calculation (first vs last in view)
  const volumeGrowthPercent = useMemo(() => {
    if (chartData.length < 2) return null;
    const firstVol = chartData[0].volumeKg;
    const lastVol = chartData[chartData.length - 1].volumeKg;
    if (firstVol <= 0) return null;
    const pct = ((lastVol - firstVol) / firstVol) * 100;
    return Math.round(pct * 10) / 10;
  }, [chartData]);

  // Intensity metric unit label
  const intensityUnitLabel = useMemo(() => {
    switch (intensityMetric) {
      case 'avg_load':
        return 'kg/rep';
      case 'density':
        return 'kg/min';
      case 'rpe':
        return 'RPE (1-10)';
      default:
        return 'kg/rep';
    }
  }, [intensityMetric]);

  const intensityName = useMemo(() => {
    if (isHindi) {
      switch (intensityMetric) {
        case 'avg_load':
          return 'औसत लोड (kg/rep)';
        case 'density':
          return 'वर्क डेंसिटी (kg/min)';
        case 'rpe':
          return 'परसीव्ड इंटेंसिटी (RPE)';
      }
    }
    switch (intensityMetric) {
      case 'avg_load':
        return 'Average Load (kg/rep)';
      case 'density':
        return 'Work Density (kg/min)';
      case 'rpe':
        return 'RPE Intensity (1-10)';
    }
  }, [intensityMetric, isHindi]);

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header with Title and Quick Indicators */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'प्रोग्रेसिव ओवरलोड व इंटेंसिटी' : 'Progressive Overload & Intensity'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{isHindi ? 'वर्कआउट वॉल्यूम और इंटेंसिटी का विश्लेषण' : 'Workout Volume & Intensity Over Time'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isHindi
              ? 'समय के साथ कुल वजन क्षमता (Tonnage kg) और लिफ्टिंग इंटेंसिटी (kg/rep) की प्रगति को Recharts लाइन चार्ट द्वारा ट्रैक करें।'
              : 'Visualize cumulative session tonnage (kg) alongside training load intensity across your historical workout sessions.'}
          </p>
        </div>

        {/* Aggregate Stats Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'औसत वॉल्यूम' : 'Avg Session Volume'}
            </div>
            <div className="text-base font-black text-emerald-700 font-mono">
              {avgVolumePerSession > 1000
                ? `${(avgVolumePerSession / 1000).toFixed(1)}k kg`
                : `${avgVolumePerSession} kg`}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'औसत इंटेंसिटी' : 'Avg Intensity'}
            </div>
            <div className="text-base font-black text-amber-700 font-mono">
              {avgIntensityInView} <span className="text-xs font-semibold text-slate-500">{intensityUnitLabel}</span>
            </div>
          </div>

          {volumeGrowthPercent !== null && (
            <div
              className={`border rounded-2xl px-3.5 py-2 ${
                volumeGrowthPercent >= 0
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50/70 border-rose-200 text-rose-800'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                {volumeGrowthPercent >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-rose-600" />
                )}
                {isHindi ? 'वॉल्यूम ट्रेंड' : 'Volume Growth'}
              </div>
              <div className="text-base font-black font-mono">
                {volumeGrowthPercent >= 0 ? `+${volumeGrowthPercent}%` : `${volumeGrowthPercent}%`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar: View Mode, Time Range, & Intensity Metric */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> {isHindi ? 'दृश्य' : 'View'}:
          </span>
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === 'both'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {isHindi ? 'दोनों (Dual Chart)' : 'Dual (Volume & Intensity)'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('volume')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'volume'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {isHindi ? 'केवल वॉल्यूम' : 'Volume Focus'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('intensity')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'intensity'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            {isHindi ? 'केवल इंटेंसिटी' : 'Intensity Focus'}
          </button>
        </div>

        {/* Right: Time Range and Intensity Metric Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Intensity Metric Selector (if not in volume only mode) */}
          {viewMode !== 'volume' && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-0.5">
                {isHindi ? 'माप' : 'Metric'}:
              </span>
              <select
                value={intensityMetric}
                onChange={(e) => setIntensityMetric(e.target.value as IntensityMetricType)}
                className="bg-white border border-slate-300 text-slate-800 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-600 shadow-2xs"
              >
                <option value="avg_load">Avg Load (kg/rep)</option>
                <option value="density">Work Density (kg/min)</option>
                <option value="rpe">RPE Effort (1-10)</option>
              </select>
            </div>
          )}

          {/* Time Range Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-0.5">
              <Calendar className="w-3 h-3 inline mr-0.5" />
            </span>
            <div className="inline-flex bg-white rounded-xl p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30d')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === '30d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('14d')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === '14d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                14D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('7d')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === '7d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7D
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="w-full">
        {chartData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-500">
            <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">
              {isHindi ? 'कोई वर्कआउट डेटा नहीं मिला' : 'No workout sessions logged yet'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {isHindi
                ? 'अपने वर्कआउट सेशन को लॉग करें ताकि प्रोग्रेसिव ओवरलोड और इंटेंसिटी लाइन चार्ट दिखाई दे।'
                : 'Complete or log a workout session to visualize your volume and load progression curve.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Chart Legend Labels */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 px-2">
              <div className="flex items-center gap-4">
                {(viewMode === 'both' || viewMode === 'volume') && (
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="w-3.5 h-1 bg-emerald-600 rounded-full inline-block" />
                    <span>{isHindi ? 'वॉल्यूम / Tonnage (kg)' : 'Volume (Tonnage kg)'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">[Left Axis]</span>
                  </span>
                )}

                {(viewMode === 'both' || viewMode === 'intensity') && (
                  <span className="flex items-center gap-1.5 font-bold text-amber-700">
                    <span className="w-3.5 h-1 bg-amber-500 rounded-full inline-block" />
                    <span>{intensityName}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {viewMode === 'both' ? '[Right Axis]' : '[Y Axis]'}
                    </span>
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 hidden sm:block">
                {isHindi
                  ? `${chartData.length} सत्र प्रदर्शित`
                  : `Showing ${chartData.length} recorded session${chartData.length > 1 ? 's' : ''}`}
              </div>
            </div>

            {/* Main Responsive Chart */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                  <XAxis
                    dataKey="displayDate"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    dy={6}
                  />

                  {/* Left Y-Axis: Volume (kg) */}
                  {(viewMode === 'both' || viewMode === 'volume') && (
                    <YAxis
                      yAxisId="volumeAxis"
                      stroke="#059669"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#a7f3d0' }}
                      tickFormatter={(value) =>
                        value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
                      }
                      domain={['auto', 'auto']}
                    />
                  )}

                  {/* Right Y-Axis: Intensity */}
                  {(viewMode === 'both' || viewMode === 'intensity') && (
                    <YAxis
                      yAxisId="intensityAxis"
                      orientation={viewMode === 'intensity' ? 'left' : 'right'}
                      stroke="#d97706"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#fde68a' }}
                      tickFormatter={(value) => `${value}`}
                      domain={
                        intensityMetric === 'rpe'
                          ? [4, 10]
                          : ['auto', 'auto']
                      }
                    />
                  )}

                  {/* Custom Rich Tooltip */}
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data: ChartPoint = payload[0].payload;
                        return (
                          <div className="p-3.5 bg-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 text-xs space-y-2 min-w-[210px] font-sans">
                            <div className="border-b border-slate-800 pb-1.5">
                              <div className="font-bold text-slate-100 text-sm">{data.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{data.fullDate}</div>
                            </div>

                            <div className="space-y-1 font-mono text-xs">
                              <div className="flex items-center justify-between gap-3 text-emerald-400">
                                <span className="font-sans text-slate-400 flex items-center gap-1">
                                  <Dumbbell className="w-3 h-3 text-emerald-400" /> Volume:
                                </span>
                                <span className="font-bold">
                                  {data.volumeKg.toLocaleString()} kg
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-amber-400">
                                <span className="font-sans text-slate-400 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-amber-400" /> Avg Load:
                                </span>
                                <span className="font-bold">{data.avgLoadKg} kg/rep</span>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-sky-400">
                                <span className="font-sans text-slate-400 flex items-center gap-1">
                                  <Activity className="w-3 h-3 text-sky-400" /> Density:
                                </span>
                                <span className="font-bold">{data.densityKgPerMin} kg/min</span>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-slate-300 pt-1 border-t border-slate-800/80 text-[11px]">
                                <span className="font-sans text-slate-500">Duration & Sets:</span>
                                <span>
                                  {data.durationMinutes}m • {data.completedSetsCount} sets
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-rose-400 text-[11px]">
                                <span className="font-sans text-slate-500">Est. Burn:</span>
                                <span>{data.caloriesBurned} kcal</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Reference line for average volume */}
                  {(viewMode === 'both' || viewMode === 'volume') && avgVolumePerSession > 0 && (
                    <ReferenceLine
                      yAxisId="volumeAxis"
                      y={avgVolumePerSession}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeOpacity={0.4}
                    />
                  )}

                  {/* Volume Line */}
                  {(viewMode === 'both' || viewMode === 'volume') && (
                    <Line
                      yAxisId="volumeAxis"
                      type="monotone"
                      dataKey="volumeKg"
                      name={isHindi ? 'वॉल्यूम (kg)' : 'Volume (kg)'}
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                    />
                  )}

                  {/* Intensity Line */}
                  {(viewMode === 'both' || viewMode === 'intensity') && (
                    <Line
                      yAxisId="intensityAxis"
                      type="monotone"
                      dataKey="intensityValue"
                      name={intensityName}
                      stroke="#d97706"
                      strokeWidth={2.5}
                      strokeDasharray={viewMode === 'both' ? '4 2' : undefined}
                      dot={{ r: 4, fill: '#d97706', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#f59e0b', stroke: '#78350f', strokeWidth: 2 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Sports Science Coaching Insight Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-800 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{isHindi ? 'प्रोग्रेसिव ओवरलोड विश्लेषण' : 'Periodization & Overload Analysis'}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                {volumeGrowthPercent && volumeGrowthPercent > 0
                  ? isHindi ? 'हाइपरट्रॉफी ज़ोन' : 'Hypertrophy Zone'
                  : isHindi ? 'स्थिर रिकवरी' : 'Maintenance / Recovery'}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {volumeGrowthPercent && volumeGrowthPercent > 5
                ? isHindi
                  ? `शानदार प्रगति! आपका वर्कआउट वॉल्यूम ${volumeGrowthPercent}% बढ़ा है। भारी कंपाउंड लिफ्ट्स में फॉर्म बनाए रखें और पर्याप्त प्रोटीन व नींद लें।`
                  : `Strong positive trend: Session volume has progressed by ${volumeGrowthPercent}%. You are successfully inducing hypertrophy without sacrificing average intensity.`
                : isHindi
                  ? 'वॉल्यूम और इंटेंसिटी स्थिर हैं। अगले हफ्ते 1-2 अतिरिक्त रिप्स या 2.5kg भार जोड़कर नए पीक वॉल्यूम की ओर बढ़ें।'
                  : 'Volume and load are steady. Aim to micro-load compound lifts (+1.25kg to +2.5kg) or add 1 clean rep per set to stimulate further muscular adaptation.'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 self-end sm:self-center font-mono">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? 'उच्चतम वॉल्यूम' : 'Peak Volume'}
          </div>
          <div className="text-sm font-black text-slate-900">
            {peakVolume > 0 ? `${peakVolume.toLocaleString()} kg` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
};
