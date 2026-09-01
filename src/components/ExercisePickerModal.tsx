import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Exercise } from '../types';
import { X, Search, Plus, Dumbbell, Flame, Music, Waves, Activity, Zap, Heart, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CHIPS = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Quadriceps',
  'Biceps',
  'Triceps',
  'Core & Abs',
  'Cardio & HIIT',
  'Zumba & Dance',
  'Swimming & Aquatics',
  'Calisthenics & Bodyweight',
  'Yoga & Mobility',
  'Pilates & Core',
  'Boxing & Martial Arts',
];

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({ isOpen, onClose }) => {
  const { exercises, addExerciseToActiveWorkout } = useFitness();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = exercises.filter((ex) => {
    const matchesGroup = selectedGroup === 'All' || ex.category === selectedGroup;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(search.toLowerCase()) ||
      ex.category.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleSelect = (exercise: Exercise) => {
    addExerciseToActiveWorkout(exercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Add Exercise or Activity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search exercises by name, muscle, activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_CHIPS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedGroup(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGroup === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exercises Scrollable List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-96">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              onClick={() => handleSelect(ex)}
              className="group cursor-pointer p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
                    {ex.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                    {ex.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {ex.targetMuscle} • {ex.equipment}
                </div>
              </div>

              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-bold text-xs border border-emerald-200 group-hover:border-emerald-600 transition-all shadow-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No exercises match your search criteria.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

