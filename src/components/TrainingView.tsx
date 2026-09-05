import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { WorkoutPlan, MuscleGroup, Exercise, TrainingDiscipline } from '../types';
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
  Waves,
  Music,
  Activity,
  Heart,
  Shield,
  Zap,
  Calendar as CalendarIcon,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutCalendar } from './WorkoutCalendar';
import { ProgramScheduleModal } from './ProgramScheduleModal';
import { BodyweightChallenge } from './BodyweightChallenge';
import { WarmUpGenerator } from './WarmUpGenerator';

interface TrainingViewProps {
  onOpenPlanCreator: () => void;
  onOpenAiGenerator: () => void;
  onSelectExerciseDetails: (exercise: Exercise) => void;
  onOpenActiveWorkout: () => void;
}

const DISCIPLINE_TABS: { id: TrainingDiscipline; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'All', label: 'All Disciplines', icon: Activity },
  { id: 'Weights & Strength', label: 'Weights & Strength', icon: Dumbbell },
  { id: 'Cardio & HIIT', label: 'Cardio & HIIT', icon: Flame },
  { id: 'Zumba & Dance', label: 'Zumba & Dance', icon: Music },
  { id: 'Swimming', label: 'Swimming & Water', icon: Waves },
  { id: 'Calisthenics', label: 'Calisthenics', icon: Zap },
  { id: 'Yoga & Mobility', label: 'Yoga & Stretching', icon: Heart },
  { id: 'Pilates', label: 'Pilates & Core', icon: Activity },
  { id: 'Boxing & Combat', label: 'Boxing & Combat', icon: Shield },
];

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
  'Cardio & HIIT',
  'Zumba & Dance',
  'Swimming & Aquatics',
  'Calisthenics & Bodyweight',
  'Yoga & Mobility',
  'Pilates & Core',
  'Boxing & Martial Arts',
];

export const TrainingView: React.FC<TrainingViewProps> = ({
  onOpenPlanCreator,
  onOpenAiGenerator,
  onSelectExerciseDetails,
  onOpenActiveWorkout,
}) => {
  const { plans, exercises, workoutLogs, activeWorkout, startWorkout, deleteWorkoutPlan } = useFitness();
  const { t, isHindi } = useLanguage();
  const [selectedDiscipline, setSelectedDiscipline] = useState<TrainingDiscipline>('All');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'athlete'>('all');
  const [selectedProgramType, setSelectedProgramType] = useState<'all' | 'normal' | '1-week' | '1-month' | 'daily'>('all');
  const [scheduleModalPlan, setScheduleModalPlan] = useState<WorkoutPlan | null>(null);
  const [yogaSubFilter, setYogaSubFilter] = useState<'all' | 'yoga' | 'stretching' | 'posture'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(true);
  const [showChallengeSection, setShowChallengeSection] = useState<boolean>(true);
  const [showWarmUpSection, setShowWarmUpSection] = useState<boolean>(true);
  const [warmUpSelectedPlanId, setWarmUpSelectedPlanId] = useState<string | null>(null);

  const handleSelectWarmUpForPlan = (plan: WorkoutPlan) => {
    setWarmUpSelectedPlanId(plan.id);
    setShowWarmUpSection(true);
    setTimeout(() => {
      const el = document.getElementById('warmup-routine-generator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const filteredPlans = plans.filter((plan) => {
    // Normal / Program Duration Filter
    if (selectedProgramType === 'normal') {
      const isNormal =
        plan.tags.some((t) => t.toLowerCase().includes('normal')) ||
        plan.title.toLowerCase().includes('normal') ||
        plan.splitType.toLowerCase().includes('normal');
      if (!isNormal) return false;
    } else if (selectedProgramType === '1-week') {
      const is1Week =
        plan.programType === '1-week' ||
        plan.tags.some((t) => t.toLowerCase().includes('1-week') || t.toLowerCase().includes('week')) ||
        plan.title.toLowerCase().includes('1-week') ||
        plan.splitType.toLowerCase().includes('1-week');
      if (!is1Week) return false;
    } else if (selectedProgramType === '1-month') {
      const is1Month =
        plan.programType === '1-month' ||
        plan.tags.some((t) => t.toLowerCase().includes('1-month') || t.toLowerCase().includes('month')) ||
        plan.title.toLowerCase().includes('1-month') ||
        plan.splitType.toLowerCase().includes('1-month');
      if (!is1Month) return false;
    } else if (selectedProgramType === 'daily') {
      const isDaily =
        plan.programType === 'daily' ||
        plan.tags.some((t) => t.toLowerCase().includes('daily')) ||
        plan.title.toLowerCase().includes('daily') ||
        plan.durationMinutes <= 30;
      if (!isDaily) return false;
    }

    // Gender filter
    if (selectedGender === 'female') {
      const isFemale = plan.targetGender === 'female' || plan.tags.some((t) => t.toLowerCase().includes('female') || t.toLowerCase().includes('glute') || t.toLowerCase().includes('hourglass'));
      if (!isFemale) return false;
    } else if (selectedGender === 'male') {
      if (plan.targetGender === 'female') return false;
    }

    // Level filter
    if (selectedLevel !== 'all') {
      if (selectedLevel === 'beginner' && plan.level !== 'beginner') return false;
      if (selectedLevel === 'intermediate' && plan.level !== 'intermediate') return false;
      if (selectedLevel === 'athlete' && plan.level !== 'athlete' && plan.level !== 'advanced') return false;
    }

    // Discipline filter
    if (selectedDiscipline === 'All') return true;
    if (selectedDiscipline === 'Weights & Strength') {
      return plan.splitType.includes('Push') || plan.splitType.includes('Weights') || plan.tags.includes('Weights') || plan.splitType.includes('Legs') || plan.splitType.includes('Pull');
    }
    if (selectedDiscipline === 'Cardio & HIIT') {
      return plan.splitType.includes('Cardio') || plan.tags.includes('Cardio') || plan.tags.includes('HIIT');
    }
    if (selectedDiscipline === 'Zumba & Dance') {
      return plan.splitType.includes('Zumba') || plan.tags.includes('Zumba') || plan.tags.includes('Dance');
    }
    if (selectedDiscipline === 'Swimming') {
      return plan.splitType.includes('Swim') || plan.tags.includes('Swimming');
    }
    if (selectedDiscipline === 'Yoga & Mobility') {
      const isYogaOrStretch =
        plan.splitType.includes('Yoga') ||
        plan.tags.includes('Yoga') ||
        plan.tags.includes('Mobility') ||
        plan.tags.includes('Stretching') ||
        plan.tags.includes('Flexibility') ||
        plan.tags.includes('Posture');
      if (!isYogaOrStretch) return false;

      if (yogaSubFilter === 'yoga') {
        return plan.title.toLowerCase().includes('yoga') || plan.tags.some((t) => t.toLowerCase().includes('yoga') || t.toLowerCase().includes('vinyasa'));
      }
      if (yogaSubFilter === 'stretching') {
        return (
          plan.title.toLowerCase().includes('stretch') ||
          plan.title.toLowerCase().includes('mobility') ||
          plan.tags.some((t) => t.toLowerCase().includes('stretch') || t.toLowerCase().includes('mobility'))
        );
      }
      if (yogaSubFilter === 'posture') {
        return (
          plan.title.toLowerCase().includes('posture') ||
          plan.title.toLowerCase().includes('desk') ||
          plan.tags.some((t) => t.toLowerCase().includes('posture') || t.toLowerCase().includes('desk'))
        );
      }
      return true;
    }
    if (selectedDiscipline === 'Pilates') {
      return plan.splitType.includes('Pilates') || plan.tags.includes('Pilates');
    }
    if (selectedDiscipline === 'Boxing & Combat') {
      return plan.splitType.includes('Boxing') || plan.tags.includes('Boxing');
    }
    if (selectedDiscipline === 'Calisthenics') {
      return plan.splitType.includes('Calisthenics') || plan.tags.includes('Calisthenics');
    }
    return true;
  });

  const filteredExercises = exercises.filter((ex) => {
    // Check discipline filter
    let matchesDiscipline = true;
    if (selectedDiscipline !== 'All') {
      if (selectedDiscipline === 'Weights & Strength') {
        matchesDiscipline = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core & Abs'].includes(ex.category as string);
      } else if (selectedDiscipline === 'Cardio & HIIT') {
        matchesDiscipline = ex.category === 'Cardio & HIIT' || ex.category === 'Cardio' || ex.discipline === 'Cardio & HIIT';
      } else if (selectedDiscipline === 'Zumba & Dance') {
        matchesDiscipline = ex.category === 'Zumba & Dance' || ex.discipline === 'Zumba & Dance';
      } else if (selectedDiscipline === 'Swimming') {
        matchesDiscipline = ex.category === 'Swimming & Aquatics' || ex.discipline === 'Swimming';
      } else if (selectedDiscipline === 'Calisthenics') {
        matchesDiscipline = ex.category === 'Calisthenics & Bodyweight' || ex.discipline === 'Calisthenics';
      } else if (selectedDiscipline === 'Yoga & Mobility') {
        matchesDiscipline = ex.category === 'Yoga & Mobility' || ex.discipline === 'Yoga & Mobility';
        if (matchesDiscipline && yogaSubFilter !== 'all') {
          const text = (ex.name + ' ' + ex.targetMuscle + ' ' + ex.equipment).toLowerCase();
          if (yogaSubFilter === 'yoga') {
            matchesDiscipline = text.includes('yoga') || text.includes('vinyasa') || text.includes('dog') || text.includes('warrior') || text.includes('triangle') || text.includes('asan');
          } else if (yogaSubFilter === 'stretching') {
            matchesDiscipline = text.includes('stretch') || text.includes('pigeon') || text.includes('lunge') || text.includes('butterfly') || text.includes('fold') || text.includes('switch') || text.includes('mobility');
          } else if (yogaSubFilter === 'posture') {
            matchesDiscipline = text.includes('neck') || text.includes('trap') || text.includes('chest') || text.includes('shoulder') || text.includes('cat-cow') || text.includes('desk') || text.includes('spine');
          }
        }
      } else if (selectedDiscipline === 'Pilates') {
        matchesDiscipline = ex.category === 'Pilates & Core' || ex.discipline === 'Pilates';
      } else if (selectedDiscipline === 'Boxing & Combat') {
        matchesDiscipline = ex.category === 'Boxing & Martial Arts' || ex.discipline === 'Boxing & Combat';
      }
    }

    const matchesMuscle = selectedMuscle === 'All' || ex.category === selectedMuscle;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDiscipline && matchesMuscle && matchesSearch;
  });

  const totalVolumeAllTime = workoutLogs.reduce((acc, log) => acc + log.totalVolumeKg, 0);

  const handleStartWorkout = (plan: WorkoutPlan) => {
    startWorkout(plan);
    onOpenActiveWorkout();
  };

  const getDisciplineBadge = (category: string) => {
    if (category.includes('Zumba') || category.includes('Dance')) {
      return { bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', icon: Music, label: 'Zumba & Dance' };
    }
    if (category.includes('Swim') || category.includes('Aquatics')) {
      return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: Waves, label: 'Swimming' };
    }
    if (category.includes('Boxing') || category.includes('Martial')) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Shield, label: 'Boxing & Combat' };
    }
    if (category.includes('Yoga') || category.includes('Mobility') || category.includes('Stretch')) {
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Heart, label: 'Yoga & Stretching' };
    }
    if (category.includes('Pilates')) {
      return { bg: 'bg-teal-50 text-teal-700 border-teal-200', icon: Activity, label: 'Pilates' };
    }
    if (category.includes('Calisthenics')) {
      return { bg: 'bg-orange-50 text-orange-700 border-orange-200', icon: Zap, label: 'Calisthenics' };
    }
    if (category.includes('Cardio') || category.includes('HIIT')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Flame, label: 'Cardio & HIIT' };
    }
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Dumbbell, label: category };
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] text-white border border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> {isHindi ? 'ऑल-इन-वन फिटनेस ट्रेनिंग' : 'All-in-One Fitness Training'}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {isHindi ? 'वेट ट्रेनिंग, कार्डियो, योग और समग्र फिटनेस' : 'Weight Training, Cardio, Stretching, Yoga & More'}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              {isHindi 
                ? 'जिम लिफ्टिंग, एचआईआईटी कार्डियो, योग, डीप स्ट्रेचिंग, ज़ुम्बा, तैराकी और बॉक्सिंग को सटीक रेस्ट टाइमर और फॉर्म गाइडेंस के साथ ट्रैक करें।' 
                : 'Track gym lifting, HIIT cardio, yoga flows, deep full-body stretching, mobility routines, Zumba, swimming, and boxing with live guidance, rest timers, and form cues.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{t('ai_smart_plan')}</span>
            </button>
            <button
              onClick={() => setShowChallengeSection((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                showChallengeSection
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Toggle 30-Day Calisthenics Challenge"
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-500/30" />
              <span>{isHindi ? '30-दिन बॉडीवेट चैलेंज' : '30-Day Challenge'}</span>
            </button>
            <button
              onClick={() => setShowWarmUpSection((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                showWarmUpSection
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Toggle 5-Minute Dynamic Warm-Up Routine Generator"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-500/30" />
              <span>{isHindi ? '5-मिनट वॉर्म-अप' : 'Warm-up Routine'}</span>
            </button>
            <button
              onClick={() => setShowCalendar((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showCalendar
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Toggle Consistency Calendar & CSV Download"
            >
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>{isHindi ? 'वर्कआउट कैलेंडर' : 'Training Calendar'}</span>
            </button>
            <button
              onClick={onOpenPlanCreator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('create_custom_plan')}</span>
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
            <div className="text-xl font-bold text-white mt-1 font-mono">42m</div>
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
            <span>{t('resume_workout')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Interactive Workout Calendar & Consistency Tracker with CSV Export */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <WorkoutCalendar
              workoutLogs={workoutLogs}
              onStartNewWorkout={onOpenPlanCreator}
              onSelectExerciseDetails={onSelectExerciseDetails}
              onSelectWarmUpForPlan={handleSelectWarmUpForPlan}
              onStartPlanWorkout={handleStartWorkout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 30-Day Bodyweight Challenge Section */}
      <AnimatePresence>
        {showChallengeSection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <BodyweightChallenge />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5-Minute Dynamic Warm-Up Routine Generator */}
      <AnimatePresence>
        {showWarmUpSection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <WarmUpGenerator
              plans={plans}
              selectedPlanId={warmUpSelectedPlanId}
              onSelectPlan={(plan) => setWarmUpSelectedPlanId(plan.id)}
              onStartWorkout={(plan) => handleStartWorkout(plan)}
              onClose={() => setShowWarmUpSection(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discipline Category Switcher Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Training Discipline & Activity Type
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {filteredPlans.length} plans • {filteredExercises.length} exercises
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {DISCIPLINE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDiscipline === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedDiscipline(tab.id);
                  setSelectedMuscle('All');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Workout Plans & Splits */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isHindi ? 'वर्कआउट रूटीन और स्प्लिट्स' : 'Workout Splits & Routines'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? 'महिला / पुरुष और अनुभव स्तर के अनुसार चुनें' : 'Filter by Gender focus (Female / Male) and Experience level'}
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs self-start sm:self-auto">
            {filteredPlans.length} {isHindi ? 'प्लान उपलब्ध' : 'plans available'}
          </span>
        </div>

        {/* Dedicated Yoga & Stretching Focus Filter */}
        {selectedDiscipline === 'Yoga & Mobility' && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-purple-50/90 rounded-2xl border border-purple-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 mr-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-purple-600" /> Focus:
            </span>
            <button
              onClick={() => setYogaSubFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                yogaSubFilter === 'all'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              🧘 All (Yoga & Stretches)
            </button>
            <button
              onClick={() => setYogaSubFilter('yoga')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                yogaSubFilter === 'yoga'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              🕉️ Yoga Flows (Vinyasa & Yin)
            </button>
            <button
              onClick={() => setYogaSubFilter('stretching')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                yogaSubFilter === 'stretching'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              🤸 Deep Stretching & Mobility
            </button>
            <button
              onClick={() => setYogaSubFilter('posture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                yogaSubFilter === 'posture'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              🪑 Desk & Posture Reset
            </button>
          </div>
        )}

        {/* Normal Workouts & Routine Duration Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white shadow-sm border border-emerald-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                {isHindi ? 'नॉर्मल वर्कआउट व रूटीन शेड्यूल' : 'Normal Workouts & Routine Schedules'}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                {isHindi ? '1-सप्ताह, 1-महीना और सामान्य दैनिक वर्कआउट्स' : '1-Week, 1-Month & Everyday Normal Fitness Splits'}
              </h3>
              <p className="text-xs text-slate-300">
                {isHindi
                  ? 'दैनिक जीवन के लिए संतुलित व सुरक्षित वर्कआउट - 7-दिन का शेड्यूल व 4-सप्ताह का प्रोग्रेसिव ओवरलोड रोडमैप।'
                  : 'Balanced, sustainable training programs with day-by-day 7-day schedules and 4-week progressive roadmaps.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
            <button
              onClick={() => setSelectedProgramType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProgramType === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              🌐 {isHindi ? 'सभी वर्कआउट्स' : 'All Workouts'}
            </button>
            <button
              onClick={() => setSelectedProgramType('normal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProgramType === 'normal'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              🌟 {isHindi ? 'सामान्य वर्कआउट्स' : 'Normal Workouts'}
            </button>
            <button
              onClick={() => setSelectedProgramType('1-week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProgramType === '1-week'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              📅 {isHindi ? '1-सप्ताह का शेड्यूल' : '1-Week Routine (7-Day)'}
            </button>
            <button
              onClick={() => setSelectedProgramType('1-month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProgramType === '1-month'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              🗓️ {isHindi ? '1-महीने का प्लान' : '1-Month Program (4-Week)'}
            </button>
            <button
              onClick={() => setSelectedProgramType('daily')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProgramType === 'daily'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              ⚡ {isHindi ? 'दैनिक 30-मिनट' : 'Daily 30-Min Maintenance'}
            </button>
          </div>
        </div>

        {/* Dual Sub-Filters: Gender & Level Switchers */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
          {/* Gender Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">Gender:</span>
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedGender === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              🌟 All
            </button>
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedGender === 'female'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-white text-pink-700 hover:bg-pink-50 border border-pink-200'
              }`}
            >
              👩 Female Focus (Glute & Toning)
            </button>
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedGender === 'male'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              👨 Male / General
            </button>
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-200 mx-1" />

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">Level:</span>
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedLevel === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              ⚡ All
            </button>
            <button
              onClick={() => setSelectedLevel('beginner')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedLevel === 'beginner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              🟢 Beginner
            </button>
            <button
              onClick={() => setSelectedLevel('intermediate')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedLevel === 'intermediate'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              🟡 Intermediate
            </button>
            <button
              onClick={() => setSelectedLevel('athlete')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                selectedLevel === 'athlete'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              🔴 Pro Athlete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;
            const badge = getDisciplineBadge(plan.splitType || plan.tags[0] || '');
            const BadgeIcon = badge.icon;
            const isFemale = plan.targetGender === 'female' || plan.tags.some((t) => t.toLowerCase().includes('female'));
            const isAthlete = plan.level === 'athlete' || plan.level === 'advanced';
            const isBeginner = plan.level === 'beginner';

            return (
              <div
                key={plan.id}
                className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${badge.bg}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {plan.splitType}
                      </span>
                      {plan.programType === '1-week' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                          📅 1-Week Split
                        </span>
                      )}
                      {plan.programType === '1-month' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          🗓️ 1-Month Program
                        </span>
                      )}
                      {plan.programType === 'daily' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          ⚡ Daily 30-Min
                        </span>
                      )}
                      {isFemale && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 border border-pink-200">
                          🌸 Female Focus
                        </span>
                      )}
                      {isBeginner && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          🟢 Beginner
                        </span>
                      )}
                      {isAthlete && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                          🔴 Athlete
                        </span>
                      )}
                      {!isBeginner && !isAthlete && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                          🟡 Intermediate
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{plan.durationMinutes} min</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-600 transition-colors">
                    {isHindi && plan.titleHi ? plan.titleHi : plan.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {isHindi && plan.descriptionHi ? plan.descriptionHi : plan.description}
                  </p>

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
                      <span>{plan.exercises.length} Exercises / Drills</span>
                      <button
                        onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        {isExpanded ? 'Hide List' : 'View Exercises'}
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-2 pt-1">
                        {plan.exercises.map((ex, idx) => {
                          const fullEx = exercises.find((e) => e.name.toLowerCase() === ex.name.toLowerCase()) || {
                            id: ex.id || `plan-ex-${idx}`,
                            name: ex.name,
                            category: 'Strength',
                            targetMuscle: ex.targetMuscle || 'Target Muscle',
                            equipment: 'Standard Equipment',
                            defaultSets: ex.sets.length,
                            defaultReps: '10-12',
                            defaultRestSeconds: 60,
                            instructions: ['Perform movement with strict biomechanical control and core stability.'],
                            formTips: ['Maintain joint alignment and rhythmic cadence.'],
                          };

                          return (
                            <div
                              key={ex.id || idx}
                              onClick={() => onSelectExerciseDetails(fullEx)}
                              className="text-xs flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/70 hover:border-emerald-300 cursor-pointer transition-all group gap-3"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-lg shrink-0 border border-slate-200 bg-emerald-50 flex items-center justify-center text-emerald-600">
                                  <Dumbbell className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-semibold text-slate-800 group-hover:text-emerald-700 block truncate transition-colors">{ex.name}</span>
                                  <div className="text-[10px] text-slate-500">{ex.targetMuscle} • Click for Form Guide</div>
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-emerald-600 font-bold shrink-0">
                                {ex.sets.length} sets
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 truncate">
                        {plan.exercises.map((e) => e.name).join(' • ')}
                      </div>
                    )}
                  </div>
                </div>

                {(plan.weeklySchedule || plan.monthlySchedule) && (
                  <button
                    type="button"
                    onClick={() => setScheduleModalPlan(plan)}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {plan.monthlySchedule
                        ? isHindi
                          ? '4-सप्ताह का रोडमैप देखें'
                          : 'View 4-Week Roadmap'
                        : isHindi
                        ? '7-दिन का शेड्यूल देखें'
                        : 'View 7-Day Schedule'}
                    </span>
                  </button>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleStartWorkout(plan)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('start_plan_now')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectWarmUpForPlan(plan)}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 hover:text-amber-950 font-bold text-xs border border-amber-300 transition-all cursor-pointer shrink-0"
                    title={isHindi ? `${plan.title} के लिए 5-मिनट वॉर्म-अप रूटीन बनाएं` : `Generate 5-min dynamic warm-up for ${plan.title}`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />
                    <span>{isHindi ? 'वॉर्म-अप (5m)' : 'Warm-up (5m)'}</span>
                  </button>

                  {plan.id.startsWith('custom-') && (
                    <button
                      onClick={() => deleteWorkoutPlan(plan.id)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200"
                      title={t('delete')}
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
            <h2 className="text-xl font-bold text-slate-900">
              {isHindi ? 'व्यायाम और एक्टिविटी डेटाबेस' : 'Exercise & Activity Database'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? 'सटीक तकनीक, लक्षित मांसपेशियां और निर्देश' : 'Step-by-step instructions, technique cues & target muscles'}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isHindi ? 'व्यायाम, मांसपेशी, उपकरण खोजें...' : 'Search by name, muscle, equipment...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Specific Muscle group filter pills */}
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

        {/* Exercises Grid with Clean Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => {
            const badge = getDisciplineBadge(ex.category);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={ex.id}
                onClick={() => onSelectExerciseDetails(ex)}
                className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/60 p-5 transition-all hover:shadow-md flex flex-col justify-between shadow-xs space-y-4"
              >
                <div className="space-y-3">
                    {/* Header: Discipline Badge & Equipment */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${badge.bg}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {ex.equipment}
                      </span>
                    </div>

                    {/* Exercise Title & Target Muscle */}
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {ex.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-500 font-medium">
                          Target: <strong className="text-slate-800 font-semibold">{ex.targetMuscle}</strong>
                        </span>
                        {ex.caloriesBurnedPerMin && (
                          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-0.5">
                            <Flame className="w-3 h-3" /> ~{ex.caloriesBurnedPerMin} cal/min
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Anatomical Form Cue */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3 text-emerald-600" /> {isHindi ? 'मुख्य तकनीक संकेत' : 'Key Form Cue'}
                      </div>
                      <p className="line-clamp-2 text-slate-600 leading-relaxed">
                        {ex.formTips[0] || ex.instructions[0]}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {ex.defaultSets} {t('sets')} × {ex.defaultReps}
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-transform">
                      {t('view_form_guide')} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Workout Logs */}
      {workoutLogs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Workout Logs</h2>
            <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {workoutLogs.length} logged sessions
            </span>
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

      {/* Program Schedule & Roadmap Modal */}
      <ProgramScheduleModal
        plan={scheduleModalPlan}
        onClose={() => setScheduleModalPlan(null)}
        onStartWorkout={handleStartWorkout}
      />
    </div>
  );
};

