import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { RoutineItem, RoutineCategory, DailyHabit } from '../types';
import {
  CalendarCheck,
  Check,
  Plus,
  Trash2,
  Clock,
  Flame,
  Moon,
  Sun,
  Dumbbell,
  Zap,
  Droplets,
  Award,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ReminderBannerWidget } from './reminders/ReminderBannerWidget';

interface DailyRoutineViewProps {
  onOpenRemindersModal?: () => void;
}

export const DailyRoutineView: React.FC<DailyRoutineViewProps> = ({ onOpenRemindersModal }) => {
  const { routineItems, habits, toggleRoutineItem, addRoutineItem, deleteRoutineItem, toggleHabit, userProfile } =
    useFitness();
  const { t, isHindi } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<RoutineCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Routine Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<RoutineCategory>('morning');
  const [newDuration, setNewDuration] = useState('15');

  const completedRoutineCount = routineItems.filter((i) => i.completed).length;
  const routinePercent = routineItems.length > 0 ? Math.round((completedRoutineCount / routineItems.length) * 100) : 0;

  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const habitPercent = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;

  const overallDailyScore = Math.round((routinePercent + habitPercent) / 2);

  const filteredRoutineItems = routineItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleCreateRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addRoutineItem({
      title: newTitle.trim(),
      time: newTime,
      description: newDesc.trim() || 'Daily habit checkpoint',
      category: newCategory,
      durationMins: parseInt(newDuration, 10) || 15,
      completed: false,
      importance: 'medium',
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const getCategoryBadge = (cat: RoutineCategory) => {
    switch (cat) {
      case 'morning':
        return { label: 'Morning', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Sun };
      case 'preworkout':
        return { label: 'Pre-Workout', color: 'text-orange-700 bg-orange-50 border-orange-200', icon: Zap };
      case 'workout':
        return { label: 'Pulse Training', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: Dumbbell };
      case 'postworkout':
        return { label: 'Post-Workout', color: 'text-teal-700 bg-teal-50 border-teal-200', icon: Droplets };
      case 'evening':
        return { label: 'Evening / Sleep', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: Moon };
      default:
        return { label: 'Habit', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: CalendarCheck };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Daily Adherence Score */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5" /> {isHindi ? 'दैनिक दिनचर्या और अनुशासन' : 'Daily Routine & Discipline'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'दैनिक दिनचर्या और आदत अनुसूची' : 'Daily Routine & Habit Schedule'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
              {isHindi 
                ? 'नियमितता ही सफलता की कुंजी है। अपनी नींद, पानी, भोजन, वर्कआउट और रिकवरी को व्यवस्थित करें।' 
                : 'Consistency builds greatness. Align your sleep, hydration, pre-workout fueling, training window, and recovery rituals.'}
            </p>
          </div>

          {/* Daily Completion Score Badge */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="relative w-14 h-14 flex items-center justify-center font-bold text-slate-900">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-200"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-emerald-600 transition-all duration-500"
                  strokeWidth="3.5"
                  strokeDasharray={`${overallDailyScore}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-sm font-black text-emerald-700">{overallDailyScore}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{isHindi ? 'आज का पालन' : "Today's Adherence"}</div>
              <div className="text-[11px] text-slate-500">
                {completedRoutineCount}/{routineItems.length} {isHindi ? 'रूटीन' : 'Routine'} • {completedHabitsCount}/{habits.length} {isHindi ? 'आदतें' : 'Habits'}
              </div>
            </div>
          </div>
        </div>

        {/* Mini Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-semibold">{isHindi ? 'सक्रिय स्ट्रीक' : 'Active Streak'}</div>
            <div className="text-xl font-bold text-amber-600 font-mono mt-0.5 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-current" /> {userProfile.streakDays} {t('days')}
            </div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-semibold">{isHindi ? 'शेड्यूल इवेंट' : 'Schedule Blocks'}</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{routineItems.length} {isHindi ? 'इवेंट्स' : 'Events'}</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-semibold">{isHindi ? 'आज पूरे हुए' : 'Completed Today'}</div>
            <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">{completedRoutineCount} {isHindi ? 'पूर्ण' : 'Done'}</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] text-slate-500 font-semibold">{isHindi ? 'आदत नियमितता' : 'Habit Consistency'}</div>
            <div className="text-xl font-bold text-blue-600 font-mono mt-0.5">{habitPercent}%</div>
          </div>
        </div>
      </div>

      {/* Reminder Banner Widget */}
      {onOpenRemindersModal && (
        <ReminderBannerWidget
          onOpenRemindersModal={onOpenRemindersModal}
          variant="routine"
        />
      )}

      {/* Section: Daily Core Fitness Habits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daily Athletic Habits</h2>
            <p className="text-xs text-slate-500">Non-negotiable daily pillars for peak performance</p>
          </div>
          <span className="text-xs text-emerald-700 font-bold font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {completedHabitsCount} / {habits.length} Done
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`group cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
                habit.completed
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    habit.completed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 group-hover:bg-slate-200 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Check className={`w-4 h-4 ${habit.completed ? 'stroke-[3]' : ''}`} />
                </div>

                <div>
                  <h4
                    className={`text-xs sm:text-sm font-bold transition-colors ${
                      habit.completed ? 'text-emerald-800 line-through' : 'text-slate-900'
                    }`}
                  >
                    {habit.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                    {habit.targetCount && (
                      <span>
                        {habit.currentCount || 0} / {habit.targetCount} {habit.unit}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Flame className="w-3 h-3 fill-current" /> {habit.streakDays}d streak
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Time-Blocked Daily Routine Timeline */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Daily Schedule & Time-Blocks</h2>
            <p className="text-xs text-slate-500">Structured daily timeline for workouts, nutrition, and rest</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Time-Block</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(['all', 'morning', 'preworkout', 'workout', 'postworkout', 'evening'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Day' : cat}
            </button>
          ))}
        </div>

        {/* Timeline Events List */}
        <div className="space-y-3">
          {filteredRoutineItems.map((item) => {
            const badge = getCategoryBadge(item.category);
            const Icon = badge.icon;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  item.completed
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => toggleRoutineItem(item.id)}
                    className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${item.completed ? 'stroke-[3]' : ''}`} />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {item.time}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.color}`}
                      >
                        <Icon className="w-2.5 h-2.5" />
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {item.durationMins}m
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold transition-colors ${
                        item.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-2xl">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => deleteRoutineItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Routine Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Add Schedule Time-Block</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRoutineItem} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-semibold">Title / Activity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pre-Workout Hydration & Banana"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Time</label>
                    <input
                      type="text"
                      placeholder="07:30 AM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Duration (Minutes)</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as RoutineCategory)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 capitalize focus:outline-none focus:border-emerald-600"
                  >
                    <option value="morning">Morning</option>
                    <option value="preworkout">Pre-Workout</option>
                    <option value="workout">Workout / Training</option>
                    <option value="postworkout">Post-Workout</option>
                    <option value="evening">Evening / Sleep</option>
                    <option value="habit">General Habit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-semibold">Description / Form Cues</label>
                  <textarea
                    rows={2}
                    placeholder="Specific instructions or reminders..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 resize-none focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Add to Schedule
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
