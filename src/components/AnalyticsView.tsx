import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BarChart3,
  TrendingUp,
  Dumbbell,
  Flame,
  Award,
  Calendar,
  Zap,
  Plus,
  Trash2,
  Heart,
  Camera,
  Layers,
  Sparkles,
  Scale,
  Activity,
  Target,
} from 'lucide-react';
import { FlexibilityTracker } from './FlexibilityTracker';
import { BodyProgressTracker } from './BodyProgressTracker';
import { WorkoutVolumeIntensityChart } from './WorkoutVolumeIntensityChart';
import { WeeklyConsistencyTrendsChart } from './WeeklyConsistencyTrendsChart';
import { BmiCalculatorTool } from './BmiCalculatorTool';

export const AnalyticsView: React.FC = () => {
  const { workoutLogs, userProfile, updateUserProfile } = useFitness();
  const { t, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trends' | 'body_progress' | 'metrics' | 'bmi' | 'flexibility'>('trends');

  const [prExercise, setPrExercise] = useState('Bench Press');
  const [prWeight, setPrWeight] = useState('');
  const [prReps, setPrReps] = useState('1');

  const [newBodyWeight, setNewBodyWeight] = useState('');

  // Calculate Aggregates
  const totalWorkouts = workoutLogs.length;
  const totalVolumeKg = workoutLogs.reduce((acc, l) => acc + l.totalVolumeKg, 0);
  const totalWorkoutMinutes = workoutLogs.reduce((acc, l) => acc + Math.round(l.durationSeconds / 60), 0);
  const totalCaloriesBurned = workoutLogs.reduce((acc, l) => acc + l.caloriesBurned, 0);

  const handleAddWeightLog = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBodyWeight);
    if (!val) return;

    updateUserProfile({
      weightKg: val,
    });
    setNewBodyWeight('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Analytics Main Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>{isHindi ? 'साप्ताहिक निरंतरता' : 'Weekly Consistency'}</span>
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {isHindi ? 'रुझान' : 'Trends'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('body_progress')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'body_progress'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>{isHindi ? 'शरीर की प्रगति' : 'Body Progress'}</span>
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {isHindi ? 'तस्वीरें' : 'Photos'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <span>{isHindi ? 'प्रदर्शन और रिकॉर्ड्स' : 'Performance & PRs'}</span>
        </button>

        <button
          onClick={() => setActiveTab('bmi')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bmi'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>{isHindi ? 'बीएमआई' : 'BMI Calc'}</span>
        </button>

        <button
          onClick={() => setActiveTab('flexibility')}
          className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'flexibility'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>{isHindi ? 'लचीलापन' : 'Flexibility'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: WEEKLY WORKOUT CONSISTENCY & PROGRESS TRENDS (RECHARTS ANIMATED)   */}
      {/* ========================================================================= */}
      {activeTab === 'trends' && (
        <WeeklyConsistencyTrendsChart
          workoutLogs={workoutLogs}
          weeklyTargetSessions={4}
          weightUnit={userProfile.weightUnit}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: BODY PROGRESS & CAMERA COMPARISON */}
      {/* ========================================================================= */}
      {activeTab === 'body_progress' && <BodyProgressTracker />}

      {/* ========================================================================= */}
      {/* TAB 2: PERFORMANCE & PRS */}
      {/* ========================================================================= */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          {/* Top Banner */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <BarChart3 className="w-3.5 h-3.5" /> {isHindi ? 'प्रदर्शन और विश्लेषण' : 'Performance & Analytics'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isHindi ? 'प्रगति और प्रदर्शन मेट्रिक्स' : 'Progress & Performance Metrics'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
                  {isHindi 
                    ? 'प्रोग्रेसिव ओवरलोड, कुल वजन की मात्रा, व्यक्तिगत रिकॉर्ड और शरीर की संरचना देखें।' 
                    : 'Visualize your progressive overload, total tonnage volume, personal records, and body composition.'}
                </p>
              </div>
            </div>

            {/* Aggregate Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-emerald-600" /> {isHindi ? 'कुल वर्कआउट पूर्ण' : 'Workouts Completed'}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">{totalWorkouts}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{isHindi ? 'सभी लॉग सत्र' : 'All-time logged sessions'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> {isHindi ? 'कुल उठाया वजन' : 'Tonnage Lifted'}
                </div>
                <div className="text-2xl font-black text-blue-600 font-mono mt-1">
                  {totalVolumeKg > 1000 ? `${(totalVolumeKg / 1000).toFixed(1)}t` : `${totalVolumeKg}kg`}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{isHindi ? 'संचयी वॉल्यूम' : 'Cumulative volume'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" /> {isHindi ? 'प्रशिक्षण समय' : 'Training Time'}
                </div>
                <div className="text-2xl font-black text-amber-600 font-mono mt-1">
                  {totalWorkoutMinutes > 60
                    ? `${Math.floor(totalWorkoutMinutes / 60)}h ${totalWorkoutMinutes % 60}m`
                    : `${totalWorkoutMinutes}m`}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{isHindi ? 'कुल कसरत अवधि' : 'Total gym duration'}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-600" /> {isHindi ? 'जलाई गई ऊर्जा' : 'Energy Burned'}
                </div>
                <div className="text-2xl font-black text-rose-600 font-mono mt-1">
                  {totalCaloriesBurned.toLocaleString()} kcal
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{isHindi ? 'अनुमानित कैलोरी खर्च' : 'Estimated workout expenditure'}</div>
              </div>
            </div>
          </div>

          {/* Weekly Consistency & Progress Trends Visualization (Recharts) */}
          <WeeklyConsistencyTrendsChart
            workoutLogs={workoutLogs}
            weeklyTargetSessions={4}
            weightUnit={userProfile.weightUnit}
          />

          {/* Workout Volume and Intensity Over Time (Recharts Line Chart) */}
          <WorkoutVolumeIntensityChart
            workoutLogs={workoutLogs}
            weightUnit={userProfile.weightUnit}
          />

          {/* BMI Calculator Tool directly inside Performance & Metrics */}
          <BmiCalculatorTool />

          {/* Personal Records (PRs) Hall of Fame */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" /> Personal Records (PRs)
                </h2>
                <p className="text-xs text-slate-500">Track your peak strength across key compound lifts</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { lift: 'Barbell Bench Press', weight: 100, reps: 5, unit: 'kg', icon: '🏋️‍♂️' },
                { lift: 'Barbell Back Squat', weight: 140, reps: 3, unit: 'kg', icon: '🦵' },
                { lift: 'Conventional Deadlift', weight: 180, reps: 2, unit: 'kg', icon: '⚡' },
                { lift: 'Overhead Military Press', weight: 65, reps: 5, unit: 'kg', icon: '🛡️' },
              ].map((pr, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{pr.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Record
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{pr.lift}</div>
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-2xl font-black text-slate-900">{pr.weight}</span>
                    <span className="text-xs text-slate-500">{pr.unit} × {pr.reps} reps</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bodyweight & Goal Alignment */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Bodyweight & Goal Alignment</h2>
                <p className="text-xs text-slate-500">Current weight vs target goal</p>
              </div>

              <form onSubmit={handleAddWeightLog} className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder={`Update weight (${userProfile.weightUnit})`}
                  value={newBodyWeight}
                  onChange={(e) => setNewBodyWeight(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono w-44 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Update
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Current Weight</div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                  {userProfile.weightKg} {userProfile.weightUnit}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Target Weight Goal</div>
                <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
                  {userProfile.targetWeightKg} {userProfile.weightUnit}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Primary Focus</div>
                <div className="text-sm font-bold text-slate-900 capitalize mt-1">
                  {userProfile.goal.replace('_', ' ')}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEDICATED BMI & HEALTH CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'bmi' && (
        <div className="space-y-6">
          <BmiCalculatorTool />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FLEXIBILITY & MOBILITY ASSESSMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'flexibility' && <FlexibilityTracker />}
    </div>
  );
};

