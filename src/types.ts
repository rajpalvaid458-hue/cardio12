export type FitnessGoal = 
  | 'muscle_gain' 
  | 'fat_loss' 
  | 'strength' 
  | 'endurance' 
  | 'recomposition' 
  | 'general_health';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Shoulders' 
  | 'Biceps' 
  | 'Triceps' 
  | 'Quadriceps' 
  | 'Hamstrings' 
  | 'Glutes' 
  | 'Calves' 
  | 'Core & Abs' 
  | 'Cardio & HIIT'
  | 'Cardio'
  | 'Zumba & Dance'
  | 'Swimming & Aquatics'
  | 'Calisthenics & Bodyweight'
  | 'Yoga & Mobility'
  | 'Pilates & Core'
  | 'Boxing & Martial Arts'
  | 'CrossFit & Functional'
  | 'Full Body';

export type TrainingDiscipline = 
  | 'All'
  | 'Weights & Strength'
  | 'Cardio & HIIT'
  | 'Zumba & Dance'
  | 'Swimming'
  | 'Calisthenics'
  | 'Yoga & Mobility'
  | 'Pilates'
  | 'Boxing & Combat'
  | 'CrossFit & Functional';

export type EquipmentType = 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Machine' 
  | 'Cable' 
  | 'Bodyweight' 
  | 'Kettlebell' 
  | 'Bands' 
  | 'Cardio' 
  | 'Pool' 
  | 'Dance Floor' 
  | 'Mat' 
  | 'Heavy Bag' 
  | 'Other';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  discipline?: TrainingDiscipline;
  equipment: EquipmentType;
  targetMuscle: string;
  secondaryMuscles?: string[];
  instructions: string[];
  formTips: string[];
  defaultSets: number;
  defaultReps: string;
  defaultRestSeconds: number;
  caloriesBurnedPerMin?: number;
  videoPlaceholderUrl?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restSecondsAfter?: number;
  isWarmup?: boolean;
}

export interface WorkoutExerciseItem {
  id: string;
  exerciseId?: string;
  name: string;
  targetMuscle: string;
  category?: MuscleGroup | string;
  equipment?: string;
  instructions?: string[];
  sets: WorkoutSet[];
  notes?: string;
  restSec: number;
  formTip?: string;
  formTips?: string[];
  defaultSets?: number;
  defaultReps?: string | number;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  splitType: string;
  level?: FitnessLevel;
  durationMinutes: number;
  daysPerWeek?: number;
  description: string;
  exercises: WorkoutExerciseItem[];
  tags: string[];
}

export interface ActiveWorkoutSession {
  id: string;
  planId?: string;
  title: string;
  startTime: number;
  elapsedSeconds: number;
  isPaused: boolean;
  exercises: WorkoutExerciseItem[];
  notes: string;
  totalVolumeKg: number;
  completedSetsCount: number;
  activeExerciseIndex: number;
  activeSetIndex: number;
}

export interface CompletedWorkoutLog {
  id: string;
  title: string;
  date: string; // ISO string
  durationSeconds: number;
  totalVolumeKg: number;
  completedSetsCount: number;
  caloriesBurned: number;
  exercises: {
    name: string;
    targetMuscle: string;
    completedSets: { weightKg: number; reps: number; isWarmup?: boolean }[];
  }[];
  rpeAverage?: number;
  notes?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams?: number;
  isCustom?: boolean;
}

export interface LoggedMeal {
  id: string;
  mealType: MealType;
  time: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  notes?: string;
}

export interface DailyDietLog {
  date: string; // YYYY-MM-DD
  meals: LoggedMeal[];
  waterMl: number;
  waterGoalMl: number;
  calorieGoal: number;
  proteinGoalGrams: number;
  carbsGoalGrams: number;
  fatsGoalGrams: number;
}

export type RoutineCategory = 'morning' | 'preworkout' | 'workout' | 'postworkout' | 'evening' | 'habit';

export interface RoutineItem {
  id: string;
  time: string; // e.g. "07:00 AM"
  title: string;
  description: string;
  category: RoutineCategory;
  durationMins: number;
  completed: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface DailyHabit {
  id: string;
  title: string;
  targetCount?: number;
  currentCount?: number;
  unit?: string;
  completed: boolean;
  iconName: string;
  streakDays: number;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatsTarget: number;
  dailyWaterTargetMl: number;
  weightUnit: 'kg' | 'lbs';
  streakDays: number;
  lastActiveDate: string;
}

export interface TimerSettings {
  mode: 'rest' | 'stopwatch' | 'hiit' | 'tabata' | 'emom';
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  prepareSeconds: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  quickActions?: string[];
}
