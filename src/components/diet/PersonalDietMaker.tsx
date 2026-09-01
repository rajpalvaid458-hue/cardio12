import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { PersonalDietPlan, MealType } from '../../types';
import { PRESET_DIET_PLANS } from '../../data/fitnessPresets';
import {
  Sparkles,
  ChefHat,
  Flame,
  Zap,
  Apple,
  Droplets,
  Check,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Info,
  ChevronRight,
  Filter,
  Bookmark,
  Share2,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PersonalDietMaker: React.FC = () => {
  const {
    savedDietPlans,
    activeDietPlan,
    setActiveDietPlan,
    savePersonalDietPlan,
    deletePersonalDietPlan,
    applyDietPlanToDailyLog,
    userProfile,
  } = useFitness();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PersonalDietPlan | null>(
    activeDietPlan || savedDietPlans[0] || PRESET_DIET_PLANS[0]
  );
  const [showAiModal, setShowAiModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dietGenderFilter, setDietGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [dietLevelFilter, setDietLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'athlete'>('all');

  // AI Generator Form States
  const [goal, setGoal] = useState('Muscle Building & Lean Mass');
  const [cuisinePreference, setCuisinePreference] = useState('Indian & International Fusion');
  const [dietType, setDietType] = useState('High Protein (Desi + Clean International)');
  const [aiTargetGender, setAiTargetGender] = useState<'all' | 'female' | 'male'>('all');
  const [aiTargetLevel, setAiTargetLevel] = useState<'beginner' | 'intermediate' | 'athlete'>('intermediate');
  const [targetCalories, setTargetCalories] = useState(
    userProfile.dailyCalorieTarget ? userProfile.dailyCalorieTarget.toString() : '2400'
  );
  const [mealsPerDay, setMealsPerDay] = useState(4);
  const [allergiesOrDislikes, setAllergiesOrDislikes] = useState('');
  const [currentWeight, setCurrentWeight] = useState(userProfile.weightKg.toString());
  const [targetWeight, setTargetWeight] = useState(
    (userProfile.weightKg + (userProfile.fitnessGoal === 'gain_muscle' ? 4 : -4)).toString()
  );

  const filteredDietPlans = savedDietPlans.filter((p) => {
    if (dietGenderFilter === 'female') {
      if (p.targetGender && p.targetGender !== 'female' && p.targetGender !== 'all') return false;
      const isFemale = p.targetGender === 'female' || p.title.toLowerCase().includes('women') || p.title.toLowerCase().includes('female') || p.tagline.toLowerCase().includes('hormone');
      if (!isFemale && p.targetGender !== 'all') return false;
    } else if (dietGenderFilter === 'male') {
      if (p.targetGender === 'female') return false;
    }

    if (dietLevelFilter !== 'all') {
      if (dietLevelFilter === 'beginner' && p.targetLevel && p.targetLevel !== 'beginner') return false;
      if (dietLevelFilter === 'athlete' && p.targetLevel && p.targetLevel !== 'athlete' && p.targetLevel !== 'advanced') return false;
    }

    return true;
  });

  const handleGenerateAiDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/ai/personal-diet-maker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          cuisinePreference,
          dietType,
          targetGender: aiTargetGender,
          targetLevel: aiTargetLevel,
          targetCalories: parseInt(targetCalories, 10) || 2400,
          weightKg: parseFloat(currentWeight) || 75,
          targetWeightKg: parseFloat(targetWeight) || 80,
          activityLevel: userProfile.activityLevel || 'Active',
          allergiesOrDislikes: allergiesOrDislikes.trim() || 'None',
          mealsPerDay,
        }),
      });

      const data = await res.json();
      if (data.success && data.dietPlan) {
        savePersonalDietPlan(data.dietPlan);
        setSelectedPlan(data.dietPlan);
        setShowAiModal(false);
      } else {
        setErrorMessage(data.error || 'Failed to generate diet plan. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating diet plan:', err);
      setErrorMessage('Network error while generating diet plan. Please verify connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPlan = (plan: PersonalDietPlan) => {
    applyDietPlanToDailyLog(plan);
    setActiveDietPlan(plan);
  };

  const getMealTypeEmoji = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🥗';
      case 'dinner':
        return '🥩';
      case 'pre_workout':
        return '⚡';
      case 'post_workout':
        return '🥤';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 md:p-8 border border-emerald-900/40 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ChefHat className="w-3.5 h-3.5" /> AI Personal Diet Maker • Indian & International
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Smart Nutrition Engine</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Scientifically calibrated diets featuring authentic high-protein Desi Indian dishes (Paneer, Sattu, Soya, Dals, Chicken Tikka) and gold-standard International athlete meals (Whey, Oats, Quinoa, Salmon, Greek Yogurt).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Create AI Custom Diet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Selector Carousel / Badges */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Diet Protocols</span>
            <p className="text-[11px] text-slate-400">Tailored for Women, Beginners, Intermediates, and Pro Athletes</p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs self-start sm:self-auto">
            {filteredDietPlans.length} of {savedDietPlans.length} plans
          </span>
        </div>

        {/* Filters for Diets */}
        <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          {/* Gender */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">Gender:</span>
            <button
              type="button"
              onClick={() => setDietGenderFilter('all')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                dietGenderFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              🌟 All
            </button>
            <button
              type="button"
              onClick={() => setDietGenderFilter('female')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                dietGenderFilter === 'female'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-pink-700 hover:bg-pink-50 border border-pink-200'
              }`}
            >
              👩 Female (महिला)
            </button>
            <button
              type="button"
              onClick={() => setDietGenderFilter('male')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                dietGenderFilter === 'male'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              👨 Male / General
            </button>
          </div>

          <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />

          {/* Level */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">Level:</span>
            <button
              type="button"
              onClick={() => setDietLevelFilter('all')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                dietLevelFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              ⚡ All
            </button>
            <button
              type="button"
              onClick={() => setDietLevelFilter('beginner')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                dietLevelFilter === 'beginner'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              🟢 Beginner
            </button>
            <button
              type="button"
              onClick={() => setDietLevelFilter('athlete')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                dietLevelFilter === 'athlete'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              🔴 Pro Athlete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDietPlans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isActive = activeDietPlan?.id === plan.id;
            const isFemale = plan.targetGender === 'female' || plan.title.toLowerCase().includes('women') || plan.title.toLowerCase().includes('female');
            const isAthlete = plan.targetLevel === 'athlete';

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`p-4 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-100/60">
                        {plan.cuisine}
                      </span>
                      {isFemale && (
                        <span className="text-[10px] font-bold text-pink-700 px-1.5 py-0.5 rounded-md bg-pink-100/80 border border-pink-200">
                          🌸 Female Focus
                        </span>
                      )}
                      {isAthlete && (
                        <span className="text-[10px] font-bold text-rose-700 px-1.5 py-0.5 rounded-md bg-rose-100/80 border border-rose-200">
                          🔴 Athlete
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-2">{plan.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{plan.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs font-mono">
                  <span className="font-bold text-slate-800">{plan.dailyCalories} kcal</span>
                  <span className="text-emerald-700 font-bold">{plan.macros.proteinGrams}g Protein</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Diet Plan Detailed Breakdown */}
      {selectedPlan && (
        <motion.div
          key={selectedPlan.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm"
        >
          {/* Plan Header & Quick Apply */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {selectedPlan.cuisine} Protocol
                </span>
                {selectedPlan.dietTypeLabel && (
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {selectedPlan.dietTypeLabel}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedPlan.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{selectedPlan.tagline}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApplyPlan(selectedPlan)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Apply to Today's Diet</span>
              </button>

              {savedDietPlans.length > 1 && !PRESET_DIET_PLANS.some((p) => p.id === selectedPlan.id) && (
                <button
                  onClick={() => deletePersonalDietPlan(selectedPlan.id)}
                  className="p-2.5 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                  title="Delete plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Macro Breakdown Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Calories</span>
              <span className="text-lg font-black text-amber-600 font-mono mt-0.5 block">
                {selectedPlan.dailyCalories} kcal
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Protein</span>
              <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">
                {selectedPlan.macros.proteinGrams}g
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Carbohydrates</span>
              <span className="text-lg font-black text-blue-600 font-mono mt-0.5 block">
                {selectedPlan.macros.carbsGrams}g
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Healthy Fats</span>
              <span className="text-lg font-black text-rose-600 font-mono mt-0.5 block">
                {selectedPlan.macros.fatsGrams}g
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Water Target</span>
              <span className="text-lg font-black text-cyan-600 font-mono mt-0.5 block">
                {selectedPlan.waterTargetMl ? `${(selectedPlan.waterTargetMl / 1000).toFixed(1)} L` : '3.5 L'}
              </span>
            </div>
          </div>

          {/* Key Benefits & Supplements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedPlan.keyBenefits && selectedPlan.keyBenefits.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Plan Highlights & Strategy
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedPlan.keyBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPlan.recommendedSupplements && selectedPlan.recommendedSupplements.length > 0 && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Recommended Supplement Timing
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlan.recommendedSupplements.map((supp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-white border border-purple-200 text-purple-900 text-xs font-medium"
                    >
                      {supp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Meals Schedule Breakdown */}
          <div className="space-y-4 pt-2">
            <h4 className="text-base font-bold text-slate-900">Scheduled Meal Plan</h4>

            <div className="space-y-4">
              {selectedPlan.meals.map((meal, mIdx) => {
                const mealCals = meal.items.reduce((acc, it) => acc + it.calories, 0);
                const mealProtein = Number(meal.items.reduce((acc, it) => acc + it.proteinGrams, 0).toFixed(1));

                return (
                  <div
                    key={mIdx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{getMealTypeEmoji(meal.mealType)}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-900 text-sm">{meal.title}</h5>
                            {meal.suggestedTime && (
                              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" /> {meal.suggestedTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        {mealCals} kcal • {mealProtein}g Protein
                      </span>
                    </div>

                    {/* Food items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {meal.items.map((food, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                              {food.name}
                              {food.hindiName && (
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-normal">
                                  {food.hindiName}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {food.servingSize} • P: {food.proteinGrams}g | C: {food.carbsGrams}g | F: {food.fatsGrams}g
                            </div>
                          </div>

                          <span className="font-mono font-bold text-slate-800 text-xs">{food.calories} kcal</span>
                        </div>
                      ))}
                    </div>

                    {meal.prepTips && (
                      <p className="text-[11px] text-slate-500 italic bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/50">
                        💡 <strong>Prep Tip:</strong> {meal.prepTips}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Personal Diet Creator Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 text-slate-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">AI Personal Diet Maker</h3>
                    <p className="text-xs text-slate-500">Customized with authentic Indian & International foods</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleGenerateAiDiet} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Target Gender (लिंग)</label>
                    <select
                      value={aiTargetGender}
                      onChange={(e) => setAiTargetGender(e.target.value as 'all' | 'female' | 'male')}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="all">🌟 All / Unisex</option>
                      <option value="female">👩 Female (महिला - Tone & Hormones)</option>
                      <option value="male">👨 Male / General (पुरुष)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Fitness Level (स्तर)</label>
                    <select
                      value={aiTargetLevel}
                      onChange={(e) => setAiTargetLevel(e.target.value as 'beginner' | 'intermediate' | 'athlete')}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="beginner">🟢 Beginner (शुरुआती - Simple & Sustainable)</option>
                      <option value="intermediate">🟡 Intermediate (मध्यम - Hypertrophy / Cut)</option>
                      <option value="athlete">🔴 Athlete / Pro (एथलीट - High Performance Fuel)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Primary Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Muscle Building & Strength">Muscle Building & Strength</option>
                      <option value="Fat Loss & Lean Shred">Fat Loss & Lean Shred</option>
                      <option value="Lean Bulk (Clean Surplus)">Lean Bulk (Clean Surplus)</option>
                      <option value="Body Recomposition (Build Muscle + Drop Fat)">Body Recomposition</option>
                      <option value="Athlete Endurance & Stamina">Athlete Endurance & Stamina</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Cuisine Preference</label>
                    <select
                      value={cuisinePreference}
                      onChange={(e) => setCuisinePreference(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Indian & International Fusion">🇮🇳 + 🌍 Indian & International Fusion</option>
                      <option value="High Protein Desi North Indian">🇮🇳 High Protein Desi North Indian</option>
                      <option value="South Indian High Protein & Idli/Dosa/Dals">🇮🇳 South Indian High Protein</option>
                      <option value="International Athlete Clean Eating">🌍 International Athlete Clean Eating</option>
                      <option value="Mediterranean High Protein">🥗 Mediterranean High Protein</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Diet Type</label>
                    <select
                      value={dietType}
                      onChange={(e) => setDietType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Non-Vegetarian High Protein (Chicken, Eggs, Fish, Paneer)">Non-Vegetarian High Protein</option>
                      <option value="Pure Vegetarian (Paneer, Soya, Dals, Sattu, Besan, Dairy)">Pure Vegetarian (Shakahari)</option>
                      <option value="Eggetarian (Eggs + Vegetarian Meals)">Eggetarian</option>
                      <option value="Vegan (100% Plant Based High Protein)">100% Plant Based Vegan</option>
                      <option value="Jain Friendly (No Onion/Garlic)">Jain High Protein</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Target Daily Calories (kcal)</label>
                    <input
                      type="number"
                      step="50"
                      min="1200"
                      max="5000"
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Current Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Target Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-semibold">Meals Per Day</label>
                    <select
                      value={mealsPerDay}
                      onChange={(e) => setMealsPerDay(parseInt(e.target.value, 10))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value={3}>3 Meals</option>
                      <option value={4}>4 Meals</option>
                      <option value={5}>5 Meals</option>
                      <option value={6}>6 Meals</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-700 font-semibold">Dislikes / Allergies / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. No seafood, prefer homecooked roti, add evening whey shake..."
                    value={allergiesOrDislikes}
                    onChange={(e) => setAllergiesOrDislikes(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Crafting Diet with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>Generate Plan</span>
                      </>
                    )}
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
