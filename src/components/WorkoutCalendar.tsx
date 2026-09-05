import React, { useState, useMemo } from 'react';
import { CompletedWorkoutLog, Exercise, WorkoutPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useFitness } from '../context/FitnessContext';
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
  Plus,
  Play,
  Info,
  Sliders,
  Check,
  RotateCcw,
  AlertCircle,
  Eye,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CALENDAR_SPLIT_OPTIONS,
  CalendarSplitType,
  getRoutineForDateKey,
  convertDayRoutineToWorkoutPlan,
  convertDayRoutineToCompletedLog,
  findExerciseInDatabase,
  DayOfWeekRoutine,
} from '../data/calendarDailyRoutines';

interface WorkoutCalendarProps {
  workoutLogs: CompletedWorkoutLog[];
  onStartNewWorkout?: () => void;
  onAddManualLog?: (dateString: string) => void;
  onSelectExerciseDetails?: (exercise: Exercise) => void;
  onSelectWarmUpForPlan?: (plan: WorkoutPlan) => void;
  onStartPlanWorkout?: (plan: WorkoutPlan) => void;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  workoutLogs,
  onStartNewWorkout,
  onSelectExerciseDetails,
  onSelectWarmUpForPlan,
  onStartPlanWorkout,
}) => {
  const { isHindi } = useLanguage();
  const { startWorkout, addWorkoutLog } = useFitness();

  // Active split selection (defaults to 5-Day Classic Bro Split)
  const [activeSplit, setActiveSplit] = useState<CalendarSplitType>('bro_split');
  const [showSplitDropdown, setShowSplitDropdown] = useState(false);

  // Tab selection for selected date: 'scheduled' vs 'logged'
  const [activeDetailTab, setActiveDetailTab] = useState<'scheduled' | 'logged'>('scheduled');

  // Success toast for marking completed
  const [loggedSuccessMessage, setLoggedSuccessMessage] = useState<string | null>(null);

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
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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
    const consistencyRate = Math.min(
      100,
      Math.round((daysWithWorkouts.size / Math.max(1, Math.min(today.getDate(), daysInThisMonth))) * 100)
    );

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
      if (streak > 365) break;
    }
    return streak;
  }, [logsByDate, today, workoutLogs]);

  // Selected date logs
  const selectedLogs = useMemo(() => {
    return logsByDate.get(selectedDateKey) || [];
  }, [logsByDate, selectedDateKey]);

  // Selected date scheduled daily routine
  const selectedRoutine: DayOfWeekRoutine = useMemo(() => {
    return getRoutineForDateKey(selectedDateKey, activeSplit);
  }, [selectedDateKey, activeSplit]);

  // Handle day click: update selected day, automatically show scheduled or logged view
  const handleSelectDay = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    const logs = logsByDate.get(dateKey) || [];
    // If has logs, default to scheduled or keep user preference
    if (logs.length > 0) {
      setActiveDetailTab('scheduled');
    } else {
      setActiveDetailTab('scheduled');
    }
  };

  // Start selected routine workout
  const handleStartRoutine = () => {
    const plan = convertDayRoutineToWorkoutPlan(selectedRoutine, selectedDateKey);
    if (onStartPlanWorkout) {
      onStartPlanWorkout(plan);
    } else {
      startWorkout(plan);
    }
  };

  // Start 5-min dynamic warm-up
  const handleWarmUpForRoutine = () => {
    const plan = convertDayRoutineToWorkoutPlan(selectedRoutine, selectedDateKey);
    if (onSelectWarmUpForPlan) {
      onSelectWarmUpForPlan(plan);
    }
  };

  // Mark this routine as completed directly
  const handleMarkAsCompleted = () => {
    const newLog = convertDayRoutineToCompletedLog(selectedRoutine, selectedDateKey);
    addWorkoutLog(newLog);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    });

    const msg = isHindi
      ? `${selectedRoutine.dayNameHi} का वर्कआउट (${selectedRoutine.titleHi}) सफलतापूर्वक लॉग किया गया!`
      : `Successfully logged ${selectedRoutine.dayNameEn}'s ${selectedRoutine.titleEn}!`;
    setLoggedSuccessMessage(msg);
    setTimeout(() => setLoggedSuccessMessage(null), 4000);
  };

  // View exercise details in modal
  const handleViewExercise = (exName: string, category?: string) => {
    const match = findExerciseInDatabase(exName, category);
    if (match && onSelectExerciseDetails) {
      onSelectExerciseDetails(match);
    }
  };

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
    const todayKey = today.toISOString().split('T')[0];
    setSelectedDateKey(todayKey);
  };

  // CSV Export feature
  const handleExportCSV = () => {
    if (workoutLogs.length === 0) {
      setExportWarning(
        isHindi
          ? 'निर्यात करने के लिए कोई वर्कआउट लॉग नहीं है।'
          : 'No workout logs available to export yet. Complete your first workout session to download history.'
      );
      setTimeout(() => setExportWarning(null), 4000);
      return;
    }

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
          const setsStr = (ex.completedSets || []).map((s) => `${s.weightKg}kg x ${s.reps}`).join('; ');
          return `${ex.name} [${ex.targetMuscle}]: (${setsStr})`;
        })
        .join(' | ');

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
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];

  const weekdayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayNamesHi = ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];

  const monthTitle = isHindi ? monthNamesHi[currentMonth] : monthNamesEn[currentMonth];
  const weekdays = isHindi ? weekdayNamesHi : weekdayNamesEn;
  const todayKeyStr = today.toISOString().split('T')[0];

  // Helper for cell badge colors
  const getCellRoutineBadgeColor = (dayIdx: number) => {
    switch (dayIdx) {
      case 1:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 2:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 3:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 4:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 5:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 6:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 7:
        return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const activeSplitOption = CALENDAR_SPLIT_OPTIONS.find((s) => s.id === activeSplit) || CALENDAR_SPLIT_OPTIONS[0];

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              {isHindi ? 'प्रशिक्षण निरंतरता एवं दैनिक व्यायाम कैलेंडर' : 'Training Calendar & Daily Exercises'}
            </span>
            {streakDays > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {streakDays} {isHindi ? 'दिन की स्ट्रीक' : 'Day Streak'}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
            <span>
              {monthTitle} {currentYear}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHindi
              ? 'किसी भी दिन पर क्लिक करें और उस दिन के सभी निर्धारित व्यायाम (Exercises), सेट्स, फॉर्म टिप्स और वॉर्म-अप तुरंत देखें।'
              : 'Click on any day to automatically view its scheduled exercises, target muscles, form tips, and start the workout.'}
          </p>
        </div>

        {/* Actions: Routine Split Selector, Navigation & Export CSV */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Split Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSplitDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Change Training Split / Routine"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[130px] sm:max-w-none truncate">
                {isHindi ? activeSplitOption.labelHi : activeSplitOption.labelEn}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showSplitDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-30 space-y-1 animate-in fade-in">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isHindi ? 'स्प्लिट रूटीन चुनें' : 'Select Weekly Split'}
                </div>
                {CALENDAR_SPLIT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setActiveSplit(opt.id);
                      setShowSplitDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2 text-xs ${
                      activeSplit === opt.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Check
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        activeSplit === opt.id ? 'text-emerald-400' : 'opacity-0'
                      }`}
                    />
                    <div>
                      <div className="font-bold">{isHindi ? opt.labelHi : opt.labelEn}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {isHindi ? opt.descHi : opt.descEn}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            title={isHindi ? 'वर्कआउट इतिहास को CSV में डाउनलोड करें' : 'Download workout history as CSV file'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isHindi ? 'CSV डाउनलोड' : 'Export CSV'}</span>
          </button>

          {/* Today Button */}
          <button
            onClick={handleToday}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            {isHindi ? 'आज' : 'Today'}
          </button>

          {/* Month Steppers */}
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Success / Warning notifications */}
      <AnimatePresence>
        {loggedSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{loggedSuccessMessage}</span>
            </div>
            <button
              onClick={() => setLoggedSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {showExportSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isHindi
                  ? 'वर्कआउट डेटा सफलतापूर्वक CSV फ़ाइल के रूप में निर्यात किया गया।'
                  : 'Workout history CSV successfully generated and downloaded.'}
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
            className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
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

            // Compute scheduled routine for this specific date
            const routineForCell = getRoutineForDateKey(cell.dateKey, activeSplit);
            const badgeColorClass = getCellRoutineBadgeColor(routineForCell.dayIndex);

            return (
              <button
                key={idx}
                onClick={() => handleSelectDay(cell.dateKey)}
                className={`group relative min-h-[66px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between text-left transition-all border cursor-pointer ${
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
                        ? 'w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-xs'
                        : isSelected
                        ? 'text-emerald-400'
                        : cell.isCurrentMonth
                        ? 'text-slate-200'
                        : 'text-slate-600'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {hasWorkout ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
                      {dayLogs.length > 1 && (
                        <span className="text-[10px] font-bold text-emerald-300 font-mono hidden sm:inline">
                          x{dayLogs.length}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span
                      className={`text-[9px] font-mono px-1 rounded-sm border opacity-80 hidden sm:inline ${badgeColorClass}`}
                    >
                      {routineForCell.isRestDay ? (isHindi ? 'आराम' : 'Rest') : `${routineForCell.exercises.length}ex`}
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
                        {dayLogs[0].totalVolumeKg > 0 && <span>• {dayLogs[0].totalVolumeKg}kg</span>}
                      </div>
                      {/* Mobile minimal icon */}
                      <div className="sm:hidden flex items-center gap-1 mt-0.5">
                        <Dumbbell className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-300 font-mono">
                          {Math.round((dayLogs[0].durationSeconds || 0) / 60)}m
                        </span>
                      </div>
                    </div>
                  ) : cell.isCurrentMonth ? (
                    <div className="w-full">
                      {/* Scheduled Exercise Focus Badge */}
                      <div
                        className={`truncate text-[10px] sm:text-[11px] font-semibold leading-tight rounded-md px-1 py-0.5 border ${badgeColorClass}`}
                      >
                        {isHindi
                          ? routineForCell.focusMuscleHi.split(',')[0]
                          : routineForCell.focusMuscleEn.split(',')[0]}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Subtle highlight marker for today */}
                {isToday && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Workout Details Drawer (AUTOMATIC EXERCISES DISPLAY) */}
      <div id="selected-day-exercises-drawer" className="border-t border-slate-800 bg-slate-950/80 p-5 sm:p-7">
        {/* Drawer Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                {isHindi ? 'चयनित दिन के स्वचालित व्यायाम' : 'Scheduled Exercises for Selected Day'}
              </span>
              {selectedDateKey === todayKeyStr && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  {isHindi ? 'आज का दिन' : 'Today'}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>
                {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                ({isHindi ? selectedRoutine.dayNameHi : selectedRoutine.dayNameEn})
              </span>
            </h3>
          </div>

          {/* Quick Tab Switcher if logs exist */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedLogs.length > 0 && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setActiveDetailTab('scheduled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeDetailTab === 'scheduled'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'निर्धारित व्यायाम' : 'Scheduled Routine'}</span>
                </button>
                <button
                  onClick={() => setActiveDetailTab('logged')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeDetailTab === 'logged'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {isHindi ? 'पूरा हुआ वर्कआउट' : 'Completed Log'} ({selectedLogs.length})
                  </span>
                </button>
              </div>
            )}

            {/* Direct Action Buttons for the Day */}
            <button
              onClick={handleStartRoutine}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02]"
              title={isHindi ? 'इस दिन का वर्कआउट सीधे शुरू करें' : 'Start this day workout session now'}
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isHindi ? 'यह वर्कआउट शुरू करें' : 'Start This Workout'}</span>
            </button>

            {onSelectWarmUpForPlan && (
              <button
                onClick={handleWarmUpForRoutine}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-all cursor-pointer"
                title={isHindi ? '5-मिनट डायनामिक वॉर्म-अप' : '5-minute dynamic warm-up for this workout'}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{isHindi ? '5-मिनट वॉर्म-अप' : '5-Min Warm-Up'}</span>
              </button>
            )}

            <button
              onClick={handleMarkAsCompleted}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title={isHindi ? 'इसे पूर्ण हुआ मार्क करें' : 'Mark this workout routine as completed'}
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'पूरा हुआ मार्क करें' : 'Mark Completed'}</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: SCHEDULED EXERCISES (AUTOMATICALLY DISPLAYED) */}
        {(activeDetailTab === 'scheduled' || selectedLogs.length === 0) && (
          <div className="space-y-6">
            {/* Day Focus Highlight Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {selectedRoutine.isRestDay
                        ? isHindi
                          ? 'सक्रिय रिकवरी एवं लचीलापन'
                          : 'Active Recovery & Mobility'
                        : isHindi
                        ? 'दैनिक हाइपरट्रॉफी एवं स्ट्रेंथ रूटीन'
                        : 'Daily Hypertrophy & Strength Target'}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-extrabold text-white mt-2">
                    {isHindi ? selectedRoutine.titleHi : selectedRoutine.titleEn}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {isHindi ? selectedRoutine.taglineHi : selectedRoutine.taglineEn}
                  </p>

                  <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>
                      {isHindi ? 'लक्षित मांसपेशियां:' : 'Target Muscles:'}{' '}
                      <strong className="text-white">
                        {isHindi ? selectedRoutine.focusMuscleHi : selectedRoutine.focusMuscleEn}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Day Routine Quick Metrics */}
                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="bg-slate-950/60 rounded-2xl px-3.5 py-2.5 border border-slate-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {isHindi ? 'व्यायाम' : 'Exercises'}
                    </div>
                    <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
                      {selectedRoutine.exercises.length}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-2xl px-3.5 py-2.5 border border-slate-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {isHindi ? 'अनुमानित समय' : 'Est. Time'}
                    </div>
                    <div className="text-base font-extrabold text-blue-400 font-mono mt-0.5">
                      {selectedRoutine.estimatedDurationMins}m
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-2xl px-3.5 py-2.5 border border-slate-800 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {isHindi ? 'कैलोरी' : 'Est. Burn'}
                    </div>
                    <div className="text-base font-extrabold text-amber-400 font-mono mt-0.5">
                      {selectedRoutine.estimatedCalories}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises List Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  {isHindi
                    ? `${selectedRoutine.dayNameHi} के सभी व्यायाम (${selectedRoutine.exercises.length})`
                    : `${selectedRoutine.dayNameEn}'s Exercise Breakdown (${selectedRoutine.exercises.length})`}
                </h4>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {isHindi ? 'तकनीक व सेट्स विवरण' : 'Sets, Reps & Coaching Form Tips'}
              </span>
            </div>

            {/* AUTOMATIC EXERCISE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {selectedRoutine.exercises.map((ex, exIdx) => {
                return (
                  <div
                    key={ex.id || exIdx}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-4.5 hover:border-slate-700 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Exercise Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-emerald-500/20">
                            #{exIdx + 1}
                          </span>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {isHindi && ex.hindiName ? ex.hindiName : ex.name}
                            </h5>
                            {isHindi && ex.name && (
                              <div className="text-xs text-slate-400 mt-0.5 font-medium">
                                {ex.name}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 shrink-0">
                          {ex.equipment}
                        </span>
                      </div>

                      {/* Muscle target & Sets/Reps Badges */}
                      <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-slate-800/80">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                          {ex.defaultSets} {isHindi ? 'सेट्स' : 'Sets'} × {ex.defaultReps} {isHindi ? 'रेप्स' : 'Reps'}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {ex.restSeconds}s {isHindi ? 'आराम' : 'Rest'}
                        </span>

                        <span className="text-xs text-slate-400 font-medium">
                          • {ex.targetMuscle}
                        </span>
                      </div>

                      {/* Coaching Form Tip Box */}
                      {ex.formTip && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">
                            <strong className="text-amber-300">{isHindi ? 'कोच टिप: ' : 'Form Tip: '}</strong>
                            {ex.formTip}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <button
                        onClick={() => handleViewExercise(ex.name, ex.category)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="View instructions, animated posture and tips"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'विवरण व तकनीक देखें' : 'View Guide & Form'}</span>
                      </button>

                      <span className="text-[11px] font-mono text-slate-500">
                        {ex.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: RECORDED LOGS (IF PRESENT AND ACTIVE TAB IS LOGGED) */}
        {activeDetailTab === 'logged' && selectedLogs.length > 0 && (
          <div className="space-y-4">
            {selectedLogs.map((log, lIdx) => (
              <div
                key={log.id || lIdx}
                className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-md"
              >
                {/* Log Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white">{log.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
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

                  <div className="flex items-center gap-2">
                    {log.rpeAverage && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300">
                        <span>RPE:</span>
                        <strong className="text-emerald-400">{log.rpeAverage}/10</strong>
                      </div>
                    )}

                    <button
                      onClick={handleStartRoutine}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'दोहराएं' : 'Repeat'}</span>
                    </button>
                  </div>
                </div>

                {/* Exercises Done */}
                {log.exercises && log.exercises.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isHindi ? 'पूरे किए गए व्यायाम' : 'Exercises Performed'}</span>
                      <span className="text-slate-500 font-mono">({log.exercises.length})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
        )}
      </div>
    </div>
  );
};
