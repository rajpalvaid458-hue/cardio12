import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { MealType, FoodItem } from '../types';
import { POPULAR_FOODS_DATABASE } from '../data/fitnessPresets';
import { WaterReminderWidget } from './diet/WaterReminderWidget';
import { SupplementTracker } from './diet/SupplementTracker';
import { PersonalDietMaker } from './diet/PersonalDietMaker';
import { CaloriesChecker } from './diet/CaloriesChecker';
import {
  UtensilsCrossed,
  Droplets,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Search,
  Check,
  Zap,
  Apple,
  Pill,
  ChefHat,
  Calculator,
  Calendar,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DietTab = 'log' | 'diet_maker' | 'calories_checker' | 'water_reminder' | 'supplements';

export const DietView: React.FC = () => {
  const {
    dailyDiet,
    logFoodItem,
    removeFoodItem,
    addWater,
    supplements,
    waterReminder,
    activeDietPlan,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<DietTab>('log');

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
    { type: 'snack', label: 'Snacks & Fruit', icon: '🍎' },
  ];

  const filteredPopularFoods = POPULAR_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    (f.hindiName && f.hindiName.toLowerCase().includes(foodSearch.toLowerCase()))
  );

  const tabs: { id: DietTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'log', label: 'Daily Meals Log', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'diet_maker', label: 'Personal Diet Maker', icon: <ChefHat className="w-4 h-4" />, badge: 'AI & Desi' },
    { id: 'calories_checker', label: 'Calories Checker', icon: <Calculator className="w-4 h-4" /> },
    { id: 'water_reminder', label: 'Water Reminder', icon: <Droplets className="w-4 h-4" />, badge: waterReminder.enabled ? 'ON' : undefined },
    { id: 'supplements', label: 'Supplements Stack', icon: <Pill className="w-4 h-4" />, badge: `${supplements.filter((s) => s.taken).length}/${supplements.length}` },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Goal Tracker */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" /> Nutrition & Fitness Fuel Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Nutrition & Diet Hub</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track calories, personalize diets with Indian & International foods, manage hydration, and supplement stacks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
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
            <div className="text-[10px] text-slate-500 font-mono text-right">{caloriePercent}% of target</div>
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
              {Math.round((totalProtein / (dailyDiet.proteinGoalGrams || 1)) * 100)}% of target
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
              {Math.round((totalCarbs / (dailyDiet.carbsGoalGrams || 1)) * 100)}% of target
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
              {Math.round((totalFats / (dailyDiet.fatsGoalGrams || 1)) * 100)}% of target
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Daily Food Log */}
      {activeTab === 'log' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Quick Water Reminder Banner */}
          <WaterReminderWidget />

          {/* Daily Meals Breakdown */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Today's Meals</h2>
              <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
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
                    className="rounded-3xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-sm"
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
                                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                  {item.name}
                                  {item.hindiName && (
                                    <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-normal">
                                      {item.hindiName}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
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
                          <p className="text-xs text-slate-400 py-3 text-center italic">No items logged yet</p>
                        )}
                      </div>
                    </div>

                    {/* Add Food Button */}
                    <button
                      onClick={() => handleOpenFoodPicker(sec.type)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/80"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Food to {sec.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </motion.div>
      )}

      {/* Tab 2: Personal Diet Maker */}
      {activeTab === 'diet_maker' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <PersonalDietMaker />
        </motion.div>
      )}

      {/* Tab 3: Calories Checker */}
      {activeTab === 'calories_checker' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <CaloriesChecker />
        </motion.div>
      )}

      {/* Tab 4: Water Reminder */}
      {activeTab === 'water_reminder' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <WaterReminderWidget />
        </motion.div>
      )}

      {/* Tab 5: Supplements Stack */}
      {activeTab === 'supplements' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SupplementTracker />
        </motion.div>
      )}

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
                  <span className="text-xs text-emerald-600 font-medium capitalize">
                    Target: {pickerMealType.replace('_', ' ')}
                  </span>
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
                      placeholder="Search Indian & International foods (Paneer, Oats, Chicken...)..."
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
                          <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                            {food.name}
                            {food.hindiName && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-normal">
                                {food.hindiName}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">{food.cuisine === 'Indian' ? '🇮🇳' : '🌍'}</span>
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
                    <label className="text-xs text-slate-600 font-semibold">Food Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grandma's Protein Ladoo / Chicken Rice Bowl"
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
                        placeholder="e.g. 1 bowl / 150g / 2 pcs"
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
                      Back to Search
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
