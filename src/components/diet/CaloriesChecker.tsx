import React, { useState } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { useLanguage } from '../../context/LanguageContext';
import { MealType, FoodItem } from '../../types';
import { POPULAR_FOODS_DATABASE } from '../../data/fitnessPresets';
import {
  Search,
  Sparkles,
  Flame,
  Zap,
  Apple,
  Plus,
  Check,
  Info,
  Scale,
  Sliders,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CaloriesCheckerProps {
  onAddFoodToMeal?: (mealType: MealType, food: FoodItem) => void;
}

export const CaloriesChecker: React.FC<CaloriesCheckerProps> = ({ onAddFoodToMeal }) => {
  const { logFoodItem } = useFitness();
  const { isHindi } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [aiMealPrompt, setAiMealPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [selectedTargetMeal, setSelectedTargetMeal] = useState<MealType>('lunch');

  // Interactive Serving Scale for selected database food
  const [activeFood, setActiveFood] = useState<FoodItem | null>(POPULAR_FOODS_DATABASE[0]);
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [successToast, setSuccessToast] = useState<string>('');

  const filteredFoods = POPULAR_FOODS_DATABASE.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCuisine =
      selectedCuisine === 'all' ||
      (selectedCuisine === 'Indian' && item.cuisine === 'Indian') ||
      (selectedCuisine === 'International' && item.cuisine === 'International');

    const matchCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchSearch && matchCuisine && matchCategory;
  });

  const handleAiEstimate = async () => {
    if (!aiMealPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/estimate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealDescription: aiMealPrompt }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setAiResult(data.item);
      }
    } catch (err) {
      console.error('Error estimating calories:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLogActiveFood = (mealType: MealType) => {
    if (!activeFood) return;

    const scaledFood: FoodItem = {
      ...activeFood,
      id: `scaled-${Date.now()}`,
      servingSize:
        servingMultiplier === 1
          ? activeFood.servingSize
          : `${(parseFloat(activeFood.servingSize) * servingMultiplier).toFixed(0) || activeFood.servingSize} (${servingMultiplier}x portion)`,
      calories: Math.round(activeFood.calories * servingMultiplier),
      proteinGrams: Number((activeFood.proteinGrams * servingMultiplier).toFixed(1)),
      carbsGrams: Number((activeFood.carbsGrams * servingMultiplier).toFixed(1)),
      fatsGrams: Number((activeFood.fatsGrams * servingMultiplier).toFixed(1)),
    };

    if (onAddFoodToMeal) {
      onAddFoodToMeal(mealType, scaledFood);
    } else {
      logFoodItem(mealType, scaledFood);
    }

    setSuccessToast(`Added ${scaledFood.name} to ${mealType.replace('_', ' ')}!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleLogAiResult = () => {
    if (!aiResult) return;
    const food: FoodItem = {
      id: `ai-food-${Date.now()}`,
      name: aiResult.foodName,
      hindiName: aiResult.hindiName,
      cuisine: aiResult.cuisine,
      servingSize: aiResult.servingSize || '1 portion',
      calories: Math.round(aiResult.calories),
      proteinGrams: Number(aiResult.proteinGrams.toFixed(1)),
      carbsGrams: Number(aiResult.carbsGrams.toFixed(1)),
      fatsGrams: Number(aiResult.fatsGrams.toFixed(1)),
      fiberGrams: aiResult.fiberGrams,
      isCustom: true,
    };

    if (onAddFoodToMeal) {
      onAddFoodToMeal(selectedTargetMeal, food);
    } else {
      logFoodItem(selectedTargetMeal, food);
    }

    setSuccessToast(`Logged ${food.name} to ${selectedTargetMeal.replace('_', ' ')}!`);
    setTimeout(() => setSuccessToast(''), 3000);
    setAiResult(null);
    setAiMealPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* AI Smart Calories Scanner & Checker */}
      <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Instant Calorie & Macro Scanner</h3>
            <p className="text-xs text-slate-400">
              Type or paste any meal in English, Hindi, or Hinglish (e.g. "2 roti with 100g paneer bhurji & 1 glass lassi")
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={aiMealPrompt}
            onChange={(e) => setAiMealPrompt(e.target.value)}
            placeholder="e.g. 1 bowl moong dal tadka, 2 chapatis, 150g grilled chicken breast..."
            className="flex-1 bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleAiEstimate()}
          />
          <button
            onClick={handleAiEstimate}
            disabled={isAiLoading || !aiMealPrompt.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            {isAiLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-current" />
                <span>Check Calories</span>
              </>
            )}
          </button>
        </div>

        {/* AI Result Card */}
        {aiResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-5 rounded-2xl bg-slate-800/90 border border-emerald-500/50 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    {aiResult.cuisine || 'Estimated'}
                  </span>
                  {isHindi && aiResult.hindiName && (
                    <span className="text-xs text-slate-300 font-medium">({aiResult.hindiName})</span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white mt-1">{aiResult.foodName}</h4>
                <p className="text-xs text-slate-400">Serving: {aiResult.servingSize}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedTargetMeal}
                  onChange={(e) => setSelectedTargetMeal(e.target.value as MealType)}
                  className="bg-slate-700 border border-slate-600 text-white text-xs rounded-xl px-3 py-2 font-medium focus:outline-none"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="pre_workout">Pre-Workout</option>
                  <option value="post_workout">Post-Workout</option>
                  <option value="snack">Snack</option>
                </select>

                <button
                  onClick={handleLogAiResult}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Log Food</span>
                </button>
              </div>
            </div>

            {/* Macro Stats */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                <div className="text-[10px] text-slate-400 font-medium">Calories</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  {Math.round(aiResult.calories)} kcal
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                <div className="text-[10px] text-slate-400 font-medium">Protein</div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  {aiResult.proteinGrams}g
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                <div className="text-[10px] text-slate-400 font-medium">Carbs</div>
                <div className="text-base font-black text-blue-400 font-mono mt-0.5">
                  {aiResult.carbsGrams}g
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                <div className="text-[10px] text-slate-400 font-medium">Fats</div>
                <div className="text-base font-black text-rose-400 font-mono mt-0.5">
                  {aiResult.fatsGrams}g
                </div>
              </div>
            </div>

            {aiResult.coachTip && (
              <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{aiResult.coachTip}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Food Database & Portion Calculator */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Food Nutrition Database</h3>
            <p className="text-xs text-slate-500">
              Explore 60+ verified Indian & International fitness staples with portion calculators
            </p>
          </div>

          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Foods' },
              { id: 'Indian', label: '🇮🇳 Indian' },
              { id: 'International', label: '🌍 International' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCuisine(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCuisine === c.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by food name, Hindi name (e.g. Paneer, Sattu, Salmon, Oats, Roti, Eggs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-xs"
          />
        </div>

        {/* Grid: Food Selector + Active Food Serving Scaler */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food List (2 Cols) */}
          <div className="lg:col-span-2 space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredFoods.map((food) => {
              const isSelected = activeFood?.id === food.id;

              return (
                <div
                  key={food.id}
                  onClick={() => {
                    setActiveFood(food);
                    setServingMultiplier(1);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {isHindi && food.hindiName ? food.hindiName : food.name}
                      </span>
                      {isHindi && food.hindiName && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-medium">
                          {food.name}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{food.cuisine === 'Indian' ? '🇮🇳' : '🌍'}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {food.servingSize} • P: {food.proteinGrams}g | C: {food.carbsGrams}g | F: {food.fatsGrams}g
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-600 font-mono block">{food.calories} kcal</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{food.proteinGrams}g Pro</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Food Detail & Portion Scaler (1 Col) */}
          {activeFood && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Portion Scaler
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{activeFood.cuisine}</span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 mt-2">
                  {isHindi && activeFood.hindiName ? activeFood.hindiName : activeFood.name}
                </h4>
                {isHindi && activeFood.hindiName && (
                  <p className="text-xs text-emerald-700 font-medium">{activeFood.name}</p>
                )}
                <p className="text-xs text-slate-500 mt-0.5">Base: {activeFood.servingSize}</p>

                {/* Multiplier buttons */}
                <div className="mt-4 space-y-1.5">
                  <label className="text-xs text-slate-600 font-semibold flex items-center justify-between">
                    <span>Serving Multiplier</span>
                    <span className="font-mono text-emerald-700 font-bold">{servingMultiplier}x</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0.5, 1, 1.5, 2].map((m) => (
                      <button
                        key={m}
                        onClick={() => setServingMultiplier(m)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          servingMultiplier === m
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scaled Macro Numbers */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">Calories</span>
                    <span className="text-base font-black text-amber-600 font-mono">
                      {Math.round(activeFood.calories * servingMultiplier)} kcal
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">Protein</span>
                    <span className="text-base font-black text-emerald-600 font-mono">
                      {Number((activeFood.proteinGrams * servingMultiplier).toFixed(1))}g
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">Carbs</span>
                    <span className="text-base font-black text-blue-600 font-mono">
                      {Number((activeFood.carbsGrams * servingMultiplier).toFixed(1))}g
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">Fats</span>
                    <span className="text-base font-black text-rose-600 font-mono">
                      {Number((activeFood.fatsGrams * servingMultiplier).toFixed(1))}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Meal Quick Dropdown/Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-600 font-semibold block">Quick Log to Today:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleLogActiveFood('breakfast')}
                    className="py-2 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-800 text-xs font-semibold transition-all"
                  >
                    + Breakfast
                  </button>
                  <button
                    onClick={() => handleLogActiveFood('lunch')}
                    className="py-2 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-800 text-xs font-semibold transition-all"
                  >
                    + Lunch
                  </button>
                  <button
                    onClick={() => handleLogActiveFood('dinner')}
                    className="py-2 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-800 text-xs font-semibold transition-all"
                  >
                    + Dinner
                  </button>
                  <button
                    onClick={() => handleLogActiveFood('pre_workout')}
                    className="py-2 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-800 text-xs font-semibold transition-all"
                  >
                    + Pre/Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
