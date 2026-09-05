import React, { useState } from 'react';
import { Exercise } from '../types';
import { ExerciseFormAnimation } from './ExerciseFormAnimation';
import {
  X,
  Dumbbell,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Timer,
  RefreshCw,
  Flame,
  Activity,
  Target,
  Shield,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  const [substituteReason, setSubstituteReason] = useState('Machine or equipment is busy');
  const [isFindingSubstitutes, setIsFindingSubstitutes] = useState(false);
  const [substitutes, setSubstitutes] = useState<any[]>([]);

  if (!exercise) return null;

  const handleFindSubstitutes = async () => {
    setIsFindingSubstitutes(true);
    setSubstitutes([]);

    try {
      const res = await fetch('/api/ai/substitute-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: exercise.name,
          targetMuscle: exercise.targetMuscle,
          equipmentAvailable: exercise.equipment,
          reason: substituteReason,
        }),
      });

      const data = await res.json();
      if (data.success && data.substitutes) {
        setSubstitutes(data.substitutes);
      }
    } catch (err) {
      console.error('Failed to find substitutes:', err);
    } finally {
      setIsFindingSubstitutes(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl space-y-0 max-h-[90vh] flex flex-col"
      >
        {/* Clean Header Bar */}
        <div className="relative shrink-0 p-5 sm:p-7 bg-slate-900 text-white border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-md">
              <Dumbbell className="w-7 h-7" />
            </div>

            <div className="space-y-2.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {exercise.category}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {exercise.equipment}
                </span>
                {exercise.caloriesBurnedPerMin && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> ~{exercise.caloriesBurnedPerMin} cal/min
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {exercise.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    Primary: <strong className="text-white font-semibold">{exercise.targetMuscle}</strong>
                  </span>
                  {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                    <span className="text-slate-400">
                      Assisting: {exercise.secondaryMuscles.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* Biomechanical Proper Form Animation & Demonstration Overlay */}
          <ExerciseFormAnimation exercise={exercise} />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Default Sets</div>
              <div className="text-base font-black text-slate-900 font-mono mt-0.5">{exercise.defaultSets} sets</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Reps</div>
              <div className="text-base font-black text-emerald-600 font-mono mt-0.5">{exercise.defaultReps}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rest Interval</div>
              <div className="text-base font-black text-slate-900 font-mono mt-0.5">{exercise.defaultRestSeconds}s</div>
            </div>
          </div>

          {/* Step by Step Form Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step-by-Step Form & Execution
            </h3>
            <div className="space-y-2">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Form Tips & Cues */}
          {exercise.formTips.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" /> Pro Cues & Mind-Muscle Connection
              </h3>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                {exercise.formTips.map((tip, idx) => (
                  <div key={idx} className="text-xs text-blue-900 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Alternative / Substitution Engine */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Need an Alternative or Gym Swap?</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={substituteReason}
                onChange={(e) => setSubstituteReason(e.target.value)}
                className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-600 shadow-xs"
              >
                <option value="Machine or equipment is busy in gym">Equipment is busy</option>
                <option value="Joint or lower back discomfort">Joint or back discomfort</option>
                <option value="Need home or dumbbell alternative">Need home / dumbbell alternative</option>
                <option value="Want a beginner variation">Need a beginner variation</option>
              </select>

              <button
                onClick={handleFindSubstitutes}
                disabled={isFindingSubstitutes}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap"
              >
                {isFindingSubstitutes ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Finding...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Find AI Swaps</span>
                  </>
                )}
              </button>
            </div>

            {/* Substitutes result */}
            {substitutes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Recommended Alternatives
                </div>
                {substitutes.map((sub, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-emerald-700 font-mono border border-slate-200">
                        {sub.equipment}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{sub.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

