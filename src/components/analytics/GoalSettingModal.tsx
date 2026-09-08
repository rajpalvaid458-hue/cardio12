import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserGoalSettings, WeightGoalType, MuscleGroup } from '../../types';
import { playVictoryFanfare, playClickFeedback } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Target,
  Scale,
  Dumbbell,
  Calendar,
  Check,
  Sparkles,
  Flame,
  ArrowRight,
  Sliders,
  TrendingUp,
  Award,
  Clock,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MUSCLE_OPTIONS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Core & Abs',
  'Full Body',
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const GoalSettingModal: React.FC<GoalSettingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateGoals } = useFitness();
  const { isHindi } = useLanguage();

  const currentGoals = userProfile.goals || {
    startingWeightKg: userProfile.weightKg - 3,
    targetWeightKg: userProfile.targetWeightKg || userProfile.weightKg,
    weightGoalType: 'gain' as WeightGoalType,
    targetWeightDate: new Date(Date.now() + 75 * 86400000).toISOString().split('T')[0],
    weeklyRateKg: 0.35,
    targetMuscleGainKg: 3.5,
    startingMuscleMassKg: 33.5,
    targetMuscleGroups: ['Chest', 'Back', 'Quadriceps', 'Biceps'] as MuscleGroup[],
    targetMonthlyVolumeKg: 45000,
    targetChestCm: 105,
    targetArmsCm: 39.5,
    targetThighsCm: 61,
    targetWorkoutsPerWeek: 4,
    targetActiveMinutesPerWeek: 200,
    preferredDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    targetMonthlyWorkouts: 16,
    motivationNotes: 'Focus on progressive overload and high protein intake.',
  };

  const [activeSection, setActiveSection] = useState<'weight' | 'muscle' | 'frequency'>('weight');

  // 1. Target Weight State
  const [startingWeight, setStartingWeight] = useState(currentGoals.startingWeightKg.toString());
  const [targetWeight, setTargetWeight] = useState(currentGoals.targetWeightKg.toString());
  const [weightGoalType, setWeightGoalType] = useState<WeightGoalType>(currentGoals.weightGoalType);
  const [targetDate, setTargetDate] = useState(
    currentGoals.targetWeightDate || new Date(Date.now() + 75 * 86400000).toISOString().split('T')[0]
  );
  const [weeklyRate, setWeeklyRate] = useState((currentGoals.weeklyRateKg || 0.35).toString());

  // 2. Muscle Gain State
  const [targetMuscleGainKg, setTargetMuscleGainKg] = useState(currentGoals.targetMuscleGainKg.toString());
  const [targetMuscleGroups, setTargetMuscleGroups] = useState<MuscleGroup[]>(
    currentGoals.targetMuscleGroups || ['Chest', 'Back', 'Quadriceps']
  );
  const [targetMonthlyVolumeKg, setTargetMonthlyVolumeKg] = useState(
    (currentGoals.targetMonthlyVolumeKg || 45000).toString()
  );
  const [targetChestCm, setTargetChestCm] = useState((currentGoals.targetChestCm || 105).toString());
  const [targetArmsCm, setTargetArmsCm] = useState((currentGoals.targetArmsCm || 39.5).toString());
  const [targetThighsCm, setTargetThighsCm] = useState((currentGoals.targetThighsCm || 61).toString());

  // 3. Activity Frequency State
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(currentGoals.targetWorkoutsPerWeek || 4);
  const [activeMinutesPerWeek, setActiveMinutesPerWeek] = useState(
    (currentGoals.targetActiveMinutesPerWeek || 200).toString()
  );
  const [preferredDays, setPreferredDays] = useState<string[]>(
    currentGoals.preferredDays || ['Mon', 'Tue', 'Thu', 'Fri']
  );
  const [targetMonthlyWorkouts, setTargetMonthlyWorkouts] = useState(
    (currentGoals.targetMonthlyWorkouts || workoutsPerWeek * 4).toString()
  );
  const [motivationNotes, setMotivationNotes] = useState(currentGoals.motivationNotes || '');

  // Quick Archetype Presets
  const applyPreset = (preset: 'hypertrophy' | 'fat_loss' | 'strength' | 'athletic') => {
    playClickFeedback();
    const currentW = userProfile.weightKg;
    if (preset === 'hypertrophy') {
      setWeightGoalType('gain');
      setStartingWeight((currentW - 1).toFixed(1));
      setTargetWeight((currentW + 4).toFixed(1));
      setWeeklyRate('0.35');
      setTargetMuscleGainKg('3.5');
      setTargetMuscleGroups(['Chest', 'Back', 'Quadriceps', 'Biceps', 'Triceps']);
      setTargetMonthlyVolumeKg('50000');
      setWorkoutsPerWeek(5);
      setActiveMinutesPerWeek('240');
      setPreferredDays(['Mon', 'Tue', 'Wed', 'Fri', 'Sat']);
      setTargetMonthlyWorkouts('20');
      setMotivationNotes('Hypertrophy focus: High volume, strict form, surplus nutrition.');
    } else if (preset === 'fat_loss') {
      setWeightGoalType('lose');
      setStartingWeight((currentW + 1).toFixed(1));
      setTargetWeight((currentW - 5).toFixed(1));
      setWeeklyRate('0.5');
      setTargetMuscleGainKg('1.0');
      setTargetMuscleGroups(['Core & Abs', 'Full Body', 'Quadriceps', 'Back']);
      setTargetMonthlyVolumeKg('35000');
      setWorkoutsPerWeek(4);
      setActiveMinutesPerWeek('220');
      setPreferredDays(['Mon', 'Tue', 'Thu', 'Sat']);
      setTargetMonthlyWorkouts('16');
      setMotivationNotes('Fat shred: Keep protein high, progressive overload, calorie deficit.');
    } else if (preset === 'strength') {
      setWeightGoalType('maintain');
      setStartingWeight(currentW.toFixed(1));
      setTargetWeight(currentW.toFixed(1));
      setWeeklyRate('0.2');
      setTargetMuscleGainKg('2.5');
      setTargetMuscleGroups(['Chest', 'Back', 'Quadriceps', 'Hamstrings']);
      setTargetMonthlyVolumeKg('45000');
      setWorkoutsPerWeek(4);
      setActiveMinutesPerWeek('200');
      setPreferredDays(['Mon', 'Tue', 'Thu', 'Fri']);
      setTargetMonthlyWorkouts('16');
      setMotivationNotes('Pure strength: Heavy compounds, long rest periods, consistent PRs.');
    } else {
      // Athletic conditioning
      setWeightGoalType('maintain');
      setStartingWeight(currentW.toFixed(1));
      setTargetWeight(currentW.toFixed(1));
      setWeeklyRate('0.25');
      setTargetMuscleGainKg('2.0');
      setTargetMuscleGroups(['Full Body', 'Core & Abs', 'Quadriceps', 'Back']);
      setTargetMonthlyVolumeKg('38000');
      setWorkoutsPerWeek(4);
      setActiveMinutesPerWeek('180');
      setPreferredDays(['Mon', 'Wed', 'Fri', 'Sat']);
      setTargetMonthlyWorkouts('16');
      setMotivationNotes('Athletic performance: Mobility, functional endurance, and recovery.');
    }
  };

  const toggleMuscleGroup = (mg: MuscleGroup) => {
    playClickFeedback();
    setTargetMuscleGroups((prev) =>
      prev.includes(mg) ? prev.filter((m) => m !== mg) : [...prev, mg]
    );
  };

  const toggleDay = (day: string) => {
    playClickFeedback();
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedStartW = parseFloat(startingWeight) || userProfile.weightKg;
    const parsedTargetW = parseFloat(targetWeight) || userProfile.targetWeightKg;
    const parsedWeeklyRate = parseFloat(weeklyRate) || 0.35;
    const parsedMuscleGain = parseFloat(targetMuscleGainKg) || 3.0;
    const parsedVolume = parseInt(targetMonthlyVolumeKg, 10) || 45000;
    const parsedActiveMins = parseInt(activeMinutesPerWeek, 10) || 200;
    const parsedMonthlyWorkouts = parseInt(targetMonthlyWorkouts, 10) || workoutsPerWeek * 4;

    const newGoalSettings: Partial<UserGoalSettings> = {
      startingWeightKg: parsedStartW,
      targetWeightKg: parsedTargetW,
      weightGoalType,
      targetWeightDate: targetDate,
      weeklyRateKg: parsedWeeklyRate,

      targetMuscleGainKg: parsedMuscleGain,
      targetMuscleGroups: targetMuscleGroups.length > 0 ? targetMuscleGroups : ['Chest', 'Back'],
      targetMonthlyVolumeKg: parsedVolume,
      targetChestCm: parseFloat(targetChestCm) || undefined,
      targetArmsCm: parseFloat(targetArmsCm) || undefined,
      targetThighsCm: parseFloat(targetThighsCm) || undefined,

      targetWorkoutsPerWeek: workoutsPerWeek,
      targetActiveMinutesPerWeek: parsedActiveMins,
      preferredDays: preferredDays.length > 0 ? preferredDays : ['Mon', 'Wed', 'Fri'],
      targetMonthlyWorkouts: parsedMonthlyWorkouts,
      motivationNotes: motivationNotes.trim(),
    };

    updateGoals(newGoalSettings);
    playVictoryFanfare();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">
                  {isHindi ? 'फिटनेस लक्ष्य और मील के पत्थर' : 'Set Fitness Goals & Targets'}
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {isHindi ? 'सक्रिय' : 'Live'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi
                  ? 'लक्षित वजन, मांसपेशी लाभ और कसरत की आवृत्ति निर्धारित करें'
                  : 'Define your target weight, muscle hypertrophy focus, and activity frequency'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Archetype Presets Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isHindi ? 'त्वरित प्रीसेट:' : 'Quick Presets:'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('hypertrophy')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all whitespace-nowrap cursor-pointer"
            >
              💪 {isHindi ? 'मांसपेशी विकास (Hypertrophy)' : 'Muscle Hypertrophy'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('fat_loss')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all whitespace-nowrap cursor-pointer"
            >
              🔥 {isHindi ? 'वसा में कमी (Fat Shred)' : 'Fat Shred'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('strength')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all whitespace-nowrap cursor-pointer"
            >
              ⚡ {isHindi ? 'अधिकतम शक्ति (Strength)' : 'Peak Strength'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('athletic')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all whitespace-nowrap cursor-pointer"
            >
              🏃 {isHindi ? 'एथलेटिक कंडीशनिंग' : 'Athletic'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveSection('weight')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSection === 'weight'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className={`w-4 h-4 ${activeSection === 'weight' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isHindi ? '1. लक्षित वजन' : '1. Target Weight'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('muscle')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSection === 'muscle'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${activeSection === 'muscle' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{isHindi ? '2. मांसपेशी लाभ' : '2. Muscle Gain'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('frequency')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSection === 'frequency'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activeSection === 'frequency' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>{isHindi ? '3. कसरत आवृत्ति' : '3. Activity Frequency'}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6 max-h-[62vh] overflow-y-auto">
          {/* SECTION 1: TARGET WEIGHT GOAL */}
          {activeSection === 'weight' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isHindi ? 'वजन रणनीति का प्रकार' : 'Weight Goal Strategy'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'lose', label: isHindi ? 'वसा घटाना (Cut)' : 'Fat Loss / Cut', icon: '📉', color: 'border-rose-300 hover:border-rose-400' },
                    { id: 'maintain', label: isHindi ? 'पुनर्गठन (Maintain)' : 'Recomp / Maintain', icon: '⚖️', color: 'border-blue-300 hover:border-blue-400' },
                    { id: 'gain', label: isHindi ? 'मांसपेशी निर्माण (Bulk)' : 'Lean Mass / Bulk', icon: '📈', color: 'border-emerald-300 hover:border-emerald-400' },
                  ].map((strat) => (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => setWeightGoalType(strat.id as WeightGoalType)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        weightGoalType === strat.id
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                          : `border-slate-200 bg-white text-slate-700 font-medium ${strat.color}`
                      }`}
                    >
                      <div className="text-xl mb-1">{strat.icon}</div>
                      <div className="text-xs">{strat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {isHindi ? 'प्रारंभिक वजन (Starting Weight)' : 'Starting Weight'} ({userProfile.weightUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={startingWeight}
                    onChange={(e) => setStartingWeight(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="75.0"
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {isHindi ? 'वर्तमान वजन:' : 'Current scale weight:'} {userProfile.weightKg} {userProfile.weightUnit}
                  </span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    {isHindi ? 'लक्षित वजन (Target Goal)' : 'Target Weight Goal'} ({userProfile.weightUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="82.0"
                    required
                  />
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                    {isHindi ? 'लक्षित अंतर:' : 'Delta to reach:'}{' '}
                    {Math.abs(parseFloat(targetWeight || '0') - userProfile.weightKg).toFixed(1)}{' '}
                    {userProfile.weightUnit} {parseFloat(targetWeight || '0') > userProfile.weightKg ? 'gain' : 'loss'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {isHindi ? 'लक्षित तिथि (Target Completion Date)' : 'Target Completion Date'}
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {isHindi ? 'साप्ताहिक दर (Weekly Rate)' : 'Weekly Rate Target'} ({userProfile.weightUnit}/week)
                  </label>
                  <select
                    value={weeklyRate}
                    onChange={(e) => setWeeklyRate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="0.25">0.25 {userProfile.weightUnit}/wk ({isHindi ? 'स्थिर और धीमा' : 'Slow & Steady'})</option>
                    <option value="0.35">0.35 {userProfile.weightUnit}/wk ({isHindi ? 'इष्टतम हाइपरट्रॉफी' : 'Optimal Hypertrophy'})</option>
                    <option value="0.5">0.50 {userProfile.weightUnit}/wk ({isHindi ? 'मानक फिटनेस' : 'Standard Rate'})</option>
                    <option value="0.75">0.75 {userProfile.weightUnit}/wk ({isHindi ? 'आक्रामक दर' : 'Aggressive Pace'})</option>
                  </select>
                </div>
              </div>

              {/* Weight Strategy Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 mb-0.5">
                    {isHindi ? 'स्मार्ट प्रोग्रेशन गणना' : 'Smart Progression Plan'}
                  </div>
                  <p>
                    {isHindi
                      ? `शुरुआती वजन ${startingWeight} ${userProfile.weightUnit} से लक्ष्य ${targetWeight} ${userProfile.weightUnit} तक पहुंचने के लिए लगभग ${weeklyRate} ${userProfile.weightUnit} प्रति सप्ताह की गति आदर्श है।`
                      : `Moving from ${startingWeight} ${userProfile.weightUnit} to ${targetWeight} ${userProfile.weightUnit} at ${weeklyRate} ${userProfile.weightUnit}/week keeps lean tissue protected.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MUSCLE GAIN GOAL */}
          {activeSection === 'muscle' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    {isHindi ? 'लक्षित लीन मांसपेशी लाभ' : 'Target Lean Muscle Gain'} ({userProfile.weightUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetMuscleGainKg}
                    onChange={(e) => setTargetMuscleGainKg(e.target.value)}
                    className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    placeholder="3.5"
                    required
                  />
                  <span className="text-[11px] text-blue-700 mt-1 block">
                    {isHindi ? 'अपेक्षित शुद्ध पेशी वृद्धि' : 'Target hypertrophic lean mass accrual'}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'मासिक प्रशिक्षण वॉल्यूम लक्ष्य' : 'Monthly Volume / Tonnage Goal'} (kg)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={targetMonthlyVolumeKg}
                    onChange={(e) => setTargetMonthlyVolumeKg(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                    placeholder="45000"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {isHindi ? 'माह भर में कुल उठाया गया वजन' : 'Cumulative monthly tonnage to stimulate growth'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isHindi ? 'प्राथमिक मांसपेशी समूह (Focus Muscle Groups)' : 'Priority Muscle Groups'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLE_OPTIONS.map((mg) => {
                    const isSelected = targetMuscleGroups.includes(mg);
                    return (
                      <button
                        key={mg}
                        type="button"
                        onClick={() => toggleMuscleGroup(mg)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{mg}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block">
                  {isHindi
                    ? 'एनालिटिक्स में इन मांसपेशी समूहों के सेट्स की विशेष निगरानी की जाएगी।'
                    : 'Direct weekly sets for selected muscles will be prioritized in hypertrophy tracking.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isHindi ? 'शरीर की परिधि माप लक्ष्य' : 'Circumference Measurement Targets'} (cm)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      {isHindi ? 'छाती (Chest)' : 'Chest'}
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      value={targetChestCm}
                      onChange={(e) => setTargetChestCm(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                      placeholder="105"
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      {isHindi ? 'भुजाएं (Arms)' : 'Arms'}
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      value={targetArmsCm}
                      onChange={(e) => setTargetArmsCm(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                      placeholder="39.5"
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      {isHindi ? 'जांघें (Thighs)' : 'Thighs'}
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      value={targetThighsCm}
                      onChange={(e) => setTargetThighsCm(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                      placeholder="61.0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ACTIVITY FREQUENCY GOAL */}
          {activeSection === 'frequency' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isHindi ? 'साप्ताहिक कसरत आवृत्ति' : 'Workouts Per Week Goal'}
                  </label>
                  <span className="text-sm font-black text-amber-600 font-mono">
                    {workoutsPerWeek} {isHindi ? 'दिन / सप्ताह' : 'days / week'}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        playClickFeedback();
                        setWorkoutsPerWeek(num);
                        setTargetMonthlyWorkouts((num * 4).toString());
                      }}
                      className={`py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                        workoutsPerWeek === num
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {num}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isHindi ? 'पसंदीदा प्रशिक्षण दिन' : 'Preferred Training Days'}
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = preferredDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'साप्ताहिक सक्रिय प्रशिक्षण समय' : 'Active Training Time'} (minutes/week)
                  </label>
                  <input
                    type="number"
                    step="15"
                    value={activeMinutesPerWeek}
                    onChange={(e) => setActiveMinutesPerWeek(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    placeholder="200"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ~{(parseInt(activeMinutesPerWeek || '0', 10) / workoutsPerWeek).toFixed(0)} mins / session
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'मासिक पूर्ण सत्र लक्ष्य' : 'Monthly Completed Sessions Target'}
                  </label>
                  <input
                    type="number"
                    value={targetMonthlyWorkouts}
                    onChange={(e) => setTargetMonthlyWorkouts(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    placeholder="16"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {isHindi ? 'मासिक निरंतरता' : 'Monthly consistency benchmark'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'व्यक्तिगत प्रेरणा नोट या मंत्र' : 'Personal Motivation Mantra'}
                </label>
                <input
                  type="text"
                  value={motivationNotes}
                  onChange={(e) => setMotivationNotes(e.target.value)}
                  placeholder={isHindi ? 'उदा: निरंतरता और प्रगतिशील अधिभार ही सफलता है' : 'e.g., Consistency beats intensity. Trust the progression.'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>

            <div className="flex items-center gap-2">
              {activeSection !== 'frequency' ? (
                <button
                  type="button"
                  onClick={() => {
                    playClickFeedback();
                    if (activeSection === 'weight') setActiveSection('muscle');
                    else if (activeSection === 'muscle') setActiveSection('frequency');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{isHindi ? 'अगला' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isHindi ? 'लक्ष्य सहेजें' : 'Save Goals & Targets'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
