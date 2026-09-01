import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { SupplementItem } from '../../types';
import {
  Pill,
  Plus,
  Trash2,
  Check,
  Bell,
  BellOff,
  Sparkles,
  Clock,
  Zap,
  ShieldCheck,
  Flame,
  Moon,
  Sun,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SupplementTracker: React.FC = () => {
  const {
    supplements,
    toggleSupplementTaken,
    addSupplement,
    deleteSupplement,
    toggleSupplementReminder,
  } = useFitness();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterTiming, setFilterTiming] = useState<string>('all');

  // Form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timing, setTiming] = useState<SupplementItem['timing']>('morning');
  const [benefits, setBenefits] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00 AM');

  const takenCount = supplements.filter((s) => s.taken).length;
  const totalCount = supplements.length;
  const completionPercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const filteredSupplements = supplements.filter((s) => {
    if (filterTiming === 'all') return true;
    return s.timing === filterTiming;
  });

  const getTimingIcon = (t: SupplementItem['timing']) => {
    switch (t) {
      case 'morning':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'pre_workout':
        return <Zap className="w-3.5 h-3.5 text-rose-500" />;
      case 'post_workout':
        return <Flame className="w-3.5 h-3.5 text-emerald-500" />;
      case 'evening':
      case 'night':
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getTimingLabel = (t: SupplementItem['timing']) => {
    switch (t) {
      case 'morning':
        return 'Morning with Meal';
      case 'pre_workout':
        return '30m Pre-Workout';
      case 'post_workout':
        return 'Post-Workout Shake';
      case 'with_meals':
        return 'With Main Meal';
      case 'evening':
        return 'Evening';
      case 'night':
        return 'Before Sleep';
      default:
        return 'Daily';
    }
  };

  const handleCreateSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    addSupplement({
      name: name.trim(),
      dosage: dosage.trim(),
      timing,
      benefits: benefits.trim() || 'General fitness & recovery support',
      taken: false,
      reminderEnabled: true,
      reminderTime: reminderTime || '09:00 AM',
    });

    setName('');
    setDosage('');
    setBenefits('');
    setShowAddModal(false);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header & Progress Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Pill className="w-3.5 h-3.5" /> Supplement Stack & Timing Reminders
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Daily Fitness Stack</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Optimize your nutrient timing, strength recovery, and essential vitamins
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Stack Taken</span>
              <span className="text-base font-black text-purple-700 font-mono">
                {takenCount} / {totalCount} ({completionPercent}%)
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center font-black text-xs text-purple-700 font-mono">
              {completionPercent}%
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplement</span>
          </button>
        </div>
      </div>

      {/* Timing Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Stacks' },
          { key: 'morning', label: 'Morning 🌅' },
          { key: 'pre_workout', label: 'Pre-Workout ⚡' },
          { key: 'post_workout', label: 'Post-Workout 🥤' },
          { key: 'night', label: 'Night 🌙' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTiming(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              filterTiming === tab.key
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Supplements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSupplements.map((supp) => (
          <motion.div
            key={supp.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              supp.taken
                ? 'bg-purple-50/50 border-purple-200 text-slate-800'
                : 'bg-white border-slate-200 hover:border-purple-300 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => toggleSupplementTaken(supp.id)}
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-all border ${
                  supp.taken
                    ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 border-slate-300 text-transparent hover:border-purple-400'
                }`}
                title={supp.taken ? 'Mark not taken' : 'Mark taken'}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`font-bold text-sm truncate ${
                      supp.taken ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {supp.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                    {supp.dosage}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    {getTimingIcon(supp.timing)}
                    {getTimingLabel(supp.timing)}
                  </span>
                  {supp.reminderTime && (
                    <span className="text-slate-400 font-mono">@{supp.reminderTime}</span>
                  )}
                </div>

                {supp.benefits && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                    {supp.benefits}
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Toggle Reminder & Delete */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleSupplementReminder(supp.id)}
                className={`p-2 rounded-xl transition-colors ${
                  supp.reminderEnabled
                    ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                    : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                }`}
                title={supp.reminderEnabled ? 'Reminder enabled' : 'Reminder disabled'}
              >
                {supp.reminderEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => deleteSupplement(supp.id)}
                className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete supplement"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Supplement Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                    <Pill className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Add Supplement to Stack</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSupplement} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-semibold">Supplement Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creatine Monohydrate / Ashwagandha / Whey"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Dosage *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5g / 1 capsule / 1 scoop"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Optimal Timing</label>
                    <select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-600"
                    >
                      <option value="morning">Morning with Meal</option>
                      <option value="pre_workout">30m Pre-Workout</option>
                      <option value="post_workout">Post-Workout</option>
                      <option value="with_meals">With Main Meals</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night before bed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Reminder Time</label>
                    <input
                      type="text"
                      placeholder="08:00 AM"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Key Benefit / Goal</label>
                    <input
                      type="text"
                      placeholder="e.g. Strength & ATP recovery"
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Save Supplement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
