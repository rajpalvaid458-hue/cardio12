import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { WorkoutPlan, MuscleGroup, Exercise } from '../types';
import {
  Play,
  Plus,
  Sparkles,
  Flame,
  Clock,
  Dumbbell,
  Search,
  ChevronRight,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface TrainingViewProps {
  onOpenPlanCreator: () => void;
  onOpenAiGenerator: () => void;
  onSelectExerciseDetails: (exercise: Exercise) => void;
  onOpenActiveWorkout: () => void;
}

const MUSCLE_FILTERS: (MuscleGroup | 'All')[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Biceps',
  'Triceps',
  'Core & Abs',
  'Cardio',
];

export const TrainingView: React.FC<TrainingViewProps> = ({
  onOpenPlanCreator,
  onOpenAiGenerator,
  onSelectExerciseDetails,
  onOpenActiveWorkout,
}) => {
  const { plans, exercises, workoutLogs, activeWorkout, startWorkout, deleteWorkoutPlan } = useFitness();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const filteredExercises = exercises.filter((ex) => {
    const matchesMuscle = selectedMuscle === 'All' || ex.category === selectedMuscle;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesSearch;
  });

  const totalVolumeAllTime = workoutLogs.reduce((acc, log) => acc + log.totalVolumeKg, 0);

  const handleStartWorkout = (plan: WorkoutPlan) => {
    startWorkout(plan);
    onOpenActiveWorkout();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white border border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> Training & Progressive Overload
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready to crush your workout?
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Track your sets, weights, rest intervals, and progressive overload with zero friction. Choose a proven split or build your custom routine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>AI Plan Generator</span>
            </button>
            <button
              onClick={onOpenPlanCreator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Custom Plan</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Total Workouts
            </div>
            <div className="text-xl font-bold text-white mt-1 font-mono">{workoutLogs.length}</div>
          </div>
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Tonnage Lifted
            </div>
            <div className="text-xl font-bold text-white mt-1 font-mono">
              {totalVolumeAllTime > 1000 ? `${(totalVolumeAllTime / 1000).toFixed(1)}t` : `${totalVolumeAllTime}kg`}
            </div>
          </div>
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Avg Session
            </div>
            <div className="text-xl font-bold text-white mt-1 font-mono">48m</div>
          </div>
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Plan
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-1 truncate">
              {plans[0]?.title || 'Standard Split'}
            </div>
          </div>
        </div>
      </div>

      {/* Active Workout Resume Card (if one is currently active) */}
      {activeWorkout && (
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-emerald-950/90 text-white border border-emerald-500/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xl animate-pulse">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Workout In Progress</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-200">
                  {activeWorkout.completedSetsCount} sets completed
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeWorkout.title}</h3>
            </div>
          </div>
          <button
            onClick={onOpenActiveWorkout}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all"
          >
            <span>Open Live Workout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Section: Workout Plans & Splits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Workout Splits & Routines</h2>
            <p className="text-xs text-slate-500">Select a training plan to start your session</p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">{plans.length} available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {plan.splitType}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{plan.durationMinutes} min</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-600 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{plan.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {plan.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Exercise summary list */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>{plan.exercises.length} Exercises</span>
                      <button
                        onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        {isExpanded ? 'Hide List' : 'View Exercises'}
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-2 pt-1">
                        {plan.exercises.map((ex, idx) => (
                          <div
                            key={ex.id || idx}
                            className="text-xs flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">{ex.name}</span>
                              <div className="text-[10px] text-slate-500">{ex.targetMuscle}</div>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-600 font-bold">
                              {ex.sets.length} sets
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 truncate">
                        {plan.exercises.map((e) => e.name).join(' • ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleStartWorkout(plan)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Workout</span>
                  </button>

                  {plan.id.startsWith('custom-') && (
                    <button
                      onClick={() => deleteWorkoutPlan(plan.id)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Comprehensive Exercise Database */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Exercise Database & Form Guides</h2>
            <p className="text-xs text-slate-500">Step-by-step instructions, target muscles & cues</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercise, muscle, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Muscle group filter pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {MUSCLE_FILTERS.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMuscle === muscle
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => onSelectExerciseDetails(ex)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/60 p-4 transition-all hover:shadow-md flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {ex.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    {ex.equipment}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-emerald-600 transition-colors">
                  {ex.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  <span className="text-slate-400">Target:</span> {ex.targetMuscle}
                </p>

                <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200/70 text-[11px] text-slate-700 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Info className="w-3 h-3 text-emerald-600" /> Key Form Cue
                  </div>
                  <p className="line-clamp-2 text-slate-600">{ex.formTips[0] || ex.instructions[0]}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono font-medium">
                  {ex.defaultSets} sets × {ex.defaultReps} reps
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                  View Guide <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Workout Logs */}
      {workoutLogs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Workout Logs</h2>
            <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">{workoutLogs.length} logged sessions</span>
          </div>

          <div className="space-y-3">
            {workoutLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{log.title}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                      {new Date(log.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" /> {Math.round(log.durationSeconds / 60)} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5 text-emerald-600" /> {log.totalVolumeKg.toLocaleString()} kg total
                      volume
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> ~{log.caloriesBurned} kcal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-700">
                    {log.exercises.length} Exercises • {log.completedSetsCount} Sets Completed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
