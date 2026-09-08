import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TrendingDown, TrendingUp, Minus, Scale, Plus, Target, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface WeightRecord {
  id: string;
  date: Date;
  weightKg: number;
  notes?: string;
}

interface D3WeightTrendsChartProps {
  currentWeightKg: number;
  targetWeightKg: number;
  weightUnit?: 'kg' | 'lbs';
  onUpdateWeight?: (newWeightKg: number) => void;
}

const STORAGE_KEY = 'pulsefit_d3_weight_history';

export const D3WeightTrendsChart: React.FC<D3WeightTrendsChartProps> = ({
  currentWeightKg,
  targetWeightKg,
  weightUnit = 'kg',
  onUpdateWeight,
}) => {
  const { isHindi } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'all'>('30d');
  const [dimensions, setDimensions] = useState({ width: 600, height: 320 });
  const [hoveredData, setHoveredData] = useState<WeightRecord | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Form for adding weight
  const [showAddForm, setShowAddForm] = useState(false);
  const [inputWeight, setInputWeight] = useState('');
  const [inputNote, setInputNote] = useState('');

  // Conversion helper
  const toDisplayUnit = (valKg: number) => (weightUnit === 'lbs' ? Math.round(valKg * 2.20462 * 10) / 10 : valKg);
  const fromDisplayUnit = (val: number) => (weightUnit === 'lbs' ? val / 2.20462 : val);

  // Initial records state with persistent storage fallback
  const [records, setRecords] = useState<WeightRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            date: new Date(item.date),
          }));
        }
      }
    } catch {
      // ignore
    }

    // Default historical baseline: generate 10 plausible readings ending at current weight
    const base: WeightRecord[] = [];
    const now = new Date();
    const diff = currentWeightKg - targetWeightKg;
    const direction = diff > 0 ? 1 : -1; // user losing or gaining
    const totalDays = 60;
    const count = 10;

    for (let i = count - 1; i >= 0; i--) {
      const dayOffset = Math.round((i / (count - 1)) * totalDays);
      const d = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      // gradual progression with subtle natural day-to-day fluctuation
      const progressRatio = (count - 1 - i) / (count - 1);
      const modeledDelta = direction * 2.4 * (1 - progressRatio);
      const jitter = (Math.sin(i * 1.7) * 0.35);
      const w = Math.round((currentWeightKg + modeledDelta + jitter) * 10) / 10;

      base.push({
        id: `gen_${i}_${d.getTime()}`,
        date: d,
        weightKg: Math.max(40, w),
      });
    }

    // Ensure the last record exactly matches currentWeightKg
    if (base.length > 0) {
      base[base.length - 1].weightKg = currentWeightKg;
    }

    return base;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save weight records:', e);
    }
  }, [records]);

  // Handle ResizeObserver for responsive D3 rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width,
          height: Math.max(280, Math.min(360, Math.round(width * 0.48))),
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Filter records based on selected time range
  const filteredRecords = useMemo(() => {
    if (records.length === 0) return [];
    const sorted = [...records].sort((a, b) => a.date.getTime() - b.date.getTime());
    if (timeRange === 'all') return sorted;

    const days = timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const inRange = sorted.filter((r) => r.date >= cutoff);
    return inRange.length >= 2 ? inRange : sorted; // fallback to sorted if too few
  }, [records, timeRange]);

  // Trend statistics
  const trendStats = useMemo(() => {
    if (filteredRecords.length < 2) {
      return { diff: 0, percentage: 0, min: currentWeightKg, max: currentWeightKg, days: 0 };
    }
    const first = filteredRecords[0].weightKg;
    const last = filteredRecords[filteredRecords.length - 1].weightKg;
    const diff = Math.round((last - first) * 10) / 10;
    const percentage = Math.round((diff / first) * 1000) / 10;
    const weights = filteredRecords.map((r) => r.weightKg);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const days = Math.round(
      (filteredRecords[filteredRecords.length - 1].date.getTime() - filteredRecords[0].date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return { diff, percentage, min, max, days };
  }, [filteredRecords, currentWeightKg]);

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || filteredRecords.length === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 24, right: 32, bottom: 36, left: 48 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings

    // Gradient definitions
    const defs = svg.append('defs');

    // Area fill gradient
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-weight-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.28);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#10B981').attr('stop-opacity', 0.0);

    // Line stroke gradient
    const lineGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-weight-line-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');

    lineGradient.append('stop').attr('offset', '0%').attr('stop-color', '#059669');
    lineGradient.append('stop').attr('offset', '100%').attr('stop-color', '#10B981');

    // Scales
    const xExtent = d3.extent(filteredRecords, (d: WeightRecord) => d.date) as [Date, Date];
    const xScale = d3.scaleTime().domain(xExtent).range([0, innerWidth]);

    const displayWeights = filteredRecords.map((d) => toDisplayUnit(d.weightKg));
    displayWeights.push(toDisplayUnit(targetWeightKg));

    const minWeight = Math.min(...displayWeights);
    const maxWeight = Math.max(...displayWeights);
    const padding = Math.max(1.5, (maxWeight - minWeight) * 0.15);

    const yScale = d3
      .scaleLinear()
      .domain([Math.floor(minWeight - padding), Math.ceil(maxWeight + padding)])
      .range([innerHeight, 0])
      .nice();

    // Chart group
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Horizontal Grid Lines
    const yTicks = yScale.ticks(5);
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

    // Target Weight Guideline
    const targetDisplay = toDisplayUnit(targetWeightKg);
    const targetY = yScale(targetDisplay);
    if (targetY >= 0 && targetY <= innerHeight) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', targetY)
        .attr('y2', targetY)
        .attr('stroke', '#0EA5E9')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4')
        .attr('opacity', 0.85);

      // Target Label badge on right
      g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', targetY - 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#0284C7')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text(`Goal: ${targetDisplay} ${weightUnit}`);
    }

    // X Axis
    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(Math.max(3, Math.floor(innerWidth / 90)))
      .tickFormat((d) => d3.timeFormat('%b %d')(d as Date))
      .tickSizeOuter(0);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((group) => {
        group.select('.domain').attr('stroke', '#CBD5E1');
        group.selectAll('.tick line').attr('stroke', '#CBD5E1');
        group.selectAll('.tick text').attr('fill', '#64748B').attr('font-size', '11px').attr('font-weight', '500');
      });

    // Y Axis
    const yAxis = d3
      .axisLeft<number>(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}`)
      .tickSizeOuter(0);

    g.append('g')
      .call(yAxis)
      .call((group) => {
        group.select('.domain').remove();
        group.selectAll('.tick line').remove();
        group.selectAll('.tick text').attr('fill', '#64748B').attr('font-size', '11px').attr('font-weight', '600');
      });

    // Area Generator
    const area = d3
      .area<WeightRecord>()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.date))
      .y0(innerHeight)
      .y1((d) => yScale(toDisplayUnit(d.weightKg)));

    // Line Generator
    const line = d3
      .line<WeightRecord>()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.date))
      .y((d) => yScale(toDisplayUnit(d.weightKg)));

    // Render Area
    g.append('path')
      .datum(filteredRecords)
      .attr('fill', 'url(#d3-weight-area-gradient)')
      .attr('d', area);

    // Render Line with subtle entrance transition
    const path = g
      .append('path')
      .datum(filteredRecords)
      .attr('fill', 'none')
      .attr('stroke', 'url(#d3-weight-line-gradient)')
      .attr('stroke-width', 2.75)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line);

    // Points on Line
    g.selectAll<SVGCircleElement, WeightRecord>('.data-dot')
      .data(filteredRecords)
      .enter()
      .append('circle')
      .attr('class', 'data-dot')
      .attr('cx', (d: WeightRecord) => xScale(d.date))
      .attr('cy', (d: WeightRecord) => yScale(toDisplayUnit(d.weightKg)))
      .attr('r', 4)
      .attr('fill', '#FFFFFF')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer');

    // Interactive Hover Tracking Layer
    const bisect = d3.bisector<WeightRecord, Date>((d) => d.date).left;

    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    // Tooltip indicator line
    const hoverLine = g
      .append('line')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .style('opacity', 0);

    const activeDot = g
      .append('circle')
      .attr('r', 6.5)
      .attr('fill', '#10B981')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2.5)
      .style('opacity', 0);

    overlay
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const x0 = xScale.invert(mx);
        const index = bisect(filteredRecords, x0, 1);
        const d0 = filteredRecords[index - 1];
        const d1 = filteredRecords[index];

        let d = d0;
        if (d1 && d0) {
          d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
        }

        if (d) {
          const cx = xScale(d.date);
          const cy = yScale(toDisplayUnit(d.weightKg));

          hoverLine
            .attr('x1', cx)
            .attr('x2', cx)
            .attr('y1', 0)
            .attr('y2', innerHeight)
            .style('opacity', 1);

          activeDot.attr('cx', cx).attr('cy', cy).style('opacity', 1);

          setHoveredData(d);
          setHoverPos({
            x: cx + margin.left,
            y: cy + margin.top,
          });
        }
      })
      .on('mouseleave', () => {
        hoverLine.style('opacity', 0);
        activeDot.style('opacity', 0);
        setHoveredData(null);
        setHoverPos(null);
      });
  }, [dimensions, filteredRecords, targetWeightKg, weightUnit]);

  // Submit new weight reading
  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputWeight);
    if (isNaN(val) || val <= 20 || val >= 350) return;

    const weightKg = fromDisplayUnit(val);
    const newRecord: WeightRecord = {
      id: `w_${Date.now()}`,
      date: new Date(),
      weightKg: Math.round(weightKg * 10) / 10,
      notes: inputNote.trim() || undefined,
    };

    const updated = [...records, newRecord].sort((a, b) => a.date.getTime() - b.date.getTime());
    setRecords(updated);
    if (onUpdateWeight) {
      onUpdateWeight(newRecord.weightKg);
    }
    setInputWeight('');
    setInputNote('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'डी3 वजन रुझान विश्लेषण' : 'D3 Weight Trend Analysis'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isHindi ? 'शरीर के वजन का इतिहास और प्रगति' : 'Bodyweight History & Progress Curve'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isHindi
              ? 'D3.js स्केलिंग, कर्व इंटरपोलेशन और टाइम-सीरीज़ एनालिसिस द्वारा प्रस्तुत।'
              : 'Rendered with D3.js temporal scales, monotonic spline curves, and target delta markers.'}
          </p>
        </div>

        {/* Action Buttons & Time Range Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              30 {isHindi ? 'दिन' : 'Days'}
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === '90d' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              90 {isHindi ? 'दिन' : 'Days'}
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isHindi ? 'सभी' : 'All Time'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHindi ? 'वजन जोड़ें' : 'Log Weight'}</span>
          </button>
        </div>
      </div>

      {/* Inline Log Weight Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddReading}
          className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {isHindi ? 'नया वजन' : 'Weight'} ({weightUnit}):
            </label>
            <input
              type="number"
              step="0.1"
              required
              autoFocus
              placeholder={`e.g. ${toDisplayUnit(currentWeightKg)}`}
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 w-32 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder={isHindi ? 'नोट (वैकल्पिक, जैसे: सुबह खाली पेट)' : 'Note (optional, e.g. morning fasted)'}
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              {isHindi ? 'सेव करें' : 'Save Entry'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-medium text-xs border border-slate-200 transition"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-600" />
            <span>{isHindi ? 'वर्तमान वजन' : 'Current Weight'}</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {toDisplayUnit(currentWeightKg)} <span className="text-xs font-sans text-slate-500">{weightUnit}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{isHindi ? 'नवीनतम रीडिंग' : 'Latest reading'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-sky-600" />
            <span>{isHindi ? 'लक्ष्य वजन' : 'Target Goal'}</span>
          </div>
          <div className="text-2xl font-black text-sky-600 font-mono mt-1">
            {toDisplayUnit(targetWeightKg)} <span className="text-xs font-sans text-slate-500">{weightUnit}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {Math.abs(toDisplayUnit(currentWeightKg) - toDisplayUnit(targetWeightKg)) === 0
              ? (isHindi ? 'लक्ष्य हासिल!' : 'Goal achieved!')
              : `${Math.abs(toDisplayUnit(currentWeightKg) - toDisplayUnit(targetWeightKg)).toFixed(1)} ${weightUnit} ${
                  toDisplayUnit(currentWeightKg) > toDisplayUnit(targetWeightKg)
                    ? isHindi ? 'कम करना बाकी' : 'to lose'
                    : isHindi ? 'बढ़ाना बाकी' : 'to gain'
                }`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            {trendStats.diff < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            ) : trendStats.diff > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isHindi ? 'अवधि परिवर्तन' : 'Period Delta'}</span>
          </div>
          <div
            className={`text-2xl font-black font-mono mt-1 ${
              trendStats.diff < 0 ? 'text-emerald-600' : trendStats.diff > 0 ? 'text-blue-600' : 'text-slate-900'
            }`}
          >
            {trendStats.diff > 0 ? `+${toDisplayUnit(trendStats.diff)}` : toDisplayUnit(trendStats.diff)}{' '}
            <span className="text-xs font-sans text-slate-500">{weightUnit}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {trendStats.percentage !== 0 ? `${trendStats.percentage > 0 ? '+' : ''}${trendStats.percentage}%` : 'Stable'}{' '}
            over {trendStats.days} days
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isHindi ? 'सीमा (Min / Max)' : 'Range (Min / Max)'}</span>
          </div>
          <div className="text-sm font-black text-slate-900 font-mono mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-emerald-700">
              {toDisplayUnit(trendStats.min)} {weightUnit}
            </span>
            <span className="text-slate-400 font-normal">→</span>
            <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-blue-700">
              {toDisplayUnit(trendStats.max)} {weightUnit}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{filteredRecords.length} total readings logged</div>
        </div>
      </div>

      {/* D3 Canvas Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden select-none">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-auto block"
          style={{ minHeight: '280px' }}
        />

        {/* Hover Tooltip Box */}
        {hoveredData && hoverPos && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs backdrop-blur-md transition-transform duration-75"
            style={{
              left: Math.min(Math.max(16, hoverPos.x - 70), dimensions.width - 160),
              top: Math.max(8, hoverPos.y - 85),
            }}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>{d3.timeFormat('%B %d, %Y')(hoveredData.date)}</span>
            </div>
            <div className="text-base font-black font-mono text-emerald-400 mt-1">
              {toDisplayUnit(hoveredData.weightKg)} <span className="text-xs font-sans text-white">{weightUnit}</span>
            </div>
            {hoveredData.notes && (
              <div className="text-[10px] text-slate-300 mt-1 italic border-t border-slate-800 pt-1">
                "{hoveredData.notes}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />
            <span className="font-semibold text-slate-700">{isHindi ? 'वजन प्रवृत्ति' : 'Weight Trend'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-500 inline-block" />
            <span className="font-semibold text-slate-700">{isHindi ? 'लक्ष्य वजन रेखा' : 'Target Goal'}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          {isHindi ? 'कर्सर घुमाकर किसी भी तारीख का वजन देखें' : 'Hover over chart points to inspect specific dates'}
        </div>
      </div>
    </div>
  );
};
