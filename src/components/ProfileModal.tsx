import React, { useState, useMemo } from 'react';
import { useFitness } from '../context/FitnessContext';
import { UserProfile } from '../types';
import { 
  X, 
  User, 
  Flame, 
  Trophy, 
  Award, 
  Dumbbell, 
  Zap, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Crown, 
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'volume' | 'workouts';
  icon: React.ElementType;
  targetValue: number;
  currentValue: number;
  unit: string;
  formatValue?: (val: number) => string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile, dailyDiet, setMacroGoals, workoutLogs } = useFitness();

  const [activeTab, setActiveTab] = useState<'profile' | 'milestones'>('profile');
  const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'streak' | 'volume' | 'workouts'>('all');

  const [name, setName] = useState(userProfile.name);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg.toString());
  const [targetWeightKg, setTargetWeightKg] = useState(userProfile.targetWeightKg.toString());
  const [heightCm, setHeightCm] = useState(userProfile.heightCm.toString());
  const [goal, setGoal] = useState(userProfile.goal);
  const [weightUnit, setWeightUnit] = useState(userProfile.weightUnit);

  const [cals, setCals] = useState(dailyDiet.calorieGoal.toString());
  const [protein, setProtein] = useState(dailyDiet.proteinGoalGrams.toString());
  const [carbs, setCarbs] = useState(dailyDiet.carbsGoalGrams.toString());
  const [fats, setFats] = useState(dailyDiet.fatsGoalGrams.toString());
  const [water, setWater] = useState(dailyDiet.waterGoalMl.toString());

  // Cumulative Metrics for Milestones
  const stats = useMemo(() => {
    const totalWorkouts = workoutLogs.length;
    const totalVolumeRawKg = workoutLogs.reduce((sum, log) => sum + (log.totalVolumeKg || 0), 0);
    const isLbs = userProfile.weightUnit === 'lbs';
    const totalVolumeDisplay = isLbs ? Math.round(totalVolumeRawKg * 2.20462) : Math.round(totalVolumeRawKg);
    const streak = userProfile.streakDays || 0;

    return {
      totalWorkouts,
      totalVolumeDisplay,
      totalVolumeRawKg,
      streak,
      unit: userProfile.weightUnit,
    };
  }, [workoutLogs, userProfile.weightUnit, userProfile.streakDays]);

  const milestonesList: Milestone[] = useMemo(() => {
    const isLbs = userProfile.weightUnit === 'lbs';
    const mult = isLbs ? 2.20462 : 1;
    const unitLabel = userProfile.weightUnit;

    return [
      // Streak Milestones
      {
        id: 'streak_3',
        title: 'Kickstarter',
        description: 'Maintain a consistent 3-day workout streak',
        category: 'streak',
        icon: Flame,
        targetValue: 3,
        currentValue: stats.streak,
        unit: 'days',
      },
      {
        id: 'streak_7',
        title: 'Habit Builder',
        description: 'Hit a full 7-day training consistency streak',
        category: 'streak',
        icon: Zap,
        targetValue: 7,
        currentValue: stats.streak,
        unit: 'days',
      },
      {
        id: 'streak_14',
        title: 'Iron Dedication',
        description: 'Complete 14 consecutive active days',
        category: 'streak',
        icon: ShieldCheck,
        targetValue: 14,
        currentValue: stats.streak,
        unit: 'days',
      },
      {
        id: 'streak_30',
        title: 'Unstoppable Titan',
        description: 'Achieve a legendary 30-day streak milestone',
        category: 'streak',
        icon: Crown,
        targetValue: 30,
        currentValue: stats.streak,
        unit: 'days',
      },

      // Volume / Tonnage Milestones
      {
        id: 'volume_1000',
        title: 'First Tonnage',
        description: `Lift a cumulative ${Math.round(1000 * mult).toLocaleString()} ${unitLabel} across all sessions`,
        category: 'volume',
        icon: Dumbbell,
        targetValue: Math.round(1000 * mult),
        currentValue: stats.totalVolumeDisplay,
        unit: unitLabel,
        formatValue: (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k ${unitLabel}` : `${v} ${unitLabel}`,
      },
      {
        id: 'volume_10000',
        title: 'Heavy Mover',
        description: `Lift ${Math.round(10000 * mult).toLocaleString()} ${unitLabel} of total cumulative volume`,
        category: 'volume',
        icon: TrendingUp,
        targetValue: Math.round(10000 * mult),
        currentValue: stats.totalVolumeDisplay,
        unit: unitLabel,
        formatValue: (v) => `${(v / 1000).toFixed(1)}k ${unitLabel}`,
      },
      {
        id: 'volume_50000',
        title: 'Titanium Club',
        description: `Surpass ${Math.round(50000 * mult).toLocaleString()} ${unitLabel} total weight moved`,
        category: 'volume',
        icon: Trophy,
        targetValue: Math.round(50000 * mult),
        currentValue: stats.totalVolumeDisplay,
        unit: unitLabel,
        formatValue: (v) => `${(v / 1000).toFixed(1)}k ${unitLabel}`,
      },
      {
        id: 'volume_100000',
        title: 'Iron God',
        description: `Move an epic ${Math.round(100000 * mult).toLocaleString()} ${unitLabel} in total tonnage`,
        category: 'volume',
        icon: Award,
        targetValue: Math.round(100000 * mult),
        currentValue: stats.totalVolumeDisplay,
        unit: unitLabel,
        formatValue: (v) => `${(v / 1000).toFixed(0)}k ${unitLabel}`,
      },

      // Workout Sessions Milestones
      {
        id: 'workouts_1',
        title: 'First Blood',
        description: 'Complete and log your first workout session',
        category: 'workouts',
        icon: Target,
        targetValue: 1,
        currentValue: stats.totalWorkouts,
        unit: 'sessions',
      },
      {
        id: 'workouts_5',
        title: 'Regular Lifter',
        description: 'Complete 5 structured workout routines',
        category: 'workouts',
        icon: Dumbbell,
        targetValue: 5,
        currentValue: stats.totalWorkouts,
        unit: 'sessions',
      },
      {
        id: 'workouts_15',
        title: 'Veteran Athlete',
        description: 'Log 15 complete gym training sessions',
        category: 'workouts',
        icon: Award,
        targetValue: 15,
        currentValue: stats.totalWorkouts,
        unit: 'sessions',
      },
      {
        id: 'workouts_50',
        title: 'Century Club',
        description: 'Reach 50 recorded training sessions in your logbook',
        category: 'workouts',
        icon: Sparkles,
        targetValue: 50,
        currentValue: stats.totalWorkouts,
        unit: 'sessions',
      },
    ];
  }, [stats, userProfile.weightUnit]);

  const unlockedCount = useMemo(() => {
    return milestonesList.filter((m) => m.currentValue >= m.targetValue).length;
  }, [milestonesList]);

  const filteredMilestones = useMemo(() => {
    if (milestoneFilter === 'all') return milestonesList;
    return milestonesList.filter((m) => m.category === milestoneFilter);
  }, [milestonesList, milestoneFilter]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      name: name.trim() || 'Athlete',
      weightKg: parseFloat(weightKg) || 75,
      targetWeightKg: parseFloat(targetWeightKg) || 75,
      heightCm: parseFloat(heightCm) || 178,
      goal: goal as any,
      weightUnit,
    });

    setMacroGoals(
      parseInt(cals, 10) || 2200,
      parseInt(protein, 10) || 150,
      parseInt(carbs, 10) || 240,
      parseInt(fats, 10) || 65,
      parseInt(water, 10) || 3000
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Athlete Profile & Milestones</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Targets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'milestones'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Milestones & Badges</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 ml-1">
              {unlockedCount}/{milestonesList.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Profile & Targets */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-semibold">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-semibold">Current Weight</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-semibold">Target Goal</label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-semibold">Weight Unit</label>
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-emerald-600"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>

            {/* Macro Goals */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nutrition & Macro Targets
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Calories (kcal)</label>
                  <input
                    type="number"
                    value={cals}
                    onChange={(e) => setCals(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Fats (g)</label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-500">Daily Water Target (ml)</label>
                <input
                  type="number"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono shadow-xs focus:outline-none focus:border-emerald-600"
                />
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
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Milestones & Badges */}
        {activeTab === 'milestones' && (
          <div className="space-y-5">
            {/* Overview Stats Strip */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Unlocked</div>
                <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
                  {unlockedCount} <span className="text-xs text-slate-400 font-normal">/ {milestonesList.length}</span>
                </div>
              </div>

              <div className="text-center border-x border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Streak</div>
                <div className="text-lg font-black text-amber-600 font-mono mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{stats.streak}d</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Volume</div>
                <div className="text-lg font-black text-blue-600 font-mono mt-0.5">
                  {stats.totalVolumeDisplay >= 1000
                    ? `${(stats.totalVolumeDisplay / 1000).toFixed(1)}k ${stats.unit}`
                    : `${stats.totalVolumeDisplay} ${stats.unit}`}
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Badges' },
                { id: 'streak', label: 'Streaks' },
                { id: 'volume', label: 'Volume' },
                { id: 'workouts', label: 'Sessions' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setMilestoneFilter(filter.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    milestoneFilter === filter.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredMilestones.map((m) => {
                const isUnlocked = m.currentValue >= m.targetValue;
                const progressPercent = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));
                const IconComponent = m.icon;

                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 opacity-80'
                    }`}
                  >
                    {/* Badge Card Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isUnlocked
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold truncate ${isUnlocked ? 'text-slate-900' : 'text-slate-700'}`}>
                            {m.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 shrink-0">
                              <Lock className="w-3 h-3" /> {progressPercent}%
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Value */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                          {m.formatValue ? m.formatValue(Math.min(m.currentValue, m.targetValue)) : Math.min(m.currentValue, m.targetValue)} / {m.formatValue ? m.formatValue(m.targetValue) : `${m.targetValue} ${m.unit}`}
                        </span>
                        <span className="text-slate-400 font-semibold">
                          {isUnlocked ? 'Completed' : `${progressPercent}%`}
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUnlocked ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

