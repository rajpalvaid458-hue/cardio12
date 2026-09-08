import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Calendar, Activity, Zap, CheckCircle2, Flame, Dumbbell, Clock } from 'lucide-react';
import { CompletedWorkoutLog } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface D3WorkoutFrequencyChartProps {
  workoutLogs: CompletedWorkoutLog[];
  weeklyGoalSessions?: number;
}

interface WeekFrequencyData {
  weekKey: string; // e.g., "Week 1", "Aug 12 - Aug 18"
  startDate: Date;
  endDate: Date;
  count: number;
  totalDurationMins: number;
  totalVolumeKg: number;
  caloriesBurned: number;
  logs: CompletedWorkoutLog[];
}

export const D3WorkoutFrequencyChart: React.FC<D3WorkoutFrequencyChartProps> = ({
  workoutLogs,
  weeklyGoalSessions = 4,
}) => {
  const { isHindi } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const [viewWeeksCount, setViewWeeksCount] = useState<8 | 12>(8);
  const [hoveredWeek, setHoveredWeek] = useState<WeekFrequencyData | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // ResizeObserver for responsive D3 rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width,
          height: Math.max(260, Math.min(340, Math.round(width * 0.44))),
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Compute Weekly Buckets
  const weeklyData = useMemo(() => {
    const now = new Date();
    const result: WeekFrequencyData[] = [];

    // Generate buckets for the last N weeks
    for (let i = viewWeeksCount - 1; i >= 0; i--) {
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      // Align end to end of week
      const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const matchingLogs = workoutLogs.filter((log) => {
        const d = new Date(log.date);
        return d >= start && d <= end;
      });

      const totalDuration = matchingLogs.reduce((acc, l) => acc + Math.round((l.durationSeconds || 0) / 60), 0);
      const totalVol = matchingLogs.reduce((acc, l) => acc + (l.totalVolumeKg || 0), 0);
      const totalCal = matchingLogs.reduce((acc, l) => acc + (l.caloriesBurned || 0), 0);

      const startLabel = d3.timeFormat('%b %d')(start);
      const endLabel = d3.timeFormat('%b %d')(end);

      result.push({
        weekKey: `${startLabel} - ${endLabel}`,
        startDate: start,
        endDate: end,
        count: matchingLogs.length,
        totalDurationMins: totalDuration,
        totalVolumeKg: totalVol,
        caloriesBurned: totalCal,
        logs: matchingLogs,
      });
    }

    return result;
  }, [workoutLogs, viewWeeksCount]);

  // Overall Frequency Metrics
  const frequencyStats = useMemo(() => {
    const totalSessions = weeklyData.reduce((acc, w) => acc + w.count, 0);
    const avgPerWeek = Math.round((totalSessions / weeklyData.length) * 10) / 10;
    const goalMetWeeks = weeklyData.filter((w) => w.count >= weeklyGoalSessions).length;
    const consistencyRate = Math.round((goalMetWeeks / weeklyData.length) * 100);

    // Day of week distribution (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    workoutLogs.forEach((log) => {
      const d = new Date(log.date);
      dayCounts[d.getDay()] += 1;
    });

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const maxDayIdx = dayCounts.indexOf(Math.max(...dayCounts));
    const favoriteDay = dayLabels[maxDayIdx];

    return { totalSessions, avgPerWeek, consistencyRate, dayCounts, favoriteDay };
  }, [weeklyData, workoutLogs, weeklyGoalSessions]);

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || weeklyData.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 24, right: 24, bottom: 44, left: 40 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(weeklyData.map((d) => d.weekKey))
      .range([0, innerWidth])
      .padding(0.35);

    const maxVal = d3.max(weeklyData, (d: WeekFrequencyData) => d.count);
    const maxCount = Math.max(weeklyGoalSessions + 1, typeof maxVal === 'number' ? maxVal : 0);
    const yScale = d3.scaleLinear().domain([0, maxCount]).range([innerHeight, 0]).nice();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Horizontal Grid Lines
    const yTicks = yScale.ticks(Math.min(6, maxCount));
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 3');

    // Weekly Goal Benchmark Line
    const goalY = yScale(weeklyGoalSessions);
    if (goalY >= 0 && goalY <= innerHeight) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', goalY)
        .attr('y2', goalY)
        .attr('stroke', '#10B981')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5 4')
        .attr('opacity', 0.9);

      g.append('text')
        .attr('x', innerWidth - 4)
        .attr('y', goalY - 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#059669')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text(`Goal: ${weeklyGoalSessions} workouts/wk`);
    }

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((d) => {
        // Shorten label for mobile
        const parts = d.split(' - ');
        return parts[0];
      })
      .tickSizeOuter(0);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((group) => {
        group.select('.domain').attr('stroke', '#CBD5E1');
        group.selectAll('.tick line').attr('stroke', '#CBD5E1');
        group.selectAll('.tick text')
          .attr('fill', '#64748B')
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('dy', '10px');
      });

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(Math.min(5, maxCount))
      .tickFormat(d3.format('d'))
      .tickSizeOuter(0);

    g.append('g')
      .call(yAxis)
      .call((group) => {
        group.select('.domain').remove();
        group.selectAll('.tick line').remove();
        group.selectAll('.tick text').attr('fill', '#64748B').attr('font-size', '11px').attr('font-weight', '600');
      });

    // Frequency Bars
    g.selectAll<SVGRectElement, WeekFrequencyData>('.bar')
      .data(weeklyData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: WeekFrequencyData) => xScale(d.weekKey) || 0)
      .attr('y', (d: WeekFrequencyData) => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: WeekFrequencyData) => Math.max(0, innerHeight - yScale(d.count)))
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', (d: WeekFrequencyData) => {
        if (d.count >= weeklyGoalSessions) return '#10B981'; // met goal (emerald)
        if (d.count > 0) return '#3B82F6'; // active (blue)
        return '#E2E8F0'; // 0 workouts (neutral slate)
      })
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d: WeekFrequencyData) => {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setHoveredWeek(d);
        setHoverPos({ x: mx, y: my });
        d3.select(event.currentTarget).attr('opacity', 0.82);
      })
      .on('mouseleave', (event) => {
        setHoveredWeek(null);
        setHoverPos(null);
        d3.select(event.currentTarget).attr('opacity', 1);
      });

    // Bar Value Badges on top
    g.selectAll<SVGTextElement, WeekFrequencyData>('.bar-label')
      .data(weeklyData)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: WeekFrequencyData) => (xScale(d.weekKey) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d: WeekFrequencyData) => (d.count > 0 ? yScale(d.count) - 6 : innerHeight - 6))
      .attr('text-anchor', 'middle')
      .attr('fill', (d: WeekFrequencyData) =>
        d.count >= weeklyGoalSessions ? '#059669' : d.count > 0 ? '#1E40AF' : '#94A3B8'
      )
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .text((d: WeekFrequencyData) => d.count);
  }, [dimensions, weeklyData, weeklyGoalSessions]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'डी3 कसरत आवृत्ति विश्लेषण' : 'D3 Workout Frequency Analysis'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isHindi ? 'साप्ताहिक कसरत आवृत्ति और निरंतरता' : 'Weekly Session Frequency & Consistency'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isHindi
              ? 'D3.js डिस्क्रीट बार विज़ुअलाइज़ेशन और लक्ष्य सीमा रेखा के साथ।'
              : 'Rendered with D3.js discrete band scaling, session count benchmarks, and frequency distributions.'}
          </p>
        </div>

        {/* View Range Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewWeeksCount(8)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewWeeksCount === 8 ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              8 {isHindi ? 'सप्ताह' : 'Weeks'}
            </button>
            <button
              type="button"
              onClick={() => setViewWeeksCount(12)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewWeeksCount === 12 ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              12 {isHindi ? 'सप्ताह' : 'Weeks'}
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Frequency Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'औसत सत्र / सप्ताह' : 'Avg Sessions / Week'}</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {frequencyStats.avgPerWeek}{' '}
            <span className="text-xs font-sans text-slate-500">{isHindi ? 'सत्र' : 'sessions'}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'लक्ष्य:' : 'Target:'} {weeklyGoalSessions} / {isHindi ? 'सप्ताह' : 'week'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'लक्ष्य उपलब्धि दर' : 'Target Consistency'}</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
            {frequencyStats.consistencyRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'सप्ताहों में लक्ष्य पूरा' : 'Weeks hitting weekly target'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'कुल रिकॉर्डेड सत्र' : 'Period Total Sessions'}</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {frequencyStats.totalSessions}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'पिछले' : 'Past'} {viewWeeksCount} {isHindi ? 'सप्ताहों में' : 'weeks'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>{isHindi ? 'सर्वाधिक सक्रिय दिन' : 'Most Active Day'}</span>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">
            {frequencyStats.favoriteDay}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isHindi ? 'सबसे नियमित वर्कआउट दिन' : 'Peak training consistency'}
          </div>
        </div>
      </div>

      {/* D3 Canvas Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden select-none">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-auto block"
          style={{ minHeight: '260px' }}
        />

        {/* Hover Tooltip Box */}
        {hoveredWeek && hoverPos && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-xs backdrop-blur-md transition-transform duration-75 min-w-[200px]"
            style={{
              left: Math.min(Math.max(16, hoverPos.x - 90), dimensions.width - 220),
              top: Math.max(8, hoverPos.y - 110),
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
              <span className="font-bold text-slate-300">{hoveredWeek.weekKey}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  hoveredWeek.count >= weeklyGoalSessions
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {hoveredWeek.count} {isHindi ? 'वर्कआउट' : 'workouts'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">{isHindi ? 'समय:' : 'Time:'}</span>
                <span className="font-bold font-mono text-white">{hoveredWeek.totalDurationMins} mins</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isHindi ? 'वॉल्यूम:' : 'Volume:'}</span>
                <span className="font-bold font-mono text-white">{hoveredWeek.totalVolumeKg.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isHindi ? 'कैलोरी:' : 'Burned:'}</span>
                <span className="font-bold font-mono text-white">{hoveredWeek.caloriesBurned} kcal</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isHindi ? 'लक्ष्य स्थिति:' : 'Goal Status:'}</span>
                <span
                  className={`font-bold ${
                    hoveredWeek.count >= weeklyGoalSessions ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {hoveredWeek.count >= weeklyGoalSessions
                    ? isHindi ? 'पूर्ण ✓' : 'Met ✓'
                    : `${weeklyGoalSessions - hoveredWeek.count} left`}
                </span>
              </div>
            </div>

            {hoveredWeek.logs.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-300">
                <span className="text-slate-400 block font-semibold mb-0.5">
                  {isHindi ? 'सत्र:' : 'Sessions:'}
                </span>
                <ul className="list-disc pl-3 space-y-0.5">
                  {hoveredWeek.logs.slice(0, 3).map((l, idx) => (
                    <li key={idx} className="truncate">
                      {l.title}
                    </li>
                  ))}
                  {hoveredWeek.logs.length > 3 && (
                    <li className="text-slate-400">+{hoveredWeek.logs.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend & Day Heatmap Pill */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" />
            <span className="font-semibold text-slate-700">{isHindi ? 'लक्ष्य पूर्ण (≥ लक्ष्य)' : 'Goal Achieved'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block" />
            <span className="font-semibold text-slate-700">{isHindi ? 'सक्रिय सत्र' : 'Active Sessions'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block" />
            <span className="font-semibold text-slate-700">{isHindi ? 'साप्ताहिक लक्ष्य रेखा' : 'Weekly Goal Line'}</span>
          </div>
        </div>

        {/* Day-of-week mini badges */}
        <div className="flex items-center gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, i) => {
            const count = frequencyStats.dayCounts[i];
            const isFav = i === frequencyStats.dayCounts.indexOf(Math.max(...frequencyStats.dayCounts));
            return (
              <div
                key={i}
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                  count > 0
                    ? isFav
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
                title={`${dayChar}: ${count} workouts`}
              >
                {dayChar}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
