import React, { useState } from 'react';
import { Exercise } from '../types';
import {
  X,
  Dumbbell,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Timer,
  RefreshCw,
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
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                {exercise.category}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                Equipment: {exercise.equipment}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{exercise.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Primary Target: <span className="text-emerald-700 font-semibold">{exercise.targetMuscle}</span></p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
      </motion.div>
    </div>
  );
};
