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
  Crown,
  HelpCircle,
  SlidersHorizontal,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutCalendar } from './WorkoutCalendar';
import { ProgramScheduleModal } from './ProgramScheduleModal';
import { BodyweightChallenge } from './BodyweightChallenge';
import { WarmUpGenerator } from './WarmUpGenerator';
import { QuickWarmUpModal } from './QuickWarmUpModal';
import { WorkoutPlanPdfModal } from './WorkoutPlanPdfModal';
import { ReadinessRecoveryHub } from './ReadinessRecoveryHub';

interface TrainingViewProps {
  onOpenPlanCreator: () => void;
  onOpenAiGenerator: () => void;
  onSelectExerciseDetails: (exercise: Exercise) => void;
  onOpenActiveWorkout: () => void;
  onOpenHowToUse?: () => void;
}

const DISCIPLINE_TABS: { id: TrainingDiscipline; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'All', label: 'All Disciplines', icon: Activity },
  { id: 'Weight Loss & Fat Burn', label: 'Weight Loss & Fat Burn', icon: Flame },
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
  'Weight Loss & Fat Burn',
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
  onOpenHowToUse,
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
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showChallengeSection, setShowChallengeSection] = useState<boolean>(false);
  const [showWarmUpSection, setShowWarmUpSection] = useState<boolean>(false);
  const [showBeginnerBanner, setShowBeginnerBanner] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [warmUpSelectedPlanId, setWarmUpSelectedPlanId] = useState<string | null>(null);
  const [quickWarmUpModalOpen, setQuickWarmUpModalOpen] = useState<boolean>(false);
  const [quickWarmUpSelectedPlan, setQuickWarmUpSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [pdfExportModalOpen, setPdfExportModalOpen] = useState<boolean>(false);
  const [pdfExportPlan, setPdfExportPlan] = useState<WorkoutPlan | null>(null);

  const activeFilterCount =
    (selectedProgramType !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedLevel !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedProgramType('all');
    setSelectedGender('all');
    setSelectedLevel('all');
  };

  const handleOpenPdfExport = (plan?: WorkoutPlan | null) => {
    const targetPlan = plan || plans[0] || null;
    if (!targetPlan) return;
    setPdfExportPlan(targetPlan);
    setPdfExportModalOpen(true);
  };

  const handleOpenQuickWarmUp = (plan?: WorkoutPlan | null) => {
    const targetPlan = plan || plans[0] || null;
    setQuickWarmUpSelectedPlan(targetPlan);
    setQuickWarmUpModalOpen(true);
  };

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
    if (selectedDiscipline === 'Weight Loss & Fat Burn') {
      return (
        plan.splitType.includes('Weight Loss') ||
        plan.splitType.includes('Fat Burn') ||
        plan.tags.some((t) => {
          const lower = t.toLowerCase();
          return lower.includes('weight loss') || lower.includes('fat burn') || lower.includes('fat loss') || lower.includes('belly fat') || lower.includes('shred') || lower.includes('calorie');
        }) ||
        plan.title.toLowerCase().includes('weight loss') ||
        plan.title.toLowerCase().includes('fat') ||
        plan.title.toLowerCase().includes('shred')
      );
    }
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
      if (selectedDiscipline === 'Weight Loss & Fat Burn') {
        matchesDiscipline =
          ex.category === 'Weight Loss & Fat Burn' ||
          ex.discipline === 'Weight Loss & Fat Burn' ||
          (ex.caloriesBurnedPerMin && ex.caloriesBurnedPerMin >= 11) ||
          ex.targetMuscle.toLowerCase().includes('fat') ||
          ex.targetMuscle.toLowerCase().includes('calorie') ||
          ex.category === 'Cardio & HIIT' ||
          ex.category === 'Cardio';
      } else if (selectedDiscipline === 'Weights & Strength') {
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
    if (category.includes('Weight Loss') || category.includes('Fat Burn')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Flame, label: isHindi ? 'वेट लॉस व फैट बर्न' : 'Weight Loss & Fat Burn' };
    }
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
    <div className="space-y-6 pb-12">
      {/* Sleek, Clean Training Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isHindi ? 'वर्कआउट रूटीन और गाइड्स' : 'Workouts & Training'}
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {filteredPlans.length} {isHindi ? 'प्लान' : 'plans'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isHindi
              ? 'आज का वर्कआउट 1-क्लिक में शुरू करें या नीचे अपनी पसंद का प्लान चुनें'
              : 'Start today\'s session in 1 tap or explore routines below'}
          </p>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenPlanCreator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-white/[0.08] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('create_custom_plan')}</span>
          </button>

          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-white/[0.08] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isHindi ? 'AI प्लान' : 'AI Plan'}</span>
          </button>

          <button
            onClick={() => handleOpenPdfExport(plans[0] || null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-white/[0.08] transition-colors cursor-pointer"
            title={isHindi ? 'वर्कआउट रूटीन को PDF में एक्सपोर्ट करें' : 'Export current workout routine as a formatted PDF'}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isHindi ? 'PDF' : 'PDF'}</span>
          </button>

          <button
            onClick={() => setShowCalendar((prev) => !prev)}
            className={`p-2 rounded-xl transition-colors cursor-pointer text-xs ${
              showCalendar
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
            }`}
            title={isHindi ? 'वर्कआउट कैलेंडर' : 'Workout Calendar'}
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Workout Hero Focus (Clear, Unmissable, 1-Click to Train) */}
      {!activeWorkout && plans.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-5 sm:p-6 border border-emerald-500/30 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  {isHindi ? 'आज का सेशन' : "Today's Workout"}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {plans[0].durationMinutes} min • {plans[0].exercises.length} {isHindi ? 'एक्सरसाइज' : 'exercises'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {plans[0].title}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-1 max-w-lg">
                {plans[0].description}
              </p>
            </div>

            <button
              onClick={() => handleStartWorkout(plans[0])}
              className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isHindi ? 'वर्कआउट शुरू करें' : 'Start Workout'}</span>
            </button>
          </div>
        </div>
      )}

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

      {/* Daily Athlete Readiness & Muscle Recovery Radar (Whoop / Apple Benchmark) */}
      <ReadinessRecoveryHub
        onStartRecommendedWorkout={() => plans.length > 0 && handleStartWorkout(plans[0])}
      />

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
              onOpenQuickWarmUp={handleOpenQuickWarmUp}
              onClose={() => setShowWarmUpSection(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discipline Category Switcher Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isHindi ? 'कैटेगरी चुनें' : 'Category'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
            {filteredPlans.length} {isHindi ? 'प्लान' : 'plans'}
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400 dark:text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.id === 'Weight Loss & Fat Burn' && isHindi ? 'वेट लॉस व फैट बर्न' : tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Workout Plans & Splits */}
      <section className="space-y-4">
        {/* Dedicated Yoga & Stretching Focus Filter */}
        {selectedDiscipline === 'Yoga & Mobility' && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-purple-500/10 dark:bg-purple-950/30 rounded-2xl border border-purple-500/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mr-1 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-purple-500" /> Focus:
            </span>
            <button
              onClick={() => setYogaSubFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                yogaSubFilter === 'all'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              🧘 {isHindi ? 'सभी योग' : 'All (Yoga & Stretches)'}
            </button>
            <button
              onClick={() => setYogaSubFilter('yoga')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                yogaSubFilter === 'yoga'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              🕉️ {isHindi ? 'योग फ्लोज़' : 'Yoga Flows'}
            </button>
            <button
              onClick={() => setYogaSubFilter('stretching')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                yogaSubFilter === 'stretching'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              🤸 {isHindi ? 'स्ट्रेचिंग' : 'Stretching'}
            </button>
            <button
              onClick={() => setYogaSubFilter('posture')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                yogaSubFilter === 'posture'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}
            >
              🪑 {isHindi ? 'पोस्चर रीसेट' : 'Posture Reset'}
            </button>
          </div>
        )}

        {/* Clean Filter Header & Expandable Settings */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isHindi ? 'वर्कआउट प्लान्स' : 'Workout Plans'}
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              {filteredPlans.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                title={isHindi ? 'सभी फिल्टर हटाएं' : 'Reset all filters'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isHindi ? 'रीसेट' : 'Reset'}</span>
              </button>
            )}

            <button
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                showAdvancedFilters || activeFilterCount > 0
                  ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 border-slate-900 dark:border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isHindi ? 'फ़िल्टर' : 'Filter Plans'}</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 dark:bg-slate-950 text-slate-950 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel (Neat, clean, and tucks away clutter) */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/[0.08] space-y-3 shadow-xs">
                {/* Duration */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-24 shrink-0">
                    {isHindi ? 'शेड्यूल:' : 'Duration:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: isHindi ? 'सभी' : 'All' },
                      { id: 'normal', label: isHindi ? 'सामान्य वर्कआउट' : 'Normal Splits' },
                      { id: '1-week', label: isHindi ? '1-सप्ताह (7-Day)' : '1-Week Split' },
                      { id: '1-month', label: isHindi ? '1-महीना (4-Week)' : '1-Month Program' },
                      { id: 'daily', label: isHindi ? 'दैनिक 30-मिनट' : 'Daily 30-Min' },
                    ].map((dur) => (
                      <button
                        key={dur.id}
                        onClick={() => setSelectedProgramType(dur.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedProgramType === dur.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Focus */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-24 shrink-0">
                    {isHindi ? 'जेंडर फोकस:' : 'Gender:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: isHindi ? 'सभी' : 'All' },
                      { id: 'female', label: isHindi ? 'महिला फोकस (ग्लो & टोनिंग)' : 'Female Focus' },
                      { id: 'male', label: isHindi ? 'पुरुष / सामान्य' : 'Male / General' },
                    ].map((gen) => (
                      <button
                        key={gen.id}
                        onClick={() => setSelectedGender(gen.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedGender === gen.id
                            ? 'bg-pink-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {gen.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-24 shrink-0">
                    {isHindi ? 'लेवल:' : 'Level:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: isHindi ? 'सभी' : 'All' },
                      { id: 'beginner', label: isHindi ? '🟢 शुरुआती (Beginner)' : '🟢 Beginner' },
                      { id: 'intermediate', label: isHindi ? '🟡 मध्यम (Intermediate)' : '🟡 Intermediate' },
                      { id: 'athlete', label: isHindi ? '🔴 प्रो (Athlete)' : '🔴 Athlete' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedLevel(lvl.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedLevel === lvl.id
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                className="group relative rounded-3xl bg-white dark:bg-[#070C1A] border border-slate-200/90 dark:border-white/[0.08] hover:border-emerald-500/50 dark:hover:border-emerald-400/50 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Micro specular highlight on card hover */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/0 group-hover:via-emerald-400/70 to-transparent transition-all duration-500" />
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

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2">
                  <button
                    onClick={() => handleStartWorkout(plan)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm hover:shadow cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('start_plan_now')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPdfExport(plan)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer border border-slate-200/80 dark:border-white/10"
                    title={isHindi ? `${plan.title} को PDF में एक्सपोर्ट करें` : `Export ${plan.title} as PDF`}
                  >
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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

      {/* AI Coach 5-Minute Quick Warm-Up Modal */}
      <QuickWarmUpModal
        isOpen={quickWarmUpModalOpen}
        onClose={() => setQuickWarmUpModalOpen(false)}
        workout={quickWarmUpSelectedPlan}
        availablePlans={plans}
        onStartWorkout={handleStartWorkout}
        isHindi={isHindi}
      />

      {/* Formatted Printable PDF Summary & Share Modal */}
      {pdfExportModalOpen && pdfExportPlan && (
        <WorkoutPlanPdfModal
          plan={pdfExportPlan}
          onClose={() => {
            setPdfExportModalOpen(false);
            setPdfExportPlan(null);
          }}
          onStartWorkout={handleStartWorkout}
        />
      )}
    </div>
  );
};

