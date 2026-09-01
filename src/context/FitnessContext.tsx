import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
} from '../types';
import {
  PRESET_WORKOUT_PLANS,
  EXERCISE_DATABASE,
  POPULAR_FOODS_DATABASE,
  DEFAULT_DAILY_ROUTINE,
  DEFAULT_HABITS,
} from '../data/fitnessPresets';
import {
  playCountdownBeep,
  playWorkStartTone,
  playRestStartTone,
  playVictoryFanfare,
  playClickFeedback,
} from '../utils/audio';
import confetti from 'canvas-confetti';

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
  userProfile: UserProfile;
  restTimer: RestTimerState | null;
  selectedDate: string;

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

  // Actions - Rest Timer
  startRestTimer: (seconds: number, exerciseName?: string) => void;
  pauseResumeRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  stopRestTimer: () => void;

  // Actions - Diet
  logFoodItem: (mealType: MealType, food: FoodItem) => void;
  removeFoodItem: (mealType: MealType, foodId: string) => void;
  addWater: (amountMl: number) => void;
  setWaterGoal: (amountMl: number) => void;
  setMacroGoals: (calories: number, protein: number, carbs: number, fats: number) => void;

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
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLANS: 'pulsefit_plans_v1',
  LOGS: 'pulsefit_logs_v1',
  DIET: 'pulsefit_diet_v1',
  ROUTINE: 'pulsefit_routine_v1',
  HABITS: 'pulsefit_habits_v1',
  PROFILE: 'pulsefit_profile_v1',
  ACTIVE_WORKOUT: 'pulsefit_active_workout_v1',
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
  calorieGoal: profile.dailyCalorieTarget || 2650,
  proteinGoalGrams: profile.dailyProteinTarget || 165,
  carbsGoalGrams: profile.dailyCarbsTarget || 290,
  fatsGoalGrams: profile.dailyFatsTarget || 70,
});

export const FitnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      return saved ? JSON.parse(saved) : PRESET_WORKOUT_PLANS;
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
      if (saved) return JSON.parse(saved);
      // Starter logs for realistic progress visualization
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString();
      return [
        {
          id: 'log-yesterday',
          title: 'Push Power & Hypertrophy',
          date: yesterday,
          durationSeconds: 3120, // 52 mins
          totalVolumeKg: 6420,
          completedSetsCount: 16,
          caloriesBurned: 410,
          exercises: [
            {
              name: 'Barbell Flat Bench Press',
              targetMuscle: 'Chest',
              completedSets: [
                { weightKg: 60, reps: 8, isWarmup: true },
                { weightKg: 75, reps: 6 },
                { weightKg: 75, reps: 6 },
                { weightKg: 75, reps: 6 },
              ],
            },
            {
              name: 'Incline Dumbbell Press',
              targetMuscle: 'Upper Chest',
              completedSets: [
                { weightKg: 26, reps: 10 },
                { weightKg: 26, reps: 10 },
                { weightKg: 26, reps: 8 },
              ],
            },
          ],
        },
        {
          id: 'log-3days',
          title: 'Pull Hypertrophy & V-Taper',
          date: threeDaysAgo,
          durationSeconds: 2880,
          totalVolumeKg: 5800,
          completedSetsCount: 15,
          caloriesBurned: 380,
          exercises: [
            {
              name: 'Pull-Ups',
              targetMuscle: 'Lats',
              completedSets: [{ weightKg: 0, reps: 8 }, { weightKg: 0, reps: 8 }, { weightKg: 0, reps: 6 }],
            },
            {
              name: 'Barbell Bent-Over Row',
              targetMuscle: 'Mid-Back',
              completedSets: [{ weightKg: 60, reps: 10 }, { weightKg: 60, reps: 10 }, { weightKg: 60, reps: 8 }],
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

  // 8. Rest Timer
  const [restTimer, setRestTimer] = useState<RestTimerState | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Save changes to localStorage
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
          return null; // timer finished
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

      // Recalculate stats
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

      // If set just got completed, auto-trigger rest timer!
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
      if (targetEx.sets.length <= 1) return prev; // keep at least 1 set

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
      notes: activeWorkout.notes,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);

    // Update streak and routine habits
    setUserProfileState((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastActiveDate: getTodayString(),
    }));

    // Mark daily workout habit as completed
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

      // Check if total protein hit goal
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

  const addWater = useCallback((amountMl: number) => {
    playClickFeedback();
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
      return { ...prev, waterMl: newWater };
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
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [userProfile, plans, workoutLogs, dailyDiet, routineItems, habits]);

  const importUserData = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.userProfile) setUserProfileState(parsed.userProfile);
      if (parsed.plans) setPlans(parsed.plans);
      if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
      if (parsed.dailyDiet) setDailyDiet(parsed.dailyDiet);
      if (parsed.routineItems) setRoutineItems(parsed.routineItems);
      if (parsed.habits) setHabits(parsed.habits);
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
        userProfile,
        restTimer,
        selectedDate,

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

        startRestTimer,
        pauseResumeRestTimer,
        adjustRestTimer,
        stopRestTimer,

        logFoodItem,
        removeFoodItem,
        addWater,
        setWaterGoal,
        setMacroGoals,

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
