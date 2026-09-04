import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export interface DayHydrationData {
  dayKey: string; // e.g. '2026-08-27'
  dayLabel: string; // e.g. 'Thu'
  dateFormatted: string; // e.g. 'Aug 27'
  isToday: boolean;
  intakeMl: number;
  goalMl: number;
  pct: number;
  goalMet: boolean;
}

interface WeeklyHydrationChartProps {
  currentTodayWaterMl: number;
  dailyGoalMl: number;
  unit: 'ml' | 'oz';
  formatVolume: (valMl: number) => string;
}

const ML_TO_FLOZ = 0.033814;

export const WeeklyHydrationChart: React.FC<WeeklyHydrationChartProps> = ({
  currentTodayWaterMl,
  dailyGoalMl,
  unit,
  formatVolume,
}) => {
  // Local storage persistence for historic 6 days so user edits/logs persist
  const [historicDays, setHistoricDays] = useState<{ [dayKey: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('pulsefit_past_week_water_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    // Sensible realistic baseline for the past 6 days
    return {
      offset_6: 2800, // 6 days ago
      offset_5: 3200, // 5 days ago
      offset_4: 2600, // 4 days ago
      offset_3: 3100, // 3 days ago
      offset_2: 3400, // 2 days ago
      offset_1: 2900, // Yesterday
    };
  });

  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Build the 7 days array (6 days ago through today)
  const chartData: DayHydrationData[] = useMemo(() => {
    const days: DayHydrationData[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);

      const dayKey = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' });
      const dateFormatted = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const isToday = i === 0;

      const intakeMl = isToday
        ? currentTodayWaterMl
        : historicDays[`offset_${i}`] ?? historicDays[dayKey] ?? 2800;

      const pct = Math.round((intakeMl / (dailyGoalMl || 3000)) * 100);
      const goalMet = intakeMl >= dailyGoalMl;

      days.push({
        dayKey,
        dayLabel,
        dateFormatted,
        isToday,
        intakeMl,
        goalMl: dailyGoalMl,
        pct,
        goalMet,
      });
    }

    return days;
  }, [currentTodayWaterMl, dailyGoalMl, historicDays]);

  // Weekly aggregate calculations
  const totalWeekIntakeMl = useMemo(
    () => chartData.reduce((acc, d) => acc + d.intakeMl, 0),
    [chartData]
  );
  const averageDailyIntakeMl = Math.round(totalWeekIntakeMl / 7);
  const daysGoalMetCount = chartData.filter((d) => d.goalMet).length;
  const bestDay = useMemo(() => {
    return [...chartData].sort((a, b) => b.intakeMl - a.intakeMl)[0];
  }, [chartData]);

  // Selected or hovered day
  const selectedDay = activeBarIndex !== null ? chartData[activeBarIndex] : chartData[6]; // default to Today

  // Convert values for chart display if unit === 'oz'
  const displayChartData = useMemo(() => {
    return chartData.map((d) => ({
      ...d,
      displayIntake:
        unit === 'oz' ? Math.round(d.intakeMl * ML_TO_FLOZ * 10) / 10 : d.intakeMl,
      displayGoal:
        unit === 'oz' ? Math.round(d.goalMl * ML_TO_FLOZ * 10) / 10 : d.goalMl,
    }));
  }, [chartData, unit]);

  const displayGoal =
    unit === 'oz'
      ? Math.round(dailyGoalMl * ML_TO_FLOZ * 10) / 10
      : dailyGoalMl;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayHydrationData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3.5 rounded-2xl shadow-xl text-white text-xs space-y-1.5 min-w-[170px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
            <span className="font-bold text-slate-200">
              {data.isToday ? 'Today' : data.dayLabel} ({data.dateFormatted})
            </span>
            {data.isToday && (
              <span className="text-[10px] bg-blue-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                Live
              </span>
            )}
          </div>

          <div className="pt-1 flex items-baseline justify-between gap-3">
            <span className="text-slate-400">Intake:</span>
            <span className="text-cyan-400 font-mono font-bold text-sm">
              {formatVolume(data.intakeMl)}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <span className="text-slate-400">Goal Target:</span>
            <span className="text-slate-300 font-mono text-xs">
              {formatVolume(data.goalMl)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800">
            <span className="text-slate-400">Achievement:</span>
            <span
              className={`font-mono font-bold ${
                data.goalMet ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {data.pct}%
            </span>
          </div>

          <div className="pt-1">
            {data.goalMet ? (
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Target Reached
              </div>
            ) : (
              <div className="text-[10px] text-amber-300 font-medium">
                {formatVolume(Math.max(0, data.goalMl - data.intakeMl))} remaining
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden"
      id="hydration-weekly-trends-chart"
    >
      {/* Header & Metrics Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" /> 7-Day Trend Analysis
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Past 7 Days
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Weekly Hydration Intake Trends
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Track daily water intake patterns, consistency against your {formatVolume(dailyGoalMl)} goal,
            and 7-day volume progress.
          </p>
        </div>

        {/* Quick Highlights Badge Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
          {/* Average */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block uppercase">
              7-Day Avg
            </span>
            <span className="text-xs sm:text-sm font-black text-blue-700 font-mono">
              {formatVolume(averageDailyIntakeMl)}
            </span>
          </div>

          {/* Goal Hit Rate */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block uppercase">
              Goal Met
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-600 font-mono">
              {daysGoalMetCount}/7 <span className="text-[10px] font-sans">Days</span>
            </span>
          </div>

          {/* Best Day */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 text-center">
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block uppercase">
              Peak Day
            </span>
            <span className="text-xs sm:text-sm font-black text-cyan-600 font-mono truncate block max-w-[80px] sm:max-w-none">
              {bestDay?.dayLabel} ({formatVolume(bestDay?.intakeMl || 0)})
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="w-3 h-3 rounded-md bg-blue-600 inline-block" />
              <span>Normal Intake</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              <span>Goal Met (≥100%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className="w-3 h-3 rounded-md bg-cyan-500 ring-2 ring-cyan-200 inline-block" />
              <span>Today (Live)</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-3 border-b-2 border-dashed border-rose-400 inline-block" />
            <span className="text-[11px]">
              Daily Target: <strong className="text-slate-800 font-mono">{formatVolume(dailyGoalMl)}</strong>
            </span>
          </div>
        </div>

        {/* Recharts Render */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayChartData}
              margin={{ top: 20, right: 10, left: -15, bottom: 5 }}
              onMouseMove={(state) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setActiveBarIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveBarIndex(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                dy={6}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                domain={[0, (dataMax: number) => Math.max(dataMax * 1.15, displayGoal * 1.15)]}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', radius: 12 }} />

              {/* Daily Target Goal Reference Line */}
              <ReferenceLine
                y={displayGoal}
                stroke="#F43F5E"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Goal ${formatVolume(dailyGoalMl)}`,
                  position: 'insideTopRight',
                  fill: '#E11D48',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              {/* Data Bars */}
              <Bar
                dataKey="displayIntake"
                radius={[10, 10, 4, 4]}
                maxBarSize={52}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {displayChartData.map((entry, index) => {
                  // Today has glowing active cyan
                  if (entry.isToday) {
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.goalMet ? '#10B981' : '#06B6D4'}
                        stroke={entry.isToday ? '#0284C7' : 'none'}
                        strokeWidth={entry.isToday ? 2 : 0}
                      />
                    );
                  }

                  // Prior days
                  if (entry.goalMet) {
                    return <Cell key={`cell-${index}`} fill="#10B981" />;
                  }
                  if (entry.pct >= 75) {
                    return <Cell key={`cell-${index}`} fill="#3B82F6" />;
                  }
                  return <Cell key={`cell-${index}`} fill="#60A5FA" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected / Hovered Day Interactive Detail Pill */}
      {selectedDay && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                selectedDay.goalMet
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {selectedDay.dayLabel.slice(0, 3)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {selectedDay.isToday ? 'Today’s Live Record' : `${selectedDay.dayLabel}, ${selectedDay.dateFormatted}`}
                </span>
                {selectedDay.goalMet ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Goal Exceeded
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {selectedDay.pct}% of Target
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Total Hydration:{' '}
                <strong className="text-slate-800 font-mono">
                  {formatVolume(selectedDay.intakeMl)}
                </strong>{' '}
                of {formatVolume(selectedDay.goalMl)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Status</span>
              <span
                className={`text-xs font-bold ${
                  selectedDay.goalMet ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {selectedDay.goalMet
                  ? `+${formatVolume(selectedDay.intakeMl - selectedDay.goalMl)} over goal`
                  : `${formatVolume(selectedDay.goalMl - selectedDay.intakeMl)} remaining`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Hydration Habit Feedback */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-cyan-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Weekly Consistency:</strong> You met your daily hydration goal on{' '}
            <strong>{daysGoalMetCount} out of 7 days</strong> this past week.
            {daysGoalMetCount >= 5
              ? ' Outstanding hydration discipline!'
              : ' Keep logging containers through the day to hit 7/7!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHydrationChart;
