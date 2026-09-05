import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import {
  WorkoutPlan,
  ActiveWorkoutSession,
  CompletedWorkoutLog,
  DailyDietLog,
  MealType,
  FoodItem,
  RoutineItem,
  DailyHabit,
  UserProfile,
  Exercise,
  SupplementItem,
  WaterReminderSettings,
  WaterLogEntry,
  PersonalDietPlan,
  WorkoutReminderSettings,
  MealReminderItem,
  InAppReminderAlert,
} from '../types';
import {
  PRESET_WORKOUT_PLANS,
  EXERCISE_DATABASE,
  POPULAR_FOODS_DATABASE,
  DEFAULT_DAILY_ROUTINE,
  DEFAULT_HABITS,
  DEFAULT_SUPPLEMENTS,
  PRESET_DIET_PLANS,
} from '../data/fitnessPresets';
import {
  playCountdownBeep,
  playWorkStartTone,
  playRestStartTone,
  playVictoryFanfare,
  playClickFeedback,
  playWaterDropTone,
  playSupplementTone,
  playWorkoutReminderTone,
  playMealReminderTone,
  playNotificationChime,
} from '../utils/audio';
import {
  sendBrowserNotification,
  getTimeWithMinutesOffset,
  formatTo12Hour,
} from '../utils/notifications';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { auth, db, doc, getDoc, setDoc } from '../lib/firebase';

interface RestTimerState {
  active: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  exerciseName?: string;
  isPaused: boolean;
}

interface FitnessContextType {
  // State
  plans: WorkoutPlan[];
  exercises: Exercise[];
  activeWorkout: ActiveWorkoutSession | null;
  workoutLogs: CompletedWorkoutLog[];
  dailyDiet: DailyDietLog;
  routineItems: RoutineItem[];
  habits: DailyHabit[];
  supplements: SupplementItem[];
  waterReminder: WaterReminderSettings;
  workoutReminder: WorkoutReminderSettings;
  mealReminders: MealReminderItem[];
  activeInAppAlerts: InAppReminderAlert[];
  savedDietPlans: PersonalDietPlan[];
  activeDietPlan: PersonalDietPlan | null;
  userProfile: UserProfile;
  restTimer: RestTimerState | null;
  selectedDate: string;
  isCloudSyncing: boolean;

  // Actions - Workout
  startWorkout: (plan: WorkoutPlan) => void;
  updateActiveWorkout: (updater: (prev: ActiveWorkoutSession | null) => ActiveWorkoutSession | null) => void;
  toggleSetCompleted: (exerciseIndex: number, setIndex: number) => void;
  updateSetValues: (exerciseIndex: number, setIndex: number, field: 'weightKg' | 'reps' | 'rpe', value: number) => void;
  addSetToExercise: (exerciseIndex: number) => void;
  removeSetFromExercise: (exerciseIndex: number, setIndex: number) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  finishWorkout: () => void;
  cancelActiveWorkout: () => void;
  saveWorkoutPlan: (plan: WorkoutPlan) => void;
  deleteWorkoutPlan: (planId: string) => void;
  addWorkoutLog: (log: CompletedWorkoutLog) => void;

  // Actions - Rest Timer
  startRestTimer: (seconds: number, exerciseName?: string) => void;
  pauseResumeRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  stopRestTimer: () => void;

  // Actions - Diet & Calories
  logFoodItem: (mealType: MealType, food: FoodItem) => void;
  removeFoodItem: (mealType: MealType, foodId: string) => void;
  addWater: (amountMl: number, containerLabel?: string, containerType?: string) => void;
  removeWaterLog: (logId: string) => void;
  resetDailyWater: () => void;
  setWaterGoal: (amountMl: number) => void;
  setMacroGoals: (calories: number, protein: number, carbs: number, fats: number) => void;

  // Actions - Water Reminder
  updateWaterReminderSettings: (settings: Partial<WaterReminderSettings>) => void;
  triggerWaterReminderAlert: () => void;

  // Actions - Scheduled Reminders (Workout & Nutrition)
  updateWorkoutReminder: (settings: Partial<WorkoutReminderSettings>) => void;
  updateMealReminder: (id: string, updates: Partial<MealReminderItem>) => void;
  toggleMealReminder: (id: string) => void;
  addMealReminder: (reminder: Omit<MealReminderItem, 'id'>) => void;
  deleteMealReminder: (id: string) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  triggerTestReminder: (type: 'workout' | 'meal', customMealType?: MealType) => void;

  // Actions - Supplements
  toggleSupplementTaken: (id: string) => void;
  addSupplement: (item: Omit<SupplementItem, 'id'>) => void;
  deleteSupplement: (id: string) => void;
  toggleSupplementReminder: (id: string) => void;

  // Actions - Personal Diet Plans
  setActiveDietPlan: (plan: PersonalDietPlan | null) => void;
  savePersonalDietPlan: (plan: PersonalDietPlan) => void;
  deletePersonalDietPlan: (planId: string) => void;
  applyDietPlanToDailyLog: (plan: PersonalDietPlan) => void;

  // Actions - Routine & Habits
  toggleRoutineItem: (id: string) => void;
  addRoutineItem: (item: Omit<RoutineItem, 'id'>) => void;
  deleteRoutineItem: (id: string) => void;
  toggleHabit: (id: string) => void;
  updateHabitProgress: (id: string, current: number) => void;

  // Actions - Profile & Sync
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setSelectedDate: (date: string) => void;
  resetAllData: () => void;
  importUserData: (jsonData: string) => boolean;
  exportUserData: () => string;
  syncToCloud: () => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLANS: 'pulsefit_plans_v1',
  LOGS: 'pulsefit_logs_v1',
  DIET: 'pulsefit_diet_v1',
  ROUTINE: 'pulsefit_routine_v1',
  HABITS: 'pulsefit_habits_v1',
  SUPPLEMENTS: 'pulsefit_supplements_v1',
  WATER_REMINDER: 'pulsefit_water_reminder_v1',
  WORKOUT_REMINDER: 'pulsefit_workout_reminder_v1',
  MEAL_REMINDERS: 'pulsefit_meal_reminders_v1',
  IN_APP_ALERTS: 'pulsefit_in_app_alerts_v1',
  DIET_PLANS: 'pulsefit_diet_plans_v1',
  ACTIVE_DIET_PLAN: 'pulsefit_active_diet_plan_v1',
  PROFILE: 'pulsefit_profile_v1',
  ACTIVE_WORKOUT: 'pulsefit_active_workout_v1',
  REST_TIMER: 'pulsefit_rest_timer_v1',
};

const DEFAULT_WORKOUT_REMINDER: WorkoutReminderSettings = {
  enabled: true,
  scheduledTime: '06:00 PM',
  workoutDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  preWorkoutFuelReminderMins: 45,
  preWorkoutFuelEnabled: true,
  warmupReminderMins: 15,
  warmupEnabled: true,
  soundAlert: true,
  browserNotification: true,
  targetPlanTitle: 'Push Power Hypertrophy',
  notes: 'Bring gym towel, resistance band & water bottle',
};

const DEFAULT_MEAL_REMINDERS: MealReminderItem[] = [
  {
    id: 'meal-breakfast',
    mealType: 'breakfast',
    label: 'Morning Breakfast',
    time: '08:30 AM',
    enabled: true,
    soundAlert: true,
    browserNotification: true,
    suggestedCalories: 650,
    suggestedProteinGrams: 35,
    reminderTip: 'Fuel up with quality protein and complex carbs to jumpstart your metabolic rate.',
  },
  {
    id: 'meal-snack-morning',
    mealType: 'snack',
    label: 'Mid-Morning Fuel',
    time: '11:00 AM',
    enabled: false,
    soundAlert: true,
    browserNotification: true,
    suggestedCalories: 250,
    suggestedProteinGrams: 15,
    reminderTip: 'Grab an apple, almonds, or Greek yogurt & drink 300ml water.',
  },
  {
    id: 'meal-lunch',
    mealType: 'lunch',
    label: 'High-Protein Lunch',
    time: '01:30 PM',
    enabled: true,
    soundAlert: true,
    browserNotification: true,
    suggestedCalories: 750,
    suggestedProteinGrams: 45,
    reminderTip: 'Time to log lunch: lean protein, wholesome carbs & fresh vegetables.',
  },
  {
    id: 'meal-snack-preworkout',
    mealType: 'snack',
    label: 'Pre-Workout Snack',
    time: '04:30 PM',
    enabled: true,
    soundAlert: true,
    browserNotification: true,
    suggestedCalories: 300,
    suggestedProteinGrams: 20,
    reminderTip: 'Quick energy boost: banana, rice cakes or whey shake for muscle glycogen.',
  },
  {
    id: 'meal-dinner',
    mealType: 'dinner',
    label: 'Recovery Dinner',
    time: '08:00 PM',
    enabled: true,
    soundAlert: true,
    browserNotification: true,
    suggestedCalories: 700,
    suggestedProteinGrams: 45,
    reminderTip: 'Log your evening dinner macros to optimize overnight muscle protein synthesis.',
  },
  {
    id: 'meal-snack-wrapup',
    mealType: 'snack',
    label: 'Daily Nutrition Wrap-Up',
    time: '09:30 PM',
    enabled: true,
    soundAlert: true,
    browserNotification: true,
    suggestedCalories: 150,
    suggestedProteinGrams: 10,
    reminderTip: 'Final check-in: review your total calories & macros against today\'s targets.',
  },
];

const DEFAULT_WATER_REMINDER: WaterReminderSettings = {
  enabled: true,
  intervalMinutes: 60,
  soundAlert: true,
  dailyGoalMl: 3200,
  nextReminderTimestamp: Date.now() + 60 * 60 * 1000,
  remindBetweenStart: '07:00 AM',
  remindBetweenEnd: '10:00 PM',
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Hunter',
  age: 26,
  gender: 'male',
  heightCm: 178,
  weightKg: 78,
  targetWeightKg: 82,
  goal: 'muscle_gain',
  fitnessLevel: 'intermediate',
  activityLevel: 'moderately_active',
  dailyCalorieTarget: 2650,
  dailyProteinTarget: 165,
  dailyCarbsTarget: 290,
  dailyFatsTarget: 70,
  dailyWaterTargetMl: 3000,
  weightUnit: 'kg',
  streakDays: 5,
  lastActiveDate: getTodayString(),
};

const getInitialDiet = (profile: UserProfile): DailyDietLog => ({
  date: getTodayString(),
  meals: [
    {
      id: 'm-breakfast',
      mealType: 'breakfast',
      time: '08:00 AM',
      items: [
        POPULAR_FOODS_DATABASE[1], // Eggs
        POPULAR_FOODS_DATABASE[5], // Oats
        POPULAR_FOODS_DATABASE[11], // Banana
      ],
      totalCalories: 481,
      totalProtein: 21.9,
      totalCarbs: 67.7,
      totalFats: 14.0,
    },
    {
      id: 'm-lunch',
      mealType: 'lunch',
      time: '01:00 PM',
      items: [
        POPULAR_FOODS_DATABASE[0], // Chicken Breast
        POPULAR_FOODS_DATABASE[6], // Brown rice
        POPULAR_FOODS_DATABASE[14], // Broccoli
      ],
      totalCalories: 493,
      totalProtein: 55.2,
      totalCarbs: 51.0,
      totalFats: 7.5,
    },
    {
      id: 'm-postworkout',
      mealType: 'post_workout',
      time: '06:15 PM',
      items: [
        POPULAR_FOODS_DATABASE[4], // Whey Protein
      ],
      totalCalories: 120,
      totalProtein: 25.0,
      totalCarbs: 2.0,
      totalFats: 1.0,
    },
  ],
  waterMl: 2250,
  waterGoalMl: profile.dailyWaterTargetMl || 3000,
  waterLogs: [
    {
      id: 'wlog-init-1',
      timestamp: Date.now() - 8 * 3600 * 1000,
      timeString: '07:30 AM',
      amountMl: 500,
      containerType: 'bottle',
      containerLabel: 'Morning Hydration Bottle',
    },
    {
      id: 'wlog-init-2',
      timestamp: Date.now() - 5.5 * 3600 * 1000,
      timeString: '10:00 AM',
      amountMl: 250,
      containerType: 'glass',
      containerLabel: 'Standard Glass',
    },
    {
      id: 'wlog-init-3',
      timestamp: Date.now() - 3.5 * 3600 * 1000,
      timeString: '12:30 PM',
      amountMl: 500,
      containerType: 'shaker',
      containerLabel: 'Gym Shaker Bottle',
    },
    {
      id: 'wlog-init-4',
      timestamp: Date.now() - 2 * 3600 * 1000,
      timeString: '02:45 PM',
      amountMl: 250,
      containerType: 'glass',
      containerLabel: 'Standard Glass',
    },
    {
      id: 'wlog-init-5',
      timestamp: Date.now() - 0.75 * 3600 * 1000,
      timeString: '04:15 PM',
      amountMl: 750,
      containerType: 'bottle',
      containerLabel: 'Sports Bottle',
    },
  ],
  calorieGoal: profile.dailyCalorieTarget || 2650,
  proteinGoalGrams: profile.dailyProteinTarget || 165,
  carbsGoalGrams: profile.dailyCarbsTarget || 290,
  fatsGoalGrams: profile.dailyFatsTarget || 70,
});

export const FitnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // 1. User Profile
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // 2. Workout Plans
  const [plans, setPlans] = useState<WorkoutPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (saved) {
        const parsed: WorkoutPlan[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p) => p.id));
          const missingPresets = PRESET_WORKOUT_PLANS.filter((p) => !existingIds.has(p.id));
          if (missingPresets.length > 0) {
            const combined = [...missingPresets, ...parsed];
            localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(combined));
            return combined;
          }
          return parsed;
        }
      }
      return PRESET_WORKOUT_PLANS;
    } catch {
      return PRESET_WORKOUT_PLANS;
    }
  });

  // 3. Active Workout
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkoutSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Workout Logs
  const [workoutLogs, setWorkoutLogs] = useState<CompletedWorkoutLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const now = Date.now();
      const dayMs = 86400000;
      return [
        {
          id: 'log-yesterday',
          title: 'Push Power & Hypertrophy',
          date: new Date(now - dayMs).toISOString(),
          durationSeconds: 3120,
          totalVolumeKg: 6540,
          completedSetsCount: 16,
          caloriesBurned: 420,
          rpeAverage: 8.5,
          exercises: [
            {
              name: 'Barbell Flat Bench Press',
              targetMuscle: 'Chest',
              completedSets: [
                { weightKg: 60, reps: 8, isWarmup: true },
                { weightKg: 80, reps: 6 },
                { weightKg: 80, reps: 6 },
                { weightKg: 80, reps: 5 },
              ],
            },
            {
              name: 'Incline Dumbbell Press',
              targetMuscle: 'Upper Chest',
              completedSets: [
                { weightKg: 28, reps: 10 },
                { weightKg: 28, reps: 10 },
                { weightKg: 28, reps: 8 },
              ],
            },
          ],
        },
        {
          id: 'log-3days',
          title: 'Pull Hypertrophy & V-Taper',
          date: new Date(now - dayMs * 3).toISOString(),
          durationSeconds: 2940,
          totalVolumeKg: 6080,
          completedSetsCount: 15,
          caloriesBurned: 390,
          rpeAverage: 8.0,
          exercises: [
            {
              name: 'Pull-Ups',
              targetMuscle: 'Lats',
              completedSets: [{ weightKg: 0, reps: 10 }, { weightKg: 0, reps: 8 }, { weightKg: 0, reps: 8 }],
            },
            {
              name: 'Barbell Bent-Over Row',
              targetMuscle: 'Mid-Back',
              completedSets: [{ weightKg: 65, reps: 10 }, { weightKg: 65, reps: 8 }, { weightKg: 65, reps: 8 }],
            },
          ],
        },
        {
          id: 'log-6days',
          title: 'Leg Day & Quad Hypertrophy',
          date: new Date(now - dayMs * 6).toISOString(),
          durationSeconds: 3400,
          totalVolumeKg: 7420,
          completedSetsCount: 17,
          caloriesBurned: 480,
          rpeAverage: 9.0,
          exercises: [
            {
              name: 'Barbell Back Squat',
              targetMuscle: 'Quads',
              completedSets: [
                { weightKg: 70, reps: 8, isWarmup: true },
                { weightKg: 100, reps: 8 },
                { weightKg: 105, reps: 6 },
                { weightKg: 105, reps: 6 },
              ],
            },
            {
              name: 'Romanian Deadlift',
              targetMuscle: 'Hamstrings',
              completedSets: [
                { weightKg: 80, reps: 10 },
                { weightKg: 85, reps: 8 },
                { weightKg: 85, reps: 8 },
              ],
            },
          ],
        },
        {
          id: 'log-9days',
          title: 'Upper Body Strength Overload',
          date: new Date(now - dayMs * 9).toISOString(),
          durationSeconds: 3000,
          totalVolumeKg: 6180,
          completedSetsCount: 15,
          caloriesBurned: 405,
          rpeAverage: 8.5,
          exercises: [
            {
              name: 'Overhead Press',
              targetMuscle: 'Shoulders',
              completedSets: [
                { weightKg: 45, reps: 8 },
                { weightKg: 50, reps: 6 },
                { weightKg: 50, reps: 6 },
              ],
            },
            {
              name: 'Close-Grip Bench Press',
              targetMuscle: 'Triceps',
              completedSets: [
                { weightKg: 60, reps: 10 },
                { weightKg: 65, reps: 8 },
                { weightKg: 65, reps: 8 },
              ],
            },
          ],
        },
        {
          id: 'log-12days',
          title: 'Lower Body & Posterior Chain',
          date: new Date(now - dayMs * 12).toISOString(),
          durationSeconds: 3180,
          totalVolumeKg: 6900,
          completedSetsCount: 16,
          caloriesBurned: 460,
          rpeAverage: 8.5,
          exercises: [
            {
              name: 'Conventional Deadlift',
              targetMuscle: 'Lower Back & Glutes',
              completedSets: [
                { weightKg: 100, reps: 6 },
                { weightKg: 120, reps: 5 },
                { weightKg: 120, reps: 5 },
              ],
            },
          ],
        },
        {
          id: 'log-16days',
          title: 'Push Hypertrophy Baseline',
          date: new Date(now - dayMs * 16).toISOString(),
          durationSeconds: 2880,
          totalVolumeKg: 5420,
          completedSetsCount: 14,
          caloriesBurned: 370,
          rpeAverage: 7.5,
          exercises: [
            {
              name: 'Barbell Flat Bench Press',
              targetMuscle: 'Chest',
              completedSets: [
                { weightKg: 70, reps: 8 },
                { weightKg: 72.5, reps: 6 },
                { weightKg: 72.5, reps: 6 },
              ],
            },
          ],
        },
      ];
    } catch {
      return [];
    }
  });

  // 5. Daily Diet
  const [dailyDiet, setDailyDiet] = useState<DailyDietLog>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIET);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === getTodayString()) {
          return parsed;
        }
      }
      return getInitialDiet(userProfile);
    } catch {
      return getInitialDiet(userProfile);
    }
  });

  // 6. Routine Items
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTINE);
      return saved ? JSON.parse(saved) : DEFAULT_DAILY_ROUTINE;
    } catch {
      return DEFAULT_DAILY_ROUTINE;
    }
  });

  // 7. Habits
  const [habits, setHabits] = useState<DailyHabit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  // 8. Supplements Tracker & Reminders
  const [supplements, setSupplements] = useState<SupplementItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLEMENTS);
      return saved ? JSON.parse(saved) : DEFAULT_SUPPLEMENTS;
    } catch {
      return DEFAULT_SUPPLEMENTS;
    }
  });

  // 9. Water Reminder Settings
  const [waterReminder, setWaterReminder] = useState<WaterReminderSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER_REMINDER);
      return saved ? JSON.parse(saved) : DEFAULT_WATER_REMINDER;
    } catch {
      return DEFAULT_WATER_REMINDER;
    }
  });

  // 9b. Workout Reminder Settings
  const [workoutReminder, setWorkoutReminder] = useState<WorkoutReminderSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT_REMINDER);
      return saved ? JSON.parse(saved) : DEFAULT_WORKOUT_REMINDER;
    } catch {
      return DEFAULT_WORKOUT_REMINDER;
    }
  });

  // 9c. Daily Nutrition & Meal Reminders
  const [mealReminders, setMealReminders] = useState<MealReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEAL_REMINDERS);
      return saved ? JSON.parse(saved) : DEFAULT_MEAL_REMINDERS;
    } catch {
      return DEFAULT_MEAL_REMINDERS;
    }
  });

  // 9d. In-App Notification Alerts & History
  const [activeInAppAlerts, setActiveInAppAlerts] = useState<InAppReminderAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IN_APP_ALERTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 10. Saved Personal Diet Plans & Active Plan
  const [savedDietPlans, setSavedDietPlans] = useState<PersonalDietPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIET_PLANS);
      if (saved) {
        const parsed: PersonalDietPlan[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingPresets = PRESET_DIET_PLANS.filter((p) => !existingIds.has(p.id));
        // Also ensure preset plans get the latest definitions
        const updatedParsed = parsed.map((p) => {
          const fresh = PRESET_DIET_PLANS.find((preset) => preset.id === p.id);
          return fresh || p;
        });
        return [...updatedParsed, ...missingPresets];
      }
      return PRESET_DIET_PLANS;
    } catch {
      return PRESET_DIET_PLANS;
    }
  });

  const [activeDietPlan, setActiveDietPlanState] = useState<PersonalDietPlan | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_DIET_PLAN);
      return saved ? JSON.parse(saved) : PRESET_DIET_PLANS[0];
    } catch {
      return PRESET_DIET_PLANS[0];
    }
  });

  // 11. Rest Timer (with offline persistence & time recovery)
  const [restTimer, setRestTimer] = useState<RestTimerState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REST_TIMER);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed || !parsed.active) return null;

      // If active and was not paused, calculate remaining seconds after page reload or network drop
      if (!parsed.isPaused && parsed.lastSavedAt) {
        const elapsedSinceSave = Math.floor((Date.now() - parsed.lastSavedAt) / 1000);
        const remaining = parsed.remainingSeconds - elapsedSinceSave;
        if (remaining <= 0) {
          localStorage.removeItem(STORAGE_KEYS.REST_TIMER);
          return null;
        }
        return {
          ...parsed,
          remainingSeconds: remaining,
        };
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Cloud Sync: Fetch user cloud data when logged in
  useEffect(() => {
    if (!currentUser) return;
    if ((currentUser as any).isLocal || !auth.currentUser) {
      setIsCloudSyncing(false);
      return;
    }
    const fetchUserData = async () => {
      setIsCloudSyncing(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.userProfile) setUserProfileState(data.userProfile);
          if (data.plans) setPlans(data.plans);
          if (data.workoutLogs) setWorkoutLogs(data.workoutLogs);
          if (data.dailyDiet && data.dailyDiet.date === getTodayString()) setDailyDiet(data.dailyDiet);
          if (data.routineItems) setRoutineItems(data.routineItems);
          if (data.habits) setHabits(data.habits);
          if (data.supplements) setSupplements(data.supplements);
          if (data.waterReminder) setWaterReminder(data.waterReminder);
          if (data.workoutReminder) setWorkoutReminder(data.workoutReminder);
          if (data.mealReminders) setMealReminders(data.mealReminders);
          if (data.savedDietPlans) setSavedDietPlans(data.savedDietPlans);
          if (data.activeDietPlan) setActiveDietPlanState(data.activeDietPlan);
        } else {
          // Initialize new cloud document for user
          await setDoc(userDocRef, {
            email: currentUser.email,
            displayName: currentUser.displayName || userProfile.name,
            userProfile: {
              ...userProfile,
              name: currentUser.displayName || userProfile.name,
            },
            plans,
            workoutLogs,
            dailyDiet,
            routineItems,
            habits,
            supplements,
            waterReminder,
            workoutReminder,
            mealReminders,
            savedDietPlans,
            activeDietPlan,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error loading Firestore data:', err);
      } finally {
        setIsCloudSyncing(false);
      }
    };
    fetchUserData();
  }, [currentUser?.uid]);

  // Save changes to localStorage & Cloud
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(activeWorkout));
  }, [activeWorkout]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(dailyDiet));
  }, [dailyDiet]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routineItems));
  }, [routineItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLEMENTS, JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER_REMINDER, JSON.stringify(waterReminder));
  }, [waterReminder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_REMINDER, JSON.stringify(workoutReminder));
  }, [workoutReminder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEAL_REMINDERS, JSON.stringify(mealReminders));
  }, [mealReminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IN_APP_ALERTS, JSON.stringify(activeInAppAlerts));
  }, [activeInAppAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DIET_PLANS, JSON.stringify(savedDietPlans));
  }, [savedDietPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DIET_PLAN, JSON.stringify(activeDietPlan));
  }, [activeDietPlan]);

  // Persist Rest Timer across reloads & offline drops
  useEffect(() => {
    if (restTimer && restTimer.active) {
      localStorage.setItem(
        STORAGE_KEYS.REST_TIMER,
        JSON.stringify({
          ...restTimer,
          lastSavedAt: Date.now(),
        })
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.REST_TIMER);
    }
  }, [restTimer]);

  // Periodic Hydration Reminder Check Loop
  useEffect(() => {
    if (!waterReminder.enabled) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (now >= waterReminder.nextReminderTimestamp) {
        if (waterReminder.soundAlert) {
          playWaterDropTone();
        }
        // Update next reminder target
        setWaterReminder((prev) => ({
          ...prev,
          nextReminderTimestamp: Date.now() + (prev.intervalMinutes || 60) * 60 * 1000,
        }));
      }
    }, 15000); // check every 15s

    return () => clearInterval(checkInterval);
  }, [waterReminder.enabled, waterReminder.intervalMinutes, waterReminder.nextReminderTimestamp, waterReminder.soundAlert]);

  // Scheduled Reminder Checking Loop (Workout & Nutrition)
  const dispatchedRemindersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const todayDateStr = now.toISOString().split('T')[0];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = dayNames[now.getDay()];
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      const current12Hour = formatTo12Hour(currentHours, currentMins);

      // 1. Check Workout Reminder
      if (workoutReminder.enabled && workoutReminder.workoutDays.includes(currentDay)) {
        // Main workout reminder
        const workoutKey = `${todayDateStr}_workout_${workoutReminder.scheduledTime}`;
        if (current12Hour === workoutReminder.scheduledTime && !dispatchedRemindersRef.current.has(workoutKey)) {
          dispatchedRemindersRef.current.add(workoutKey);

          if (workoutReminder.soundAlert) {
            playWorkoutReminderTone();
          }

          if (workoutReminder.browserNotification) {
            sendBrowserNotification('⚡ Time for Your Workout!', {
              body: `Scheduled session: ${workoutReminder.targetPlanTitle || 'PulseFit Workout'}. Let's crush today's goals!`,
              tag: 'workout-reminder',
            });
          }

          const newAlert: InAppReminderAlert = {
            id: `workout-${Date.now()}`,
            type: 'workout',
            title: 'Time for Your Workout! 🏋️',
            message: `Scheduled: ${workoutReminder.targetPlanTitle || 'Daily Workout Session'}. Time to train!`,
            timestamp: Date.now(),
            unread: true,
            actionType: 'start_workout',
          };

          setActiveInAppAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
        }

        // Pre-workout fuel reminder (e.g. 45 mins before)
        if (workoutReminder.preWorkoutFuelEnabled && workoutReminder.preWorkoutFuelReminderMins > 0) {
          const preFuelTime = getTimeWithMinutesOffset(workoutReminder.scheduledTime, workoutReminder.preWorkoutFuelReminderMins);
          const preFuelKey = `${todayDateStr}_prefuel_${preFuelTime}`;

          if (current12Hour === preFuelTime && !dispatchedRemindersRef.current.has(preFuelKey)) {
            dispatchedRemindersRef.current.add(preFuelKey);

            if (workoutReminder.soundAlert) {
              playMealReminderTone();
            }

            if (workoutReminder.browserNotification) {
              sendBrowserNotification('🥗 Pre-Workout Fuel Reminder', {
                body: `Workout starts in ${workoutReminder.preWorkoutFuelReminderMins} mins! Have your pre-workout carbs and hydrate.`,
                tag: 'prefuel-reminder',
              });
            }

            const newAlert: InAppReminderAlert = {
              id: `prefuel-${Date.now()}`,
              type: 'meal',
              title: 'Pre-Workout Fuel Window 🍌',
              message: `Workout starts in ${workoutReminder.preWorkoutFuelReminderMins} mins. Grab a light carb snack & 400ml water!`,
              timestamp: Date.now(),
              unread: true,
              mealType: 'snack',
              actionType: 'log_meal',
            };

            setActiveInAppAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
          }
        }

        // Warmup reminder (e.g. 15 mins before)
        if (workoutReminder.warmupEnabled && workoutReminder.warmupReminderMins > 0) {
          const warmupTime = getTimeWithMinutesOffset(workoutReminder.scheduledTime, workoutReminder.warmupReminderMins);
          const warmupKey = `${todayDateStr}_warmup_${warmupTime}`;

          if (current12Hour === warmupTime && !dispatchedRemindersRef.current.has(warmupKey)) {
            dispatchedRemindersRef.current.add(warmupKey);

            if (workoutReminder.soundAlert) {
              playWorkoutReminderTone();
            }

            if (workoutReminder.browserNotification) {
              sendBrowserNotification('🔥 Dynamic Warm-Up Starting', {
                body: `Workout starts in ${workoutReminder.warmupReminderMins} mins! Begin mobility & joint prep.`,
                tag: 'warmup-reminder',
              });
            }

            const newAlert: InAppReminderAlert = {
              id: `warmup-${Date.now()}`,
              type: 'workout',
              title: 'Dynamic Warm-Up Window 🔥',
              message: `Workout starts in ${workoutReminder.warmupReminderMins} mins. Prime your shoulders, hips & core!`,
              timestamp: Date.now(),
              unread: true,
              actionType: 'start_workout',
            };

            setActiveInAppAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
          }
        }
      }

      // 2. Check Daily Nutrition / Meal Reminders
      mealReminders.forEach((meal) => {
        if (!meal.enabled) return;
        const mealKey = `${todayDateStr}_meal_${meal.id}_${meal.time}`;

        if (current12Hour === meal.time && !dispatchedRemindersRef.current.has(mealKey)) {
          dispatchedRemindersRef.current.add(mealKey);

          // Check if already logged today
          const loggedMeal = dailyDiet.meals.find((m) => m.type === meal.mealType);
          const hasLoggedItems = loggedMeal && loggedMeal.items.length > 0;

          if (meal.soundAlert !== false) {
            playMealReminderTone();
          }

          if (meal.browserNotification !== false) {
            sendBrowserNotification(`🍽️ ${meal.label} Reminder`, {
              body: hasLoggedItems
                ? `You've logged ${meal.label}! Tap to review your daily macros & targets.`
                : (meal.reminderTip || `Time to log your ${meal.label} and hit your protein target!`),
              tag: `meal-${meal.id}`,
            });
          }

          const newAlert: InAppReminderAlert = {
            id: `meal-${meal.id}-${Date.now()}`,
            type: 'meal',
            title: `${meal.label} Check-In 🥑`,
            message: hasLoggedItems
              ? `You've logged ${meal.label} (${loggedMeal.totalCalories} kcal, ${loggedMeal.totalProtein}g protein). Check remaining goals!`
              : (meal.reminderTip || `Time to log your ${meal.label} and record today's calories & macros.`),
            timestamp: Date.now(),
            unread: true,
            mealType: meal.mealType,
            actionType: 'log_meal',
          };

          setActiveInAppAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
        }
      });
    };

    const interval = setInterval(checkSchedule, 15000); // 15s poll
    checkSchedule(); // initial check
    return () => clearInterval(interval);
  }, [workoutReminder, mealReminders, dailyDiet.meals]);

  // Auto-sync debounced to Cloud Firestore if logged in
  const syncToCloud = useCallback(async () => {
    if (!currentUser) return;
    if ((currentUser as any).isLocal || !auth.currentUser) {
      return;
    }
    try {
      setIsCloudSyncing(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userDocRef,
        {
          email: currentUser.email,
          userProfile,
          plans,
          workoutLogs,
          dailyDiet,
          routineItems,
          habits,
          supplements,
          waterReminder,
          workoutReminder,
          mealReminders,
          savedDietPlans,
          activeDietPlan,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Error auto-syncing to Firestore:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  }, [currentUser, userProfile, plans, workoutLogs, dailyDiet, routineItems, habits, supplements, waterReminder, workoutReminder, mealReminders, savedDietPlans, activeDietPlan]);

  // Auto-sync pending data when reconnecting to network
  useEffect(() => {
    const handleReconnected = () => {
      syncToCloud();
    };
    window.addEventListener('online', handleReconnected);
    return () => window.removeEventListener('online', handleReconnected);
  }, [syncToCloud]);

  // Active workout elapsed timer
  useEffect(() => {
    if (!activeWorkout || activeWorkout.isPaused) return;
    const interval = setInterval(() => {
      setActiveWorkout((prev) => {
        if (!prev || prev.isPaused) return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout?.isPaused, activeWorkout?.id]);

  // Rest Timer ticking with audio countdown
  useEffect(() => {
    if (!restTimer || !restTimer.active || restTimer.isPaused) return;

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (!prev || !prev.active || prev.isPaused) return prev;
        const nextRemaining = prev.remainingSeconds - 1;

        if (nextRemaining === 3 || nextRemaining === 2 || nextRemaining === 1) {
          playCountdownBeep(880, 0.08);
        } else if (nextRemaining <= 0) {
          playWorkStartTone();
          return null;
        }

        return {
          ...prev,
          remainingSeconds: nextRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer?.active, restTimer?.isPaused, restTimer?.remainingSeconds]);

  // Workout Actions
  const startWorkout = useCallback((plan: WorkoutPlan) => {
    playWorkStartTone();
    const clonedExercises = plan.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({ ...s, completed: false })),
    }));

    const newSession: ActiveWorkoutSession = {
      id: `session-${Date.now()}`,
      planId: plan.id,
      title: plan.title,
      startTime: Date.now(),
      elapsedSeconds: 0,
      isPaused: false,
      exercises: clonedExercises,
      notes: '',
      totalVolumeKg: 0,
      completedSetsCount: 0,
      activeExerciseIndex: 0,
      activeSetIndex: 0,
    };
    setActiveWorkout(newSession);
  }, []);

  const updateActiveWorkout = useCallback((updater: (prev: ActiveWorkoutSession | null) => ActiveWorkoutSession | null) => {
    setActiveWorkout(updater);
  }, []);

  const toggleSetCompleted = useCallback((exerciseIndex: number, setIndex: number) => {
    playClickFeedback();
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const targetEx = { ...updatedExercises[exerciseIndex] };
      const targetSets = [...targetEx.sets];
      const currentSet = targetSets[setIndex];

      const newCompleted = !currentSet.completed;
      targetSets[setIndex] = { ...currentSet, completed: newCompleted };
      targetEx.sets = targetSets;
      updatedExercises[exerciseIndex] = targetEx;

      let totalVolume = 0;
      let completedCount = 0;
      updatedExercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          if (s.completed && !s.isWarmup) {
            totalVolume += (s.weightKg || 0) * (s.reps || 0);
            completedCount += 1;
          }
        });
      });

      if (newCompleted) {
        const restDuration = currentSet.restSecondsAfter || targetEx.restSec || 60;
        if (restDuration > 0) {
          playRestStartTone();
          setRestTimer({
            active: true,
            remainingSeconds: restDuration,
            totalSeconds: restDuration,
            exerciseName: targetEx.name,
            isPaused: false,
          });
        }
      }

      return {
        ...prev,
        exercises: updatedExercises,
        totalVolumeKg: totalVolume,
        completedSetsCount: completedCount,
      };
    });
  }, []);

  const updateSetValues = useCallback(
    (exerciseIndex: number, setIndex: number, field: 'weightKg' | 'reps' | 'rpe', value: number) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const updatedExercises = [...prev.exercises];
        const targetEx = { ...updatedExercises[exerciseIndex] };
        const targetSets = [...targetEx.sets];
        targetSets[setIndex] = {
          ...targetSets[setIndex],
          [field]: Math.max(0, value),
        };
        targetEx.sets = targetSets;
        updatedExercises[exerciseIndex] = targetEx;

        let totalVolume = 0;
        updatedExercises.forEach((ex) => {
          ex.sets.forEach((s) => {
            if (s.completed && !s.isWarmup) {
              totalVolume += (s.weightKg || 0) * (s.reps || 0);
            }
          });
        });

        return {
          ...prev,
          exercises: updatedExercises,
          totalVolumeKg: totalVolume,
        };
      });
    },
    []
  );

  const addSetToExercise = useCallback((exerciseIndex: number) => {
    playClickFeedback();
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const targetEx = { ...updatedExercises[exerciseIndex] };
      const lastSet = targetEx.sets[targetEx.sets.length - 1];
      const newSetNumber = targetEx.sets.length + 1;

      targetEx.sets = [
        ...targetEx.sets,
        {
          id: `s-${Date.now()}-${newSetNumber}`,
          setNumber: newSetNumber,
          weightKg: lastSet ? lastSet.weightKg : 20,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
          isWarmup: false,
        },
      ];
      updatedExercises[exerciseIndex] = targetEx;
      return { ...prev, exercises: updatedExercises };
    });
  }, []);

  const removeSetFromExercise = useCallback((exerciseIndex: number, setIndex: number) => {
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const targetEx = { ...updatedExercises[exerciseIndex] };
      if (targetEx.sets.length <= 1) return prev;

      targetEx.sets = targetEx.sets
        .filter((_, idx) => idx !== setIndex)
        .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

      updatedExercises[exerciseIndex] = targetEx;
      return { ...prev, exercises: updatedExercises };
    });
  }, []);

  const addExerciseToWorkout = useCallback((exercise: Exercise) => {
    playClickFeedback();
    setActiveWorkout((prev) => {
      if (!prev) return null;
      const newExItem = {
        id: `we-${Date.now()}`,
        exerciseId: exercise.id,
        name: exercise.name,
        targetMuscle: exercise.targetMuscle,
        restSec: exercise.defaultRestSeconds || 60,
        formTip: exercise.formTips[0] || '',
        sets: Array.from({ length: exercise.defaultSets || 3 }).map((_, idx) => ({
          id: `s-${Date.now()}-${idx + 1}`,
          setNumber: idx + 1,
          weightKg: 20,
          reps: 10,
          completed: false,
        })),
      };
      return {
        ...prev,
        exercises: [...prev.exercises, newExItem],
      };
    });
  }, []);

  const finishWorkout = useCallback(() => {
    if (!activeWorkout) return;
    playVictoryFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const completedExercises = activeWorkout.exercises
      .map((ex) => ({
        name: ex.name,
        targetMuscle: ex.targetMuscle,
        completedSets: ex.sets
          .filter((s) => s.completed)
          .map((s) => ({ weightKg: s.weightKg, reps: s.reps, isWarmup: s.isWarmup })),
      }))
      .filter((ex) => ex.completedSets.length > 0);

    const estCalories = Math.round((activeWorkout.elapsedSeconds / 60) * 7.5);

    const newLog: CompletedWorkoutLog = {
      id: `log-${Date.now()}`,
      title: activeWorkout.title,
      date: new Date().toISOString(),
      durationSeconds: activeWorkout.elapsedSeconds,
      totalVolumeKg: activeWorkout.totalVolumeKg,
      completedSetsCount: activeWorkout.completedSetsCount,
      caloriesBurned: Math.max(80, estCalories),
      exercises: completedExercises,
      intensity: activeWorkout.intensity,
      notes: activeWorkout.notes,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);

    setUserProfileState((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastActiveDate: getTodayString(),
    }));

    setHabits((prev) =>
      prev.map((h) => (h.id === 'h1' ? { ...h, completed: true, currentCount: (h.currentCount || 0) + 1 } : h))
    );

    setActiveWorkout(null);
    setRestTimer(null);
  }, [activeWorkout]);

  const cancelActiveWorkout = useCallback(() => {
    setActiveWorkout(null);
    setRestTimer(null);
  }, []);

  const addWorkoutLog = useCallback((log: CompletedWorkoutLog) => {
    setWorkoutLogs((prev) => [log, ...prev]);
    setUserProfileState((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastActiveDate: getTodayString(),
    }));
  }, []);

  const saveWorkoutPlan = useCallback((newPlan: WorkoutPlan) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === newPlan.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newPlan;
        return next;
      }
      return [newPlan, ...prev];
    });
  }, []);

  const deleteWorkoutPlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  }, []);

  // Rest Timer Controls
  const startRestTimer = useCallback((seconds: number, exerciseName?: string) => {
    playRestStartTone();
    setRestTimer({
      active: true,
      remainingSeconds: seconds,
      totalSeconds: seconds,
      exerciseName,
      isPaused: false,
    });
  }, []);

  const pauseResumeRestTimer = useCallback(() => {
    setRestTimer((prev) => (prev ? { ...prev, isPaused: !prev.isPaused } : null));
  }, []);

  const adjustRestTimer = useCallback((deltaSeconds: number) => {
    setRestTimer((prev) => {
      if (!prev) return null;
      const nextVal = Math.max(5, prev.remainingSeconds + deltaSeconds);
      return {
        ...prev,
        remainingSeconds: nextVal,
        totalSeconds: Math.max(prev.totalSeconds, nextVal),
      };
    });
  }, []);

  const stopRestTimer = useCallback(() => {
    setRestTimer(null);
  }, []);

  // Diet Controls
  const logFoodItem = useCallback((mealType: MealType, food: FoodItem) => {
    playClickFeedback();
    setDailyDiet((prev) => {
      const existingMealIdx = prev.meals.findIndex((m) => m.mealType === mealType);
      let updatedMeals = [...prev.meals];

      if (existingMealIdx >= 0) {
        const targetMeal = { ...updatedMeals[existingMealIdx] };
        targetMeal.items = [...targetMeal.items, food];
        targetMeal.totalCalories += food.calories;
        targetMeal.totalProtein = Number((targetMeal.totalProtein + food.proteinGrams).toFixed(1));
        targetMeal.totalCarbs = Number((targetMeal.totalCarbs + food.carbsGrams).toFixed(1));
        targetMeal.totalFats = Number((targetMeal.totalFats + food.fatsGrams).toFixed(1));
        updatedMeals[existingMealIdx] = targetMeal;
      } else {
        updatedMeals.push({
          id: `meal-${Date.now()}`,
          mealType,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          items: [food],
          totalCalories: food.calories,
          totalProtein: food.proteinGrams,
          totalCarbs: food.carbsGrams,
          totalFats: food.fatsGrams,
        });
      }

      const totalProteinNow = updatedMeals.reduce((acc, m) => acc + m.totalProtein, 0);
      if (totalProteinNow >= prev.proteinGoalGrams) {
        setHabits((hPrev) =>
          hPrev.map((h) => (h.id === 'h2' ? { ...h, completed: true, currentCount: totalProteinNow } : h))
        );
      }

      return {
        ...prev,
        meals: updatedMeals,
      };
    });
  }, []);

  const removeFoodItem = useCallback((mealType: MealType, foodId: string) => {
    setDailyDiet((prev) => {
      const updatedMeals = prev.meals
        .map((m) => {
          if (m.mealType !== mealType) return m;
          const filteredItems = m.items.filter((item) => item.id !== foodId);
          const cals = filteredItems.reduce((acc, it) => acc + it.calories, 0);
          const pro = Number(filteredItems.reduce((acc, it) => acc + it.proteinGrams, 0).toFixed(1));
          const carbs = Number(filteredItems.reduce((acc, it) => acc + it.carbsGrams, 0).toFixed(1));
          const fats = Number(filteredItems.reduce((acc, it) => acc + it.fatsGrams, 0).toFixed(1));
          return {
            ...m,
            items: filteredItems,
            totalCalories: cals,
            totalProtein: pro,
            totalCarbs: carbs,
            totalFats: fats,
          };
        })
        .filter((m) => m.items.length > 0);

      return {
        ...prev,
        meals: updatedMeals,
      };
    });
  }, []);

  const addWater = useCallback((amountMl: number, containerLabel?: string, containerType?: string) => {
    if (amountMl > 0) {
      playWaterDropTone();
    } else {
      playClickFeedback();
    }
    setDailyDiet((prev) => {
      const newWater = Math.max(0, prev.waterMl + amountMl);
      if (newWater >= prev.waterGoalMl && prev.waterMl < prev.waterGoalMl) {
        confetti({ particleCount: 50, spread: 60 });
        playVictoryFanfare();
      }
      setHabits((hPrev) =>
        hPrev.map((h) =>
          h.id === 'h3' ? { ...h, currentCount: newWater, completed: newWater >= prev.waterGoalMl } : h
        )
      );

      const existingLogs = prev.waterLogs || [];
      let updatedLogs = [...existingLogs];
      if (amountMl > 0) {
        const newEntry: WaterLogEntry = {
          id: `wlog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amountMl,
          containerType: (containerType as any) || 'custom',
          containerLabel: containerLabel || `${amountMl}ml Container`,
        };
        updatedLogs = [newEntry, ...updatedLogs];
      } else if (amountMl < 0 && updatedLogs.length > 0) {
        updatedLogs = updatedLogs.slice(1);
      }

      return { ...prev, waterMl: newWater, waterLogs: updatedLogs };
    });
  }, []);

  const removeWaterLog = useCallback((logId: string) => {
    playClickFeedback();
    setDailyDiet((prev) => {
      const existingLogs = prev.waterLogs || [];
      const target = existingLogs.find((l) => l.id === logId);
      if (!target) return prev;
      const newWater = Math.max(0, prev.waterMl - target.amountMl);
      const updatedLogs = existingLogs.filter((l) => l.id !== logId);

      setHabits((hPrev) =>
        hPrev.map((h) =>
          h.id === 'h3' ? { ...h, currentCount: newWater, completed: newWater >= prev.waterGoalMl } : h
        )
      );

      return {
        ...prev,
        waterMl: newWater,
        waterLogs: updatedLogs,
      };
    });
  }, []);

  const resetDailyWater = useCallback(() => {
    playClickFeedback();
    setDailyDiet((prev) => {
      setHabits((hPrev) =>
        hPrev.map((h) =>
          h.id === 'h3' ? { ...h, currentCount: 0, completed: false } : h
        )
      );
      return {
        ...prev,
        waterMl: 0,
        waterLogs: [],
      };
    });
  }, []);

  const setWaterGoal = useCallback((amountMl: number) => {
    setDailyDiet((prev) => ({ ...prev, waterGoalMl: amountMl }));
  }, []);

  const setMacroGoals = useCallback((calories: number, protein: number, carbs: number, fats: number) => {
    setDailyDiet((prev) => ({
      ...prev,
      calorieGoal: calories,
      proteinGoalGrams: protein,
      carbsGoalGrams: carbs,
      fatsGoalGrams: fats,
    }));
    setUserProfileState((prev) => ({
      ...prev,
      dailyCalorieTarget: calories,
      dailyProteinTarget: protein,
      dailyCarbsTarget: carbs,
      dailyFatsTarget: fats,
    }));
  }, []);

  // Water Reminder Controls
  const updateWaterReminderSettings = useCallback((settings: Partial<WaterReminderSettings>) => {
    playClickFeedback();
    setWaterReminder((prev) => {
      const updated = { ...prev, ...settings };
      if (settings.intervalMinutes && settings.intervalMinutes !== prev.intervalMinutes) {
        updated.nextReminderTimestamp = Date.now() + settings.intervalMinutes * 60 * 1000;
      }
      return updated;
    });
  }, []);

  const triggerWaterReminderAlert = useCallback(() => {
    playWaterDropTone();
    confetti({ particleCount: 30, spread: 50, colors: ['#38bdf8', '#0284c7', '#bae6fd'] });
  }, []);

  // Workout & Nutrition Scheduled Reminder Controls
  const updateWorkoutReminder = useCallback((settings: Partial<WorkoutReminderSettings>) => {
    playClickFeedback();
    setWorkoutReminder((prev) => ({ ...prev, ...settings }));
  }, []);

  const updateMealReminder = useCallback((id: string, updates: Partial<MealReminderItem>) => {
    playClickFeedback();
    setMealReminders((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const toggleMealReminder = useCallback((id: string) => {
    playClickFeedback();
    setMealReminders((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  }, []);

  const addMealReminder = useCallback((reminder: Omit<MealReminderItem, 'id'>) => {
    playClickFeedback();
    const newItem: MealReminderItem = {
      ...reminder,
      id: `meal-${Date.now()}`,
    };
    setMealReminders((prev) => [...prev, newItem]);
  }, []);

  const deleteMealReminder = useCallback((id: string) => {
    playClickFeedback();
    setMealReminders((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    playClickFeedback();
    setActiveInAppAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    playClickFeedback();
    setActiveInAppAlerts([]);
  }, []);

  const triggerTestReminder = useCallback((type: 'workout' | 'meal', customMealType?: MealType) => {
    if (type === 'workout') {
      playWorkoutReminderTone();
      sendBrowserNotification('⚡ Workout Reminder (Test Alert)', {
        body: `Scheduled session: ${workoutReminder.targetPlanTitle || 'Push Power Hypertrophy'}. Ready to train!`,
        tag: 'test-workout',
      });
      const alert: InAppReminderAlert = {
        id: `test-workout-${Date.now()}`,
        type: 'workout',
        title: 'Workout Reminder (Test) 🏋️',
        message: `It's time for your ${workoutReminder.targetPlanTitle || 'PulseFit Workout'}! Notification and audio chime verified successfully.`,
        timestamp: Date.now(),
        unread: true,
        actionType: 'start_workout',
      };
      setActiveInAppAlerts((prev) => [alert, ...prev.slice(0, 19)]);
    } else {
      playMealReminderTone();
      const mType = customMealType || 'lunch';
      const mLabel = mType.charAt(0).toUpperCase() + mType.slice(1);
      sendBrowserNotification(`🍽️ Nutrition Log Reminder (${mLabel})`, {
        body: `Time to log your ${mLabel} and hit today's calorie & protein targets!`,
        tag: 'test-meal',
      });
      const alert: InAppReminderAlert = {
        id: `test-meal-${Date.now()}`,
        type: 'meal',
        title: `Daily Nutrition: ${mLabel} (Test) 🥑`,
        message: `Time to log your ${mLabel}! Nutrition notification chime and tracker verified successfully.`,
        timestamp: Date.now(),
        unread: true,
        mealType: mType,
        actionType: 'log_meal',
      };
      setActiveInAppAlerts((prev) => [alert, ...prev.slice(0, 19)]);
    }
  }, [workoutReminder]);

  // Supplement Controls
  const toggleSupplementTaken = useCallback((id: string) => {
    setSupplements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextTaken = !item.taken;
          if (nextTaken) {
            playSupplementTone();
            confetti({ particleCount: 35, spread: 55, colors: ['#a855f7', '#ec4899', '#f43f5e'] });
          } else {
            playClickFeedback();
          }
          return { ...item, taken: nextTaken };
        }
        return item;
      })
    );
  }, []);

  const addSupplement = useCallback((item: Omit<SupplementItem, 'id'>) => {
    playClickFeedback();
    const newItem: SupplementItem = {
      ...item,
      id: `supp-${Date.now()}`,
    };
    setSupplements((prev) => [newItem, ...prev]);
  }, []);

  const deleteSupplement = useCallback((id: string) => {
    playClickFeedback();
    setSupplements((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleSupplementReminder = useCallback((id: string) => {
    playClickFeedback();
    setSupplements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reminderEnabled: !item.reminderEnabled } : item))
    );
  }, []);

  // Personal Diet Plan Controls
  const setActiveDietPlan = useCallback((plan: PersonalDietPlan | null) => {
    playClickFeedback();
    setActiveDietPlanState(plan);
  }, []);

  const savePersonalDietPlan = useCallback((newPlan: PersonalDietPlan) => {
    playClickFeedback();
    setSavedDietPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === newPlan.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newPlan;
        return next;
      }
      return [newPlan, ...prev];
    });
    setActiveDietPlanState(newPlan);
  }, []);

  const deletePersonalDietPlan = useCallback((planId: string) => {
    playClickFeedback();
    setSavedDietPlans((prev) => prev.filter((p) => p.id !== planId));
    setActiveDietPlanState((prev) => (prev?.id === planId ? null : prev));
  }, []);

  const applyDietPlanToDailyLog = useCallback((plan: PersonalDietPlan) => {
    playVictoryFanfare();
    confetti({ particleCount: 60, spread: 70 });
    
    // Set daily macro targets according to diet plan
    setMacroGoals(
      plan.dailyCalories,
      plan.macros.proteinGrams,
      plan.macros.carbsGrams,
      plan.macros.fatsGrams
    );

    if (plan.waterTargetMl) {
      setWaterGoal(plan.waterTargetMl);
    }

    // Convert plan meals to daily logged meals
    const newMeals = plan.meals.map((m, idx) => {
      const totalCals = m.items.reduce((acc, it) => acc + it.calories, 0);
      const totalPro = Number(m.items.reduce((acc, it) => acc + it.proteinGrams, 0).toFixed(1));
      const totalCarb = Number(m.items.reduce((acc, it) => acc + it.carbsGrams, 0).toFixed(1));
      const totalFat = Number(m.items.reduce((acc, it) => acc + it.fatsGrams, 0).toFixed(1));

      return {
        id: `plan-meal-${Date.now()}-${idx}`,
        mealType: m.mealType,
        time: m.suggestedTime || '08:00 AM',
        items: m.items,
        totalCalories: totalCals,
        totalProtein: totalPro,
        totalCarbs: totalCarb,
        totalFats: totalFat,
        notes: m.prepTips,
      };
    });

    setDailyDiet((prev) => ({
      ...prev,
      calorieGoal: plan.dailyCalories,
      proteinGoalGrams: plan.macros.proteinGrams,
      carbsGoalGrams: plan.macros.carbsGrams,
      fatsGoalGrams: plan.macros.fatsGrams,
      waterGoalMl: plan.waterTargetMl || prev.waterGoalMl,
      meals: newMeals,
    }));
  }, [setMacroGoals, setWaterGoal]);

  // Routine & Habit controls
  const toggleRoutineItem = useCallback((id: string) => {
    playClickFeedback();
    setRoutineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }, []);

  const addRoutineItem = useCallback((item: Omit<RoutineItem, 'id'>) => {
    const newItem: RoutineItem = {
      ...item,
      id: `routine-${Date.now()}`,
    };
    setRoutineItems((prev) => [...prev, newItem]);
  }, []);

  const deleteRoutineItem = useCallback((id: string) => {
    setRoutineItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleHabit = useCallback((id: string) => {
    playClickFeedback();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed;
          if (nextCompleted) confetti({ particleCount: 40, spread: 50 });
          return {
            ...h,
            completed: nextCompleted,
            streakDays: nextCompleted ? h.streakDays + 1 : Math.max(0, h.streakDays - 1),
          };
        }
        return h;
      })
    );
  }, []);

  const updateHabitProgress = useCallback((id: string, current: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const isComplete = h.targetCount ? current >= h.targetCount : false;
          return { ...h, currentCount: current, completed: isComplete };
        }
        return h;
      })
    );
  }, []);

  const updateUserProfile = useCallback((profileUpdates: Partial<UserProfile>) => {
    setUserProfileState((prev) => ({ ...prev, ...profileUpdates }));
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.clear();
    setPlans(PRESET_WORKOUT_PLANS);
    setWorkoutLogs([]);
    setDailyDiet(getInitialDiet(INITIAL_PROFILE));
    setRoutineItems(DEFAULT_DAILY_ROUTINE);
    setHabits(DEFAULT_HABITS);
    setSupplements(DEFAULT_SUPPLEMENTS);
    setWaterReminder(DEFAULT_WATER_REMINDER);
    setWorkoutReminder(DEFAULT_WORKOUT_REMINDER);
    setMealReminders(DEFAULT_MEAL_REMINDERS);
    setActiveInAppAlerts([]);
    setSavedDietPlans(PRESET_DIET_PLANS);
    setActiveDietPlanState(PRESET_DIET_PLANS[0]);
    setUserProfileState(INITIAL_PROFILE);
    setActiveWorkout(null);
    setRestTimer(null);
  }, []);

  const exportUserData = useCallback(() => {
    const data = {
      userProfile,
      plans,
      workoutLogs,
      dailyDiet,
      routineItems,
      habits,
      supplements,
      waterReminder,
      workoutReminder,
      mealReminders,
      savedDietPlans,
      activeDietPlan,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [userProfile, plans, workoutLogs, dailyDiet, routineItems, habits, supplements, waterReminder, workoutReminder, mealReminders, savedDietPlans, activeDietPlan]);

  const importUserData = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.userProfile) setUserProfileState(parsed.userProfile);
      if (parsed.plans) setPlans(parsed.plans);
      if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
      if (parsed.dailyDiet) setDailyDiet(parsed.dailyDiet);
      if (parsed.routineItems) setRoutineItems(parsed.routineItems);
      if (parsed.habits) setHabits(parsed.habits);
      if (parsed.supplements) setSupplements(parsed.supplements);
      if (parsed.waterReminder) setWaterReminder(parsed.waterReminder);
      if (parsed.workoutReminder) setWorkoutReminder(parsed.workoutReminder);
      if (parsed.mealReminders) setMealReminders(parsed.mealReminders);
      if (parsed.savedDietPlans) setSavedDietPlans(parsed.savedDietPlans);
      if (parsed.activeDietPlan) setActiveDietPlanState(parsed.activeDietPlan);
      return true;
    } catch (e) {
      console.error('Failed to import user data:', e);
      return false;
    }
  }, []);

  return (
    <FitnessContext.Provider
      value={{
        plans,
        exercises: EXERCISE_DATABASE,
        activeWorkout,
        workoutLogs,
        dailyDiet,
        routineItems,
        habits,
        supplements,
        waterReminder,
        workoutReminder,
        mealReminders,
        activeInAppAlerts,
        savedDietPlans,
        activeDietPlan,
        userProfile,
        restTimer,
        selectedDate,
        isCloudSyncing,

        startWorkout,
        updateActiveWorkout,
        toggleSetCompleted,
        updateSetValues,
        addSetToExercise,
        removeSetFromExercise,
        addExerciseToWorkout,
        finishWorkout,
        cancelActiveWorkout,
        saveWorkoutPlan,
        deleteWorkoutPlan,
        addWorkoutLog,

        startRestTimer,
        pauseResumeRestTimer,
        adjustRestTimer,
        stopRestTimer,

        logFoodItem,
        removeFoodItem,
        addWater,
        removeWaterLog,
        resetDailyWater,
        setWaterGoal,
        setMacroGoals,

        updateWaterReminderSettings,
        triggerWaterReminderAlert,

        updateWorkoutReminder,
        updateMealReminder,
        toggleMealReminder,
        addMealReminder,
        deleteMealReminder,
        dismissAlert,
        clearAllAlerts,
        triggerTestReminder,

        toggleSupplementTaken,
        addSupplement,
        deleteSupplement,
        toggleSupplementReminder,

        setActiveDietPlan,
        savePersonalDietPlan,
        deletePersonalDietPlan,
        applyDietPlanToDailyLog,

        toggleRoutineItem,
        addRoutineItem,
        deleteRoutineItem,
        toggleHabit,
        updateHabitProgress,

        updateUserProfile,
        setSelectedDate,
        resetAllData,
        importUserData,
        exportUserData,
        syncToCloud,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
