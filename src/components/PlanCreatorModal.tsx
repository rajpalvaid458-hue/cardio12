import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Exercise, WorkoutPlan } from '../types';
import { X, Plus, Trash2, Dumbbell, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface PlanCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanCreatorModal: React.FC<PlanCreatorModalProps> = ({ isOpen, onClose }) => {
  const { exercises, addWorkoutPlan } = useFitness();

  const [title, setTitle] = useState('');
  const [splitType, setSplitType] = useState('Push / Pull / Legs');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'athlete'>('intermediate');
  const [targetGender, setTargetGender] = useState<'all' | 'female' | 'male'>('all');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<
    { exercise: Exercise; sets: number; reps: number; restSec: number }[]
  >([]);

  const [exerciseSelectId, setExerciseSelectId] = useState('');

  if (!isOpen) return null;

  const handleAddExerciseToPlan = () => {
    if (!exerciseSelectId) return;
    const found = exercises.find((e) => e.id === exerciseSelectId);
    if (!found) return;

    setSelectedExercises([
      ...selectedExercises,
      { exercise: found, sets: 3, reps: 10, restSec: 60 },
    ]);
    setExerciseSelectId('');
  };

  const handleRemoveExercise = (idx: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== idx));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedExercises.length === 0) return;

    const tags = ['Custom', splitType];
    if (targetGender === 'female') tags.push('Female Focus');
    if (level === 'beginner') tags.push('Beginner');
    if (level === 'athlete') tags.push('Athlete');

    const newPlan: WorkoutPlan = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      splitType,
      level,
      targetGender,
      durationMinutes,
      description: description.trim() || 'Custom user training routine',
      tags,
      exercises: selectedExercises.map((item, idx) => ({
        id: `cust-ex-${Date.now()}-${idx}`,
        name: item.exercise.name,
        category: item.exercise.category,
        targetMuscle: item.exercise.targetMuscle,
        equipment: item.exercise.equipment,
        instructions: item.exercise.instructions,
        formTips: item.exercise.formTips,
        restSec: item.restSec,
        defaultSets: item.sets,
        defaultReps: item.reps,
        sets: Array.from({ length: item.sets }).map((_, sIdx) => ({
          id: `set-${sIdx + 1}`,
          setNumber: sIdx + 1,
          reps: item.reps,
          weightKg: 0,
          completed: false,
        })),
      })),
    };

    addWorkoutPlan(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Create Custom Workout Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSavePlan} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-600 font-semibold">Routine Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Heavy Chest & Triceps Blast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Target Gender</label>
              <select
                value={targetGender}
                onChange={(e) => setTargetGender(e.target.value as 'all' | 'female' | 'male')}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-emerald-600"
              >
                <option value="all">🌟 All / Unisex</option>
                <option value="female">👩 Female Focus (Glutes / Sculpt)</option>
                <option value="male">👨 Male Focus / General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'athlete')}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-emerald-600"
              >
                <option value="beginner">🟢 Beginner (Foundation)</option>
                <option value="intermediate">🟡 Intermediate (Hypertrophy)</option>
                <option value="athlete">🔴 Athlete / Pro (1RM / Explosive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Split Type</label>
              <select
                value={splitType}
                onChange={(e) => setSplitType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-emerald-600"
              >
                <option value="Push / Pull / Legs">Push / Pull / Legs (Weights)</option>
                <option value="Upper / Lower">Upper / Lower (Strength)</option>
                <option value="Full Body">Full Body Weights</option>
                <option value="Chest & Arms">Chest & Arms</option>
                <option value="HIIT & Cardio">HIIT & Cardio</option>
                <option value="Zumba & Dance">Zumba & Dance Fitness</option>
                <option value="Swimming & Aquatics">Swimming & Aquatics</option>
                <option value="Calisthenics & Bodyweight">Calisthenics & Bodyweight</option>
                <option value="Yoga & Mobility">Yoga & Mobility Flow</option>
                <option value="Pilates & Core">Pilates & Core Mat</option>
                <option value="Boxing & Martial Arts">Boxing & Combat Conditioning</option>
                <option value="Custom">Custom Multi-Discipline</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Est. Duration (Mins)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 45)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-600 font-semibold">Description</label>
            <input
              type="text"
              placeholder="Brief target or goal for this workout session..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Add Exercises to Plan */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block">
              Exercises in this Routine ({selectedExercises.length})
            </label>

            <div className="flex gap-2">
              <select
                value={exerciseSelectId}
                onChange={(e) => setExerciseSelectId(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-emerald-600"
              >
                <option value="">-- Choose Exercise from Library --</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.targetMuscle})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddExerciseToPlan}
                disabled={!exerciseSelectId}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors"
              >
                + Add
              </button>
            </div>

            {/* Selected Exercises List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedExercises.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{item.exercise.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.sets} sets × {item.reps} reps • Rest: {item.restSec}s
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(idx)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedExercises.length === 0 || !title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Save Workout Plan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
