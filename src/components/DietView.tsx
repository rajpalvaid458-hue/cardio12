import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { MealType, FoodItem } from '../types';
import { POPULAR_FOODS_DATABASE } from '../data/fitnessPresets';
import {
  UtensilsCrossed,
  Droplets,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Search,
  Check,
  ChevronRight,
  Info,
  Apple,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DietView: React.FC = () => {
  const { dailyDiet, logFoodItem, removeFoodItem, addWater, setWaterGoal, setMacroGoals, userProfile } = useFitness();

  const [aiMealInput, setAiMealInput] = useState('');
  const [isEstimatingAi, setIsEstimatingAi] = useState(false);
  const [estimatedMealResult, setEstimatedMealResult] = useState<any>(null);
  const [aiSelectedMealType, setAiSelectedMealType] = useState<MealType>('lunch');

  // Food Picker Modal State
  const [isFoodPickerOpen, setIsFoodPickerOpen] = useState(false);
  const [pickerMealType, setPickerMealType] = useState<MealType>('breakfast');
  const [foodSearch, setFoodSearch] = useState('');

  // Custom Food Creator State
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('100g');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');

  // Calculate Totals
  const totalCalories = dailyDiet.meals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = Number(dailyDiet.meals.reduce((acc, m) => acc + m.totalProtein, 0).toFixed(1));
  const totalCarbs = Number(dailyDiet.meals.reduce((acc, m) => acc + m.totalCarbs, 0).toFixed(1));
  const totalFats = Number(dailyDiet.meals.reduce((acc, m) => acc + m.totalFats, 0).toFixed(1));

  const remainingCalories = Math.max(0, dailyDiet.calorieGoal - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / (dailyDiet.calorieGoal || 2000)) * 100));
  const waterPercent = Math.min(100, Math.round((dailyDiet.waterMl / (dailyDiet.waterGoalMl || 3000)) * 100));

  const handleEstimateWithAi = async () => {
    if (!aiMealInput.trim()) return;
    setIsEstimatingAi(true);
    setEstimatedMealResult(null);

    try {
      const res = await fetch('/api/ai/estimate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealDescription: aiMealInput }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setEstimatedMealResult(data.item);
      }
    } catch (err) {
      console.error('Failed to estimate meal:', err);
    } finally {
      setIsEstimatingAi(false);
    }
  };

  const handleLogAiEstimatedMeal = () => {
    if (!estimatedMealResult) return;
    const food: FoodItem = {
      id: `ai-food-${Date.now()}`,
      name: estimatedMealResult.foodName,
      servingSize: estimatedMealResult.servingSize || '1 portion',
      calories: Math.round(estimatedMealResult.calories),
      proteinGrams: Math.round(estimatedMealResult.proteinGrams),
      carbsGrams: Math.round(estimatedMealResult.carbsGrams),
      fatsGrams: Math.round(estimatedMealResult.fatsGrams),
      fiberGrams: estimatedMealResult.fiberGrams,
      isCustom: true,
    };

    logFoodItem(aiSelectedMealType, food);
    setEstimatedMealResult(null);
    setAiMealInput('');
  };

  const handleOpenFoodPicker = (mealType: MealType) => {
    setPickerMealType(mealType);
    setIsFoodPickerOpen(true);
    setShowCustomFoodForm(false);
  };

  const handleAddPopularFood = (food: FoodItem) => {
    logFoodItem(pickerMealType, food);
    setIsFoodPickerOpen(false);
  };

  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCals) return;

    const newFood: FoodItem = {
      id: `cust-${Date.now()}`,
      name: customName,
      servingSize: customServing || '1 serving',
      calories: parseInt(customCals, 10) || 0,
      proteinGrams: parseFloat(customProtein) || 0,
      carbsGrams: parseFloat(customCarbs) || 0,
      fatsGrams: parseFloat(customFats) || 0,
      isCustom: true,
    };

    logFoodItem(pickerMealType, newFood);
    setIsFoodPickerOpen(false);
    setCustomName('');
    setCustomCals('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFats('');
  };

  const mealSections: { type: MealType; label: string; icon: string }[] = [
    { type: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { type: 'lunch', label: 'Lunch', icon: '🥗' },
    { type: 'dinner', label: 'Dinner', icon: '🥩' },
    { type: 'pre_workout', label: 'Pre-Workout Fuel', icon: '⚡' },
    { type: 'post_workout', label: 'Post-Workout Shake & Meal', icon: '🥤' },
    { type: 'snack', label: 'Snacks & Hydration', icon: '🍎' },
  ];

  const filteredPopularFoods = POPULAR_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Goal Tracker */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" /> Nutrition & Macronutrient Balance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Daily Diet & Fuel</h1>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-semibold block">Remaining Calories</span>
              <span className="text-lg font-black text-emerald-600 font-mono">{remainingCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Macros Progress Bar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {/* Calories */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Calories
              </span>
              <span className="font-mono text-slate-500 font-medium">
                {totalCalories} / {dailyDiet.calorieGoal}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-right">{caloriePercent}% of goal</div>
          </div>

          {/* Protein */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" /> Protein
              </span>
              <span className="font-mono text-slate-500 font-medium">
                {totalProtein}g / {dailyDiet.proteinGoalGrams}g
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((totalProtein / (dailyDiet.proteinGoalGrams || 1)) * 100))}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-right">
              {Math.round((totalProtein / (dailyDiet.proteinGoalGrams || 1)) * 100)}% of goal
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-blue-600" /> Carbs
              </span>
              <span className="font-mono text-slate-500 font-medium">
                {totalCarbs}g / {dailyDiet.carbsGoalGrams}g
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((totalCarbs / (dailyDiet.carbsGoalGrams || 1)) * 100))}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-right">
              {Math.round((totalCarbs / (dailyDiet.carbsGoalGrams || 1)) * 100)}% of goal
            </div>
          </div>

          {/* Fats */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Healthy Fats
              </span>
              <span className="font-mono text-slate-500 font-medium">
                {totalFats}g / {dailyDiet.fatsGoalGrams}g
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.round((totalFats / (dailyDiet.fatsGoalGrams || 1)) * 100))}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-right">
              {Math.round((totalFats / (dailyDiet.fatsGoalGrams || 1)) * 100)}% of goal
            </div>
          </div>
        </div>
      </div>

      {/* Section: Water & Hydration Tracker */}
      <div className="rounded-3xl bg-[#0F172A] text-white border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-blue-900/60 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Droplets className="w-8 h-8 fill-blue-400/20" />
            <span className="absolute bottom-1 right-1 text-[10px] font-bold font-mono text-blue-300">
              {waterPercent}%
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Hydration Tracker</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-white font-mono">{dailyDiet.waterMl} ml</span>
              <span className="text-xs text-slate-400">/ {dailyDiet.waterGoalMl} ml goal</span>
            </div>
            {dailyDiet.waterMl >= dailyDiet.waterGoalMl ? (
              <span className="text-xs text-emerald-400 font-semibold">🎉 Daily water goal achieved!</span>
            ) : (
              <span className="text-xs text-slate-400">
                {(dailyDiet.waterGoalMl - dailyDiet.waterMl) / 1000}L remaining today
              </span>
            )}
          </div>
        </div>

        {/* Quick Water Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => addWater(250)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> 250ml Cup
          </button>
          <button
            onClick={() => addWater(500)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/50 text-blue-100 text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> 500ml Bottle
          </button>
          <button
            onClick={() => addWater(1000)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> +1 Liter
          </button>
          {dailyDiet.waterMl > 0 && (
            <button
              onClick={() => addWater(-250)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
              title="-250ml"
            >
              -250ml
            </button>
          )}
        </div>
      </div>

      {/* Section: AI Meal Macro Estimator */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Meal & Macro Estimator</h3>
            <p className="text-xs text-slate-500">Describe what you ate in natural language to calculate macros</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiMealInput}
            onChange={(e) => setAiMealInput(e.target.value)}
            placeholder="e.g. 2 boiled eggs, 1 bowl oatmeal with blueberries and scoop of whey protein..."
            className="flex-1 bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleEstimateWithAi()}
          />
          <button
            onClick={handleEstimateWithAi}
            disabled={isEstimatingAi || !aiMealInput.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
          >
            {isEstimatingAi ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Analyze Meal</span>
              </>
            )}
          </button>
        </div>

        {/* AI Estimation Result Card */}
        {estimatedMealResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-5 rounded-2xl bg-slate-50 border border-emerald-200 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">AI Estimation</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">{estimatedMealResult.foodName}</h4>
                <p className="text-xs text-slate-500">Serving: {estimatedMealResult.servingSize}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={aiSelectedMealType}
                  onChange={(e) => setAiSelectedMealType(e.target.value as MealType)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none shadow-xs"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="pre_workout">Pre-Workout</option>
                  <option value="post_workout">Post-Workout</option>
                  <option value="snack">Snack</option>
                </select>
                <button
                  onClick={handleLogAiEstimatedMeal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Log This Meal</span>
                </button>
              </div>
            </div>

            {/* Macros breakdown tags */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Calories</div>
                <div className="text-sm font-black text-amber-600 font-mono mt-0.5">
                  {Math.round(estimatedMealResult.calories)} kcal
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Protein</div>
                <div className="text-sm font-black text-emerald-600 font-mono mt-0.5">
                  {Math.round(estimatedMealResult.proteinGrams)}g
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Carbs</div>
                <div className="text-sm font-black text-blue-600 font-mono mt-0.5">
                  {Math.round(estimatedMealResult.carbsGrams)}g
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500 font-medium">Fats</div>
                <div className="text-sm font-black text-rose-600 font-mono mt-0.5">
                  {Math.round(estimatedMealResult.fatsGrams)}g
                </div>
              </div>
            </div>

            {estimatedMealResult.coachTip && (
              <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{estimatedMealResult.coachTip}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Section: Daily Meals Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Daily Meals Breakdown</h2>
          <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
            {dailyDiet.meals.reduce((acc, m) => acc + m.items.length, 0)} logged food items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealSections.map((sec) => {
            const loggedMeal = dailyDiet.meals.find((m) => m.mealType === sec.type);
            const items = loggedMeal?.items || [];
            const mealCals = loggedMeal?.totalCalories || 0;
            const mealProtein = loggedMeal?.totalProtein || 0;

            return (
              <div
                key={sec.type}
                className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sec.icon}</span>
                      <h3 className="font-bold text-slate-900 text-base">{sec.label}</h3>
                    </div>
                    {mealCals > 0 && (
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {mealCals} kcal • {mealProtein}g P
                      </span>
                    )}
                  </div>

                  {/* Food Items List */}
                  <div className="mt-4 space-y-2">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-800">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {item.servingSize} • P: {item.proteinGrams}g | C: {item.carbsGrams}g | F:{' '}
                              {item.fatsGrams}g
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800">{item.calories} kcal</span>
                            <button
                              onClick={() => removeFoodItem(sec.type, item.id)}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete food"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-3 text-center italic">No foods logged yet</p>
                    )}
                  </div>
                </div>

                {/* Add Food Button */}
                <button
                  onClick={() => handleOpenFoodPicker(sec.type)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/80"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Food to {sec.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Food Picker Modal */}
      <AnimatePresence>
        {isFoodPickerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col justify-between shadow-2xl space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add Food Item</h3>
                  <span className="text-xs text-emerald-600 font-medium capitalize">Target: {pickerMealType.replace('_', ' ')}</span>
                </div>
                <button
                  onClick={() => setIsFoodPickerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {!showCustomFoodForm ? (
                <>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search fitness food database..."
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-xs"
                    />
                  </div>

                  {/* Popular Foods Scrollable List */}
                  <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
                    {filteredPopularFoods.map((food) => (
                      <div
                        key={food.id}
                        onClick={() => handleAddPopularFood(food)}
                        className="group cursor-pointer p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-emerald-500/60 flex items-center justify-between transition-all"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors">
                            {food.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {food.servingSize} • P: {food.proteinGrams}g | C: {food.carbsGrams}g | F: {food.fatsGrams}g
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-700 text-xs">{food.calories} kcal</span>
                          <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setShowCustomFoodForm(true)}
                      className="text-xs text-emerald-600 hover:underline font-semibold"
                    >
                      + Create Custom Food Item
                    </button>
                  </div>
                </>
              ) : (
                /* Custom Food Form */
                <form onSubmit={handleSaveCustomFood} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 font-semibold">Food Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grandma's Protein Smoothie"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 font-semibold">Serving Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 bowl / 150g"
                        value={customServing}
                        onChange={(e) => setCustomServing(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 font-semibold">Calories (kcal) *</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 350"
                        value={customCals}
                        onChange={(e) => setCustomCals(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 font-semibold">Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 30"
                        value={customProtein}
                        onChange={(e) => setCustomProtein(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 font-semibold">Carbs (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 40"
                        value={customCarbs}
                        onChange={(e) => setCustomCarbs(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 font-semibold">Fats (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 10"
                        value={customFats}
                        onChange={(e) => setCustomFats(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomFoodForm(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Back to Database
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Save & Log Food
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
