import React, { useState, useMemo } from 'react';
import { CompletedWorkoutLog } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  CheckCircle2,
  Download,
  Clock,
  Award,
  Zap,
  Sparkles,
  Layers,
  FileSpreadsheet,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkoutCalendarProps {
  workoutLogs: CompletedWorkoutLog[];
  onStartNewWorkout?: () => void;
  onAddManualLog?: (dateString: string) => void;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  workoutLogs,
  onStartNewWorkout,
}) => {
  const { isHindi } = useLanguage();

  // Calendar navigation state
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    return today.toISOString().split('T')[0];
  });
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [exportWarning, setExportWarning] = useState<string | null>(null);

  // Group workout logs by YYYY-MM-DD
  const logsByDate = useMemo(() => {
    const map = new Map<string, CompletedWorkoutLog[]>();
    workoutLogs.forEach((log) => {
      try {
        const d = new Date(log.date);
        if (isNaN(d.getTime())) return;
        const key = d.toISOString().split('T')[0];
        const existing = map.get(key) || [];
        existing.push(log);
        map.set(key, existing);
      } catch {
        // skip invalid dates
      }
    });
    return map;
  }, [workoutLogs]);

  // Calendar calculations for current month
  const calendarData = useMemo(() => {
    // Days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // First day index (0 = Sunday, 1 = Monday, etc.)
    // We'll align Monday as index 0, Sunday as index 6
    const firstDayRaw = new Date(currentYear, currentMonth, 1).getDay();
    const firstDayIndex = (firstDayRaw + 6) % 7; // Monday-first

    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Previous month filler days
    const prevDays: { day: number; dateKey: string; isCurrentMonth: boolean }[] = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthDate = new Date(currentYear, currentMonth - 1, dayNum);
      prevDays.push({
        day: dayNum,
        dateKey: prevMonthDate.toISOString().split('T')[0],
        isCurrentMonth: false,
      });
    }

    // Current month days
    const currentMonthDays: { day: number; dateKey: string; isCurrentMonth: boolean }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      currentMonthDays.push({
        day: i,
        dateKey: d.toISOString().split('T')[0],
        isCurrentMonth: true,
      });
    }

    // Next month filler days (to complete 35 or 42 grid items)
    const totalFilled = prevDays.length + currentMonthDays.length;
    const nextDaysCount = totalFilled <= 35 ? 35 - totalFilled : 42 - totalFilled;
    const nextDays: { day: number; dateKey: string; isCurrentMonth: boolean }[] = [];
    for (let i = 1; i <= nextDaysCount; i++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
      nextDays.push({
        day: i,
        dateKey: nextMonthDate.toISOString().split('T')[0],
        isCurrentMonth: false,
      });
    }

    return [...prevDays, ...currentMonthDays, ...nextDays];
  }, [currentYear, currentMonth]);

  // Statistics for the currently viewed month
  const monthStats = useMemo(() => {
    let workoutCount = 0;
    let totalVolumeKg = 0;
    let totalDurationMinutes = 0;
    let totalCalories = 0;
    const daysWithWorkouts = new Set<string>();

    workoutLogs.forEach((log) => {
      try {
        const d = new Date(log.date);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          workoutCount++;
          totalVolumeKg += log.totalVolumeKg || 0;
          totalDurationMinutes += Math.round((log.durationSeconds || 0) / 60);
          totalCalories += log.caloriesBurned || 0;
          daysWithWorkouts.add(d.toISOString().split('T')[0]);
        }
      } catch {
        // ignore
      }
    });

    const daysInThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // consistency rate: days active / days so far (capped at daysInThisMonth)
    const consistencyRate = Math.min(100, Math.round((daysWithWorkouts.size / Math.max(1, Math.min(today.getDate(), daysInThisMonth))) * 100));

    return {
      workoutCount,
      uniqueDays: daysWithWorkouts.size,
      totalVolumeKg,
      totalDurationMinutes,
      totalCalories,
      consistencyRate,
    };
  }, [workoutLogs, currentYear, currentMonth, today]);

  // Calculate current streak
  const streakDays = useMemo(() => {
    if (workoutLogs.length === 0) return 0;
    let streak = 0;
    const dayMs = 86400000;
    let checkDate = new Date(today);
    // If no workout today, check if yesterday had one
    const todayKey = today.toISOString().split('T')[0];
    const hasToday = (logsByDate.get(todayKey) || []).length > 0;
    if (!hasToday) {
      checkDate = new Date(today.getTime() - dayMs);
    }

    while (true) {
      const key = checkDate.toISOString().split('T')[0];
      const logs = logsByDate.get(key) || [];
      if (logs.length > 0) {
        streak++;
        checkDate = new Date(checkDate.getTime() - dayMs);
      } else {
        break;
      }
      if (streak > 365) break; // safety break
    }
    return streak;
  }, [logsByDate, today, workoutLogs]);

  // Selected date logs
  const selectedLogs = useMemo(() => {
    return logsByDate.get(selectedDateKey) || [];
  }, [logsByDate, selectedDateKey]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateKey(today.toISOString().split('T')[0]);
  };

  // CSV Export feature
  const handleExportCSV = () => {
    if (workoutLogs.length === 0) {
      setExportWarning(isHindi ? 'निर्यात करने के लिए कोई वर्कआउट लॉग नहीं है।' : 'No workout logs available to export yet. Complete your first workout session to download history.');
      setTimeout(() => setExportWarning(null), 4000);
      return;
    }

    // Prepare headers
    const headers = [
      'Workout ID',
      'Date',
      'Time',
      'Workout Title',
      'Duration (Minutes)',
      'Total Volume (kg)',
      'Sets Completed',
      'Calories Burned (kcal)',
      'Average RPE',
      'Exercises Performed',
      'Session Notes',
    ];

    const rows = workoutLogs.map((log) => {
      const dateObj = new Date(log.date);
      const dateStr = isNaN(dateObj.getTime()) ? log.date : dateObj.toLocaleDateString('en-CA');
      const timeStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleTimeString('en-US', { hour12: false });
      const durationMins = Math.round((log.durationSeconds || 0) / 60);

      const exercisesSummary = (log.exercises || [])
        .map((ex) => {
          const setsStr = (ex.completedSets || [])
            .map((s) => `${s.weightKg}kg x ${s.reps}`)
            .join('; ');
          return `${ex.name} [${ex.targetMuscle}]: (${setsStr})`;
        })
        .join(' | ');

      // Escape quotes for CSV compliance
      const escape = (val: string | number | undefined) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      return [
        escape(log.id),
        escape(dateStr),
        escape(timeStr),
        escape(log.title),
        durationMins,
        log.totalVolumeKg || 0,
        log.completedSetsCount || 0,
        log.caloriesBurned || 0,
        log.rpeAverage || '',
        escape(exercisesSummary),
        escape(log.notes || ''),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PulseFit_Workout_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 4000);
  };

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const weekdayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayNamesHi = ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];

  const monthTitle = isHindi ? monthNamesHi[currentMonth] : monthNamesEn[currentMonth];
  const weekdays = isHindi ? weekdayNamesHi : weekdayNamesEn;
  const todayKeyStr = today.toISOString().split('T')[0];

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              {isHindi ? 'प्रशिक्षण निरंतरता कैलेंडर' : 'Training Consistency Calendar'}
            </span>
            {streakDays > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {streakDays} {isHindi ? 'दिन की स्ट्रीक' : 'Day Streak'}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
            <span>{monthTitle} {currentYear}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHindi
              ? 'कैलेंडर में हरे रंग के बिंदु उन दिनों को दर्शाते हैं जब आपने वर्कआउट पूरा किया है।'
              : 'Marked green days indicate completed training sessions to visualize weekly consistency.'}
          </p>
        </div>

        {/* Actions: Navigation & Export CSV */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            title={isHindi ? 'वर्कआउट इतिहास को CSV में डाउनलोड करें' : 'Download workout history as CSV file'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-xs hover:border-slate-600"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'इतिहास CSV डाउनलोड' : 'Export CSV'}</span>
          </button>

          {/* Today Button */}
          <button
            onClick={handleToday}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors"
          >
            {isHindi ? 'आज' : 'Today'}
          </button>

          {/* Month Steppers */}
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CSV Export Success & Warning Banners */}
      <AnimatePresence>
        {showExportSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-950/80 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isHindi
                  ? 'सफलता! आपका वर्कआउट इतिहास CSV फ़ाइल के रूप में डाउनलोड हो गया है।'
                  : 'Success! Your workout history & metrics CSV has been downloaded.'}
              </span>
            </div>
            <button
              onClick={() => setShowExportSuccess(false)}
              className="text-emerald-400 hover:text-emerald-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {exportWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-950/80 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{exportWarning}</span>
            </div>
            <button
              onClick={() => setExportWarning(null)}
              className="text-amber-400 hover:text-amber-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Consistency Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-5 bg-slate-950/50 border-b border-slate-800/80">
        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            {isHindi ? 'इस माह के सत्र' : 'Sessions This Month'}
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {monthStats.workoutCount}
            <span className="text-xs font-sans text-slate-400 ml-1.5 font-normal">
              ({monthStats.uniqueDays} {isHindi ? 'दिन' : 'days'})
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            {isHindi ? 'सक्रियता दर' : 'Consistency Rate'}
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {monthStats.consistencyRate}%
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {isHindi ? 'कुल वजन' : 'Total Volume'}
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {monthStats.totalVolumeKg > 1000
              ? `${(monthStats.totalVolumeKg / 1000).toFixed(1)}t`
              : `${monthStats.totalVolumeKg}kg`}
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {isHindi ? 'कुल प्रशिक्षण समय' : 'Training Time'}
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {Math.floor(monthStats.totalDurationMinutes / 60)}h {monthStats.totalDurationMinutes % 60}m
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="p-4 sm:p-6">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
          {weekdays.map((wd, i) => (
            <div
              key={i}
              className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1.5"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarData.map((cell, idx) => {
            const dayLogs = logsByDate.get(cell.dateKey) || [];
            const hasWorkout = dayLogs.length > 0;
            const isToday = cell.dateKey === todayKeyStr;
            const isSelected = cell.dateKey === selectedDateKey;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDateKey(cell.dateKey)}
                className={`group relative min-h-[58px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between text-left transition-all border ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50'
                    : hasWorkout
                    ? 'border-emerald-500/30 bg-slate-800/80 hover:border-emerald-500/60 hover:bg-slate-800'
                    : cell.isCurrentMonth
                    ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-slate-700'
                    : 'border-transparent bg-slate-950/20 text-slate-600 opacity-40 hover:opacity-70'
                }`}
              >
                {/* Day Number and Badges */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-bold font-mono ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black'
                        : isSelected
                        ? 'text-emerald-400'
                        : cell.isCurrentMonth
                        ? 'text-slate-200'
                        : 'text-slate-600'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {hasWorkout && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
                      {dayLogs.length > 1 && (
                        <span className="text-[10px] font-bold text-emerald-300 font-mono hidden sm:inline">
                          x{dayLogs.length}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Workout Indicators / Content inside cell */}
                <div className="w-full mt-1">
                  {hasWorkout ? (
                    <div className="w-full">
                      <div className="hidden sm:block truncate text-[11px] font-bold text-emerald-300 font-sans leading-tight">
                        {dayLogs[0].title}
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-mono">
                        <span>{Math.round((dayLogs[0].durationSeconds || 0) / 60)}m</span>
                        {dayLogs[0].totalVolumeKg > 0 && (
                          <span>• {dayLogs[0].totalVolumeKg}kg</span>
                        )}
                      </div>
                      {/* Mobile minimal icon */}
                      <div className="sm:hidden flex items-center gap-1 mt-0.5">
                        <Dumbbell className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-300 font-mono">
                          {Math.round((dayLogs[0].durationSeconds || 0) / 60)}m
                        </span>
                      </div>
                    </div>
                  ) : (
                    cell.isCurrentMonth && (
                      <div className="hidden sm:block text-[10px] text-slate-600 font-sans italic">
                        {isToday ? (isHindi ? 'आज' : 'Today') : (isHindi ? 'विश्राम' : 'Rest')}
                      </div>
                    )
                  )}
                </div>

                {/* Subtle highlight marker */}
                {isToday && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Workout Details Drawer */}
      <div className="border-t border-slate-800 bg-slate-950/70 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              {isHindi ? 'चयनित तिथि विवरण' : 'Selected Date Details'}
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>
                {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {selectedDateKey === todayKeyStr && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  {isHindi ? 'आज' : 'Today'}
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {selectedLogs.length > 0 ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                {selectedLogs.length} {isHindi ? 'वर्कआउट पूरा हुआ' : 'Workout(s) Logged'}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
                {isHindi ? 'कोई वर्कआउट रिकॉर्ड नहीं (विश्राम दिवस)' : 'Rest & Recovery Day'}
              </span>
            )}

            {onStartNewWorkout && (
              <button
                onClick={onStartNewWorkout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? 'नया वर्कआउट शुरू करें' : 'Start Workout'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Workout list or Rest state */}
        {selectedLogs.length > 0 ? (
          <div className="space-y-3">
            {selectedLogs.map((log, lIdx) => (
              <div
                key={log.id || lIdx}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4"
              >
                {/* Log Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{log.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          {Math.round((log.durationSeconds || 0) / 60)} {isHindi ? 'मिनट' : 'mins'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          {log.caloriesBurned || 350} kcal
                        </span>
                        {log.totalVolumeKg > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                              {log.totalVolumeKg} kg volume
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {log.rpeAverage && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 self-start sm:self-auto">
                      <span>RPE:</span>
                      <strong className="text-emerald-400">{log.rpeAverage}/10</strong>
                    </div>
                  )}
                </div>

                {/* Exercises Done */}
                {log.exercises && log.exercises.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isHindi ? 'पूरे किए गए व्यायाम' : 'Exercises Performed'}</span>
                      <span className="text-slate-500 font-mono">({log.exercises.length})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {log.exercises.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{ex.name}</div>
                            <div className="text-[11px] text-emerald-400 font-medium">
                              {ex.targetMuscle}
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-xs font-bold text-slate-300">
                              {ex.completedSets?.length || 0} {isHindi ? 'सेट्स' : 'sets'}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              {ex.completedSets?.map((s) => `${s.weightKg}kg`).slice(0, 3).join(', ')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes if any */}
                {log.notes && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 italic">
                    <strong>{isHindi ? 'नोट्स:' : 'Notes:'}</strong> {log.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 rounded-2xl border border-dashed border-slate-800 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-200">
              {isHindi ? 'इस दिन कोई वर्कआउट रिकॉर्ड नहीं है' : 'No workout completed on this day'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              {isHindi
                ? 'विश्राम दिन मांसपेशियों की रिकवरी और हाइपरट्रॉफी के लिए अत्यंत महत्वपूर्ण हैं। प्रोटीन और पर्याप्त नींद पर ध्यान दें।'
                : 'Rest days are critical for muscle tissue repair and CNS recovery. Keep your protein intake high and stay hydrated!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
