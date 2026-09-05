import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { MealType, FoodItem } from '../types';
import { POPULAR_FOODS_DATABASE } from '../data/fitnessPresets';
import { WaterReminderWidget } from './diet/WaterReminderWidget';
import { HydrationTracker } from './diet/HydrationTracker';
import { SupplementTracker } from './diet/SupplementTracker';
import { PersonalDietMaker } from './diet/PersonalDietMaker';
import { CaloriesChecker } from './diet/CaloriesChecker';
import { MacroBalanceAdvisor } from './diet/MacroBalanceAdvisor';
import { SnapAndLogFoodModal } from './diet/SnapAndLogFoodModal';
import { ReminderBannerWidget } from './reminders/ReminderBannerWidget';
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
  Camera,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DietTab = 'log' | 'snap_log' | 'macro_advisor' | 'diet_maker' | 'calories_checker' | 'water_reminder' | 'supplements';

interface DietViewProps {
  onOpenRemindersModal?: () => void;
}

export const DietView: React.FC<DietViewProps> = ({ onOpenRemindersModal }) => {
  const {
    dailyDiet,
    logFoodItem,
    removeFoodItem,
    addWater,
    supplements,
    waterReminder,
    activeDietPlan,
    userProfile,
    updateUserProfile,
  } = useFitness();
  const { t, isHindi } = useLanguage();

  const [activeTab, setActiveTab] = useState<DietTab>('log');
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [snapInitialMeal, setSnapInitialMeal] = useState<MealType>('lunch');

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
    { type: 'breakfast', label: isHindi ? 'नाश्ता (Breakfast)' : 'Breakfast', icon: '🍳' },
    { type: 'lunch', label: isHindi ? 'दोपहर का भोजन (Lunch)' : 'Lunch', icon: '🥗' },
    { type: 'dinner', label: isHindi ? 'रात का खाना (Dinner)' : 'Dinner', icon: '🥩' },
    { type: 'pre_workout', label: isHindi ? 'प्री-वर्कआउट ऊर्जा' : 'Pre-Workout Fuel', icon: '⚡' },
    { type: 'post_workout', label: isHindi ? 'पोस्ट-वर्कआउट शेक व भोजन' : 'Post-Workout Shake & Meal', icon: '🥤' },
    { type: 'snack', label: isHindi ? 'स्नैक्स और फल' : 'Snacks & Fruit', icon: '🍎' },
  ];

  const filteredPopularFoods = POPULAR_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    (f.hindiName && f.hindiName.toLowerCase().includes(foodSearch.toLowerCase()))
  );

  const tabs: { id: DietTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'log', label: isHindi ? 'दैनिक भोजन लॉग' : 'Daily Meals Log', icon: <UtensilsCrossed className="w-4 h-4" /> },
    {
      id: 'snap_log',
      label: isHindi ? 'स्नैप और लॉग (कैमरा)' : 'Snap & Log Food',
      icon: <Camera className="w-4 h-4 text-emerald-600" />,
      badge: isHindi ? 'एआई विज़न' : 'AI Camera',
    },
    {
      id: 'macro_advisor',
      label: isHindi ? 'मैक्रो बैलेंस व दैनिक टिप्स' : 'Macro Balance & Daily Tips',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      badge: isHindi ? 'स्मार्ट टिप्स' : 'AI Tips',
    },
    { id: 'diet_maker', label: isHindi ? 'कस्टम डाइट प्लान' : 'Personal Diet Maker', icon: <ChefHat className="w-4 h-4" />, badge: isHindi ? 'एआई व देसी' : 'AI & Desi' },
    { id: 'calories_checker', label: isHindi ? 'कैलोरी चेकर' : 'Calories Checker', icon: <Calculator className="w-4 h-4" /> },
    {
      id: 'water_reminder',
      label: isHindi ? 'पानी और हाइड्रेशन' : 'Hydration Tracker',
      icon: <Droplets className="w-4 h-4" />,
      badge: `${Math.min(100, Math.round((dailyDiet.waterMl / (dailyDiet.waterGoalMl || 3000)) * 100))}%`,
    },
    { id: 'supplements', label: isHindi ? 'सप्लीमेंट्स स्टैक' : 'Supplements Stack', icon: <Pill className="w-4 h-4" />, badge: `${supplements.filter((s) => s.taken).length}/${supplements.length}` },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Goal Tracker */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" /> {isHindi ? 'पोषण और फिटनेस आहार केंद्र' : 'Nutrition & Fitness Fuel Hub'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'पोषण और आहार हब' : 'Nutrition & Diet Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isHindi 
                ? 'कैलोरी ट्रैक करें, भारतीय व अंतरराष्ट्रीय खाद्य पदार्थों से आहार बनाएं, हाइड्रेशन और सप्लीमेंट्स संभालें।' 
                : 'Track calories, personalize diets with Indian & International foods, manage hydration, and supplement stacks.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSnapInitialMeal('lunch');
                setIsSnapModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-sm cursor-pointer"
              title={isHindi ? 'कैमरा से भोजन स्कैन करें और ऑटो-लॉग करें' : 'Snap meal with camera to auto-estimate & log'}
            >
              <Camera className="w-4 h-4" />
              <span>{isHindi ? '📸 स्नैप और लॉग' : '📸 Snap & Log'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('macro_advisor');
                setTimeout(() => {
                  const el = document.getElementById('macro-balance-advisor');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shadow-2xs cursor-pointer"
              title={isHindi ? 'मैक्रो बैलेंस विश्लेषण व दैनिक टिप्स देखें' : 'View Macro Balance Analysis & Personalized Daily Tips'}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'दैनिक मैक्रो टिप्स' : 'Macro Balance Tips'}</span>
            </button>

            <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
              <span className="text-[11px] text-slate-500 font-semibold block">
                {isHindi ? 'शेष कैलोरी' : 'Remaining Calories'}
              </span>
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
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {t('calories')}
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
            <div className="text-[10px] text-slate-500 font-mono text-right">
              {caloriePercent}% {isHindi ? 'लक्ष्य का' : 'of target'}
            </div>
          </div>

          {/* Protein */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" /> {t('protein')}
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
              {Math.round((totalProtein / (dailyDiet.proteinGoalGrams || 1)) * 100)}% {isHindi ? 'लक्ष्य का' : 'of target'}
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-blue-600" /> {t('carbs')}
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
              {Math.round((totalCarbs / (dailyDiet.carbsGoalGrams || 1)) * 100)}% {isHindi ? 'लक्ष्य का' : 'of target'}
            </div>
          </div>

          {/* Fats */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> {t('fats')}
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
              {Math.round((totalFats / (dailyDiet.fatsGoalGrams || 1)) * 100)}% {isHindi ? 'लक्ष्य का' : 'of target'}
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Banner Widget */}
      {onOpenRemindersModal && (
        <ReminderBannerWidget
          onOpenRemindersModal={onOpenRemindersModal}
          variant="diet"
        />
      )}

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

          {/* Real-time Macro Balance Analysis & Personalized Daily Tips */}
          <MacroBalanceAdvisor
            dailyDiet={dailyDiet}
            userGoal={userProfile?.goal || 'muscle_gain'}
            onLogFoodItem={logFoodItem}
            onUpdateGoal={(newGoal) => updateUserProfile({ goal: newGoal })}
          />

          {/* Daily Meals Breakdown */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {isHindi ? "आज का भोजन (Today's Meals)" : "Today's Meals"}
              </h2>
              <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                {dailyDiet.meals.reduce((acc, m) => acc + m.items.length, 0)} {isHindi ? 'खाद्य पदार्थ लॉग किए गए' : 'logged food items'}
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

                    {/* Meal Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenFoodPicker(sec.type)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200/80 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isHindi ? `+ ${sec.label} में जोड़ें` : `+ Add to ${sec.label}`}</span>
                      </button>
                      <button
                        onClick={() => {
                          setSnapInitialMeal(sec.type);
                          setIsSnapModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200 cursor-pointer"
                        title={isHindi ? `${sec.label} की फ़ोटो लेकर लॉग करें` : `Snap photo for ${sec.label}`}
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isHindi ? 'स्नैप' : 'Snap'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </motion.div>
      )}

      {/* Tab: Snap & Log Food (Camera AI) */}
      {activeTab === 'snap_log' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <SnapAndLogFoodModal
            isOpen={true}
            isInlineView={true}
            initialMealType="lunch"
          />
        </motion.div>
      )}

      {/* Tab: Macro Balance Advisor & Daily Tips */}
      {activeTab === 'macro_advisor' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <MacroBalanceAdvisor
            dailyDiet={dailyDiet}
            userGoal={userProfile?.goal || 'muscle_gain'}
            onLogFoodItem={logFoodItem}
            onUpdateGoal={(newGoal) => updateUserProfile({ goal: newGoal })}
          />
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

      {/* Tab 4: Hydration Tracker & Water Intake */}
      {activeTab === 'water_reminder' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <HydrationTracker />
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
                  {/* Quick Snap & Log shortcut inside Food Picker */}
                  <button
                    onClick={() => {
                      setIsFoodPickerOpen(false);
                      setSnapInitialMeal(pickerMealType);
                      setIsSnapModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold block">{isHindi ? 'कैमरा से भोजन स्कैन करें' : 'Snap Food with Camera'}</span>
                        <span className="text-[10px] text-emerald-700">{isHindi ? 'एआई सामग्री और मैक्रोज़ का सटीक अनुमान लगाएगा' : 'Auto-estimate calories & macros with AI vision'}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-600" />
                  </button>

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

      {/* Snap & Log Food Modal */}
      <SnapAndLogFoodModal
        isOpen={isSnapModalOpen}
        isInlineView={false}
        initialMealType={snapInitialMeal}
        onClose={() => setIsSnapModalOpen(false)}
      />
    </div>
  );
};
