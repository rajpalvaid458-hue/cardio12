import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Exercise, MuscleGroup } from '../types';
import { X, Search, Plus, Dumbbell } from 'lucide-react';
import { motion } from 'motion/react';

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({ isOpen, onClose }) => {
  const { exercises, addExerciseToActiveWorkout } = useFitness();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = exercises.filter((ex) => {
    const matchesGroup = selectedGroup === 'All' || ex.category === selectedGroup;
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(search.toLowerCase());
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
        className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Add Exercise to Live Session</h3>
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
            placeholder="Search exercises by name or muscle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
          />
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
                <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
                  {ex.name}
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
        </div>
      </motion.div>
    </div>
  );
};
