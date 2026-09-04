import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { Exercise } from '../types';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExerciseImage } from './ExerciseImage';
import { isChestExercise } from '../utils/exerciseImages';

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
  } = useFitness();
  const { t, isHindi } = useLanguage();

  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<number | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen || !activeWorkout) return null;

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
                      className={`${
                        isChestExercise(exercise)
                          ? 'w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900 shadow-xs cursor-pointer group/img'
                          : 'w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-colors'
                      }`}
                      title="Click to view form guide"
                    >
                      {isChestExercise(exercise) ? (
                        <ExerciseImage
                          exercise={exercise}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                        />
                      ) : (
                        <Dumbbell className="w-5 h-5" />
                      )}
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
                        <th className="pb-2 font-semibold w-12 text-center">{isHindi ? 'सेट' : 'SET'}</th>
                        <th className="pb-2 font-semibold w-24">{userProfile.weightUnit.toUpperCase()}</th>
                        <th className="pb-2 font-semibold w-24">{isHindi ? 'रेप्स' : 'REPS'}</th>
                        <th className="pb-2 font-semibold text-center w-16">{isHindi ? 'पूर्ण' : 'DONE'}</th>
                        <th className="pb-2 font-semibold w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {exercise.sets.map((set, setIndex) => (
                        <tr
                          key={set.id || setIndex}
                          className={`transition-colors ${set.completed ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                        >
                          {/* Set Number */}
                          <td className="py-2.5 text-center font-mono font-bold">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] ${
                                set.completed
                                  ? 'bg-emerald-600 text-white font-extrabold'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {set.setNumber}
                            </span>
                          </td>

                          {/* Weight input */}
                          <td className="py-2.5 pr-2">
                            <div className="relative flex items-center">
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
                                className={`w-20 bg-white border rounded-xl px-2.5 py-1.5 text-center font-mono font-bold text-sm text-slate-900 focus:outline-none transition-colors ${
                                  set.completed ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-300 focus:border-emerald-600'
                                }`}
                              />
                            </div>
                          </td>

                          {/* Reps input */}
                          <td className="py-2.5 pr-2">
                            <div className="relative flex items-center">
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
                                className={`w-20 bg-white border rounded-xl px-2.5 py-1.5 text-center font-mono font-bold text-sm text-slate-900 focus:outline-none transition-colors ${
                                  set.completed ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-300 focus:border-emerald-600'
                                }`}
                              />
                            </div>
                          </td>

                          {/* Completed Checkbox */}
                          <td className="py-2.5 text-center">
                            <button
                              onClick={() => toggleSetCompleted(exIndex, setIndex)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
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
                                onClick={() => removeSetFromExercise(exIndex, setIndex)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove set"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
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
    </div>
  );
};
