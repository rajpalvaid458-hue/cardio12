export type FitnessGoal = 
  | 'muscle_gain' 
  | 'fat_loss' 
  | 'strength' 
  | 'endurance' 
  | 'recomposition' 
  | 'general_health';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'athlete';

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
  imageUrl?: string;
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
  imageUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  splitType: string;
  level?: FitnessLevel;
  targetGender?: 'all' | 'female' | 'male';
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

export type FoodCuisine = 'Indian' | 'International' | 'Universal';

export type FoodCategory = 
  | 'High Protein'
  | 'Lentils & Pulses'
  | 'Dairy & Paneer'
  | 'Poultry & Meat'
  | 'Seafood'
  | 'Grains & Carbs'
  | 'Fruits & Veggies'
  | 'Nuts & Healthy Fats'
  | 'Supplements & Shakes'
  | 'Traditional Indian Meals'
  | 'Healthy Bowls & Salads';

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  cuisine?: FoodCuisine;
  category?: FoodCategory;
  servingSize: string;
  servingUnitWeightGrams?: number; // Base weight in grams for portion scaling
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams?: number;
  isCustom?: boolean;
  benefits?: string;
  dietPreference?: 'veg' | 'non_veg' | 'vegan' | 'eggetarian';
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

export interface SupplementItem {
  id: string;
  name: string;
  hindiName?: string;
  dosage: string;
  timing: string; // e.g. "Morning with Breakfast", "30m Pre-Workout", "Post-Workout", "Bedtime"
  timingLabel: 'Morning' | 'Pre-Workout' | 'Post-Workout' | 'Lunch' | 'Dinner' | 'Bedtime';
  timeSchedule: string; // e.g. "08:00 AM"
  taken: boolean;
  reminderEnabled: boolean;
  benefit: string;
  category: 'performance' | 'recovery' | 'vitality' | 'joint_health' | 'sleep';
  iconType?: string;
}

export interface WaterLogEntry {
  id: string;
  timestamp: number;
  timeString: string;
  amountMl: number;
  containerType: 'small_glass' | 'glass' | 'mug' | 'shaker' | 'bottle' | 'jug' | 'gallon' | 'custom';
  containerLabel: string;
}

export interface WaterReminderSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g. 30, 45, 60, 90, 120
  soundAlert: boolean;
  dailyGoalMl: number;
  nextReminderTimestamp: number;
  remindBetweenStart: string; // "07:00 AM"
  remindBetweenEnd: string; // "10:00 PM"
}

export interface WorkoutReminderSettings {
  enabled: boolean;
  scheduledTime: string; // e.g. "06:00 PM" or "07:00 AM"
  workoutDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  preWorkoutFuelReminderMins: number; // e.g. 45 mins before
  preWorkoutFuelEnabled: boolean;
  warmupReminderMins: number; // e.g. 15 mins before
  warmupEnabled: boolean;
  soundAlert: boolean;
  browserNotification?: boolean;
  targetPlanTitle?: string;
  notes?: string;
}

export interface MealReminderItem {
  id: string;
  mealType: MealType;
  label: string;
  time: string; // e.g. "08:30 AM"
  enabled: boolean;
  soundAlert?: boolean;
  browserNotification?: boolean;
  suggestedCalories?: number;
  suggestedProteinGrams?: number;
  reminderTip?: string;
}

export interface PostureStretchReminderSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g. 45, 60, 90
  soundAlert: boolean;
  workHoursStart: string; // "09:00 AM"
  workHoursEnd: string; // "07:00 PM"
  lastAlertTimestamp: number;
}

export interface SleepReminderSettings {
  enabled: boolean;
  targetBedtime: string; // "10:30 PM"
  windDownMinutesBefore: number; // 45 mins before
  targetWakeTime: string; // "06:30 AM"
  targetSleepHours: number; // 8.0
  soundAlert: boolean;
  magnesiumSuppReminder: boolean;
  screenOffReminder: boolean;
}

export interface InAppReminderAlert {
  id: string;
  type: 'water' | 'supplement' | 'workout' | 'meal' | 'stretch' | 'sleep';
  title: string;
  message: string;
  timestamp: number;
  unread?: boolean;
  mealType?: MealType;
  actionType?: 'log_water' | 'mark_supplement' | 'start_workout' | 'log_meal' | 'do_stretch';
  actionData?: any;
}

export interface PersonalDietPlan {
  id: string;
  title: string;
  tagline: string;
  goal: FitnessGoal;
  targetGender?: 'all' | 'female' | 'male';
  targetLevel?: FitnessLevel;
  cuisine: 'Indian' | 'International' | 'Fusion';
  dietType: 'pure_veg' | 'non_veg' | 'vegan' | 'eggetarian' | 'jain' | 'keto' | 'high_protein';
  dietTypeLabel: string;
  wheyOption?: 'with_whey' | 'without_whey' | 'with_plant_protein' | 'zero_powders';
  isVeg?: boolean;
  isVegan?: boolean;
  dailyCalories: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
  };
  waterTargetMl: number;
  meals: {
    mealType: MealType;
    title: string;
    suggestedTime: string;
    items: FoodItem[];
    prepTips?: string;
  }[];
  recommendedSupplements: string[];
  keyBenefits: string[];
}

export interface DailyDietLog {
  date: string; // YYYY-MM-DD
  meals: LoggedMeal[];
  waterMl: number;
  waterGoalMl: number;
  waterLogs?: WaterLogEntry[];
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

export type FlexibilityTestType =
  | 'sit_and_reach'
  | 'shoulder_apley'
  | 'hip_90_90'
  | 'ankle_dorsiflexion'
  | 'thoracic_rotation'
  | 'overhead_squat';

export interface FlexibilityAssessment {
  id: string;
  testType: FlexibilityTestType;
  testName: string;
  date: string; // YYYY-MM-DD
  score: number;
  unit: string;
  side?: 'left' | 'right' | 'both';
  status: 'Tight' | 'Normal' | 'Good' | 'Excellent' | 'Elite';
  notes?: string;
}

export type BodyProgressPose = 'front' | 'side' | 'back' | 'flexed';

export interface BodyProgressEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  weightKg: number;
  weightUnit?: 'kg' | 'lbs';
  photoUrl: string;
  pose: BodyProgressPose;
  notes?: string;
  bodyFatPercent?: number;
  chestCm?: number;
  waistCm?: number;
  armsCm?: number;
  thighsCm?: number;
  createdAt: number;
}
