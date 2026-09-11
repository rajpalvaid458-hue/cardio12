import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { Exercise, WorkoutIntensity, WorkoutPlan, SetType } from '../types';
import { exportWorkoutPlanToPdf } from '../utils/pdfExport';
import { ActiveWorkoutWarmUp } from './ActiveWorkoutWarmUp';
import { PlateCalculatorModal } from './PlateCalculatorModal';
import {
  Play,
  Pause,
  Check,
  Plus,
  Trash2,
  X,
  Dumbbell,
  Timer,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  Activity,
  FileText,
  Calculator,
  Flame,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExercisePicker: () => void;
  onSelectExerciseDetails?: (exercise: Exercise) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  onOpenExercisePicker,
  onSelectExerciseDetails,
}) => {
  const {
    exercises,
    activeWorkout,
    updateActiveWorkout,
    toggleSetCompleted,
    updateSetValues,
    addSetToExercise,
    removeSetFromExercise,
    finishWorkout,
    cancelActiveWorkout,
    startRestTimer,
    userProfile,
    workoutLogs,
    restTimer,
    adjustRestTimer,
    stopRestTimer,
  } = useFitness();
  const { t, isHindi } = useLanguage();

  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<number | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [plateCalcTarget, setPlateCalcTarget] = useState<{ exIndex: number; setIndex: number; initialWeight: number } | null>(null);

  if (!isOpen || !activeWorkout) return null;

  // Retrieve previous session performance benchmark for progressive overload (Hevy benchmark)
  const getPreviousPerformance = (exerciseName: string, setIndex: number) => {
    const normName = exerciseName.toLowerCase().trim();
    for (const log of workoutLogs) {
      const matchedEx = log.exercises?.find((e) => e.name.toLowerCase().trim() === normName);
      if (matchedEx && matchedEx.completedSets && matchedEx.completedSets[setIndex]) {
        const prevSet = matchedEx.completedSets[setIndex];
        return `${prevSet.weightKg}${userProfile.weightUnit} × ${prevSet.reps}`;
      }
    }
    return null;
  };

  // Cycle set type: Normal -> Warmup (W) -> Drop Set (D) -> Failure (F)
  const cycleSetType = (exIndex: number, setIndex: number) => {
    updateActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const targetEx = { ...updatedExercises[exIndex] };
      const targetSets = [...targetEx.sets];
      const currentSet = targetSets[setIndex];

      const currentType: SetType = currentSet.setType || (currentSet.isWarmup ? 'warmup' : 'normal');
      let nextType: SetType = 'normal';
      if (currentType === 'normal') nextType = 'warmup';
      else if (currentType === 'warmup') nextType = 'dropset';
      else if (currentType === 'dropset') nextType = 'failure';
      else nextType = 'normal';

      targetSets[setIndex] = {
        ...currentSet,
        setType: nextType,
        isWarmup: nextType === 'warmup',
      };
      targetEx.sets = targetSets;
      updatedExercises[exIndex] = targetEx;
      return { ...prev, exercises: updatedExercises };
    });
  };

  const formatElapsed = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinish = () => {
    finishWorkout();
    onClose();
  };

  const handleCancel = () => {
    cancelActiveWorkout();
    setShowCancelConfirm(false);
    onClose();
  };

  const togglePause = () => {
    updateActiveWorkout((prev) => {
      if (!prev) return null;
      return { ...prev, isPaused: !prev.isPaused };
    });
  };

  const handleUpdateIntensity = (intensity: WorkoutIntensity) => {
    updateActiveWorkout((prev) => {
      if (!prev) return null;
      return { ...prev, intensity };
    });
  };

  const totalSetsCount = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {isHindi ? 'लाइव सत्र' : 'Live Session'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
              {activeWorkout.title}
            </h2>
          </div>

          {/* Center Timer & Pause */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200">
            <Timer className="w-4 h-4 text-emerald-600" />
            <span className="font-mono text-base sm:text-lg font-bold text-slate-900 tracking-wider">
              {formatElapsed(activeWorkout.elapsedSeconds)}
            </span>
            <button
              onClick={togglePause}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
              title={activeWorkout.isPaused ? (isHindi ? 'जारी रखें' : 'Resume') : (isHindi ? 'रोकें' : 'Pause')}
            >
              {activeWorkout.isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const planFromSession: WorkoutPlan = {
                  id: activeWorkout.planId || activeWorkout.id,
                  title: activeWorkout.title,
                  splitType: 'Active Routine',
                  durationMinutes: Math.max(15, Math.round(activeWorkout.elapsedSeconds / 60)),
                  description: activeWorkout.notes || 'Current training protocol and exercises.',
                  exercises: activeWorkout.exercises,
                  tags: ['Live Workout'],
                };
                exportWorkoutPlanToPdf(planFromSession, {
                  athleteName: userProfile?.name || 'PulseFit Athlete',
                  notes: activeWorkout.notes,
                });
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors border border-slate-200"
              title={isHindi ? 'वर्तमान वर्कआउट को PDF में एक्सपोर्ट करें' : 'Export current workout plan as formatted PDF'}
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-102"
            >
              <Award className="w-4 h-4" />
              <span>{isHindi ? 'समाप्त करें' : 'Finish'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              title={isHindi ? 'छोटा करें' : 'Minimize'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Workout Stats Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-xs">
            <div className="text-[11px] text-slate-500 font-medium">
              {isHindi ? 'उठाया गया वजन' : 'Volume Lifted'}
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5">
              {activeWorkout.totalVolumeKg.toLocaleString()} {userProfile.weightUnit}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-xs">
            <div className="text-[11px] text-slate-500 font-medium">
              {isHindi ? 'पूरे किए गए सेट्स' : 'Completed Sets'}
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-600 font-mono mt-0.5">
              {activeWorkout.completedSetsCount} / {totalSetsCount}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-xs">
            <div className="text-[11px] text-slate-500 font-medium">
              {isHindi ? 'अनुमानित कैलोरी' : 'Est. Calories'}
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-600 font-mono mt-0.5">
              ~{Math.round((activeWorkout.elapsedSeconds / 60) * 7.5)} kcal
            </div>
          </div>
        </div>

        {/* Dedicated Warm-up Section tailored by workout intensity */}
        <ActiveWorkoutWarmUp
          activeWorkout={activeWorkout}
          onUpdateIntensity={handleUpdateIntensity}
          isHindi={isHindi}
        />

        {/* Exercises List */}
        <div className="space-y-4">
          {activeWorkout.exercises.map((exercise, exIndex) => {
            const isTipExpanded = expandedExerciseIndex === exIndex;
            return (
              <div
                key={exercise.id || exIndex}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* Exercise Header */}
                <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      onClick={() => {
                        const fullEx = exercises.find((e) => e.name.toLowerCase() === exercise.name.toLowerCase()) || {
                          id: exercise.id || `ex-${exIndex}`,
                          name: exercise.name,
                          category: 'Strength',
                          targetMuscle: exercise.targetMuscle || 'Target Muscle',
                          equipment: 'Standard Equipment',
                          defaultSets: exercise.sets.length,
                          defaultReps: '10-12',
                          defaultRestSeconds: 60,
                          instructions: [exercise.formTip || 'Perform movement with strict biomechanical control and core stability.'],
                          formTips: [exercise.formTip || 'Maintain joint alignment and rhythmic cadence.'],
                        };
                        onSelectExerciseDetails?.(fullEx);
                      }}
                      className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-colors"
                      title="Click to view form guide"
                    >
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {exercise.targetMuscle}
                        </span>
                        <button
                          onClick={() => startRestTimer(exercise.restSec || 60, exercise.name)}
                          className="text-[11px] text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-mono"
                        >
                          <Timer className="w-3 h-3 text-slate-400" /> Rest: {exercise.restSec}s
                        </button>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 truncate">{exercise.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        const fullEx = exercises.find((e) => e.name.toLowerCase() === exercise.name.toLowerCase()) || {
                          id: exercise.id || `ex-${exIndex}`,
                          name: exercise.name,
                          category: 'Strength',
                          targetMuscle: exercise.targetMuscle || 'Target Muscle',
                          equipment: 'Standard Equipment',
                          defaultSets: exercise.sets.length,
                          defaultReps: '10-12',
                          defaultRestSeconds: 60,
                          instructions: [exercise.formTip || 'Perform movement with strict biomechanical control and core stability.'],
                          formTips: [exercise.formTip || 'Maintain joint alignment and rhythmic cadence.'],
                        };
                        onSelectExerciseDetails?.(fullEx);
                      }}
                      className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="View Proper Form Animation & Demonstration"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Form Guide</span>
                    </button>
                    {exercise.formTip && (
                      <button
                        onClick={() => setExpandedExerciseIndex(isTipExpanded ? null : exIndex)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                        title="Form Tip"
                      >
                        <Info className="w-4 h-4 text-emerald-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Form Tip Expandable */}
                {isTipExpanded && exercise.formTip && (
                  <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{exercise.formTip}</span>
                  </div>
                )}

                  {/* Sets Table */}
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200 pb-2">
                        <th className="pb-2 font-semibold w-14 text-center">
                          <span title="Click number to cycle set type: Normal, Warmup (W), Dropset (D), Failure (F)">
                            {isHindi ? 'टाइप' : 'TYPE'}
                          </span>
                        </th>
                        <th className="pb-2 font-semibold min-w-[120px]">
                          <div className="flex items-center gap-1">
                            <span>{userProfile.weightUnit.toUpperCase()}</span>
                            <span className="text-[10px] text-emerald-600 font-normal">
                              ({isHindi ? 'प्लेट्स' : 'Plates'})
                            </span>
                          </div>
                        </th>
                        <th className="pb-2 font-semibold min-w-[100px]">{isHindi ? 'रेप्स' : 'REPS'}</th>
                        <th className="pb-2 font-semibold text-center w-16">{isHindi ? 'पूर्ण' : 'DONE'}</th>
                        <th className="pb-2 font-semibold w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {exercise.sets.map((set, setIndex) => {
                        const prevPerf = getPreviousPerformance(exercise.name, setIndex);
                        const setType: SetType = set.setType || (set.isWarmup ? 'warmup' : 'normal');

                        return (
                          <tr
                            key={set.id || setIndex}
                            className={`transition-colors ${set.completed ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                          >
                            {/* Set Type & Number Selector (Hevy Gold Standard) */}
                            <td className="py-2.5 text-center font-mono font-bold">
                              <button
                                type="button"
                                onClick={() => cycleSetType(exIndex, setIndex)}
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-[11px] font-black transition-all cursor-pointer shadow-2xs ${
                                  setType === 'warmup'
                                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                                    : setType === 'dropset'
                                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                    : setType === 'failure'
                                    ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                                    : set.completed
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title={
                                  setType === 'warmup'
                                    ? 'Warm-up Set (W) - Click to change'
                                    : setType === 'dropset'
                                    ? 'Drop Set (D) - Click to change'
                                    : setType === 'failure'
                                    ? 'Failure Set (F) - Click to change'
                                    : `Normal Set ${set.setNumber} - Click to change type`
                                }
                              >
                                {setType === 'warmup' ? 'W' : setType === 'dropset' ? 'D' : setType === 'failure' ? 'F' : set.setNumber}
                              </button>
                            </td>

                            {/* Weight input + Plate Calculator Button + Previous record */}
                            <td className="py-2.5 pr-2">
                              <div className="space-y-0.5">
                                <div className="relative flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    step="2.5"
                                    value={set.weightKg === 0 ? '' : set.weightKg}
                                    placeholder="0"
                                    onChange={(e) =>
                                      updateSetValues(
                                        exIndex,
                                        setIndex,
                                        'weightKg',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className={`w-20 bg-white border rounded-xl px-2.5 py-1.5 text-center font-mono font-bold text-sm text-slate-900 focus:outline-hidden transition-colors ${
                                      set.completed ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-300 focus:border-emerald-600'
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPlateCalcTarget({
                                        exIndex,
                                        setIndex,
                                        initialWeight: set.weightKg || 60,
                                      })
                                    }
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
                                    title={isHindi ? 'बार्बेल प्लेट कैलकुलेटर खोलें' : 'Open Barbell Plate Calculator for this set'}
                                  >
                                    <Calculator className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {prevPerf && (
                                  <div className="text-[10px] text-slate-400 font-mono tracking-tight pl-0.5">
                                    {isHindi ? 'पिछला' : 'Prev'}: {prevPerf}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Reps input + RPE Selector */}
                            <td className="py-2.5 pr-2">
                              <div className="space-y-0.5">
                                <div className="relative flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={set.reps === 0 ? '' : set.reps}
                                    placeholder="0"
                                    onChange={(e) =>
                                      updateSetValues(
                                        exIndex,
                                        setIndex,
                                        'reps',
                                        parseInt(e.target.value, 10) || 0
                                      )
                                    }
                                    className={`w-18 bg-white border rounded-xl px-2.5 py-1.5 text-center font-mono font-bold text-sm text-slate-900 focus:outline-hidden transition-colors ${
                                      set.completed ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-300 focus:border-emerald-600'
                                    }`}
                                  />
                                </div>
                                {/* RPE indicator */}
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                  <span>RPE:</span>
                                  <select
                                    value={set.rpe || 8}
                                    onChange={(e) =>
                                      updateSetValues(exIndex, setIndex, 'rpe', parseFloat(e.target.value))
                                    }
                                    className="bg-transparent border-0 text-slate-600 font-bold p-0 cursor-pointer focus:ring-0"
                                  >
                                    {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((r) => (
                                      <option key={r} value={r}>
                                        {r}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </td>

                            {/* Completed Checkbox */}
                            <td className="py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => toggleSetCompleted(exIndex, setIndex)}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                  set.completed
                                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-200'
                                }`}
                              >
                                <Check className={`w-4 h-4 ${set.completed ? 'stroke-[3]' : ''}`} />
                              </button>
                            </td>

                            {/* Delete set */}
                            <td className="py-2.5 text-right">
                              {exercise.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSetFromExercise(exIndex, setIndex)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                  title="Remove set"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Add set button */}
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      onClick={() => addSetToExercise(exIndex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isHindi ? '+ सेट जोड़ें' : 'Add Set'}</span>
                    </button>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {isHindi ? 'विश्राम' : 'Rest'}: {exercise.restSec}s
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Exercise button */}
        <div className="pt-2">
          <button
            onClick={onOpenExercisePicker}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-bold text-sm transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? '+ इस वर्कआउट में व्यायाम जोड़ें' : 'Add Exercise to This Workout'}</span>
          </button>
        </div>

        {/* Cancel Workout footer action */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="text-xs text-red-500 hover:text-red-600 hover:underline"
          >
            {isHindi ? 'सत्र रद्द करें' : 'Discard Workout Session'}
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all hover:scale-102"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isHindi ? 'कसरत पूरी करें व लॉग करें' : 'Complete & Log Workout'}</span>
          </button>
        </div>
      </div>

      {/* Discard confirmation dialog */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900">
                {isHindi ? 'कसरत रद्द करें?' : 'Discard workout?'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi 
                  ? 'क्या आप वाकई इस वर्कआउट को रद्द करना चाहते हैं? इस सत्र के सेट्स आपके इतिहास में सहेजे नहीं जाएंगे।' 
                  : 'Are you sure you want to cancel this workout? Your logged sets for this session will not be saved to your history.'}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {isHindi ? 'अभ्यास जारी रखें' : 'Keep Training'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  {isHindi ? 'हाँ, रद्द करें' : 'Yes, Discard'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating In-Session Rest Timer Bar (Nike / Strong Benchmark) */}
      {restTimer && restTimer.active && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-slate-950/95 text-white border border-emerald-500/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-sm shrink-0">
              {restTimer.remainingSeconds}s
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {isHindi ? 'विश्राम ब्रेक' : 'Active Rest Period'}
              </div>
              <div className="text-xs font-bold text-slate-100 truncate">
                {restTimer.exerciseName || (isHindi ? 'अगला सेट' : 'Next Set')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => adjustRestTimer(-15)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
              title="-15s"
            >
              -15s
            </button>
            <button
              type="button"
              onClick={() => adjustRestTimer(30)}
              className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-colors cursor-pointer"
              title="+30s"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={stopRestTimer}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              title={isHindi ? 'छोड़ें' : 'Skip'}
            >
              {isHindi ? 'छोड़ें' : 'Skip'}
            </button>
          </div>
        </div>
      )}

      {/* Barbell Plate Calculator Modal */}
      {plateCalcTarget && (
        <PlateCalculatorModal
          isOpen={true}
          onClose={() => setPlateCalcTarget(null)}
          initialWeight={plateCalcTarget.initialWeight}
          onApplyWeight={(calculatedWeight) => {
            updateSetValues(plateCalcTarget.exIndex, plateCalcTarget.setIndex, 'weightKg', calculatedWeight);
            setPlateCalcTarget(null);
          }}
        />
      )}
    </div>
  );
};
