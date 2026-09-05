import { Exercise, WorkoutPlan, FoodItem, RoutineItem, DailyHabit, SupplementItem, PersonalDietPlan } from '../types';
import { NORMAL_WORKOUT_PLANS } from './normalWorkoutPlans';

export const EXERCISE_DATABASE: Exercise[] = [
  // HOME EXERCISES (NO EQUIPMENT / BODYWEIGHT)
  {
    id: 'bodyweight-pushups',
    name: 'Standard Floor Push-Ups',
    category: 'Chest',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Pectoralis Major & Triceps',
    secondaryMuscles: ['Anterior Deltoids', 'Core & Abs'],
    instructions: [
      'Set hands slightly wider than shoulder-width, fingers pointing slightly outwards.',
      'Maintain straight line from head to heels with braced glutes and core.',
      'Lower chest until 2 inches from floor, keeping elbows at a 45-degree angle.',
      'Press firmly through palms back to top lockout.'
    ],
    formTips: ['Do not let lower back sag', 'Keep neck neutral, looking at the floor', 'Breathe in lowering, exhale pressing up'],
    defaultSets: 4,
    defaultReps: '12-20',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 7,
  },
  {
    id: 'diamond-pushups',
    name: 'Diamond Close-Grip Push-Ups',
    category: 'Triceps',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Triceps Brachii & Inner Chest',
    secondaryMuscles: ['Front Shoulders', 'Core'],
    instructions: [
      'Assume push-up position with index fingers and thumbs touching to form a diamond.',
      'Lower chest directly toward hands while keeping elbows tucked tight to ribs.',
      'Press through triceps to full arm extension.'
    ],
    formTips: ['Keep elbows tucked in, do not flare', 'Squeeze triceps hard at lockout'],
    defaultSets: 3,
    defaultReps: '10-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'bodyweight-air-squats',
    name: 'Bodyweight Air Squats',
    category: 'Quadriceps',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    instructions: [
      'Stand with feet shoulder-width apart, toes angled slightly outward 15-20 degrees.',
      'Initiate squat by sending hips back and down as if sitting in a low chair.',
      'Lower until hip crease is parallel or below knees, keeping chest tall and heels glued.',
      'Drive powerfully through heels to return to standing.'
    ],
    formTips: ['Push knees outward in line with toes', 'Keep spine long and eyes forward'],
    defaultSets: 4,
    defaultReps: '15-25',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'walking-lunges-bw',
    name: 'Bodyweight Walking Lunges',
    category: 'Quadriceps',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Glutes, Quads & Hamstrings',
    secondaryMuscles: ['Calves', 'Core Balance'],
    instructions: [
      'Take a long step forward with right leg, lowering back knee toward floor.',
      'Keep front knee directly above ankle at a 90-degree angle.',
      'Drive through front heel to step forward into next lunge with opposite leg.'
    ],
    formTips: ['Keep torso upright with braced core', 'Do not let front knee collapse inward'],
    defaultSets: 3,
    defaultReps: '20 steps',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'glute-bridges-bw',
    name: 'Bodyweight Glute Bridges',
    category: 'Glutes',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Gluteus Maximus & Hamstrings',
    secondaryMuscles: ['Lower Back', 'Erector Spinae'],
    instructions: [
      'Lie face up on floor, knees bent, feet flat on ground hip-width apart.',
      'Drive through heels and squeeze glutes to elevate hips toward ceiling.',
      'Hold at top contraction for 2 seconds forming straight diagonal from knees to shoulders.',
      'Lower slowly under control.'
    ],
    formTips: ['Squeeze glutes actively at top, avoid over-arching lower back'],
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'mountain-climbers-bw',
    name: 'Dynamic Mountain Climbers',
    category: 'Core & Abs',
    discipline: 'Cardio & HIIT',
    equipment: 'Bodyweight',
    targetMuscle: 'Rectus Abdominis & Cardio Stamina',
    secondaryMuscles: ['Shoulders', 'Hip Flexors', 'Quads'],
    instructions: [
      'Start in tall plank position with hands under shoulders.',
      'Drive one knee forward toward chest rapidly without lifting hips too high.',
      'Quickly switch legs in a rhythmic running cadence on balls of feet.'
    ],
    formTips: ['Maintain flat back', 'Keep shoulders stacked over wrists'],
    defaultSets: 4,
    defaultReps: '30-45 sec',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 11,
  },
  {
    id: 'chair-dips-home',
    name: 'Home Chair / Couch Dips',
    category: 'Triceps',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Triceps & Anterior Deltoids',
    secondaryMuscles: ['Upper Chest'],
    instructions: [
      'Sit on edge of sturdy chair or sofa, grip edge next to hips.',
      'Slide hips off edge, legs extended or knees bent at 90 degrees.',
      'Lower hips by bending elbows to 90 degrees.',
      'Press through palms to straighten arms and lock out triceps.'
    ],
    formTips: ['Keep back close to the chair edge', 'Do not shrug shoulders up'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 7,
  },
  {
    id: 'bicycle-crunches-bw',
    name: 'Bicycle Crunches',
    category: 'Core & Abs',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Obliques & Rectus Abdominis',
    secondaryMuscles: ['Hip Flexors'],
    instructions: [
      'Lie flat on back, hands lightly touching behind ears.',
      'Lift shoulders off floor, bring right elbow to meet left knee as right leg extends.',
      'Alternate sides in smooth, deliberate pedaling tempo.'
    ],
    formTips: ['Do not pull on neck', 'Rotate through thoracic ribcage'],
    defaultSets: 3,
    defaultReps: '20 total',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 7,
  },

  // CHEST
  {
    id: 'bench-press-bb',
    name: 'Barbell Flat Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    targetMuscle: 'Pectoralis Major (Mid/Lower)',
    secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    instructions: [
      'Lie flat on bench, retract scapula (shoulder blades pinched).',
      'Grip bar slightly wider than shoulder width with thumbs wrapped.',
      'Unrack, lower bar with control to mid-chest / nipple line.',
      'Drive feet into floor and press bar up explosively without flaring elbows excessively.'
    ],
    formTips: ['Keep wrists straight above elbows', 'Do not bounce the bar off ribs', 'Maintain natural arch in lower back'],
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSeconds: 120,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    equipment: 'Dumbbell',
    targetMuscle: 'Upper Chest (Clavicular Head)',
    secondaryMuscles: ['Front Delts', 'Triceps'],
    instructions: [
      'Set bench angle to 30-45 degrees.',
      'Kick dumbbells to shoulder height, press upward in a slight arc.',
      'Lower weights until thumbs are level with upper chest.'
    ],
    formTips: ['Keep elbows tucked at ~45 degrees from torso', 'Squeeze chest at top without banging weights'],
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 7,
  },
  {
    id: 'cable-crossover-fly',
    name: 'Cable Chest Fly / Crossover',
    category: 'Chest',
    equipment: 'Cable',
    targetMuscle: 'Inner/Mid Chest',
    secondaryMuscles: ['Anterior Delts'],
    instructions: [
      'Set pulleys at shoulder or chest height.',
      'Step forward with staggered stance, slight bend in elbows.',
      'Bring hands together in front of chest in a hugging motion, squeeze hard.'
    ],
    formTips: ['Lead with pinkies/elbows slightly', 'Keep tension throughout full range'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'bodyweight-dips',
    name: 'Parallel Bar Dips',
    category: 'Chest',
    equipment: 'Bodyweight',
    targetMuscle: 'Lower Chest & Triceps',
    secondaryMuscles: ['Front Deltoids'],
    instructions: [
      'Mount dip station, lean torso forward ~30 degrees for chest emphasis.',
      'Lower until upper arms are parallel to floor.',
      'Push through palms back to starting lockout.'
    ],
    formTips: ['Keep shoulders depressed (down and back)', 'Do not flare elbows wide'],
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 8,
  },

  // BACK
  {
    id: 'deadlift-bb',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    targetMuscle: 'Erector Spinae & Posterior Chain',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Lats', 'Traps', 'Forearms'],
    instructions: [
      'Stand feet hip-width, barbell over mid-foot.',
      'Hinge hips, grip bar just outside knees.',
      'Pull chest up, engage lats, push floor away through heels.',
      'Lock out hips and knees in tall posture.'
    ],
    formTips: ['Keep spine neutral (no rounding)', 'Drag the bar along shins and thighs'],
    defaultSets: 4,
    defaultReps: '5',
    defaultRestSeconds: 180,
    caloriesBurnedPerMin: 10,
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown (Wide Grip)',
    category: 'Back',
    equipment: 'Cable',
    targetMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rear Deltoids', 'Rhomboids'],
    instructions: [
      'Sit facing pad, secure knees firmly under rollers.',
      'Grip bar slightly wider than shoulders.',
      'Lean back 10-15 degrees and pull bar down to upper chest while driving elbows down.'
    ],
    formTips: ['Initiate with back muscles, not arms', 'Avoid swinging torso backward excessively'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 7,
  },
  {
    id: 'bent-over-bb-row',
    name: 'Barbell Bent-Over Row',
    category: 'Back',
    equipment: 'Barbell',
    targetMuscle: 'Mid-Back & Rhomboids',
    secondaryMuscles: ['Lats', 'Biceps', 'Lower Back'],
    instructions: [
      'Hinge forward 45-60 degrees with knees slightly bent.',
      'Pull bar towards lower ribcage/belly button, pinching shoulder blades together at apex.'
    ],
    formTips: ['Keep core braced and spine locked', 'Control the eccentric downward phase'],
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups (Overhand Grip)',
    category: 'Back',
    equipment: 'Bodyweight',
    targetMuscle: 'Latissimus Dorsi & Upper Back',
    secondaryMuscles: ['Biceps', 'Brachialis', 'Core'],
    instructions: [
      'Hang from bar with palms facing away.',
      'Depress scapulae and pull chest up toward bar until chin clears bar.',
      'Lower under control to full dead-hang stretch.'
    ],
    formTips: ['Avoid kipping or kicking legs', 'Keep neck in neutral alignment'],
    defaultSets: 3,
    defaultReps: '6-10',
    defaultRestSeconds: 120,
    caloriesBurnedPerMin: 9,
  },

  // SHOULDERS
  {
    id: 'overhead-db-press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbell',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps', 'Upper Traps'],
    instructions: [
      'Sit upright on bench, dumbbells at shoulder height palms forward.',
      'Press directly overhead until arms are nearly straight.',
      'Lower with control to ear level.'
    ],
    formTips: ['Keep core braced against backrest', 'Do not arch lower back excessively'],
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 7,
  },
  {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    equipment: 'Dumbbell',
    targetMuscle: 'Lateral Deltoids (Side Delts)',
    secondaryMuscles: ['Traps'],
    instructions: [
      'Stand with dumbbells at sides, slight forward torso lean.',
      'Raise weights out to sides with slight bend in elbows up to shoulder level.',
      'Pause for half second, lower smoothly.'
    ],
    formTips: ['Lead with elbows, not wrists', 'Do not use momentum or shrug ears up'],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 5,
  },
  {
    id: 'face-pulls',
    name: 'Cable Rope Face Pulls',
    category: 'Shoulders',
    equipment: 'Cable',
    targetMuscle: 'Rear Deltoids & Rotator Cuff',
    secondaryMuscles: ['Rhomboids', 'Trapezius'],
    instructions: [
      'Attach rope to upper cable pulley.',
      'Pull rope towards forehead/eyes while separating hands and externally rotating shoulders.'
    ],
    formTips: ['Keep elbows high and back', 'Crucial exercise for shoulder posture & health'],
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 5,
  },

  // LEGS
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'Quadriceps',
    equipment: 'Barbell',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Core', 'Spinal Erectors'],
    instructions: [
      'Rest bar across upper traps/rear delts, feet shoulder-width apart.',
      'Hinge hips back and bend knees, keeping chest high and knees tracking over toes.',
      'Descend until thighs are parallel or below parallel to floor.',
      'Drive through midfoot to return to upright stance.'
    ],
    formTips: ['Breathe deeply and brace core with Valsalva maneuver', 'Never let knees cave inward'],
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSeconds: 150,
    caloriesBurnedPerMin: 10,
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Hamstrings',
    equipment: 'Barbell',
    targetMuscle: 'Hamstrings & Glutes',
    secondaryMuscles: ['Lower Back', 'Forearms'],
    instructions: [
      'Hold bar at hips with overhand grip, slight knee bend.',
      'Push hips backward while lowering bar down front of thighs and shins.',
      'Lower until deep hamstring stretch is reached, then contract glutes to return up.'
    ],
    formTips: ['Keep bar in constant contact with legs', 'Keep spine flat throughout'],
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'leg-press',
    name: '45-Degree Leg Press',
    category: 'Quadriceps',
    equipment: 'Machine',
    targetMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Calves'],
    instructions: [
      'Sit comfortably, feet placed shoulder-width on sled.',
      'Release safety handles, lower sled until knees reach 90 degrees.',
      'Press sled up through whole foot without locking knees violently.'
    ],
    formTips: ['Keep lower back and pelvis glued to pad', 'Never allow hips to lift off seat'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'walking-lunges',
    name: 'Dumbbell Walking Lunges',
    category: 'Glutes',
    equipment: 'Dumbbell',
    targetMuscle: 'Glutes & Quads',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    instructions: [
      'Hold dumbbells at sides, step forward into a lunge.',
      'Lower back knee toward floor, push through front heel to step into next stride.'
    ],
    formTips: ['Keep torso upright', 'Maintain balance and knee stability'],
    defaultSets: 3,
    defaultReps: '12 per leg',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    category: 'Calves',
    equipment: 'Machine',
    targetMuscle: 'Gastrocnemius & Soleus',
    secondaryMuscles: ['Foot Intrinsic Muscles'],
    instructions: [
      'Place balls of feet on platform with heels hanging off.',
      'Lower heels for full stretch, then drive onto tiptoes with maximum squeeze at apex.'
    ],
    formTips: ['Pause for 1 full second at bottom stretch and top contraction', 'Do not bounce'],
    defaultSets: 4,
    defaultReps: '15-20',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 5,
  },

  // ARMS
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    category: 'Biceps',
    equipment: 'Barbell',
    targetMuscle: 'Biceps Brachii',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    instructions: [
      'Stand upright, hold barbell with underhand grip shoulder-width.',
      'Keep elbows pinned to ribs, curl bar towards shoulders.',
      'Squeeze biceps at peak, lower with 2-second negative.'
    ],
    formTips: ['Avoid swinging hips or leaning back', 'Keep wrists neutral'],
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 5,
  },
  {
    id: 'tricep-rope-pushdown',
    name: 'Cable Tricep Rope Pushdown',
    category: 'Triceps',
    equipment: 'Cable',
    targetMuscle: 'Triceps (Lateral & Medial Head)',
    secondaryMuscles: ['Forearms'],
    instructions: [
      'Grip rope attachment at high pulley.',
      'Pin elbows to sides, push hands down and spread rope apart at bottom.'
    ],
    formTips: ['Lock out elbows with brief flex at bottom', 'Do not let elbows drift forward'],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 5,
  },
  {
    id: 'incline-db-curl',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'Biceps',
    equipment: 'Dumbbell',
    targetMuscle: 'Biceps (Long Head / Peak)',
    secondaryMuscles: ['Brachialis'],
    instructions: [
      'Sit on 45-degree incline bench with arms hanging straight down.',
      'Curl dumbbells upward while supinating wrists (palms up).'
    ],
    formTips: ['Creates extreme long-head stretch for arm peak', 'Keep upper arms perpendicular to floor'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 5,
  },
  {
    id: 'skull-crushers',
    name: 'EZ-Bar Skull Crushers (Lying Tricep Extension)',
    category: 'Triceps',
    equipment: 'Barbell',
    targetMuscle: 'Triceps (Long Head)',
    secondaryMuscles: ['Elbow Flexors'],
    instructions: [
      'Lie flat, press EZ-bar overhead with narrow grip.',
      'Hinge at elbows to lower bar towards crown of head/forehead.',
      'Extend elbows back to starting position.'
    ],
    formTips: ['Keep upper arms tilted slightly backward for constant tricep tension'],
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    caloriesBurnedPerMin: 6,
  },

  // CORE & ABS
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    category: 'Core & Abs',
    equipment: 'Bodyweight',
    targetMuscle: 'Lower Rectus Abdominis',
    secondaryMuscles: ['Hip Flexors', 'Obliques', 'Grip'],
    instructions: [
      'Hang from pull-up bar, brace core.',
      'Raise straight legs or knees up to chest level, curling pelvis upward at top.'
    ],
    formTips: ['Curl pelvis to activate abs, do not just lift hip flexors', 'Eliminate swing between reps'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'cable-woodchopper',
    name: 'Cable Woodchopper / Rotational Twist',
    category: 'Core & Abs',
    equipment: 'Cable',
    targetMuscle: 'Internal & External Obliques',
    secondaryMuscles: ['Transverse Abdominis'],
    instructions: [
      'Set cable at shoulder level, hold handle with both hands.',
      'Rotate torso across body with arms extended, pivot on rear foot.'
    ],
    formTips: ['Rotate through core and hips, not arms', 'Control resistance on return'],
    defaultSets: 3,
    defaultReps: '12 per side',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'plank-hold',
    name: 'Weighted / Standard Forearm Plank',
    category: 'Core & Abs',
    equipment: 'Bodyweight',
    targetMuscle: 'Transverse Abdominis & Deep Core',
    secondaryMuscles: ['Shoulders', 'Glutes', 'Quads'],
    instructions: [
      'Rest on forearms and toes, elbows directly under shoulders.',
      'Create straight line from head to heels, squeeze glutes and pull navel to spine.'
    ],
    formTips: ['Do not let hips sag or hike up', 'Breathe rhythmically'],
    defaultSets: 3,
    defaultReps: '45-60s hold',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 5,
  },

  // CARDIO & HIIT
  {
    id: 'hiit-burpees',
    name: 'Chest-to-Floor Burpees',
    category: 'Cardio & HIIT',
    discipline: 'Cardio & HIIT',
    equipment: 'Bodyweight',
    targetMuscle: 'Full Body Cardio & Power',
    secondaryMuscles: ['Chest', 'Quads', 'Core', 'Shoulders'],
    instructions: [
      'Drop hands to floor from standing, kick feet back to plank.',
      'Lower chest to touch floor, press up, snap feet to hands, and jump explosively.'
    ],
    formTips: ['Keep steady pace for endurance, or max effort for HIIT intervals'],
    defaultSets: 4,
    defaultReps: '45 sec',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 12,
  },
  {
    id: 'kettlebell-swing',
    name: 'Russian Kettlebell Swing',
    category: 'Cardio & HIIT',
    discipline: 'Cardio & HIIT',
    equipment: 'Kettlebell',
    targetMuscle: 'Posterior Chain & Cardio',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Lats', 'Core'],
    instructions: [
      'Stand feet wider than hips, hinge back with KB between legs.',
      'Snap hips forward violently, swinging kettlebell up to chest height.'
    ],
    formTips: ['Power comes from hip drive, not arm lifting', 'Keep spine neutral'],
    defaultSets: 4,
    defaultReps: '20 reps',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 11,
  },
  {
    id: 'treadmill-incline-walk',
    name: 'Zone 2 Incline Treadmill Walk',
    category: 'Cardio & HIIT',
    discipline: 'Cardio & HIIT',
    equipment: 'Cardio',
    targetMuscle: 'Cardiovascular & Calves',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    instructions: [
      'Set incline to 10-12% and speed to 4.5-5.5 km/h.',
      'Maintain upright posture without holding onto handrails.'
    ],
    formTips: ['Maintains fat-burning Zone 2 heart rate with zero joint impact'],
    defaultSets: 1,
    defaultReps: '25-30 min',
    defaultRestSeconds: 0,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'rowing-intervals',
    name: 'Concept2 Rowing Machine Intervals',
    category: 'Cardio & HIIT',
    discipline: 'Cardio & HIIT',
    equipment: 'Cardio',
    targetMuscle: 'Total Body Cardiovascular (Lats, Legs & Core)',
    secondaryMuscles: ['Hamstrings', 'Quads', 'Upper Back', 'Arms'],
    instructions: [
      'Strap feet in, grab handle with overhand grip.',
      'Drive through legs first, lean torso back slightly, pull handle to lower ribs.',
      'Extend arms forward, hinge torso, bend knees to slide forward for recovery.'
    ],
    formTips: ['Legs-Core-Arms on drive, Arms-Core-Legs on return', 'Maintain 24-28 strokes/min pace'],
    defaultSets: 4,
    defaultReps: '500m split',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 13,
  },
  {
    id: 'speed-jump-rope',
    name: 'High-Speed Jump Rope Intervals',
    category: 'Cardio & HIIT',
    discipline: 'Cardio & HIIT',
    equipment: 'Cardio',
    targetMuscle: 'Calves, Foot Agility & Cardio Endurance',
    secondaryMuscles: ['Shoulders', 'Forearms', 'Core'],
    instructions: [
      'Hold handles loosely with elbows close to ribs.',
      'Turn rope with wrists, jumping only 1-2 inches off floor with balls of feet.',
      'Land softly with slightly bent knees in constant rhythm.'
    ],
    formTips: ['Rotate from wrists not shoulders', 'Stay on balls of feet'],
    defaultSets: 4,
    defaultReps: '60 sec',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 14,
  },

  // ZUMBA & DANCE FITNESS
  {
    id: 'zumba-salsa-cardio',
    name: 'Zumba Salsa & Merengue Rhythm Step',
    category: 'Zumba & Dance',
    discipline: 'Zumba & Dance',
    equipment: 'Dance Floor',
    targetMuscle: 'Full Body Aerobic Conditioning & Hips',
    secondaryMuscles: ['Calves', 'Quads', 'Glutes', 'Core Obliques'],
    instructions: [
      'Step right foot to side with hips following, return to center on beat 3.',
      'Step left foot to side with hip roll, return to center on beat 7.',
      'Add double-step Merengue marching with high knees and rhythmic arm sweeps.'
    ],
    formTips: ['Engage core while keeping hips fluid and relaxed', 'Sync footwork with 120-140 BPM Latin music'],
    defaultSets: 4,
    defaultReps: '3-min song',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 10,
  },
  {
    id: 'zumba-reggaeton-bounce',
    name: 'Reggaeton Dance Squat & Bounce',
    category: 'Zumba & Dance',
    discipline: 'Zumba & Dance',
    equipment: 'Dance Floor',
    targetMuscle: 'Glutes, Quads & Core Stability',
    secondaryMuscles: ['Hamstrings', 'Lower Back', 'Calves'],
    instructions: [
      'Drop into a quarter squat athletic stance.',
      'Perform rhythmic pelvic tilts and chest pops while stepping laterally.',
      'Add explosive jump turns on the drop beats.'
    ],
    formTips: ['Keep knees soft and springy to absorb dance impacts', 'Maintain low center of gravity for maximum burn'],
    defaultSets: 4,
    defaultReps: '3-min song',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 11,
  },
  {
    id: 'zumba-cumbia-cross',
    name: 'Cumbia Machete & Sleepy Step',
    category: 'Zumba & Dance',
    discipline: 'Zumba & Dance',
    equipment: 'Dance Floor',
    targetMuscle: 'Obliques, Calves & Agility',
    secondaryMuscles: ['Deltoids', 'Inner Thighs'],
    instructions: [
      'Step right foot back on heel pivot while swinging left arm overhead.',
      'Switch sides continuously with sweeping arm motions and rhythmic waist swivel.'
    ],
    formTips: ['Extend arm fully during sweeps', 'Let shoulders roll with the rhythm'],
    defaultSets: 3,
    defaultReps: '3-min track',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'zumba-toning-sticks',
    name: 'Zumba Toning & Light Weight Dance Sculpt',
    category: 'Zumba & Dance',
    discipline: 'Zumba & Dance',
    equipment: 'Dumbbell',
    targetMuscle: 'Shoulders, Arms & Full Body Dance Cardio',
    secondaryMuscles: ['Upper Back', 'Core', 'Glutes'],
    instructions: [
      'Hold light 1-2kg dumbbells or toning sticks.',
      'Execute continuous Latin dance footwork while performing synchronized bicep pulses and overhead presses.'
    ],
    formTips: ['Avoid locking elbows on rapid movements', 'Keep core braced through all rotations'],
    defaultSets: 3,
    defaultReps: '4-min track',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 11,
  },

  // SWIMMING & AQUATICS
  {
    id: 'swim-freestyle-laps',
    name: 'Freestyle (Front Crawl) High-Pace Laps',
    category: 'Swimming & Aquatics',
    discipline: 'Swimming',
    equipment: 'Pool',
    targetMuscle: 'Lats, Shoulders & Full Body Cardiovascular',
    secondaryMuscles: ['Chest', 'Core', 'Glutes', 'Quads'],
    instructions: [
      'Push off pool wall in streamlined glide position.',
      'Alternate high-elbow arm pulls with continuous flutter kick from hips.',
      'Rotate torso side-to-side and breathe bilaterally every 3 strokes.'
    ],
    formTips: ['Keep head down and water level at hairline', 'Kick from hips, not knees'],
    defaultSets: 6,
    defaultReps: '50m (2 laps)',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 12,
  },
  {
    id: 'swim-breaststroke',
    name: 'Breaststroke Power Glide',
    category: 'Swimming & Aquatics',
    discipline: 'Swimming',
    equipment: 'Pool',
    targetMuscle: 'Chest, Inner Thighs (Adductors) & Lats',
    secondaryMuscles: ['Hamstrings', 'Shoulders', 'Core'],
    instructions: [
      'Sweep arms out and pull back in heart shape, lifting chest to breathe.',
      'Whip kick feet outward and snap heels together while extending arms into long glide.'
    ],
    formTips: ['Hold the streamlined glide for 1-2 seconds after each kick', 'Do not drop hips'],
    defaultSets: 5,
    defaultReps: '50m (2 laps)',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 10,
  },
  {
    id: 'swim-butterfly-intervals',
    name: 'Butterfly Stroke Power Intervals',
    category: 'Swimming & Aquatics',
    discipline: 'Swimming',
    equipment: 'Pool',
    targetMuscle: 'Deltoids, Trapezius, Core & Hip Undulation',
    secondaryMuscles: ['Lats', 'Chest', 'Lower Back'],
    instructions: [
      'Execute dual dolphin kicks per arm stroke cycle.',
      'Pull both arms simultaneously under chest and recover over surface of water.',
      'Press chest forward into the water wave.'
    ],
    formTips: ['Generate movement from deep core undulation, not arms alone'],
    defaultSets: 4,
    defaultReps: '25m (1 lap)',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 15,
  },
  {
    id: 'swim-backstroke',
    name: 'Backstroke Endurance Recovery Laps',
    category: 'Swimming & Aquatics',
    discipline: 'Swimming',
    equipment: 'Pool',
    targetMuscle: 'Upper Back, Posterior Deltoids & Calves',
    secondaryMuscles: ['Core', 'Glutes'],
    instructions: [
      'Float on back in horizontal alignment.',
      'Alternate windmill arm strokes with straight arms passing by ears.',
      'Perform steady flutter kick keeping toes near surface.'
    ],
    formTips: ['Keep chin tucked slightly, hips high near the surface'],
    defaultSets: 5,
    defaultReps: '50m (2 laps)',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'treading-water-intervals',
    name: 'High-Knee Treading Water & Eggbeater',
    category: 'Swimming & Aquatics',
    discipline: 'Swimming',
    equipment: 'Pool',
    targetMuscle: 'Core, Hip Flexors & Heart Rate Spike',
    secondaryMuscles: ['Shoulders', 'Quads', 'Calves'],
    instructions: [
      'Stay vertical in deep water without touching bottom.',
      'Perform continuous eggbeater or scissor kick while sculling hands in water.',
      'Raise hands above water surface for extreme intensity.'
    ],
    formTips: ['Holding hands out of water doubles the workload on core & legs'],
    defaultSets: 4,
    defaultReps: '60 sec',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 13,
  },

  // CALISTHENICS & BODYWEIGHT
  {
    id: 'muscle-up-rings',
    name: 'Bar / Gymnastic Ring Muscle-Up',
    category: 'Calisthenics & Bodyweight',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Lats, Chest, Triceps & Explosive Pulling',
    secondaryMuscles: ['Shoulders', 'Grip', 'Abs'],
    instructions: [
      'Hang from bar or rings with false grip.',
      'Pull explosively toward lower sternum, drive head and chest over bar, and transition into top dip lockout.'
    ],
    formTips: ['Aggressive wrist rotation during transition', 'Maintain hollow body tension'],
    defaultSets: 4,
    defaultReps: '3-6 reps',
    defaultRestSeconds: 120,
    caloriesBurnedPerMin: 10,
  },
  {
    id: 'pistol-squat',
    name: 'Single-Leg Pistol Squat',
    category: 'Calisthenics & Bodyweight',
    discipline: 'Calisthenics',
    equipment: 'Bodyweight',
    targetMuscle: 'Quadriceps, Glutes & Ankle Mobility',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    instructions: [
      'Stand on one leg, extend opposite leg straight out in front.',
      'Descend into a full single-leg squat until hamstring touches calf.',
      'Drive through heel to return to standing.'
    ],
    formTips: ['Reach arms forward to counterbalance', 'Keep standing heel glued down'],
    defaultSets: 3,
    defaultReps: '6-8 per leg',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 8,
  },

  // YOGA & MOBILITY
  {
    id: 'vinyasa-flow-sun-salutation',
    name: 'Vinyasa Sun Salutation Flow (Surya Namaskar)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Spine Decompression, Hamstrings & Full Body Flow',
    secondaryMuscles: ['Shoulders', 'Hip Flexors', 'Chest'],
    instructions: [
      'Start in Mountain Pose (Tadasana), inhale and sweep arms overhead.',
      'Exhale into Forward Fold (Uttanasana), step back into Plank, lower to Chaturanga.',
      'Inhale to Upward-Facing Dog, exhale to Downward-Facing Dog. Hold 5 breaths.'
    ],
    formTips: ['Link each movement to deep Ujjayi nasal breath', 'Never strain lower back in backbends'],
    defaultSets: 5,
    defaultReps: 'Flow sequence',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 5,
  },
  {
    id: 'pigeon-pose-mobility',
    name: 'Pigeon Pose & Deep Hip Opener',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Gluteus Medius, Piriformis & Hip Flexors',
    secondaryMuscles: ['Lower Back', 'Groin'],
    instructions: [
      'From Downward Dog, bring right knee forward behind right wrist.',
      'Extend left leg straight back with top of foot on floor.',
      'Square hips and fold forward onto forearms.'
    ],
    formTips: ['Keep hips level, do not roll onto side', 'Breathe deeply into tightness'],
    defaultSets: 2,
    defaultReps: '90 sec / side',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 3,
  },
  {
    id: 'downward-facing-dog',
    name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Calves, Hamstrings, Shoulders & Spine Decompression',
    secondaryMuscles: ['Lats', 'Wrists', 'Upper Back'],
    instructions: [
      'Start on hands and knees with wrists under shoulders and knees under hips.',
      'Tuck toes, lift knees off mat, and send hips high toward ceiling into an inverted V.',
      'Press firmly through palms, lengthen spine, and gently pedal heels toward the floor.'
    ],
    formTips: ['Keep neck relaxed between upper arms', 'Bend knees slightly if hamstrings are tight to keep back flat'],
    defaultSets: 3,
    defaultReps: '45-60 sec hold',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 4,
  },
  {
    id: 'cat-cow-spinal-flow',
    name: 'Cat-Cow Spinal Mobility Wave (Marjaryasana-Bitilasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Thoracic Spine, Erector Spinae & Abdominals',
    secondaryMuscles: ['Neck', 'Pelvic Floor'],
    instructions: [
      'Begin on all fours in tabletop position with hands under shoulders and knees under hips.',
      'Inhale into Cow: drop belly toward mat, lift chest, roll shoulders back, gaze slightly upward.',
      'Exhale into Cat: press firmly into hands, dome upper back toward ceiling, tuck chin and tailbone.'
    ],
    formTips: ['Initiate movement from the tailbone, rippling up through each vertebra', 'Synchronize movement with breath'],
    defaultSets: 3,
    defaultReps: '10 breath cycles',
    defaultRestSeconds: 15,
    caloriesBurnedPerMin: 3.5,
  },
  {
    id: 'warrior-two-pose',
    name: 'Warrior II Flow (Virabhadrasana II)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Hip Abductors, Groin, Quadriceps & Chest Expansion',
    secondaryMuscles: ['Glutes', 'Ankles', 'Deltoids'],
    instructions: [
      'Step feet wide apart (~4 feet), turn front foot forward 90 degrees and back foot slightly inward.',
      'Extend arms parallel to floor at shoulder height, palms down, reaching actively front and back.',
      'Bend front knee to 90 degrees tracking over ankle while keeping torso centered. Gaze over front fingertips.'
    ],
    formTips: ['Stack front knee directly over ankle, never collapse inward', 'Keep shoulders relaxed away from ears'],
    defaultSets: 2,
    defaultReps: '45 sec / side',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 5,
  },
  {
    id: 'childs-pose-restorative',
    name: "Child's Pose Restorative Stretch (Balasana)",
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Lower Back Decompression, Lats & Hip Capsules',
    secondaryMuscles: ['Glutes', 'Ankles', 'Shoulders'],
    instructions: [
      'Kneel on mat, bring big toes together, and spread knees mat-width apart.',
      'Sit hips back toward heels, fold torso forward between thighs, and rest forehead gently on mat.',
      'Extend arms long out front with palms flat, feeling deep lengthening along entire spine and side ribs.'
    ],
    formTips: ['Breathe deeply into back of ribcage to expand lower back', 'Relax jaw and shoulder blades'],
    defaultSets: 2,
    defaultReps: '60-90 sec hold',
    defaultRestSeconds: 15,
    caloriesBurnedPerMin: 2.5,
  },
  {
    id: 'cobra-upward-dog-stretch',
    name: 'Cobra / Upward-Facing Dog Stretch (Bhujangasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Chest, Anterior Abdominal Wall & Lumbar Extension',
    secondaryMuscles: ['Triceps', 'Shoulders', 'Neck'],
    instructions: [
      'Lie facedown on mat, hands flat under shoulders, elbows hugged tight into ribcage.',
      'Press tops of feet firmly into mat, contract glutes gently to protect lower back.',
      'Inhale and gently peel chest off floor using back muscles, pressing lightly into palms. Keep neck long.'
    ],
    formTips: ['Avoid crunching the lumbar spine; focus on lifting through upper chest and sternum', 'Keep elbows soft'],
    defaultSets: 3,
    defaultReps: '30-45 sec hold',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 3.5,
  },
  {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Stretch (Spiderman Lunge & Thoracic Rotation)",
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Hip Flexors, Hamstrings, Groin & Thoracic Spine Mobility',
    secondaryMuscles: ['Glutes', 'Adductors', 'Shoulders'],
    instructions: [
      'Step right foot forward into a deep lunge with back leg straight, hands planted inside right foot.',
      'Lower right elbow toward inside of right ankle, holding 2-3 seconds for deep groin and hip opener.',
      'Rotate right arm toward ceiling, opening chest wide and following hand with eyes for thoracic mobility.',
      'Plant hand back down, sit back slightly to straighten front leg into a hamstring stretch, then switch sides.'
    ],
    formTips: ['Keep rear leg actively engaged', 'Turn head with torso to guide rotational mobility from upper back'],
    defaultSets: 3,
    defaultReps: '6 reps / side',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'seated-forward-fold-stretch',
    name: 'Seated Forward Fold Hamstring Stretch (Paschimottanasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Hamstrings, Calves & Entire Posterior Chain',
    secondaryMuscles: ['Lower Back', 'Glutes'],
    instructions: [
      'Sit tall on mat with legs extended straight in front, feet flexed and toes pointing toward ceiling.',
      'Inhale and reach arms overhead to elongate spine from base to crown.',
      'Exhale and hinge forward from hip creases, reaching toward shins, ankles, or feet while keeping chest open.'
    ],
    formTips: ['Lead with the heart rather than rounding forehead down', 'Bend knees slightly if hamstrings are tight'],
    defaultSets: 3,
    defaultReps: '60 sec hold',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 3,
  },
  {
    id: 'low-lunge-quad-hip-flexor',
    name: 'Low Lunge & Psoas Hip Flexor Stretch (Anjaneyasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Iliopsoas, Rectus Femoris & Anterior Hip Capsule',
    secondaryMuscles: ['Glutes', 'Groin', 'Abdominals'],
    instructions: [
      'From tabletop or downward dog, step right foot between hands and lower left knee down to mat.',
      'Keep front knee stacked over ankle, untuck rear toes, letting top of rear foot rest flat.',
      'Sweep arms overhead or rest on front thigh, tuck pelvis slightly, and gently sink hips forward and downward.'
    ],
    formTips: ['Squeeze the rear glute to trigger reciprocal inhibition in the hip flexor', 'Do not arch lower back excessively'],
    defaultSets: 2,
    defaultReps: '45-60 sec / side',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 3.5,
  },
  {
    id: 'butterfly-adductor-stretch',
    name: 'Seated Butterfly Groin & Adductor Stretch (Baddha Konasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Adductors, Groin & Inner Thigh Flexibility',
    secondaryMuscles: ['Pelvic Floor', 'Lower Back'],
    instructions: [
      'Sit upright with soles of feet pressed together and knees dropped wide toward sides.',
      'Hold feet or ankles with hands, lengthen spine upward on inhale.',
      'Exhale and gently lean forward from hips, using elbows to guide thighs softly toward the floor without forcing.'
    ],
    formTips: ['Never bounce knees aggressively; use calm steady breath to release inner groin tightness', 'Sit tall'],
    defaultSets: 2,
    defaultReps: '60 sec hold',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 2.5,
  },
  {
    id: 'ninety-ninety-hip-switch',
    name: '90/90 Hip Mobility Flow & Capsule Switch',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Internal & External Hip Rotators & Gluteus Medius',
    secondaryMuscles: ['Piriformis', 'IT Band', 'Core'],
    instructions: [
      'Sit on floor with lead leg in front bent at 90 degrees at hip and knee.',
      'Trail leg sits to the side bent at 90 degrees at hip and knee.',
      'Keep torso tall, hinge slightly over front shin for 30s glute stretch, then rotate hips and switch lead legs without using hands.'
    ],
    formTips: ['Keep both sit bones as grounded as mobility permits', 'Rotate through hips rather than twisting lower spine'],
    defaultSets: 2,
    defaultReps: '8 switches with 30s holds',
    defaultRestSeconds: 25,
    caloriesBurnedPerMin: 4,
  },
  {
    id: 'doorway-chest-shoulder-stretch',
    name: 'Doorway Pectoral & Anterior Shoulder Stretch',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Other',
    targetMuscle: 'Pectoralis Major, Pectoralis Minor & Anterior Deltoid',
    secondaryMuscles: ['Biceps', 'Neck'],
    instructions: [
      'Stand in an open doorway. Place forearms vertically against doorframe with elbows bent at 90 degrees at shoulder height.',
      'Step one foot forward through the doorway until a comfortable stretch is felt across chest and front shoulders.',
      'Keep core braced and spine neutral. Hold and breathe deeply into upper chest.'
    ],
    formTips: ['Avoid arching lower back or pushing head forward', 'Vary elbow height slightly to target different pectoral fibers'],
    defaultSets: 3,
    defaultReps: '45 sec hold',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 2.5,
  },
  {
    id: 'reclined-spinal-twist',
    name: 'Reclined Supine Spinal Twist (Supta Matsyendrasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Thoracolumbar Fascia, Glutes, Obliques & Chest',
    secondaryMuscles: ['Lower Back', 'IT Band', 'Neck'],
    instructions: [
      'Lie flat on back, hug right knee into chest while left leg extends long on mat.',
      'Open right arm out to side at shoulder height with palm facing up.',
      'Guide right knee across body toward the floor on left side using left hand, turning head gently to gaze toward right hand.'
    ],
    formTips: ['Keep both shoulder blades pinned to the floor', 'Exhale completely to release rotational tension along spinal column'],
    defaultSets: 2,
    defaultReps: '60 sec / side',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 2.5,
  },
  {
    id: 'triangle-pose-flow',
    name: 'Extended Triangle Pose (Utthita Trikonasana)',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Mat',
    targetMuscle: 'Hamstrings, Groin, Obliques, Chest & Lateral Spine',
    secondaryMuscles: ['Lats', 'Ankles', 'Upper Back'],
    instructions: [
      'Stand with feet wide (~4 feet). Turn right foot out 90 degrees and left foot in 15 degrees.',
      'Extend arms wide at shoulder height. Inhale and reach right arm far forward over right leg, hinging at right hip.',
      'Exhale and lower right hand to shin, ankle, or floor outside foot. Reach left arm straight up toward ceiling in a vertical line.'
    ],
    formTips: ['Imagine flattening entire body between two parallel walls', 'Keep thighs engaged to protect knee joints'],
    defaultSets: 2,
    defaultReps: '45 sec / side',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 4.5,
  },
  {
    id: 'desk-tech-neck-trap-stretch',
    name: 'Desk Worker Cervical & Upper Trap Release',
    category: 'Yoga & Mobility',
    discipline: 'Yoga & Mobility',
    equipment: 'Bodyweight',
    targetMuscle: 'Upper Trapezius, Levator Scapulae & Scalenes',
    secondaryMuscles: ['Suboccipitals', 'Neck Flexors', 'Shoulders'],
    instructions: [
      'Sit or stand tall with shoulders dropped away from ears. Place left hand behind back or hold under chair edge.',
      'Gently tilt right ear toward right shoulder. Place right hand softly over top of head with zero pulling force.',
      'Slowly angle chin down toward right collarbone to target levator scapulae. Hold 30-45s, breathing slowly into neck.'
    ],
    formTips: ['Never yank or wrench neck; use gentle passive weight of hand only', 'Maintain tall upright posture'],
    defaultSets: 2,
    defaultReps: '45 sec / side',
    defaultRestSeconds: 15,
    caloriesBurnedPerMin: 2,
  },

  // PILATES & CORE
  {
    id: 'pilates-the-hundred',
    name: 'Classical Pilates: The Hundred',
    category: 'Pilates & Core',
    discipline: 'Pilates',
    equipment: 'Mat',
    targetMuscle: 'Transverse Abdominis & Deep Core Stability',
    secondaryMuscles: ['Neck Flexors', 'Hip Flexors'],
    instructions: [
      'Lie on back, curl head and shoulders up, extend legs to 45-degree angle.',
      'Pump arms vigorously up and down at sides: inhale for 5 counts, exhale for 5 counts (total 100 pumps).'
    ],
    formTips: ['Keep lower spine anchored to mat', 'Maintain tight navel-to-spine scoop'],
    defaultSets: 1,
    defaultReps: '100 pumps',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'pilates-teaser',
    name: 'Pilates Teaser V-Hold',
    category: 'Pilates & Core',
    discipline: 'Pilates',
    equipment: 'Mat',
    targetMuscle: 'Rectus Abdominis & Hip Flexors',
    secondaryMuscles: ['Spine Articulators', 'Quads'],
    instructions: [
      'Lie flat, simultaneously roll torso up while lifting straight legs into a crisp V-shape.',
      'Hold at balance point with arms parallel to legs, then articulate spine down with control.'
    ],
    formTips: ['Roll through each vertebra sequentially', 'Avoid jerky momentum'],
    defaultSets: 3,
    defaultReps: '6-8 reps',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 7,
  },

  // BOXING & MARTIAL ARTS
  {
    id: 'boxing-heavy-bag-combos',
    name: 'Heavy Bag 6-Punch Power Combinations',
    category: 'Boxing & Martial Arts',
    discipline: 'Boxing & Combat',
    equipment: 'Heavy Bag',
    targetMuscle: 'Rotational Core, Deltoids & Cardio Stamina',
    secondaryMuscles: ['Lats', 'Chest', 'Calves', 'Triceps'],
    instructions: [
      'Maintain boxing guard: Jab (1), Cross (2), Lead Hook (3), Rear Uppercut (4).',
      'Slip under counter-hook, fire Lead Body Hook (5) and Cross (6).',
      'Step out with swift pivot footwork.'
    ],
    formTips: ['Rotate hips and pivot ball of foot on punches', 'Keep opposite hand glued to chin guard'],
    defaultSets: 5,
    defaultReps: '3-min round',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 14,
  },
  {
    id: 'boxing-shadow-footwork',
    name: 'Shadow Boxing & Defensive Slip Drills',
    category: 'Boxing & Martial Arts',
    discipline: 'Boxing & Combat',
    equipment: 'Bodyweight',
    targetMuscle: 'Shoulder Endurance, Agility & Footwork',
    secondaryMuscles: ['Core Obliques', 'Calves'],
    instructions: [
      'Circle around imaginary opponent with light, bouncy footwork.',
      'Throw crisp combinations while constantly changing angles, slipping, and rolling under imaginary punches.'
    ],
    formTips: ['Stay light on balls of feet', 'Exhale sharp breaths on every strike'],
    defaultSets: 4,
    defaultReps: '3-min round',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 11,
  },

  // GLUTES & FEMALE TONING SPECIALTIES
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust (Glute Hypertrophy)',
    category: 'Glutes',
    equipment: 'Barbell',
    targetMuscle: 'Gluteus Maximus (Upper & Mid Glute)',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Core'],
    instructions: [
      'Sit on floor with upper back against sturdy bench, padded barbell over hips.',
      'Feet flat on floor shoulder-width apart, knees at 90 degrees at apex.',
      'Drive hips upward through heels until thighs and torso are in straight line.',
      'Hold hard glute contraction at top for 2 seconds before lowering under control.'
    ],
    formTips: ['Keep chin tucked to chest throughout', 'Do not hyperextend lower back at apex', 'Drive strictly through heels'],
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat (Rear Foot Elevated)',
    category: 'Glutes',
    equipment: 'Dumbbell',
    targetMuscle: 'Glutes & Quadriceps',
    secondaryMuscles: ['Hamstrings', 'Core Stabilizers'],
    instructions: [
      'Stand 2 feet in front of bench, place top of rear foot flat on bench.',
      'Hold dumbbells at sides, lean torso forward ~20 degrees to bias glutes.',
      'Lower hips until front thigh is parallel to ground.',
      'Drive up through front heel.'
    ],
    formTips: ['Keep front shin relatively vertical for glute bias', 'Control the 3-second descent'],
    defaultSets: 3,
    defaultReps: '10 per leg',
    defaultRestSeconds: 75,
    caloriesBurnedPerMin: 8,
  },
  {
    id: 'cable-glute-kickback',
    name: 'Cable Glute Kickback & Abduction',
    category: 'Glutes',
    equipment: 'Cable',
    targetMuscle: 'Gluteus Maximus & Gluteus Medius',
    secondaryMuscles: ['Hamstrings'],
    instructions: [
      'Attach ankle cuff to low cable pulley, face the machine holding frame for balance.',
      'Hinge forward slightly, kick leg backward and slightly outward in 45-degree arc.',
      'Squeeze glute hard at apex for 1 second, resist return.'
    ],
    formTips: ['Do not arch lower back to lift leg', 'Maintain constant cable tension throughout'],
    defaultSets: 3,
    defaultReps: '12-15 per leg',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 6,
  },
  {
    id: 'db-goblet-squat',
    name: 'Dumbbell / Kettlebell Goblet Squat',
    category: 'Quadriceps',
    equipment: 'Dumbbell',
    targetMuscle: 'Quads, Glutes & Core (Beginner Safe)',
    secondaryMuscles: ['Upper Back', 'Calves'],
    instructions: [
      'Hold dumbbell vertically against chest with elbows pointing down.',
      'Stand feet shoulder-width with slight toe flare.',
      'Squat deep between knees while keeping chest upright and heels planted.',
      'Drive up through whole foot.'
    ],
    formTips: ['Perfect beginner squat builder', 'Use elbows inside knees at bottom to open hips'],
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 7,
  },

  // ATHLETIC & EXPLOSIVE CROSS-TRAINING
  {
    id: 'dumbbell-thruster',
    name: 'Dumbbell Thrusters (Squat to Overhead Press)',
    category: 'CrossFit & Functional',
    discipline: 'CrossFit & Functional',
    equipment: 'Dumbbell',
    targetMuscle: 'Full Body Explosive Power (Quads, Glutes & Deltoids)',
    secondaryMuscles: ['Triceps', 'Core', 'Cardiovascular'],
    instructions: [
      'Hold dumbbells at shoulders in front rack position.',
      'Descend into a full deep squat.',
      'Drive up explosively and transfer leg drive directly into an overhead press in one continuous motion.'
    ],
    formTips: ['Do not pause between squat and press', 'Exhale hard at lockout'],
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 13,
  },
  {
    id: 'box-jump-explosive',
    name: 'Plyometric Box Jumps (Reactive Power)',
    category: 'CrossFit & Functional',
    discipline: 'CrossFit & Functional',
    equipment: 'Other',
    targetMuscle: 'Fast-Twitch Leg Explosiveness & Vertical Jump',
    secondaryMuscles: ['Glutes', 'Calves', 'Core'],
    instructions: [
      'Stand in athletic stance 1 foot in front of 24-30" plyo box.',
      'Swing arms back and hinge hips, then explode upward onto the box.',
      'Land softly in quarter squat with feet fully on the platform. Step down carefully.'
    ],
    formTips: ['Focus on soft, quiet landings to protect joints', 'Step down rather than jumping down'],
    defaultSets: 4,
    defaultReps: '8-10 jumps',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 11,
  },
];

export const PRESET_WORKOUT_PLANS: WorkoutPlan[] = [
  ...NORMAL_WORKOUT_PLANS,
  {
    id: 'plan-home-no-equipment-fullbody',
    title: 'Home Workout (Zero Equipment Full Body)',
    splitType: 'Calisthenics & Bodyweight',
    level: 'beginner',
    durationMinutes: 35,
    daysPerWeek: 4,
    description: 'Complete home workout requiring zero gym equipment. Build muscle tone, burn fat, and strengthen joints using bodyweight mechanics.',
    tags: ['Home Workout', 'No Equipment', 'Bodyweight', 'Full Body'],
    exercises: [
      {
        id: 'hw1',
        exerciseId: 'bodyweight-pushups',
        name: 'Standard Floor Push-Ups',
        targetMuscle: 'Chest, Triceps & Core',
        restSec: 60,
        formTip: 'Keep core tight in straight plank, elbows at 45 degrees',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
          { id: 's3', setNumber: 3, weightKg: 0, reps: 12, completed: false },
        ]
      },
      {
        id: 'hw2',
        exerciseId: 'bodyweight-air-squats',
        name: 'Bodyweight Air Squats',
        targetMuscle: 'Quadriceps & Glutes',
        restSec: 60,
        formTip: 'Hips back and down below parallel, chest tall',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 20, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 20, completed: false },
          { id: 's3', setNumber: 3, weightKg: 0, reps: 20, completed: false },
        ]
      },
      {
        id: 'hw3',
        exerciseId: 'walking-lunges-bw',
        name: 'Bodyweight Walking Lunges',
        targetMuscle: 'Glutes & Legs',
        restSec: 60,
        formTip: 'Step forward 90 degrees, keep chest upright',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 20, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 20, completed: false },
        ]
      },
      {
        id: 'hw4',
        exerciseId: 'chair-dips-home',
        name: 'Home Chair / Couch Dips',
        targetMuscle: 'Triceps & Deltoids',
        restSec: 60,
        formTip: 'Keep back close to chair edge, lower to 90 degrees',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 12, completed: false },
          { id: 's3', setNumber: 3, weightKg: 0, reps: 12, completed: false },
        ]
      },
      {
        id: 'hw5',
        exerciseId: 'glute-bridges-bw',
        name: 'Bodyweight Glute Bridges',
        targetMuscle: 'Glutes & Lower Back',
        restSec: 45,
        formTip: 'Drive through heels, squeeze glutes hard for 2 seconds at top',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 20, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 20, completed: false },
        ]
      },
      {
        id: 'hw6',
        exerciseId: 'bicycle-crunches-bw',
        name: 'Bicycle Crunches',
        targetMuscle: 'Abs & Obliques',
        restSec: 45,
        formTip: 'Rotate ribcage smoothly without pulling on neck',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 20, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 20, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-home-hiit-burn',
    title: 'Home HIIT & Core Burn (Zero Equipment)',
    splitType: 'Cardio & HIIT',
    level: 'beginner',
    durationMinutes: 25,
    daysPerWeek: 3,
    description: 'High energy metabolic bodyweight circuit for cardiovascular stamina, core definition, and maximum calorie burn at home.',
    tags: ['Home Workout', 'No Equipment', 'HIIT', 'Fat Loss', 'Abs'],
    exercises: [
      {
        id: 'hiit1',
        exerciseId: 'mountain-climbers-bw',
        name: 'Dynamic Mountain Climbers',
        targetMuscle: 'Core & Cardio Stamina',
        restSec: 45,
        formTip: 'Fast rhythmic knee drives in strong plank posture',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 30, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 30, completed: false },
          { id: 's3', setNumber: 3, weightKg: 0, reps: 30, completed: false },
        ]
      },
      {
        id: 'hiit2',
        exerciseId: 'bodyweight-pushups',
        name: 'Standard Floor Push-Ups',
        targetMuscle: 'Chest & Arms',
        restSec: 45,
        formTip: 'Explosive push, smooth 2-second descent',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
        ]
      },
      {
        id: 'hiit3',
        exerciseId: 'diamond-pushups',
        name: 'Diamond Close-Grip Push-Ups',
        targetMuscle: 'Triceps & Inner Chest',
        restSec: 45,
        formTip: 'Keep elbows tucked to torso',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 10, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 10, completed: false },
        ]
      },
      {
        id: 'hiit4',
        exerciseId: 'bicycle-crunches-bw',
        name: 'Bicycle Crunches',
        targetMuscle: 'Abs & Obliques',
        restSec: 30,
        formTip: 'Elbow-to-knee contact with full leg extension',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 0, reps: 25, completed: false },
          { id: 's2', setNumber: 2, weightKg: 0, reps: 25, completed: false },
        ]
      }
    ]
  },
  {
    id: 'plan-push-hypertrophy',
    title: 'Push Power & Hypertrophy',
    splitType: 'Weights & Strength',
    level: 'intermediate',
    durationMinutes: 50,
    daysPerWeek: 4,
    description: 'Target Chest, Shoulders, and Triceps with heavy compound lifting and high-volume isolation.',
    tags: ['Weights', 'Muscle Gain', 'Chest & Arms'],
    exercises: [
      {
        id: 'p1',
        exerciseId: 'bench-press-bb',
        name: 'Barbell Flat Bench Press',
        targetMuscle: 'Chest (Mid/Lower)',
        restSec: 120,
        formTip: 'Pinch shoulder blades, drive through floor',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 60, reps: 8, completed: false, isWarmup: true },
          { id: 's2', setNumber: 2, weightKg: 75, reps: 6, completed: false },
          { id: 's3', setNumber: 3, weightKg: 75, reps: 6, completed: false },
          { id: 's4', setNumber: 4, weightKg: 75, reps: 6, completed: false },
        ]
      },
      {
        id: 'p2',
        exerciseId: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        targetMuscle: 'Upper Chest',
        restSec: 90,
        formTip: '30 degree bench, full stretch at bottom',
        sets: [
          { id: 's5', setNumber: 1, weightKg: 26, reps: 10, completed: false },
          { id: 's6', setNumber: 2, weightKg: 26, reps: 10, completed: false },
          { id: 's7', setNumber: 3, weightKg: 26, reps: 8, completed: false },
        ]
      },
      {
        id: 'p3',
        exerciseId: 'overhead-db-press',
        name: 'Seated Dumbbell Shoulder Press',
        targetMuscle: 'Shoulders (Front/Side)',
        restSec: 90,
        formTip: 'Keep core tight against back pad',
        sets: [
          { id: 's8', setNumber: 1, weightKg: 20, reps: 10, completed: false },
          { id: 's9', setNumber: 2, weightKg: 20, reps: 10, completed: false },
          { id: 's10', setNumber: 3, weightKg: 20, reps: 8, completed: false },
        ]
      },
      {
        id: 'p4',
        exerciseId: 'db-lateral-raise',
        name: 'Dumbbell Lateral Raise',
        targetMuscle: 'Side Delts',
        restSec: 60,
        formTip: 'Control the descent, lead with elbows',
        sets: [
          { id: 's11', setNumber: 1, weightKg: 10, reps: 15, completed: false },
          { id: 's12', setNumber: 2, weightKg: 10, reps: 14, completed: false },
          { id: 's13', setNumber: 3, weightKg: 10, reps: 12, completed: false },
        ]
      },
      {
        id: 'p5',
        exerciseId: 'tricep-rope-pushdown',
        name: 'Cable Tricep Rope Pushdown',
        targetMuscle: 'Triceps',
        restSec: 60,
        formTip: 'Spread rope handles wide at lockout',
        sets: [
          { id: 's14', setNumber: 1, weightKg: 25, reps: 12, completed: false },
          { id: 's15', setNumber: 2, weightKg: 25, reps: 12, completed: false },
          { id: 's16', setNumber: 3, weightKg: 25, reps: 10, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-zumba-fiesta',
    title: 'Zumba Latin Fiesta & Dance Blast',
    splitType: 'Zumba & Dance',
    level: 'beginner',
    durationMinutes: 40,
    daysPerWeek: 3,
    description: 'High-energy, mood-boosting Latin dance workout combining Salsa, Reggaeton, Merengue, and Cumbia rhythm sculpt.',
    tags: ['Zumba', 'Dance', 'High Calorie Burn', 'Cardio'],
    exercises: [
      {
        id: 'zm1',
        exerciseId: 'zumba-salsa-cardio',
        name: 'Zumba Salsa & Merengue Rhythm Step',
        targetMuscle: 'Full Body Aerobic',
        restSec: 45,
        formTip: 'Keep hips fluid and step to the beat',
        sets: [
          { id: 'zms1', setNumber: 1, weightKg: 0, reps: 1, completed: false },
          { id: 'zms2', setNumber: 2, weightKg: 0, reps: 1, completed: false },
          { id: 'zms3', setNumber: 3, weightKg: 0, reps: 1, completed: false },
        ]
      },
      {
        id: 'zm2',
        exerciseId: 'zumba-reggaeton-bounce',
        name: 'Reggaeton Dance Squat & Bounce',
        targetMuscle: 'Glutes & Quads',
        restSec: 45,
        formTip: 'Stay low in athletic squat stance',
        sets: [
          { id: 'zms4', setNumber: 1, weightKg: 0, reps: 1, completed: false },
          { id: 'zms5', setNumber: 2, weightKg: 0, reps: 1, completed: false },
          { id: 'zms6', setNumber: 3, weightKg: 0, reps: 1, completed: false },
        ]
      },
      {
        id: 'zm3',
        exerciseId: 'zumba-cumbia-cross',
        name: 'Cumbia Machete & Sleepy Step',
        targetMuscle: 'Obliques & Calves',
        restSec: 45,
        formTip: 'Sweeping arms with waist swivel',
        sets: [
          { id: 'zms7', setNumber: 1, weightKg: 0, reps: 1, completed: false },
          { id: 'zms8', setNumber: 2, weightKg: 0, reps: 1, completed: false },
        ]
      },
      {
        id: 'zm4',
        exerciseId: 'zumba-toning-sticks',
        name: 'Zumba Toning & Light Weight Dance Sculpt',
        targetMuscle: 'Shoulders & Full Body',
        restSec: 60,
        formTip: 'Controlled arm pulses while dancing',
        sets: [
          { id: 'zms9', setNumber: 1, weightKg: 2, reps: 1, completed: false },
          { id: 'zms10', setNumber: 2, weightKg: 2, reps: 1, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-swim-endurance',
    title: 'Aquatic Swim Endurance & Laps',
    splitType: 'Swimming & Aquatics',
    level: 'intermediate',
    durationMinutes: 45,
    daysPerWeek: 3,
    description: 'Full-body zero-impact aerobic conditioning: freestyle interval laps, breaststroke power glides, and deep-water treading.',
    tags: ['Swimming', 'Cardio', 'Low Impact', 'Endurance'],
    exercises: [
      {
        id: 'sw1',
        exerciseId: 'swim-freestyle-laps',
        name: 'Freestyle High-Pace Laps',
        targetMuscle: 'Lats & Cardio',
        restSec: 30,
        formTip: 'Bilateral breathing, long stroke pull',
        sets: [
          { id: 'sws1', setNumber: 1, weightKg: 0, reps: 50, completed: false },
          { id: 'sws2', setNumber: 2, weightKg: 0, reps: 50, completed: false },
          { id: 'sws3', setNumber: 3, weightKg: 0, reps: 50, completed: false },
          { id: 'sws4', setNumber: 4, weightKg: 0, reps: 50, completed: false },
        ]
      },
      {
        id: 'sw2',
        exerciseId: 'swim-breaststroke',
        name: 'Breaststroke Power Glide',
        targetMuscle: 'Chest & Inner Thighs',
        restSec: 45,
        formTip: 'Glide 2 seconds after each powerful whip kick',
        sets: [
          { id: 'sws5', setNumber: 1, weightKg: 0, reps: 50, completed: false },
          { id: 'sws6', setNumber: 2, weightKg: 0, reps: 50, completed: false },
          { id: 'sws7', setNumber: 3, weightKg: 0, reps: 50, completed: false },
        ]
      },
      {
        id: 'sw3',
        exerciseId: 'swim-backstroke',
        name: 'Backstroke Endurance Recovery Laps',
        targetMuscle: 'Upper Back & Calves',
        restSec: 30,
        formTip: 'Continuous windmill arms, high hips',
        sets: [
          { id: 'sws8', setNumber: 1, weightKg: 0, reps: 50, completed: false },
          { id: 'sws9', setNumber: 2, weightKg: 0, reps: 50, completed: false },
        ]
      },
      {
        id: 'sw4',
        exerciseId: 'treading-water-intervals',
        name: 'High-Knee Treading Water',
        targetMuscle: 'Core & Hip Flexors',
        restSec: 45,
        formTip: 'Keep hands out of water for max intensity',
        sets: [
          { id: 'sws10', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'sws11', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-boxing-conditioning',
    title: 'Boxer Heavy Bag & Combat Stamina',
    splitType: 'Boxing & Martial Arts',
    level: 'intermediate',
    durationMinutes: 40,
    daysPerWeek: 3,
    description: 'High-intensity fight conditioning: 6-punch power combinations, fast-paced shadow slip drills, and speed jump rope.',
    tags: ['Boxing', 'Martial Arts', 'HIIT', 'Core Power'],
    exercises: [
      {
        id: 'bx1',
        exerciseId: 'speed-jump-rope',
        name: 'High-Speed Jump Rope Intervals',
        targetMuscle: 'Calves & Foot Agility',
        restSec: 30,
        formTip: 'Stay on balls of feet, turn from wrists',
        sets: [
          { id: 'bxs1', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'bxs2', setNumber: 2, weightKg: 0, reps: 60, completed: false },
          { id: 'bxs3', setNumber: 3, weightKg: 0, reps: 60, completed: false },
        ]
      },
      {
        id: 'bx2',
        exerciseId: 'boxing-heavy-bag-combos',
        name: 'Heavy Bag 6-Punch Combinations',
        targetMuscle: 'Rotational Core & Shoulders',
        restSec: 60,
        formTip: 'Pivot hips on crosses and hooks',
        sets: [
          { id: 'bxs4', setNumber: 1, weightKg: 0, reps: 3, completed: false },
          { id: 'bxs5', setNumber: 2, weightKg: 0, reps: 3, completed: false },
          { id: 'bxs6', setNumber: 3, weightKg: 0, reps: 3, completed: false },
          { id: 'bxs7', setNumber: 4, weightKg: 0, reps: 3, completed: false },
        ]
      },
      {
        id: 'bx3',
        exerciseId: 'boxing-shadow-footwork',
        name: 'Shadow Boxing & Defensive Slips',
        targetMuscle: 'Shoulders & Agility',
        restSec: 45,
        formTip: 'Change angles and keep tight guard',
        sets: [
          { id: 'bxs8', setNumber: 1, weightKg: 0, reps: 3, completed: false },
          { id: 'bxs9', setNumber: 2, weightKg: 0, reps: 3, completed: false },
          { id: 'bxs10', setNumber: 3, weightKg: 0, reps: 3, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-yoga-flow',
    title: 'Vinyasa Flow & Deep Hip Mobility',
    splitType: 'Yoga & Mobility',
    level: 'beginner',
    durationMinutes: 35,
    daysPerWeek: 4,
    description: 'Dynamic breath-to-movement flow, spinal articulation, deep hip unlocking, and posture correction.',
    tags: ['Yoga', 'Mobility', 'Flexibility', 'Recovery'],
    exercises: [
      {
        id: 'yg1',
        exerciseId: 'vinyasa-flow-sun-salutation',
        name: 'Vinyasa Sun Salutation Flow',
        targetMuscle: 'Spine & Full Body Flow',
        restSec: 30,
        formTip: 'Match each breath with movement',
        sets: [
          { id: 'ygs1', setNumber: 1, weightKg: 0, reps: 5, completed: false },
          { id: 'ygs2', setNumber: 2, weightKg: 0, reps: 5, completed: false },
          { id: 'ygs3', setNumber: 3, weightKg: 0, reps: 5, completed: false },
        ]
      },
      {
        id: 'yg2',
        exerciseId: 'pigeon-pose-mobility',
        name: 'Pigeon Pose Deep Hip Opener',
        targetMuscle: 'Glutes & Hip Flexors',
        restSec: 20,
        formTip: 'Square hips, surrender into stretch',
        sets: [
          { id: 'ygs4', setNumber: 1, weightKg: 0, reps: 90, completed: false },
          { id: 'ygs5', setNumber: 2, weightKg: 0, reps: 90, completed: false },
        ]
      },
      {
        id: 'yg3',
        exerciseId: 'plank-hold',
        name: 'Plank Hold & Center Alignment',
        targetMuscle: 'Deep Core',
        restSec: 30,
        formTip: 'Tuck pelvis, hold active line',
        sets: [
          { id: 'ygs6', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'ygs7', setNumber: 2, weightKg: 0, reps: 45, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-full-body-deep-stretch',
    title: 'Full-Body Restorative Mobility & Deep Stretch',
    splitType: 'Yoga & Mobility',
    level: 'beginner',
    durationMinutes: 20,
    daysPerWeek: 5,
    description: 'Complete full-body static and dynamic stretching routine for muscle recovery, joint decompression, and posture relief.',
    tags: ['Stretching', 'Mobility', 'Flexibility', 'Recovery', 'Posture'],
    exercises: [
      {
        id: 'st1',
        exerciseId: 'cat-cow-spinal-flow',
        name: 'Cat-Cow Spinal Mobility Wave',
        targetMuscle: 'Thoracic Spine & Abdominals',
        restSec: 15,
        formTip: 'Synchronize breath with spinal wave',
        sets: [
          { id: 'sts1', setNumber: 1, weightKg: 0, reps: 10, completed: false },
          { id: 'sts2', setNumber: 2, weightKg: 0, reps: 10, completed: false },
        ],
      },
      {
        id: 'st2',
        exerciseId: 'worlds-greatest-stretch',
        name: "World's Greatest Stretch",
        targetMuscle: 'Hips, Groin & Thoracic Spine',
        restSec: 25,
        formTip: 'Deep elbow reach to ankle then open skyward',
        sets: [
          { id: 'sts3', setNumber: 1, weightKg: 0, reps: 6, completed: false },
          { id: 'sts4', setNumber: 2, weightKg: 0, reps: 6, completed: false },
        ],
      },
      {
        id: 'st3',
        exerciseId: 'low-lunge-quad-hip-flexor',
        name: 'Low Lunge & Psoas Hip Flexor Stretch',
        targetMuscle: 'Hip Flexors & Quads',
        restSec: 20,
        formTip: 'Squeeze rear glute to release psoas',
        sets: [
          { id: 'sts5', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'sts6', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ],
      },
      {
        id: 'st4',
        exerciseId: 'pigeon-pose-mobility',
        name: 'Pigeon Pose Deep Hip Opener',
        targetMuscle: 'Glutes & Hip Rotators',
        restSec: 20,
        formTip: 'Square hips and breathe into outer glute',
        sets: [
          { id: 'sts7', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'sts8', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ],
      },
      {
        id: 'st5',
        exerciseId: 'seated-forward-fold-stretch',
        name: 'Seated Forward Fold Hamstring Stretch',
        targetMuscle: 'Hamstrings & Posterior Chain',
        restSec: 20,
        formTip: 'Hinge from hips with elongated spine',
        sets: [
          { id: 'sts9', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'sts10', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ],
      },
      {
        id: 'st6',
        exerciseId: 'childs-pose-restorative',
        name: "Child's Pose Restorative Stretch",
        targetMuscle: 'Spine & Lats',
        restSec: 15,
        formTip: 'Surrender hips into heels, expand ribcage',
        sets: [
          { id: 'sts11', setNumber: 1, weightKg: 0, reps: 90, completed: false },
        ],
      },
    ],
  },
  {
    id: 'plan-morning-vinyasa-yoga',
    title: 'Morning Energizing Vinyasa Yoga Flow',
    splitType: 'Yoga & Mobility',
    level: 'beginner',
    durationMinutes: 25,
    daysPerWeek: 4,
    description: 'Awaken body and mind with invigorating breath synchronization, Sun Salutations, Warrior II strength, and spinal twists.',
    tags: ['Yoga', 'Vinyasa', 'Flexibility', 'Core', 'Morning'],
    exercises: [
      {
        id: 'my1',
        exerciseId: 'vinyasa-flow-sun-salutation',
        name: 'Vinyasa Sun Salutation Flow',
        targetMuscle: 'Full Body Movement & Spine',
        restSec: 25,
        formTip: 'Match each breath with movement',
        sets: [
          { id: 'mys1', setNumber: 1, weightKg: 0, reps: 5, completed: false },
          { id: 'mys2', setNumber: 2, weightKg: 0, reps: 5, completed: false },
        ],
      },
      {
        id: 'my2',
        exerciseId: 'downward-facing-dog',
        name: 'Downward-Facing Dog Hold',
        targetMuscle: 'Hamstrings, Calves & Shoulders',
        restSec: 20,
        formTip: 'Tailbone high, lengthen through armpits',
        sets: [
          { id: 'mys3', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'mys4', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ],
      },
      {
        id: 'my3',
        exerciseId: 'warrior-two-pose',
        name: 'Warrior II Strength Flow',
        targetMuscle: 'Hips, Quads & Upper Back',
        restSec: 20,
        formTip: 'Deep 90-degree front knee, relaxed shoulders',
        sets: [
          { id: 'mys5', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'mys6', setNumber: 2, weightKg: 0, reps: 45, completed: false },
        ],
      },
      {
        id: 'my4',
        exerciseId: 'triangle-pose-flow',
        name: 'Extended Triangle Pose',
        targetMuscle: 'Lateral Spine, Hamstrings & Chest',
        restSec: 20,
        formTip: 'Open chest upward like flat glass pane',
        sets: [
          { id: 'mys7', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'mys8', setNumber: 2, weightKg: 0, reps: 45, completed: false },
        ],
      },
      {
        id: 'my5',
        exerciseId: 'cobra-upward-dog-stretch',
        name: 'Cobra Chest & Spine Stretch',
        targetMuscle: 'Chest & Lumbar Extension',
        restSec: 20,
        formTip: 'Keep elbows soft and neck elongated',
        sets: [
          { id: 'mys9', setNumber: 1, weightKg: 0, reps: 45, completed: false },
        ],
      },
      {
        id: 'my6',
        exerciseId: 'reclined-spinal-twist',
        name: 'Reclined Supine Spinal Twist',
        targetMuscle: 'Spinal Decompression & Glutes',
        restSec: 15,
        formTip: 'Keep both shoulder blades grounded',
        sets: [
          { id: 'mys10', setNumber: 1, weightKg: 0, reps: 60, completed: false },
        ],
      },
    ],
  },
  {
    id: 'plan-desk-posture-reset',
    title: 'Desk Worker Tech-Neck & Hip Flexor Reset',
    splitType: 'Yoga & Mobility',
    level: 'beginner',
    durationMinutes: 12,
    daysPerWeek: 6,
    description: 'Targeted office and desk stretching routine to counter sitting, eliminate forward-head posture, and open tight hip flexors.',
    tags: ['Stretching', 'Desk Worker', 'Posture', 'Neck', 'Hips'],
    exercises: [
      {
        id: 'dk1',
        exerciseId: 'desk-tech-neck-trap-stretch',
        name: 'Desk Cervical & Upper Trap Release',
        targetMuscle: 'Upper Trapezius & Neck',
        restSec: 15,
        formTip: 'Gentle passive hand weight only, no pulling',
        sets: [
          { id: 'dks1', setNumber: 1, weightKg: 0, reps: 45, completed: false },
        ],
      },
      {
        id: 'dk2',
        exerciseId: 'doorway-chest-shoulder-stretch',
        name: 'Doorway Pectoral & Shoulder Opener',
        targetMuscle: 'Chest & Anterior Deltoids',
        restSec: 15,
        formTip: 'Step forward, breathe wide into ribs',
        sets: [
          { id: 'dks2', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'dks3', setNumber: 2, weightKg: 0, reps: 45, completed: false },
        ],
      },
      {
        id: 'dk3',
        exerciseId: 'low-lunge-quad-hip-flexor',
        name: 'Low Lunge Hip Flexor Opener',
        targetMuscle: 'Hip Flexors & Psoas',
        restSec: 20,
        formTip: 'Tuck pelvis and gently glide forward',
        sets: [
          { id: 'dks4', setNumber: 1, weightKg: 0, reps: 45, completed: false },
        ],
      },
      {
        id: 'dk4',
        exerciseId: 'ninety-ninety-hip-switch',
        name: '90/90 Hip Mobility Flow',
        targetMuscle: 'Internal & External Hip Rotators',
        restSec: 20,
        formTip: 'Sit tall through transitions',
        sets: [
          { id: 'dks5', setNumber: 1, weightKg: 0, reps: 8, completed: false },
        ],
      },
      {
        id: 'dk5',
        exerciseId: 'childs-pose-restorative',
        name: "Child's Pose Restorative Stretch",
        targetMuscle: 'Spine & Lower Back',
        restSec: 15,
        formTip: 'Rest forehead, exhale deeply',
        sets: [
          { id: 'dks6', setNumber: 1, weightKg: 0, reps: 60, completed: false },
        ],
      },
    ],
  },
  {
    id: 'plan-evening-yin-yoga',
    title: 'Evening Yin Yoga & Deep Relaxation for Sleep',
    splitType: 'Yoga & Mobility',
    level: 'beginner',
    durationMinutes: 18,
    daysPerWeek: 7,
    description: 'Gentle, passive restorative poses held for deep fascia release, activating parasympathetic recovery for restorative sleep.',
    tags: ['Yoga', 'Yin Yoga', 'Stretching', 'Sleep', 'Restorative'],
    exercises: [
      {
        id: 'yn1',
        exerciseId: 'childs-pose-restorative',
        name: "Child's Pose Restorative Stretch",
        targetMuscle: 'Lower Back & Hips',
        restSec: 15,
        formTip: 'Sink into gravity with calm belly breathing',
        sets: [
          { id: 'yns1', setNumber: 1, weightKg: 0, reps: 90, completed: false },
        ],
      },
      {
        id: 'yn2',
        exerciseId: 'butterfly-adductor-stretch',
        name: 'Seated Butterfly Groin Stretch',
        targetMuscle: 'Inner Thighs & Groin',
        restSec: 15,
        formTip: 'Do not force knees; surrender with breath',
        sets: [
          { id: 'yns2', setNumber: 1, weightKg: 0, reps: 90, completed: false },
        ],
      },
      {
        id: 'yn3',
        exerciseId: 'pigeon-pose-mobility',
        name: 'Pigeon Pose Deep Hip Opener',
        targetMuscle: 'Deep Glutes & Piriformis',
        restSec: 20,
        formTip: 'Forearms on mat, slow 4-count exhale',
        sets: [
          { id: 'yns3', setNumber: 1, weightKg: 0, reps: 90, completed: false },
        ],
      },
      {
        id: 'yn4',
        exerciseId: 'seated-forward-fold-stretch',
        name: 'Seated Forward Fold Hamstring Stretch',
        targetMuscle: 'Hamstrings & Spine',
        restSec: 15,
        formTip: 'Gentle passive fold, release tension',
        sets: [
          { id: 'yns4', setNumber: 1, weightKg: 0, reps: 90, completed: false },
        ],
      },
      {
        id: 'yn5',
        exerciseId: 'reclined-spinal-twist',
        name: 'Reclined Supine Spinal Twist',
        targetMuscle: 'Spinal Mobility & Relaxation',
        restSec: 15,
        formTip: 'Grounded shoulders, calm nervous system',
        sets: [
          { id: 'yns5', setNumber: 1, weightKg: 0, reps: 90, completed: false },
        ],
      },
    ],
  },
  {
    id: 'plan-pilates-core',
    title: 'Pilates Sculpt & Core Power Mat',
    splitType: 'Pilates & Core',
    level: 'intermediate',
    durationMinutes: 30,
    daysPerWeek: 3,
    description: 'Precision core activation, pelvic stability, spinal control, and lean muscular conditioning.',
    tags: ['Pilates', 'Core', 'Toning', 'Posture'],
    exercises: [
      {
        id: 'pl1_core',
        exerciseId: 'pilates-the-hundred',
        name: 'Classical Pilates: The Hundred',
        targetMuscle: 'Transverse Abdominis',
        restSec: 45,
        formTip: 'Lower back glued to mat, strong rhythmic pumps',
        sets: [
          { id: 'pls1_c', setNumber: 1, weightKg: 0, reps: 100, completed: false },
        ]
      },
      {
        id: 'pl2_core',
        exerciseId: 'pilates-teaser',
        name: 'Pilates Teaser V-Hold',
        targetMuscle: 'Abs & Hip Flexors',
        restSec: 45,
        formTip: 'Articulate spine smoothly into V',
        sets: [
          { id: 'pls2_c', setNumber: 1, weightKg: 0, reps: 8, completed: false },
          { id: 'pls3_c', setNumber: 2, weightKg: 0, reps: 8, completed: false },
          { id: 'pls4_c', setNumber: 3, weightKg: 0, reps: 8, completed: false },
        ]
      },
      {
        id: 'pl3_core',
        exerciseId: 'cable-woodchopper',
        name: 'Rotational Oblique Control',
        targetMuscle: 'Obliques',
        restSec: 45,
        formTip: 'Rotate purely from torso',
        sets: [
          { id: 'pls5_c', setNumber: 1, weightKg: 15, reps: 12, completed: false },
          { id: 'pls6_c', setNumber: 2, weightKg: 15, reps: 12, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-push-power',
    title: 'Push Power & Hypertrophy',
    splitType: 'Push / Pull / Legs',
    level: 'intermediate',
    durationMinutes: 55,
    daysPerWeek: 4,
    description: 'Target Chest, Shoulders, and Triceps with heavy compound lifting and high-volume isolation.',
    tags: ['Muscle Gain', 'Strength', 'Upper Body'],
    exercises: [
      {
        id: 'p1',
        exerciseId: 'bench-press-bb',
        name: 'Barbell Flat Bench Press',
        targetMuscle: 'Chest (Mid/Lower)',
        restSec: 120,
        formTip: 'Pinch shoulder blades, drive through floor',
        sets: [
          { id: 's1', setNumber: 1, weightKg: 60, reps: 8, completed: false, isWarmup: true },
          { id: 's2', setNumber: 2, weightKg: 75, reps: 6, completed: false },
          { id: 's3', setNumber: 3, weightKg: 75, reps: 6, completed: false },
          { id: 's4', setNumber: 4, weightKg: 75, reps: 6, completed: false },
        ]
      },
      {
        id: 'p2',
        exerciseId: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        targetMuscle: 'Upper Chest',
        restSec: 90,
        formTip: '30 degree bench, full stretch at bottom',
        sets: [
          { id: 's5', setNumber: 1, weightKg: 26, reps: 10, completed: false },
          { id: 's6', setNumber: 2, weightKg: 26, reps: 10, completed: false },
          { id: 's7', setNumber: 3, weightKg: 26, reps: 8, completed: false },
        ]
      },
      {
        id: 'p3',
        exerciseId: 'overhead-db-press',
        name: 'Seated Dumbbell Shoulder Press',
        targetMuscle: 'Shoulders (Front/Side)',
        restSec: 90,
        formTip: 'Keep core tight against back pad',
        sets: [
          { id: 's8', setNumber: 1, weightKg: 20, reps: 10, completed: false },
          { id: 's9', setNumber: 2, weightKg: 20, reps: 10, completed: false },
          { id: 's10', setNumber: 3, weightKg: 20, reps: 8, completed: false },
        ]
      },
      {
        id: 'p4',
        exerciseId: 'db-lateral-raise',
        name: 'Dumbbell Lateral Raise',
        targetMuscle: 'Side Delts',
        restSec: 60,
        formTip: 'Control the descent, lead with elbows',
        sets: [
          { id: 's11', setNumber: 1, weightKg: 10, reps: 15, completed: false },
          { id: 's12', setNumber: 2, weightKg: 10, reps: 14, completed: false },
          { id: 's13', setNumber: 3, weightKg: 10, reps: 12, completed: false },
        ]
      },
      {
        id: 'p5',
        exerciseId: 'tricep-rope-pushdown',
        name: 'Cable Tricep Rope Pushdown',
        targetMuscle: 'Triceps',
        restSec: 60,
        formTip: 'Spread rope handles wide at lockout',
        sets: [
          { id: 's14', setNumber: 1, weightKg: 25, reps: 12, completed: false },
          { id: 's15', setNumber: 2, weightKg: 25, reps: 12, completed: false },
          { id: 's16', setNumber: 3, weightKg: 25, reps: 10, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-pull-builder',
    title: 'Pull Hypertrophy & V-Taper',
    splitType: 'Push / Pull / Legs',
    level: 'intermediate',
    durationMinutes: 50,
    daysPerWeek: 4,
    description: 'Build a wide, thick back and peak biceps with vertical pulls, rows, and isolation curls.',
    tags: ['Back & Biceps', 'Hypertrophy', 'Posture'],
    exercises: [
      {
        id: 'pl1',
        exerciseId: 'pull-ups',
        name: 'Pull-Ups (Overhand Grip)',
        targetMuscle: 'Lats & Upper Back',
        restSec: 90,
        formTip: 'Full stretch at bottom, chest up',
        sets: [
          { id: 'pls1', setNumber: 1, weightKg: 0, reps: 8, completed: false },
          { id: 'pls2', setNumber: 2, weightKg: 0, reps: 8, completed: false },
          { id: 'pls3', setNumber: 3, weightKg: 0, reps: 6, completed: false },
        ]
      },
      {
        id: 'pl2',
        exerciseId: 'bent-over-bb-row',
        name: 'Barbell Bent-Over Row',
        targetMuscle: 'Mid-Back & Lats',
        restSec: 90,
        formTip: 'Pull to belly button, keep back flat',
        sets: [
          { id: 'pls4', setNumber: 1, weightKg: 60, reps: 10, completed: false },
          { id: 'pls5', setNumber: 2, weightKg: 60, reps: 10, completed: false },
          { id: 'pls6', setNumber: 3, weightKg: 60, reps: 8, completed: false },
        ]
      },
      {
        id: 'pl3',
        exerciseId: 'lat-pulldown',
        name: 'Lat Pulldown (Wide Grip)',
        targetMuscle: 'Lats',
        restSec: 75,
        formTip: 'Drive elbows down, squeeze lats',
        sets: [
          { id: 'pls7', setNumber: 1, weightKg: 55, reps: 12, completed: false },
          { id: 'pls8', setNumber: 2, weightKg: 55, reps: 12, completed: false },
          { id: 'pls9', setNumber: 3, weightKg: 55, reps: 10, completed: false },
        ]
      },
      {
        id: 'pl4',
        exerciseId: 'face-pulls',
        name: 'Cable Rope Face Pulls',
        targetMuscle: 'Rear Delts & Rotator Cuff',
        restSec: 60,
        formTip: 'Hands apart, pull to forehead',
        sets: [
          { id: 'pls10', setNumber: 1, weightKg: 20, reps: 15, completed: false },
          { id: 'pls11', setNumber: 2, weightKg: 20, reps: 15, completed: false },
          { id: 'pls12', setNumber: 3, weightKg: 20, reps: 15, completed: false },
        ]
      },
      {
        id: 'pl5',
        exerciseId: 'barbell-bicep-curl',
        name: 'Barbell Bicep Curl',
        targetMuscle: 'Biceps',
        restSec: 60,
        formTip: 'Strict form, no swinging back',
        sets: [
          { id: 'pls13', setNumber: 1, weightKg: 30, reps: 10, completed: false },
          { id: 'pls14', setNumber: 2, weightKg: 30, reps: 10, completed: false },
          { id: 'pls15', setNumber: 3, weightKg: 30, reps: 8, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-legs-core',
    title: 'Legs & Core Powerhouse',
    splitType: 'Push / Pull / Legs',
    level: 'intermediate',
    durationMinutes: 55,
    daysPerWeek: 4,
    description: 'Heavy squats, Romanian deadlifts for hamstrings, lunges, and deep core strengthening.',
    tags: ['Leg Day', 'Strength', 'Core'],
    exercises: [
      {
        id: 'lg1',
        exerciseId: 'barbell-squat',
        name: 'Barbell Back Squat',
        targetMuscle: 'Quads & Glutes',
        restSec: 150,
        formTip: 'Deep squat, knees tracking over toes',
        sets: [
          { id: 'lgs1', setNumber: 1, weightKg: 60, reps: 10, completed: false, isWarmup: true },
          { id: 'lgs2', setNumber: 2, weightKg: 90, reps: 8, completed: false },
          { id: 'lgs3', setNumber: 3, weightKg: 90, reps: 8, completed: false },
          { id: 'lgs4', setNumber: 4, weightKg: 90, reps: 6, completed: false },
        ]
      },
      {
        id: 'lg2',
        exerciseId: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        targetMuscle: 'Hamstrings & Glutes',
        restSec: 90,
        formTip: 'Hinge hips back, feel hamstring stretch',
        sets: [
          { id: 'lgs5', setNumber: 1, weightKg: 70, reps: 10, completed: false },
          { id: 'lgs6', setNumber: 2, weightKg: 70, reps: 10, completed: false },
          { id: 'lgs7', setNumber: 3, weightKg: 70, reps: 8, completed: false },
        ]
      },
      {
        id: 'lg3',
        exerciseId: 'walking-lunges',
        name: 'Dumbbell Walking Lunges',
        targetMuscle: 'Glutes & Quads',
        restSec: 90,
        formTip: 'Long strides, keep chest tall',
        sets: [
          { id: 'lgs8', setNumber: 1, weightKg: 16, reps: 12, completed: false },
          { id: 'lgs9', setNumber: 2, weightKg: 16, reps: 12, completed: false },
          { id: 'lgs10', setNumber: 3, weightKg: 16, reps: 12, completed: false },
        ]
      },
      {
        id: 'lg4',
        exerciseId: 'hanging-leg-raise',
        name: 'Hanging Leg / Knee Raise',
        targetMuscle: 'Lower Abs',
        restSec: 60,
        formTip: 'Curl hips upward, no momentum swing',
        sets: [
          { id: 'lgs11', setNumber: 1, weightKg: 0, reps: 12, completed: false },
          { id: 'lgs12', setNumber: 2, weightKg: 0, reps: 12, completed: false },
          { id: 'lgs13', setNumber: 3, weightKg: 0, reps: 12, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-hiit-fatburn',
    title: '20-Min HIIT & Athletic Conditioning',
    splitType: 'Full Body / Cardio',
    level: 'beginner',
    durationMinutes: 25,
    daysPerWeek: 3,
    description: 'High calorie burn, metabolic boost, and endurance conditioning using bodyweight and kettlebells.',
    tags: ['Fat Loss', 'HIIT', 'Endurance'],
    exercises: [
      {
        id: 'ht1',
        exerciseId: 'hiit-burpees',
        name: 'Chest-to-Floor Burpees',
        targetMuscle: 'Full Body Cardio',
        restSec: 30,
        formTip: 'Explosive jump at top',
        sets: [
          { id: 'hts1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 'hts2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
          { id: 'hts3', setNumber: 3, weightKg: 0, reps: 12, completed: false },
        ]
      },
      {
        id: 'ht2',
        exerciseId: 'kettlebell-swing',
        name: 'Russian Kettlebell Swing',
        targetMuscle: 'Glutes & Hamstrings',
        restSec: 45,
        formTip: 'Snap hips, don’t squat the bell',
        sets: [
          { id: 'hts4', setNumber: 1, weightKg: 16, reps: 20, completed: false },
          { id: 'hts5', setNumber: 2, weightKg: 16, reps: 20, completed: false },
          { id: 'hts6', setNumber: 3, weightKg: 16, reps: 20, completed: false },
        ]
      },
      {
        id: 'ht3',
        exerciseId: 'plank-hold',
        name: 'Forearm Plank',
        targetMuscle: 'Core & Stability',
        restSec: 45,
        formTip: 'Squeeze glutes and abs tight',
        sets: [
          { id: 'hts7', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'hts8', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ]
      },
    ]
  },

  // ===================== FEMALE SPECIALIZED WORKOUTS =====================
  {
    id: 'plan-female-glute-sculpt',
    title: 'Female Glute Hypertrophy & Waist Sculpt',
    splitType: 'Weights & Strength',
    level: 'intermediate',
    targetGender: 'female',
    durationMinutes: 50,
    daysPerWeek: 4,
    description: 'Designed specifically for lower-body curves, upper glute shelf development, hip stability, and a tight sculpted waist.',
    tags: ['Female Focus', 'Glute Growth', 'Hourglass', 'Toning'],
    exercises: [
      {
        id: 'fg1',
        exerciseId: 'barbell-hip-thrust',
        name: 'Barbell Hip Thrust (Glute Hypertrophy)',
        targetMuscle: 'Gluteus Maximus (Upper/Mid)',
        restSec: 90,
        formTip: '2-second hard squeeze at top, chin tucked',
        sets: [
          { id: 'fgs1', setNumber: 1, weightKg: 40, reps: 12, completed: false, isWarmup: true },
          { id: 'fgs2', setNumber: 2, weightKg: 55, reps: 10, completed: false },
          { id: 'fgs3', setNumber: 3, weightKg: 60, reps: 10, completed: false },
          { id: 'fgs4', setNumber: 4, weightKg: 60, reps: 8, completed: false },
        ]
      },
      {
        id: 'fg2',
        exerciseId: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squat (Rear Foot Elevated)',
        targetMuscle: 'Glutes & Quads',
        restSec: 75,
        formTip: 'Forward torso lean for deep glute stretch',
        sets: [
          { id: 'fgs5', setNumber: 1, weightKg: 10, reps: 10, completed: false },
          { id: 'fgs6', setNumber: 2, weightKg: 12, reps: 10, completed: false },
          { id: 'fgs7', setNumber: 3, weightKg: 12, reps: 10, completed: false },
        ]
      },
      {
        id: 'fg3',
        exerciseId: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        targetMuscle: 'Hamstrings & Glute-Ham Tie-in',
        restSec: 75,
        formTip: 'Push hips back, tight core, soft knees',
        sets: [
          { id: 'fgs8', setNumber: 1, weightKg: 40, reps: 12, completed: false },
          { id: 'fgs9', setNumber: 2, weightKg: 45, reps: 10, completed: false },
          { id: 'fgs10', setNumber: 3, weightKg: 45, reps: 10, completed: false },
        ]
      },
      {
        id: 'fg4',
        exerciseId: 'cable-glute-kickback',
        name: 'Cable Glute Kickback & Abduction',
        targetMuscle: 'Gluteus Medius & Shelf',
        restSec: 45,
        formTip: 'Kick 45-degrees back, pause 1s at apex',
        sets: [
          { id: 'fgs11', setNumber: 1, weightKg: 7.5, reps: 15, completed: false },
          { id: 'fgs12', setNumber: 2, weightKg: 10, reps: 12, completed: false },
          { id: 'fgs13', setNumber: 3, weightKg: 10, reps: 12, completed: false },
        ]
      },
      {
        id: 'fg5',
        exerciseId: 'plank-hold',
        name: 'Plank with Pelvic Tilt Core Tightening',
        targetMuscle: 'Transverse Abdominis & Deep Core',
        restSec: 45,
        formTip: 'Pull belly button to spine to tighten waistline',
        sets: [
          { id: 'fgs14', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'fgs15', setNumber: 2, weightKg: 0, reps: 45, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-female-fullbody-tone',
    title: 'Female Full-Body Tone & Posture Sculpt',
    splitType: 'Weights & Strength',
    level: 'beginner',
    targetGender: 'female',
    durationMinutes: 45,
    daysPerWeek: 3,
    description: 'Beginner-friendly full body toning split focusing on posture correction, back contouring, toned arms, and leg shaping.',
    tags: ['Female Focus', 'Full Body', 'Beginner', 'Toning', 'Posture'],
    exercises: [
      {
        id: 'fbt1',
        exerciseId: 'db-goblet-squat',
        name: 'Dumbbell Goblet Squat',
        targetMuscle: 'Quads & Glutes',
        restSec: 60,
        formTip: 'Hold dumbbell tight at chest, sit deep',
        sets: [
          { id: 'fbts1', setNumber: 1, weightKg: 8, reps: 12, completed: false },
          { id: 'fbts2', setNumber: 2, weightKg: 10, reps: 12, completed: false },
          { id: 'fbts3', setNumber: 3, weightKg: 10, reps: 12, completed: false },
        ]
      },
      {
        id: 'fbt2',
        exerciseId: 'lat-pulldown',
        name: 'Lat Pulldown (Wide Grip)',
        targetMuscle: 'Upper Back & Posture',
        restSec: 60,
        formTip: 'Open chest and pull shoulder blades together',
        sets: [
          { id: 'fbts4', setNumber: 1, weightKg: 25, reps: 12, completed: false },
          { id: 'fbts5', setNumber: 2, weightKg: 30, reps: 12, completed: false },
          { id: 'fbts6', setNumber: 3, weightKg: 30, reps: 10, completed: false },
        ]
      },
      {
        id: 'fbt3',
        exerciseId: 'db-lateral-raise',
        name: 'Dumbbell Lateral Raise',
        targetMuscle: 'Shoulder Definition',
        restSec: 45,
        formTip: 'Light weights, smooth controlled tempo',
        sets: [
          { id: 'fbts7', setNumber: 1, weightKg: 4, reps: 15, completed: false },
          { id: 'fbts8', setNumber: 2, weightKg: 4, reps: 15, completed: false },
          { id: 'fbts9', setNumber: 3, weightKg: 4, reps: 12, completed: false },
        ]
      },
      {
        id: 'fbt4',
        exerciseId: 'tricep-rope-pushdown',
        name: 'Cable Tricep Rope Pushdown',
        targetMuscle: 'Toned Triceps',
        restSec: 45,
        formTip: 'Spread rope at bottom for arm tightening',
        sets: [
          { id: 'fbts10', setNumber: 1, weightKg: 12, reps: 15, completed: false },
          { id: 'fbts11', setNumber: 2, weightKg: 15, reps: 12, completed: false },
        ]
      },
      {
        id: 'fbt5',
        exerciseId: 'treadmill-incline-walk',
        name: 'Zone 2 Incline Glute Treadmill Walk',
        targetMuscle: 'Cardio & Fat Burning',
        restSec: 0,
        formTip: '12% incline, 4.8 km/h, hands free',
        sets: [
          { id: 'fbts12', setNumber: 1, weightKg: 0, reps: 15, completed: false },
        ]
      },
    ]
  },

  // ===================== BEGINNER FOUNDATION PLANS =====================
  {
    id: 'plan-beginner-3day',
    title: '3-Day Beginner Full-Body Foundation',
    splitType: 'Weights & Strength',
    level: 'beginner',
    targetGender: 'all',
    durationMinutes: 45,
    daysPerWeek: 3,
    description: 'Safe, foundational gym introduction covering essential compound movements, correct joint alignment, and gradual strength progression.',
    tags: ['Beginner', 'Foundation', 'Full Body', 'Linear Progress'],
    exercises: [
      {
        id: 'bg1',
        exerciseId: 'db-goblet-squat',
        name: 'Dumbbell Goblet Squat',
        targetMuscle: 'Quads & Glutes',
        restSec: 75,
        formTip: 'Keep heels glued to floor, chest upright',
        sets: [
          { id: 'bgs1', setNumber: 1, weightKg: 10, reps: 12, completed: false },
          { id: 'bgs2', setNumber: 2, weightKg: 12, reps: 10, completed: false },
          { id: 'bgs3', setNumber: 3, weightKg: 12, reps: 10, completed: false },
        ]
      },
      {
        id: 'bg2',
        exerciseId: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        targetMuscle: 'Chest & Shoulders',
        restSec: 75,
        formTip: '30-degree angle, controlled descent',
        sets: [
          { id: 'bgs4', setNumber: 1, weightKg: 12, reps: 10, completed: false },
          { id: 'bgs5', setNumber: 2, weightKg: 14, reps: 10, completed: false },
          { id: 'bgs6', setNumber: 3, weightKg: 14, reps: 10, completed: false },
        ]
      },
      {
        id: 'bg3',
        exerciseId: 'lat-pulldown',
        name: 'Lat Pulldown (Wide Grip)',
        targetMuscle: 'Lats & Upper Back',
        restSec: 75,
        formTip: 'Pull bar smoothly to collarbone',
        sets: [
          { id: 'bgs7', setNumber: 1, weightKg: 35, reps: 12, completed: false },
          { id: 'bgs8', setNumber: 2, weightKg: 40, reps: 10, completed: false },
          { id: 'bgs9', setNumber: 3, weightKg: 40, reps: 10, completed: false },
        ]
      },
      {
        id: 'bg4',
        exerciseId: 'face-pulls',
        name: 'Cable Rope Face Pulls',
        targetMuscle: 'Shoulder Health & Upper Back',
        restSec: 60,
        formTip: 'Pull rope apart to ear level',
        sets: [
          { id: 'bgs10', setNumber: 1, weightKg: 15, reps: 15, completed: false },
          { id: 'bgs11', setNumber: 2, weightKg: 15, reps: 15, completed: false },
        ]
      },
      {
        id: 'bg5',
        exerciseId: 'plank-hold',
        name: 'Forearm Core Plank',
        targetMuscle: 'Core & Abdominals',
        restSec: 60,
        formTip: 'Breathe normally, do not let lower back sag',
        sets: [
          { id: 'bgs12', setNumber: 1, weightKg: 0, reps: 30, completed: false },
          { id: 'bgs13', setNumber: 2, weightKg: 0, reps: 30, completed: false },
        ]
      },
    ]
  },

  // ===================== PRO ATHLETE & ADVANCED PLANS =====================
  {
    id: 'plan-athlete-powerlifting',
    title: 'Pro Powerlifting & 1RM Strength Peak',
    splitType: 'Weights & Strength',
    level: 'athlete',
    targetGender: 'all',
    durationMinutes: 65,
    daysPerWeek: 4,
    description: 'High-intensity neuromuscular strength block focusing on heavy squats, paused bench press, and deadlifts with RPE 8-9.5 CNS loading.',
    tags: ['Athlete', 'Powerlifting', '1RM Strength', 'Heavy Compound'],
    exercises: [
      {
        id: 'ath1',
        exerciseId: 'barbell-squat',
        name: 'Barbell Back Squat (Heavy 1RM Focus)',
        targetMuscle: 'Lower Body Maximal Force',
        restSec: 180,
        formTip: 'Brace core with belt, drive explosively out of hole',
        sets: [
          { id: 'aths1', setNumber: 1, weightKg: 80, reps: 5, completed: false, isWarmup: true },
          { id: 'aths2', setNumber: 2, weightKg: 110, reps: 3, completed: false, isWarmup: true },
          { id: 'aths3', setNumber: 3, weightKg: 130, reps: 3, completed: false },
          { id: 'aths4', setNumber: 4, weightKg: 140, reps: 2, completed: false },
          { id: 'aths5', setNumber: 5, weightKg: 145, reps: 2, completed: false },
        ]
      },
      {
        id: 'ath2',
        exerciseId: 'bench-press-bb',
        name: 'Barbell Flat Bench Press (1s Paused)',
        targetMuscle: 'Upper Body Pressing Power',
        restSec: 150,
        formTip: '1-second pause on chest, explosive leg drive press',
        sets: [
          { id: 'aths6', setNumber: 1, weightKg: 70, reps: 5, completed: false, isWarmup: true },
          { id: 'aths7', setNumber: 2, weightKg: 95, reps: 3, completed: false },
          { id: 'aths8', setNumber: 3, weightKg: 105, reps: 3, completed: false },
          { id: 'aths9', setNumber: 4, weightKg: 110, reps: 2, completed: false },
        ]
      },
      {
        id: 'ath3',
        exerciseId: 'deadlift-bb',
        name: 'Conventional Barbell Deadlift',
        targetMuscle: 'Posterior Chain Raw Power',
        restSec: 180,
        formTip: 'Lock lats, push floor away through heels',
        sets: [
          { id: 'aths10', setNumber: 1, weightKg: 100, reps: 5, completed: false, isWarmup: true },
          { id: 'aths11', setNumber: 2, weightKg: 140, reps: 3, completed: false },
          { id: 'aths12', setNumber: 3, weightKg: 160, reps: 2, completed: false },
          { id: 'aths13', setNumber: 4, weightKg: 170, reps: 2, completed: false },
        ]
      },
    ]
  },
  {
    id: 'plan-athlete-crossfit',
    title: 'CrossFit WOD & High-Threshold Conditioning',
    splitType: 'CrossFit & Functional',
    level: 'athlete',
    targetGender: 'all',
    durationMinutes: 45,
    daysPerWeek: 5,
    description: 'Elite conditioning circuit combining dumbbell thrusters, explosive plyometric box jumps, pull-ups, and rowing sprint intervals.',
    tags: ['Athlete', 'CrossFit', 'HIIT', 'Power Endurance', 'VO2 Max'],
    exercises: [
      {
        id: 'cf1',
        exerciseId: 'dumbbell-thruster',
        name: 'Dumbbell Thrusters (Squat to Overhead)',
        targetMuscle: 'Full Body Power & VO2 Max',
        restSec: 45,
        formTip: 'Continuous momentum from squat to press',
        sets: [
          { id: 'cfs1', setNumber: 1, weightKg: 18, reps: 15, completed: false },
          { id: 'cfs2', setNumber: 2, weightKg: 20, reps: 12, completed: false },
          { id: 'cfs3', setNumber: 3, weightKg: 20, reps: 12, completed: false },
          { id: 'cfs4', setNumber: 4, weightKg: 20, reps: 10, completed: false },
        ]
      },
      {
        id: 'cf2',
        exerciseId: 'pull-ups',
        name: 'Pull-Ups / Butterfly Kips',
        targetMuscle: 'Upper Body Pulling Density',
        restSec: 45,
        formTip: 'Full range of motion, chin over bar',
        sets: [
          { id: 'cfs5', setNumber: 1, weightKg: 0, reps: 12, completed: false },
          { id: 'cfs6', setNumber: 2, weightKg: 0, reps: 12, completed: false },
          { id: 'cfs7', setNumber: 3, weightKg: 0, reps: 10, completed: false },
        ]
      },
      {
        id: 'cf3',
        exerciseId: 'box-jump-explosive',
        name: 'Plyometric Box Jumps (24/30 Inch)',
        targetMuscle: 'Leg Explosiveness',
        restSec: 45,
        formTip: 'Soft landing, aggressive hip opening at apex',
        sets: [
          { id: 'cfs8', setNumber: 1, weightKg: 0, reps: 10, completed: false },
          { id: 'cfs9', setNumber: 2, weightKg: 0, reps: 10, completed: false },
          { id: 'cfs10', setNumber: 3, weightKg: 0, reps: 10, completed: false },
        ]
      },
      {
        id: 'cf4',
        exerciseId: 'rowing-intervals',
        name: 'Rowing Machine 500m Max Sprint',
        targetMuscle: 'Cardio & Lactic Tolerance',
        restSec: 60,
        formTip: 'Drive through legs first, hold sub-1:40 split pace',
        sets: [
          { id: 'cfs11', setNumber: 1, weightKg: 0, reps: 500, completed: false },
          { id: 'cfs12', setNumber: 2, weightKg: 0, reps: 500, completed: false },
        ]
      },
    ]
  }
];

export const POPULAR_FOODS_DATABASE: FoodItem[] = [
  // ===================== INDIAN PROTEIN & STAPLES =====================
  {
    id: 'ind-paneer-raw',
    name: 'Paneer / Indian Cottage Cheese (Raw)',
    hindiName: 'पनीर (कच्चा)',
    cuisine: 'Indian',
    category: 'Dairy & Paneer',
    servingSize: '100g',
    servingUnitWeightGrams: 100,
    calories: 265,
    proteinGrams: 18.3,
    carbsGrams: 3.5,
    fatsGrams: 20.8,
    fiberGrams: 0,
    dietPreference: 'veg',
    benefits: 'Rich in slow-digesting casein protein & calcium for bone strength'
  },
  {
    id: 'ind-lowfat-paneer',
    name: 'Low-Fat / Diet Paneer',
    hindiName: 'कम वसा वाला पनीर',
    cuisine: 'Indian',
    category: 'Dairy & Paneer',
    servingSize: '100g',
    servingUnitWeightGrams: 100,
    calories: 145,
    proteinGrams: 24.5,
    carbsGrams: 4.2,
    fatsGrams: 3.5,
    fiberGrams: 0,
    dietPreference: 'veg',
    benefits: 'High protein-to-calorie ratio, ideal for pure veg fat loss'
  },
  {
    id: 'ind-soya-chunks',
    name: 'Soya Chunks / Nutrela (Dry)',
    hindiName: 'सोया चंक्स (न्यूट्रिला)',
    cuisine: 'Indian',
    category: 'High Protein',
    servingSize: '50g dry (yields 150g cooked)',
    servingUnitWeightGrams: 50,
    calories: 172,
    proteinGrams: 26.0,
    carbsGrams: 16.5,
    fatsGrams: 0.5,
    fiberGrams: 6.5,
    dietPreference: 'vegan',
    benefits: 'Super-rich vegetarian protein powerhouse with complete amino acid profile'
  },
  {
    id: 'ind-dal-tadka',
    name: 'Dal Tadka / Yellow Arhar-Moong Dal (Cooked)',
    hindiName: 'दाल तड़का (अरहर/मूंग)',
    cuisine: 'Indian',
    category: 'Lentils & Pulses',
    servingSize: '1 medium bowl (200g)',
    servingUnitWeightGrams: 200,
    calories: 185,
    proteinGrams: 9.8,
    carbsGrams: 24.0,
    fatsGrams: 5.5,
    fiberGrams: 6.2,
    dietPreference: 'veg',
    benefits: 'Gentle on stomach, rich in dietary fiber, folate and potassium'
  },
  {
    id: 'ind-dal-makhani-light',
    name: 'Dal Makhani (Light Home Style)',
    hindiName: 'दाल मखनी (घर की)',
    cuisine: 'Indian',
    category: 'Lentils & Pulses',
    servingSize: '1 bowl (200g)',
    servingUnitWeightGrams: 200,
    calories: 245,
    proteinGrams: 11.2,
    carbsGrams: 28.0,
    fatsGrams: 9.8,
    fiberGrams: 7.5,
    dietPreference: 'veg',
    benefits: 'Black urad lentils provide iron and sustained complex energy'
  },
  {
    id: 'ind-rajma-masala',
    name: 'Rajma Masala / Red Kidney Beans Curry',
    hindiName: 'राजमा मसाला',
    cuisine: 'Indian',
    category: 'Lentils & Pulses',
    servingSize: '1 bowl (200g)',
    servingUnitWeightGrams: 200,
    calories: 220,
    proteinGrams: 12.4,
    carbsGrams: 33.0,
    fatsGrams: 4.8,
    fiberGrams: 8.8,
    dietPreference: 'vegan',
    benefits: 'Low glycemic index carb with high prebiotic fiber and plant protein'
  },
  {
    id: 'ind-chole-masala',
    name: 'Chole Masala / Chickpea Curry (Cooked)',
    hindiName: 'छोले मसाला (चना)',
    cuisine: 'Indian',
    category: 'Lentils & Pulses',
    servingSize: '1 bowl (200g)',
    servingUnitWeightGrams: 200,
    calories: 235,
    proteinGrams: 11.8,
    carbsGrams: 34.5,
    fatsGrams: 6.0,
    fiberGrams: 8.2,
    dietPreference: 'vegan',
    benefits: 'Satiety booster that keeps hunger low and stabilizes blood sugar'
  },
  {
    id: 'ind-sprouted-moong-salad',
    name: 'Sprouted Moong Bean Salad',
    hindiName: 'अंकुरित मूंग सलाद',
    cuisine: 'Indian',
    category: 'High Protein',
    servingSize: '1 bowl (150g)',
    servingUnitWeightGrams: 150,
    calories: 140,
    proteinGrams: 11.5,
    carbsGrams: 22.0,
    fatsGrams: 0.8,
    fiberGrams: 6.0,
    dietPreference: 'vegan',
    benefits: 'Loaded with active enzymes, Vitamin C, iron and antioxidant flavonoids'
  },
  {
    id: 'ind-sattu-drink',
    name: 'Desi Sattu Protein Drink (Roasted Gram Flour)',
    hindiName: 'देसी सत्तू शरबत / ड्रिंक',
    cuisine: 'Indian',
    category: 'High Protein',
    servingSize: '1 glass (40g Sattu powder in water)',
    servingUnitWeightGrams: 250,
    calories: 165,
    proteinGrams: 10.4,
    carbsGrams: 26.0,
    fatsGrams: 2.1,
    fiberGrams: 5.8,
    dietPreference: 'vegan',
    benefits: 'Natural cooling summer protein booster, keeps gut healthy and full'
  },
  {
    id: 'ind-besan-chilla',
    name: 'Besan Chilla / Gram Flour Pancake (with Veggies)',
    hindiName: 'बेसन का चीला (सब्जियों के साथ)',
    cuisine: 'Indian',
    category: 'Traditional Indian Meals',
    servingSize: '2 medium chillas (140g)',
    servingUnitWeightGrams: 140,
    calories: 210,
    proteinGrams: 12.0,
    carbsGrams: 26.0,
    fatsGrams: 6.5,
    fiberGrams: 5.2,
    dietPreference: 'vegan',
    benefits: 'Gluten-free, nutrient dense high-protein breakfast option'
  },
  {
    id: 'ind-chicken-tikka',
    name: 'Tandoori / Grilled Chicken Tikka Breast',
    hindiName: 'चिकन टिक्का / तंदूरी चिकन',
    cuisine: 'Indian',
    category: 'Poultry & Meat',
    servingSize: '150g (5-6 pieces)',
    servingUnitWeightGrams: 150,
    calories: 230,
    proteinGrams: 42.0,
    carbsGrams: 3.5,
    fatsGrams: 5.5,
    fiberGrams: 0.5,
    dietPreference: 'non_veg',
    benefits: 'Leanest high-protein Indian delicacy packed with warming spices like turmeric'
  },
  {
    id: 'ind-chicken-curry-homestyle',
    name: 'Chicken Curry (Homestyle Low-Oil)',
    hindiName: 'घर का बना चिकन करी',
    cuisine: 'Indian',
    category: 'Poultry & Meat',
    servingSize: '1 bowl with 2 pieces (200g)',
    servingUnitWeightGrams: 200,
    calories: 275,
    proteinGrams: 34.0,
    carbsGrams: 6.0,
    fatsGrams: 12.5,
    fiberGrams: 1.5,
    dietPreference: 'non_veg',
    benefits: 'Nutrient-rich bone broth minerals, bioavailable iron and zinc'
  },
  {
    id: 'ind-egg-bhurji',
    name: 'Desi Egg Bhurji (2 Whole Eggs + 2 Whites)',
    hindiName: 'अंडा भुर्जी (मसाला एग)',
    cuisine: 'Indian',
    category: 'Poultry & Meat',
    servingSize: '1 plate (160g)',
    servingUnitWeightGrams: 160,
    calories: 225,
    proteinGrams: 23.5,
    carbsGrams: 4.5,
    fatsGrams: 12.0,
    fiberGrams: 1.2,
    dietPreference: 'eggetarian',
    benefits: 'High biological value protein with choline for brain function'
  },
  {
    id: 'ind-fish-curry',
    name: 'Rohu / Pomfret Fish Curry',
    hindiName: 'मछली करी (फिश करी)',
    cuisine: 'Indian',
    category: 'Seafood',
    servingSize: '1 medium fillet + gravy (180g)',
    servingUnitWeightGrams: 180,
    calories: 215,
    proteinGrams: 28.0,
    carbsGrams: 3.0,
    fatsGrams: 9.8,
    fiberGrams: 0.5,
    dietPreference: 'non_veg',
    benefits: 'Natural Omega-3 fatty acids for joint mobility and cardiovascular health'
  },
  {
    id: 'ind-whole-wheat-roti',
    name: 'Whole Wheat Roti / Phulka (No Ghee)',
    hindiName: 'गेहूं की रोटी / फुल्का',
    cuisine: 'Indian',
    category: 'Grains & Carbs',
    servingSize: '1 standard roti (35g raw flour)',
    servingUnitWeightGrams: 45,
    calories: 85,
    proteinGrams: 3.2,
    carbsGrams: 17.5,
    fatsGrams: 0.5,
    fiberGrams: 2.8,
    dietPreference: 'vegan',
    benefits: 'Complex whole-grain carbohydrate providing steady glycemic energy'
  },
  {
    id: 'ind-khichdi',
    name: 'Moong Dal & Brown Rice Khichdi',
    hindiName: 'मूंग दाल खिचड़ी',
    cuisine: 'Indian',
    category: 'Traditional Indian Meals',
    servingSize: '1 medium bowl (220g)',
    servingUnitWeightGrams: 220,
    calories: 230,
    proteinGrams: 9.5,
    carbsGrams: 40.0,
    fatsGrams: 3.8,
    fiberGrams: 5.5,
    dietPreference: 'veg',
    benefits: 'Ultimate ayurvedic gut-healing meal with complementary amino acids'
  },
  {
    id: 'ind-idli-sambar',
    name: 'Steamed Idli with Sambar (2 Idlis)',
    hindiName: 'इडली और सांभर (2 पीस)',
    cuisine: 'Indian',
    category: 'Traditional Indian Meals',
    servingSize: '2 Idlis + 1 cup Sambar (200g)',
    servingUnitWeightGrams: 200,
    calories: 190,
    proteinGrams: 7.5,
    carbsGrams: 37.0,
    fatsGrams: 1.5,
    fiberGrams: 4.8,
    dietPreference: 'vegan',
    benefits: 'Fermented food rich in probiotic bio-availability and easy digestion'
  },
  {
    id: 'ind-masala-dosa',
    name: 'Plain / Masala Dosa (Home-Style, Crisp)',
    hindiName: 'मसाला डोसा (घर का)',
    cuisine: 'Indian',
    category: 'Traditional Indian Meals',
    servingSize: '1 medium dosa with potato filling (150g)',
    servingUnitWeightGrams: 150,
    calories: 260,
    proteinGrams: 6.0,
    carbsGrams: 42.0,
    fatsGrams: 8.0,
    fiberGrams: 3.5,
    dietPreference: 'vegan',
    benefits: 'Fermented crispy rice-lentil crepe'
  },
  {
    id: 'ind-curd-dahi',
    name: 'Fresh Curd / Dahi (Whole Milk)',
    hindiName: 'ताज़ा दही',
    cuisine: 'Indian',
    category: 'Dairy & Paneer',
    servingSize: '1 cup (150g)',
    servingUnitWeightGrams: 150,
    calories: 95,
    proteinGrams: 5.5,
    carbsGrams: 6.5,
    fatsGrams: 5.2,
    fiberGrams: 0,
    dietPreference: 'veg',
    benefits: 'Packed with live Lactobacillus probiotics for gut microbiome'
  },
  {
    id: 'ind-roasted-makhana',
    name: 'Roasted Foxnuts / Makhana (Light Ghee/Salt)',
    hindiName: 'भुना हुआ मखाना (फॉक्स नट्स)',
    cuisine: 'Indian',
    category: 'Nuts & Healthy Fats',
    servingSize: '1 bowl (40g)',
    servingUnitWeightGrams: 40,
    calories: 145,
    proteinGrams: 4.0,
    carbsGrams: 28.0,
    fatsGrams: 2.2,
    fiberGrams: 3.0,
    dietPreference: 'vegan',
    benefits: 'Low-calorie crunchy snack rich in magnesium and anti-aging antioxidants'
  },
  {
    id: 'ind-roasted-chana',
    name: 'Roasted Black Chana (Bengal Gram)',
    hindiName: 'भुना हुआ काला चना',
    cuisine: 'Indian',
    category: 'High Protein',
    servingSize: '1 handful (50g)',
    servingUnitWeightGrams: 50,
    calories: 185,
    proteinGrams: 11.5,
    carbsGrams: 29.0,
    fatsGrams: 2.5,
    fiberGrams: 8.5,
    dietPreference: 'vegan',
    benefits: 'Dense in slow-burning complex carbs and satisfying crunch'
  },
  {
    id: 'ind-poha-veggies',
    name: 'Flattened Rice Poha with Veggies & Peanuts',
    hindiName: 'पोहा (सब्जियों और मूंगफली के साथ)',
    cuisine: 'Indian',
    category: 'Traditional Indian Meals',
    servingSize: '1 plate (180g)',
    servingUnitWeightGrams: 180,
    calories: 240,
    proteinGrams: 5.5,
    carbsGrams: 42.0,
    fatsGrams: 6.0,
    fiberGrams: 3.8,
    dietPreference: 'vegan',
    benefits: 'Naturally iron-rich breakfast, very light on the stomach'
  },
  {
    id: 'ind-chicken-biryani',
    name: 'Lean Chicken Dum Biryani (Home-Style)',
    hindiName: 'चिकन दम बिरयानी (कम तेल)',
    cuisine: 'Indian',
    category: 'Poultry & Meat',
    servingSize: '1 plate (250g)',
    servingUnitWeightGrams: 250,
    calories: 385,
    proteinGrams: 28.0,
    carbsGrams: 48.0,
    fatsGrams: 9.5,
    fiberGrams: 2.5,
    dietPreference: 'non_veg',
    benefits: 'Balanced aromatic meal with high protein and long-grain Basmati'
  },

  // ===================== INTERNATIONAL HEALTH FOODS =====================
  {
    id: 'int-chicken-breast',
    name: 'Grilled Chicken Breast (Skinless)',
    hindiName: 'ग्रिल्ड चिकन ब्रेस्ट',
    cuisine: 'International',
    category: 'Poultry & Meat',
    servingSize: '150g cooked',
    servingUnitWeightGrams: 150,
    calories: 247,
    proteinGrams: 46.5,
    carbsGrams: 0,
    fatsGrams: 5.4,
    fiberGrams: 0,
    dietPreference: 'non_veg',
    benefits: 'The ultimate gold standard for lean muscle building & fat loss'
  },
  {
    id: 'int-whole-eggs',
    name: 'Whole Eggs (Boiled / Poached)',
    hindiName: 'उबले हुए अंडे (2 पूरे)',
    cuisine: 'International',
    category: 'Poultry & Meat',
    servingSize: '2 large eggs (100g)',
    servingUnitWeightGrams: 100,
    calories: 143,
    proteinGrams: 12.6,
    carbsGrams: 0.7,
    fatsGrams: 9.5,
    fiberGrams: 0,
    dietPreference: 'eggetarian',
    benefits: 'Contains all 9 essential amino acids, choline, lutein, and vitamin D'
  },
  {
    id: 'int-egg-whites',
    name: 'Liquid / Boiled Egg Whites',
    hindiName: 'अंडे का सफेद भाग (4-5 अंडे)',
    cuisine: 'International',
    category: 'Poultry & Meat',
    servingSize: '150g (4-5 egg whites)',
    servingUnitWeightGrams: 150,
    calories: 78,
    proteinGrams: 16.5,
    carbsGrams: 1.1,
    fatsGrams: 0.3,
    fiberGrams: 0,
    dietPreference: 'eggetarian',
    benefits: 'Pure zero-fat bioavailable protein for aggressive cutting'
  },
  {
    id: 'int-salmon-fillet',
    name: 'Atlantic Salmon Fillet (Pan-Seared)',
    hindiName: 'सैल्मन फिश (ओमेगा 3 रिच)',
    cuisine: 'International',
    category: 'Seafood',
    servingSize: '150g fillet',
    servingUnitWeightGrams: 150,
    calories: 312,
    proteinGrams: 34.0,
    carbsGrams: 0,
    fatsGrams: 18.5,
    fiberGrams: 0,
    dietPreference: 'non_veg',
    benefits: 'High EPA/DHA Omega-3s that reduce muscle inflammation and boost recovery'
  },
  {
    id: 'int-tuna-can',
    name: 'Canned Tuna in Spring Water',
    hindiName: 'टूना फिश (पानी में)',
    cuisine: 'International',
    category: 'Seafood',
    servingSize: '1 can drained (120g)',
    servingUnitWeightGrams: 120,
    calories: 130,
    proteinGrams: 29.0,
    carbsGrams: 0,
    fatsGrams: 1.2,
    fiberGrams: 0,
    dietPreference: 'non_veg',
    benefits: 'Convenient high-density protein snack with nearly zero carbohydrates'
  },
  {
    id: 'int-greek-yogurt',
    name: 'Greek Yogurt (0% Fat Plain / Unsweetened)',
    hindiName: 'ग्रीक योगर्ट (0% फैट)',
    cuisine: 'International',
    category: 'Dairy & Paneer',
    servingSize: '200g (1 cup)',
    servingUnitWeightGrams: 200,
    calories: 118,
    proteinGrams: 20.6,
    carbsGrams: 7.2,
    fatsGrams: 0.8,
    fiberGrams: 0,
    dietPreference: 'veg',
    benefits: 'Strained yogurt with double the protein of normal curd and probiotics'
  },
  {
    id: 'int-whey-isolate',
    name: '100% Whey Protein Isolate (1 Scoop)',
    hindiName: 'व्हे प्रोटीन आइसोलेट (1 स्कूप)',
    cuisine: 'International',
    category: 'Supplements & Shakes',
    servingSize: '1 scoop (30g powder)',
    servingUnitWeightGrams: 30,
    calories: 120,
    proteinGrams: 25.0,
    carbsGrams: 1.5,
    fatsGrams: 0.8,
    fiberGrams: 0,
    dietPreference: 'veg',
    benefits: 'Fastest absorbing protein with high leucine content to trigger muscle synthesis'
  },
  {
    id: 'int-casein-protein',
    name: 'Micellar Casein Protein Shake (Night)',
    hindiName: 'कैसीन प्रोटीन (रात के लिए)',
    cuisine: 'International',
    category: 'Supplements & Shakes',
    servingSize: '1 scoop (32g)',
    servingUnitWeightGrams: 32,
    calories: 120,
    proteinGrams: 24.0,
    carbsGrams: 2.0,
    fatsGrams: 1.0,
    fiberGrams: 0,
    dietPreference: 'veg',
    benefits: 'Slow-release 7-hour amino acid stream ideal before sleep'
  },
  {
    id: 'int-rolled-oats',
    name: 'Rolled Whole Oats (Raw / Porridge)',
    hindiName: 'रोल्ड ओट्स (दलिया)',
    cuisine: 'International',
    category: 'Grains & Carbs',
    servingSize: '60g raw',
    servingUnitWeightGrams: 60,
    calories: 233,
    proteinGrams: 8.0,
    carbsGrams: 40.0,
    fatsGrams: 4.2,
    fiberGrams: 6.2,
    dietPreference: 'vegan',
    benefits: 'Beta-glucan fiber helps lower bad cholesterol and feeds healthy gut bacteria'
  },
  {
    id: 'int-quinoa-cooked',
    name: 'Quinoa Bowl (Cooked)',
    hindiName: 'क्विनोआ (पका हुआ)',
    cuisine: 'International',
    category: 'Grains & Carbs',
    servingSize: '150g cooked',
    servingUnitWeightGrams: 150,
    calories: 180,
    proteinGrams: 6.5,
    carbsGrams: 32.0,
    fatsGrams: 2.8,
    fiberGrams: 4.2,
    dietPreference: 'vegan',
    benefits: 'Ancient gluten-free pseudo-grain containing all 9 essential amino acids'
  },
  {
    id: 'int-sweet-potato',
    name: 'Baked / Steamed Sweet Potato',
    hindiName: 'शकरकंद (स्वीट पोटैटो)',
    cuisine: 'International',
    category: 'Grains & Carbs',
    servingSize: '1 medium (200g)',
    servingUnitWeightGrams: 200,
    calories: 180,
    proteinGrams: 4.0,
    carbsGrams: 41.4,
    fatsGrams: 0.3,
    fiberGrams: 6.6,
    dietPreference: 'vegan',
    benefits: 'High Vitamin A, potassium, and complex carbs for intense workouts'
  },
  {
    id: 'int-avocado-toast',
    name: 'Avocado on Whole Grain Sourdough',
    hindiName: 'एवोकाडो टोस्ट',
    cuisine: 'International',
    category: 'Healthy Bowls & Salads',
    servingSize: '1 slice + 1/2 avocado (130g)',
    servingUnitWeightGrams: 130,
    calories: 240,
    proteinGrams: 6.0,
    carbsGrams: 22.0,
    fatsGrams: 15.0,
    fiberGrams: 7.5,
    dietPreference: 'vegan',
    benefits: 'Heart-healthy monounsaturated oleic acid and rich in dietary potassium'
  },
  {
    id: 'int-peanut-butter',
    name: 'Natural Peanut Butter (100% Peanuts)',
    hindiName: 'पीनट बटर (शुद्ध मूंगफली)',
    cuisine: 'Universal',
    category: 'Nuts & Healthy Fats',
    servingSize: '2 tbsp (32g)',
    servingUnitWeightGrams: 32,
    calories: 188,
    proteinGrams: 8.0,
    carbsGrams: 6.3,
    fatsGrams: 16.0,
    fiberGrams: 2.0,
    dietPreference: 'vegan',
    benefits: 'Dense healthy fats and plant protein for calorie surpluses and sustained energy'
  },
  {
    id: 'int-tofu-firm',
    name: 'Firm Tofu / Bean Curd (Grilled/Stir-Fry)',
    hindiName: 'टोफू (सोया पनीर)',
    cuisine: 'International',
    category: 'High Protein',
    servingSize: '150g',
    servingUnitWeightGrams: 150,
    calories: 165,
    proteinGrams: 18.5,
    carbsGrams: 3.5,
    fatsGrams: 8.5,
    fiberGrams: 2.2,
    dietPreference: 'vegan',
    benefits: 'Low-calorie vegan protein rich in isoflavones, calcium and manganese'
  },
  {
    id: 'int-chia-pudding',
    name: 'Chia Seed Pudding (with Almond Milk & Berries)',
    hindiName: 'चिया सीड्स पुडिंग',
    cuisine: 'International',
    category: 'Healthy Bowls & Salads',
    servingSize: '1 glass (180g)',
    servingUnitWeightGrams: 180,
    calories: 175,
    proteinGrams: 5.5,
    carbsGrams: 18.0,
    fatsGrams: 9.0,
    fiberGrams: 9.5,
    dietPreference: 'vegan',
    benefits: 'Plant-based Omega-3 ALA, soluble mucilage fiber for digestion'
  },
  {
    id: 'int-steamed-broccoli',
    name: 'Steamed Broccoli & Green Veggies',
    hindiName: 'उबली हुई ब्रोकली व हरी सब्जियां',
    cuisine: 'Universal',
    category: 'Fruits & Veggies',
    servingSize: '150g',
    servingUnitWeightGrams: 150,
    calories: 51,
    proteinGrams: 4.2,
    carbsGrams: 10.0,
    fatsGrams: 0.6,
    fiberGrams: 3.9,
    dietPreference: 'vegan',
    benefits: 'Sulforaphane, indole-3-carbinol, high micronutrient density'
  },
  {
    id: 'int-raw-almonds',
    name: 'Raw California Almonds',
    hindiName: 'कच्चा बादाम',
    cuisine: 'Universal',
    category: 'Nuts & Healthy Fats',
    servingSize: '1 handful (30g / ~23 nuts)',
    servingUnitWeightGrams: 30,
    calories: 174,
    proteinGrams: 6.3,
    carbsGrams: 6.1,
    fatsGrams: 15.0,
    fiberGrams: 3.5,
    dietPreference: 'vegan',
    benefits: 'Vitamin E antioxidant power and supports testosterone / lipid balance'
  },
  {
    id: 'int-banana',
    name: 'Fresh Banana (Medium)',
    hindiName: 'केला (मीडियम)',
    cuisine: 'Universal',
    category: 'Fruits & Veggies',
    servingSize: '1 medium (118g)',
    servingUnitWeightGrams: 118,
    calories: 105,
    proteinGrams: 1.3,
    carbsGrams: 27.0,
    fatsGrams: 0.3,
    fiberGrams: 3.1,
    dietPreference: 'vegan',
    benefits: 'Ideal pre/post-workout fast carbohydrate with natural electrolytes'
  },
  {
    id: 'int-plant-protein-powder',
    name: 'Organic Pea & Rice Plant Protein (1 scoop)',
    hindiName: 'ऑर्गेनिक प्लांट प्रोटीन पाउडर (मटर और चावल)',
    cuisine: 'International',
    category: 'Supplements & Shakes',
    servingSize: '1 scoop (33g)',
    servingUnitWeightGrams: 33,
    calories: 125,
    proteinGrams: 25.0,
    carbsGrams: 2.5,
    fatsGrams: 1.5,
    fiberGrams: 1.8,
    dietPreference: 'vegan',
    benefits: '100% Dairy-free, hypoallergenic complete amino acid profile for vegan muscle repair'
  },
  {
    id: 'int-tempeh',
    name: 'Tempeh / Cultured Soybean Cake (Grilled/Stir-Fry)',
    hindiName: 'टेम्पेह (किण्वित सोयाबीन)',
    cuisine: 'International',
    category: 'High Protein',
    servingSize: '100g',
    servingUnitWeightGrams: 100,
    calories: 195,
    proteinGrams: 19.0,
    carbsGrams: 9.0,
    fatsGrams: 11.0,
    fiberGrams: 6.0,
    dietPreference: 'vegan',
    benefits: 'Fermented plant protein packed with gut-friendly probiotics, isoflavones and iron'
  },
  {
    id: 'int-edamame-beans',
    name: 'Steamed Edamame Beans (In Pods)',
    hindiName: 'स्टीम्ड एडामामे (हरी सोयाबीन्स)',
    cuisine: 'International',
    category: 'High Protein',
    servingSize: '1 cup (150g)',
    servingUnitWeightGrams: 150,
    calories: 180,
    proteinGrams: 17.0,
    carbsGrams: 14.0,
    fatsGrams: 8.0,
    fiberGrams: 8.0,
    dietPreference: 'vegan',
    benefits: 'Whole young soybeans with complete essential amino acids and anti-inflammatory nutrients'
  },
  {
    id: 'int-soy-milk-unsweetened',
    name: 'Unsweetened Soy Milk (High Protein)',
    hindiName: 'सोया मिल्क (बिना चीनी)',
    cuisine: 'Universal',
    category: 'Dairy & Paneer',
    servingSize: '1 glass (250ml)',
    servingUnitWeightGrams: 250,
    calories: 90,
    proteinGrams: 8.0,
    carbsGrams: 4.0,
    fatsGrams: 4.0,
    fiberGrams: 1.5,
    dietPreference: 'vegan',
    benefits: 'Plant-based calcium-fortified milk alternative with cow milk-equivalent protein'
  },
  {
    id: 'ind-kala-chana-boiled',
    name: 'Boiled Kala Chana Chaat (Black Chickpeas)',
    hindiName: 'उबला काला चना चाट',
    cuisine: 'Indian',
    category: 'High Protein',
    servingSize: '1 medium bowl (150g)',
    servingUnitWeightGrams: 150,
    calories: 190,
    proteinGrams: 13.0,
    carbsGrams: 30.0,
    fatsGrams: 2.8,
    fiberGrams: 9.5,
    dietPreference: 'vegan',
    benefits: 'Deep sustained energy, dense iron, high satiety without any dairy or powders'
  },
  {
    id: 'int-seeds-pumpkin-sunflower',
    name: 'Roasted Pumpkin & Sunflower Seeds Mix',
    hindiName: 'कद्दू और सूरजमुखी के बीज',
    cuisine: 'Universal',
    category: 'Nuts & Healthy Fats',
    servingSize: '2 tbsp (30g)',
    servingUnitWeightGrams: 30,
    calories: 165,
    proteinGrams: 8.5,
    carbsGrams: 5.0,
    fatsGrams: 13.5,
    fiberGrams: 2.5,
    dietPreference: 'vegan',
    benefits: 'High zinc for testosterone, magnesium for muscle relaxation and plant protein'
  },
  {
    id: 'ind-besan-paneer-chilla',
    name: 'Besan & Paneer Stuffed Chilla (1 large)',
    hindiName: 'बेसन पनीर चीला (1 बड़ा)',
    cuisine: 'Indian',
    category: 'High Protein',
    servingSize: '1 large chilla (150g)',
    servingUnitWeightGrams: 150,
    calories: 235,
    proteinGrams: 16.5,
    carbsGrams: 22.0,
    fatsGrams: 9.0,
    fiberGrams: 4.5,
    dietPreference: 'veg',
    benefits: 'Desi breakfast staple pairing gram flour protein with slow-burning casein paneer'
  }
];

export const DEFAULT_SUPPLEMENTS: SupplementItem[] = [
  {
    id: 'supp-creatine',
    name: 'Creatine Monohydrate (Creapure)',
    hindiName: 'क्रेआटिन मोनोहाइड्रेट',
    dosage: '5g (1 scoop)',
    timing: 'Post-Workout / Morning Hydration',
    timingLabel: 'Post-Workout',
    timeSchedule: '06:30 PM',
    taken: false,
    reminderEnabled: true,
    benefit: 'Increases cellular ATP energy, power output, and intracellular muscle hydration',
    category: 'performance',
  },
  {
    id: 'supp-whey',
    name: 'Whey Protein Isolate',
    hindiName: 'व्हे प्रोटीन आइसोलेट',
    dosage: '30g (1 scoop)',
    timing: 'Immediately after workout or afternoon snack',
    timingLabel: 'Post-Workout',
    timeSchedule: '06:15 PM',
    taken: false,
    reminderEnabled: true,
    benefit: 'Rapidly spikes muscle protein synthesis (MPS) for recovery',
    category: 'recovery',
  },
  {
    id: 'supp-multivitamin',
    name: 'Daily Comprehensive Multivitamin & Minerals',
    hindiName: 'मल्टीविटामिन और मिनरल्स',
    dosage: '1 Tablet',
    timing: 'With Breakfast & Water',
    timingLabel: 'Morning',
    timeSchedule: '08:30 AM',
    taken: false,
    reminderEnabled: true,
    benefit: 'Fills micronutrient gaps: Zinc, B-Complex, Vitamin C, Iron & Selenium',
    category: 'vitality',
  },
  {
    id: 'supp-omega3',
    name: 'Omega-3 Fish Oil / Algal Oil (Triple Strength)',
    hindiName: 'ओमेगा-3 फिश ऑयल',
    dosage: '1000mg (1-2 softgels)',
    timing: 'With Lunch or Dinner (fat-containing meal)',
    timingLabel: 'Lunch',
    timeSchedule: '01:30 PM',
    taken: false,
    reminderEnabled: true,
    benefit: 'EPA/DHA reduces systemic joint inflammation and promotes brain & heart health',
    category: 'joint_health',
  },
  {
    id: 'supp-preworkout',
    name: 'Pre-Workout Energy & Nitric Oxide (Caffeine + Citrulline)',
    hindiName: 'प्री-वर्कआउट सप्लीमेंट',
    dosage: '1 scoop in 300ml cold water',
    timing: '25-30 mins before lifting session',
    timingLabel: 'Pre-Workout',
    timeSchedule: '04:45 PM',
    taken: false,
    reminderEnabled: true,
    benefit: 'Enhances focus, stamina, muscle blood flow and vascular pumps',
    category: 'performance',
  },
  {
    id: 'supp-ashwagandha',
    name: 'Ashwagandha KSM-66 (Organic Extract)',
    hindiName: 'अश्वगंधा केएसएम-66',
    dosage: '500mg (1 capsule)',
    timing: 'Night before bed or with warm milk',
    timingLabel: 'Bedtime',
    timeSchedule: '10:00 PM',
    taken: false,
    reminderEnabled: true,
    benefit: 'Lowers cortisol, boosts natural testosterone, and promotes restorative REM sleep',
    category: 'sleep',
  },
  {
    id: 'supp-vitamind3',
    name: 'Vitamin D3 + K2 (2000 IU)',
    hindiName: 'विटामिन D3 + K2',
    dosage: '1 capsule / drop',
    timing: 'Morning with healthy fats',
    timingLabel: 'Morning',
    timeSchedule: '08:45 AM',
    taken: false,
    reminderEnabled: true,
    benefit: 'Crucial for testosterone synthesis, calcium deposition in bones and immune defense',
    category: 'vitality',
  }
];

export const PRESET_DIET_PLANS: PersonalDietPlan[] = [
  {
    id: 'diet-ind-muscle-gain',
    title: 'Desi High-Protein Muscle Builder',
    tagline: 'Authentic Indian powerhouse diet with 160g+ quality protein for lean hypertrophy',
    goal: 'muscle_gain',
    cuisine: 'Indian',
    dietType: 'high_protein',
    dietTypeLabel: 'Indian High-Protein (Veg / Non-Veg options)',
    dailyCalories: 2650,
    macros: {
      proteinGrams: 165,
      carbsGrams: 285,
      fatsGrams: 68,
    },
    waterTargetMl: 3500,
    recommendedSupplements: ['Creatine Monohydrate (5g)', 'Whey Isolate (1 scoop)', 'Multivitamin'],
    keyBenefits: [
      'Utilizes affordable, high-bioavailable Indian staples (Paneer, Soya, Eggs, Dal, Sattu)',
      'Rich in natural anti-inflammatory spices: Haldi (turmeric), Jeera & Ginger',
      'Timed nutrient intake around workout windows to maximize anabolic gains'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Power Protein Breakfast',
        suggestedTime: '08:00 AM',
        prepTips: 'Cook besan chilla with grated paneer inside and serve with mint chutney.',
        items: [
          { id: 'dp1-1', name: 'Besan Chilla with Paneer & Veggies (2 chillas)', servingSize: '200g', calories: 310, proteinGrams: 20.5, carbsGrams: 28.0, fatsGrams: 12.0, cuisine: 'Indian' },
          { id: 'dp1-2', name: 'Whole Eggs (Boiled/Poached)', servingSize: '2 eggs', calories: 143, proteinGrams: 12.6, carbsGrams: 0.7, fatsGrams: 9.5, cuisine: 'Universal' },
          { id: 'dp1-3', name: 'Fresh Curd / Dahi', servingSize: '150g', calories: 95, proteinGrams: 5.5, carbsGrams: 6.5, fatsGrams: 5.2, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Nutrient-Dense Indian Anabolic Lunch',
        suggestedTime: '01:00 PM',
        prepTips: 'Pair hot dal tadka with grilled chicken or raw low-fat paneer, green salad and phulkas.',
        items: [
          { id: 'dp1-4', name: 'Tandoori / Grilled Chicken Tikka Breast', servingSize: '150g', calories: 230, proteinGrams: 42.0, carbsGrams: 3.5, fatsGrams: 5.5, cuisine: 'Indian' },
          { id: 'dp1-5', name: 'Dal Tadka / Yellow Lentils', servingSize: '1 bowl (200g)', calories: 185, proteinGrams: 9.8, carbsGrams: 24.0, fatsGrams: 5.5, cuisine: 'Indian' },
          { id: 'dp1-6', name: 'Whole Wheat Roti / Phulka (2 rotis)', servingSize: '2 rotis (90g)', calories: 170, proteinGrams: 6.4, carbsGrams: 35.0, fatsGrams: 1.0, cuisine: 'Indian' },
          { id: 'dp1-7', name: 'Steamed Broccoli & Cucumber Salad', servingSize: '150g', calories: 51, proteinGrams: 4.2, carbsGrams: 10.0, fatsGrams: 0.6, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Pre-Workout Glycogen Fuel',
        suggestedTime: '04:30 PM',
        prepTips: 'Drink sattu with chilled water, lemon juice & rock salt 45 minutes before gym.',
        items: [
          { id: 'dp1-8', name: 'Desi Sattu Protein Drink', servingSize: '1 glass (40g powder)', calories: 165, proteinGrams: 10.4, carbsGrams: 26.0, fatsGrams: 2.1, cuisine: 'Indian' },
          { id: 'dp1-9', name: 'Fresh Banana', servingSize: '1 medium', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Post-Workout Muscle Repair Shake',
        suggestedTime: '06:30 PM',
        prepTips: 'Shake whey protein isolate with 5g Creatine in chilled water immediately after your final set.',
        items: [
          { id: 'dp1-10', name: '100% Whey Protein Isolate (1 scoop)', servingSize: '30g scoop', calories: 120, proteinGrams: 25.0, carbsGrams: 1.5, fatsGrams: 0.8, cuisine: 'International' },
          { id: 'dp1-11', name: 'Roasted Foxnuts / Makhana', servingSize: '30g', calories: 110, proteinGrams: 3.0, carbsGrams: 21.0, fatsGrams: 1.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Clean Recovery Dinner',
        suggestedTime: '08:30 PM',
        prepTips: 'Light khichdi with roasted soya chunks curry or boiled egg whites.',
        items: [
          { id: 'dp1-12', name: 'Soya Chunks Curry (50g dry)', servingSize: '1 bowl (180g)', calories: 195, proteinGrams: 26.0, carbsGrams: 18.0, fatsGrams: 2.0, cuisine: 'Indian' },
          { id: 'dp1-13', name: 'Moong Dal & Brown Rice Khichdi', servingSize: '1 bowl (200g)', calories: 210, proteinGrams: 8.5, carbsGrams: 36.0, fatsGrams: 3.5, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-ind-pure-veg-shred',
    title: 'Pure-Vegetarian Indian Fat Loss Plan',
    tagline: '100% Vegetarian high-protein cutting diet (1,850 kcal) to shred belly fat without losing muscle',
    goal: 'fat_loss',
    cuisine: 'Indian',
    dietType: 'pure_veg',
    dietTypeLabel: '100% Pure Vegetarian / Satvik',
    dailyCalories: 1850,
    macros: {
      proteinGrams: 135,
      carbsGrams: 180,
      fatsGrams: 45,
    },
    waterTargetMl: 3800,
    recommendedSupplements: ['Plant / Whey Protein', 'Omega-3 Algal Oil', 'Vitamin D3 & B12'],
    keyBenefits: [
      'High satiety with dense dietary fiber from sprouts, lentils, and roasted chana',
      'No non-veg or eggs required: uses Soya, Low-fat paneer, Greek yogurt & Moong sprouts',
      'Maintains active metabolism and burns stubborn body fat'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Sprout & Greek Yogurt Power Bowl',
        suggestedTime: '08:00 AM',
        prepTips: 'Toss sprouted moong with chopped onions, tomatoes, chaat masala, lemon and Greek yogurt.',
        items: [
          { id: 'dp2-1', name: 'Sprouted Moong Bean Salad', servingSize: '150g', calories: 140, proteinGrams: 11.5, carbsGrams: 22.0, fatsGrams: 0.8, cuisine: 'Indian' },
          { id: 'dp2-2', name: 'Greek Yogurt (0% Fat Plain)', servingSize: '150g', calories: 90, proteinGrams: 16.0, carbsGrams: 5.5, fatsGrams: 0.5, cuisine: 'International' },
          { id: 'dp2-3', name: 'Raw California Almonds', servingSize: '15g (10-12 nuts)', calories: 87, proteinGrams: 3.1, carbsGrams: 3.0, fatsGrams: 7.5, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Low-Calorie Protein Thali',
        suggestedTime: '01:00 PM',
        prepTips: 'Sauté low-fat paneer with capsicum and pair with 1 whole wheat roti and yellow dal.',
        items: [
          { id: 'dp2-4', name: 'Low-Fat / Diet Paneer (Grilled with Herbs)', servingSize: '150g', calories: 215, proteinGrams: 36.5, carbsGrams: 6.0, fatsGrams: 5.0, cuisine: 'Indian' },
          { id: 'dp2-5', name: 'Dal Tadka / Yellow Dal', servingSize: '1 bowl (180g)', calories: 165, proteinGrams: 8.8, carbsGrams: 21.0, fatsGrams: 4.8, cuisine: 'Indian' },
          { id: 'dp2-6', name: 'Whole Wheat Roti (1 Phulka)', servingSize: '1 roti (45g)', calories: 85, proteinGrams: 3.2, carbsGrams: 17.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'snack',
        title: 'Evening Metabolism Snack',
        suggestedTime: '05:00 PM',
        prepTips: 'Eat roasted chana and sip hot green tea to beat evening cravings.',
        items: [
          { id: 'dp2-7', name: 'Roasted Black Chana', servingSize: '40g', calories: 148, proteinGrams: 9.2, carbsGrams: 23.2, fatsGrams: 2.0, cuisine: 'Indian' },
          { id: 'dp2-8', name: 'Roasted Foxnuts / Makhana', servingSize: '25g', calories: 90, proteinGrams: 2.5, carbsGrams: 17.5, fatsGrams: 1.2, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'High-Protein Soya Sauté Bowl',
        suggestedTime: '08:00 PM',
        prepTips: 'Boil soya chunks, squeeze dry, and stir-fry with broccoli, tomatoes and cumin.',
        items: [
          { id: 'dp2-9', name: 'Soya Chunks Curry / Sauté (50g dry)', servingSize: '180g', calories: 172, proteinGrams: 26.0, carbsGrams: 16.5, fatsGrams: 0.5, cuisine: 'Indian' },
          { id: 'dp2-10', name: 'Steamed Broccoli & Green Veggies', servingSize: '200g', calories: 68, proteinGrams: 5.6, carbsGrams: 13.0, fatsGrams: 0.8, cuisine: 'Universal' },
          { id: 'dp2-11', name: '100% Whey / Plant Protein Scoop', servingSize: '1 scoop', calories: 120, proteinGrams: 25.0, carbsGrams: 1.5, fatsGrams: 0.8, cuisine: 'International' }
        ]
      }
    ]
  },
  {
    id: 'diet-intl-lean-shred',
    title: 'International Athlete Lean Shred Plan',
    tagline: 'World-class macro-balanced cutting diet (2,100 kcal) with Salmon, Chicken Breast, Oats & Avocado',
    goal: 'fat_loss',
    cuisine: 'International',
    dietType: 'non_veg',
    dietTypeLabel: 'Global High-Protein Shred',
    dailyCalories: 2100,
    macros: {
      proteinGrams: 180,
      carbsGrams: 190,
      fatsGrams: 55,
    },
    waterTargetMl: 4000,
    recommendedSupplements: ['Whey Isolate', 'Omega-3 Fish Oil', 'Creatine Monohydrate', 'Pre-Workout'],
    keyBenefits: [
      'High Omega-3 fatty acids for rapid recovery and reduced inflammation',
      'Timed complex carbohydrates for intense resistance training',
      'Zero refined sugar and optimal fiber intake'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Anabolic Oatmeal & Egg Scramble',
        suggestedTime: '07:30 AM',
        prepTips: 'Cook rolled oats in water/almond milk with cinnamon, top with banana slices. Scramble egg whites on the side.',
        items: [
          { id: 'dp3-1', name: 'Rolled Whole Oats', servingSize: '60g raw', calories: 233, proteinGrams: 8.0, carbsGrams: 40.0, fatsGrams: 4.2, cuisine: 'International' },
          { id: 'dp3-2', name: 'Liquid / Boiled Egg Whites (4 whites)', servingSize: '130g', calories: 68, proteinGrams: 14.5, carbsGrams: 0.9, fatsGrams: 0.2, cuisine: 'International' },
          { id: 'dp3-3', name: 'Fresh Banana', servingSize: '1 medium', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Grilled Chicken, Sweet Potato & Greens',
        suggestedTime: '01:00 PM',
        prepTips: 'Season chicken breast with garlic, oregano, and black pepper. Bake sweet potato.',
        items: [
          { id: 'dp3-4', name: 'Grilled Chicken Breast', servingSize: '180g cooked', calories: 295, proteinGrams: 55.0, carbsGrams: 0, fatsGrams: 6.5, cuisine: 'International' },
          { id: 'dp3-5', name: 'Baked Sweet Potato', servingSize: '180g', calories: 162, proteinGrams: 3.6, carbsGrams: 37.0, fatsGrams: 0.3, cuisine: 'International' },
          { id: 'dp3-6', name: 'Steamed Broccoli & Asparagus', servingSize: '150g', calories: 51, proteinGrams: 4.2, carbsGrams: 10.0, fatsGrams: 0.6, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Post-Workout Shake',
        suggestedTime: '06:00 PM',
        prepTips: 'Blend whey protein isolate with ice cold water and 5g creatine.',
        items: [
          { id: 'dp3-7', name: '100% Whey Protein Isolate (1.5 scoops)', servingSize: '45g powder', calories: 180, proteinGrams: 37.5, carbsGrams: 2.5, fatsGrams: 1.2, cuisine: 'International' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Seared Salmon & Quinoa Bowl',
        suggestedTime: '08:30 PM',
        prepTips: 'Pan sear salmon fillet in non-stick pan without extra oil. Serve over warm fluffy quinoa with avocado slices.',
        items: [
          { id: 'dp3-8', name: 'Atlantic Salmon Fillet', servingSize: '150g fillet', calories: 312, proteinGrams: 34.0, carbsGrams: 0, fatsGrams: 18.5, cuisine: 'International' },
          { id: 'dp3-9', name: 'Quinoa Bowl (Cooked)', servingSize: '120g', calories: 144, proteinGrams: 5.2, carbsGrams: 25.5, fatsGrams: 2.2, cuisine: 'International' },
          { id: 'dp3-10', name: 'Avocado on the side', servingSize: '50g (1/4 avocado)', calories: 80, proteinGrams: 1.0, carbsGrams: 4.2, fatsGrams: 7.4, cuisine: 'Universal' }
        ]
      }
    ]
  },
  {
    id: 'diet-female-tone-hormone',
    title: "Women's Lean Tone & Hormone Balance",
    titleHi: "महिलाओं के लिए लीन टोन व हार्मोन संतुलन",
    tagline: 'Calibrated 1,650 kcal plan with bioavailable iron, calcium, clean proteins, and healthy hormone-balancing fats',
    goal: 'fat_loss',
    targetGender: 'female',
    targetLevel: 'beginner',
    cuisine: 'Fusion',
    dietType: 'high_protein',
    dietTypeLabel: "Women's Hormone-Friendly Nutrition (1,650 kcal)",
    dailyCalories: 1650,
    macros: {
      proteinGrams: 125,
      carbsGrams: 160,
      fatsGrams: 48,
    },
    waterTargetMl: 3200,
    recommendedSupplements: ['Omega-3 (Algal / Fish Oil)', 'Vitamin D3 + K2', 'Iron & Folate Rich Greens', 'Magnesium Glycinate (Bedtime)'],
    keyBenefits: [
      'Rich in hormone-supporting healthy fats (Avocado, Chia, Almonds) and slow-digesting complex carbs',
      'High iron and calcium from sprouted moong, curd, spinach, sattu, and low-fat paneer',
      'Prevents menstrual energy crashes and reduces water retention / bloating'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Chia Berry Pudding & Boiled Eggs / Besan Chilla',
        suggestedTime: '08:00 AM',
        prepTips: 'Overnight soaked chia seeds with almond milk, topped with pomegranate and 2 boiled egg whites or besan chilla.',
        items: [
          { id: 'dp4-1', name: 'Chia Seed Pudding (with Almond Milk & Berries)', servingSize: '1 bowl (180g)', calories: 175, proteinGrams: 5.5, carbsGrams: 18.0, fatsGrams: 9.0, cuisine: 'International' },
          { id: 'dp4-2', name: 'Boiled Egg Whites (3 whites) / Besan Chilla', servingSize: '100g', calories: 52, proteinGrams: 11.0, carbsGrams: 0.7, fatsGrams: 0.2, cuisine: 'Universal' },
          { id: 'dp4-3', name: 'Fresh Curd / Dahi', servingSize: '100g', calories: 65, proteinGrams: 4.0, carbsGrams: 4.5, fatsGrams: 3.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Sprout & Low-Fat Paneer Power Bowl',
        suggestedTime: '01:00 PM',
        prepTips: 'Warm sauté of low-fat paneer with bell peppers, moong sprouts, 1 phulka, and cucumber-mint raita.',
        items: [
          { id: 'dp4-4', name: 'Low-Fat / Diet Paneer (Grilled)', servingSize: '120g', calories: 175, proteinGrams: 29.5, carbsGrams: 5.0, fatsGrams: 4.2, cuisine: 'Indian' },
          { id: 'dp4-5', name: 'Sprouted Moong Bean Salad', servingSize: '120g', calories: 110, proteinGrams: 9.2, carbsGrams: 18.0, fatsGrams: 0.6, cuisine: 'Indian' },
          { id: 'dp4-6', name: 'Whole Wheat Roti / Phulka (1 Roti)', servingSize: '1 roti (45g)', calories: 85, proteinGrams: 3.2, carbsGrams: 17.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'snack',
        title: 'Mid-Afternoon Metabolism Boost',
        suggestedTime: '04:30 PM',
        prepTips: 'Light roasted makhana with green tea or coconut water.',
        items: [
          { id: 'dp4-7', name: 'Roasted Foxnuts / Makhana', servingSize: '30g', calories: 110, proteinGrams: 3.0, carbsGrams: 21.0, fatsGrams: 1.5, cuisine: 'Indian' },
          { id: 'dp4-8', name: 'Raw California Almonds & Walnuts', servingSize: '15g', calories: 95, proteinGrams: 3.0, carbsGrams: 2.5, fatsGrams: 8.5, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Light Digestive Protein Dinner',
        suggestedTime: '08:00 PM',
        prepTips: 'Tofu/Chicken/Soya chunks lightly spiced with turmeric & cumin, alongside steamed broccoli.',
        items: [
          { id: 'dp4-9', name: 'Firm Tofu / Grilled Chicken Breast', servingSize: '140g', calories: 195, proteinGrams: 32.0, carbsGrams: 2.5, fatsGrams: 6.0, cuisine: 'Universal' },
          { id: 'dp4-10', name: 'Steamed Broccoli & Green Veggies', servingSize: '150g', calories: 51, proteinGrams: 4.2, carbsGrams: 10.0, fatsGrams: 0.6, cuisine: 'Universal' },
          { id: 'dp4-11', name: 'Moong Dal & Brown Rice Khichdi (Half Cup)', servingSize: '120g', calories: 125, proteinGrams: 5.5, carbsGrams: 22.0, fatsGrams: 2.0, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-athlete-peak-power',
    title: 'Elite Athlete & Cross-Training High-Fuel Blueprint',
    titleHi: 'एलीट एथलीट व क्रॉस-ट्रेनिंग हाई-फ्यूल ब्लूप्रिंट',
    tagline: 'High-glycogen 2,900 kcal performance diet designed for explosive power output, CNS recovery, and lean mass',
    goal: 'muscle_gain',
    targetGender: 'all',
    targetLevel: 'athlete',
    cuisine: 'Fusion',
    dietType: 'high_protein',
    dietTypeLabel: 'Elite Pro Athlete High-Carb Fuel (2,900 kcal)',
    dailyCalories: 2900,
    macros: {
      proteinGrams: 190,
      carbsGrams: 365,
      fatsGrams: 75,
    },
    waterTargetMl: 4500,
    recommendedSupplements: ['Creatine Monohydrate (5g daily)', 'Whey Isolate (2 scoops)', 'Beta-Alanine', 'Electrolytes during training'],
    keyBenefits: [
      'Replenishes intramuscular glycogen stores rapidly for consecutive high-intensity training days',
      '30-40g high-leucine protein spaced every 3.5 hours for maximum mTOR stimulation',
      'Natural anti-inflammatory turmeric, ginger, and Omega-3s to protect joints during heavy lifts'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Athlete Anabolic Oats & Whole Eggs Feast',
        suggestedTime: '07:30 AM',
        prepTips: '80g oats cooked with honey and cinnamon + 4 eggs (2 whole, 2 whites).',
        items: [
          { id: 'dp5-1', name: 'Rolled Whole Oats with Honey & Banana', servingSize: '80g oats + 1 banana', calories: 410, proteinGrams: 12.0, carbsGrams: 75.0, fatsGrams: 6.0, cuisine: 'International' },
          { id: 'dp5-2', name: 'Whole Eggs & Egg Whites (2 Whole + 2 Whites)', servingSize: '160g', calories: 180, proteinGrams: 20.0, carbsGrams: 1.0, fatsGrams: 10.0, cuisine: 'Universal' },
          { id: 'dp5-3', name: 'Natural Peanut Butter', servingSize: '2 tbsp (32g)', calories: 188, proteinGrams: 8.0, carbsGrams: 6.3, fatsGrams: 16.0, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'High-Calorie Athlete Performance Thali',
        suggestedTime: '01:00 PM',
        prepTips: '200g grilled chicken/paneer tikka, 2 large bowls of dal, 3 whole wheat rotis and fresh cucumber.',
        items: [
          { id: 'dp5-4', name: 'Tandoori / Grilled Chicken Tikka Breast', servingSize: '200g', calories: 310, proteinGrams: 55.0, carbsGrams: 4.5, fatsGrams: 7.0, cuisine: 'Indian' },
          { id: 'dp5-5', name: 'Dal Tadka / Yellow Lentils', servingSize: '250g', calories: 230, proteinGrams: 12.0, carbsGrams: 30.0, fatsGrams: 6.5, cuisine: 'Indian' },
          { id: 'dp5-6', name: 'Whole Wheat Roti / Phulka (3 rotis)', servingSize: '135g', calories: 255, proteinGrams: 9.6, carbsGrams: 52.5, fatsGrams: 1.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Explosive Intracellular ATP Pump Fuel',
        suggestedTime: '04:30 PM',
        prepTips: 'Chilled Sattu with rock salt, lemon and 1 banana 40 minutes prior to lifting.',
        items: [
          { id: 'dp5-7', name: 'Desi Sattu Protein Drink', servingSize: '1 glass (50g powder)', calories: 205, proteinGrams: 13.0, carbsGrams: 32.5, fatsGrams: 2.6, cuisine: 'Indian' },
          { id: 'dp5-8', name: 'Fresh Banana', servingSize: '1 large', calories: 120, proteinGrams: 1.5, carbsGrams: 31.0, fatsGrams: 0.4, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Rapid Glycogen & Muscle Recovery Shake',
        suggestedTime: '06:30 PM',
        prepTips: '2 scoops whey protein isolate with 5g creatine and 4 Medjool dates for insulin spike.',
        items: [
          { id: 'dp5-9', name: '100% Whey Protein Isolate (2 scoops)', servingSize: '60g powder', calories: 240, proteinGrams: 50.0, carbsGrams: 3.0, fatsGrams: 1.6, cuisine: 'International' },
          { id: 'dp5-10', name: 'Roasted Foxnuts / Makhana', servingSize: '35g', calories: 128, proteinGrams: 3.5, carbsGrams: 24.5, fatsGrams: 1.8, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Deep Recovery & Joint Restoration Dinner',
        suggestedTime: '08:45 PM',
        prepTips: 'Atlantic Salmon / Paneer Soya Curry with steamed Basmati rice and curd.',
        items: [
          { id: 'dp5-11', name: 'Atlantic Salmon Fillet / Soya Chunks Curry', servingSize: '180g', calories: 340, proteinGrams: 38.0, carbsGrams: 12.0, fatsGrams: 16.0, cuisine: 'Universal' },
          { id: 'dp5-12', name: 'Basmati Rice (Steamed)', servingSize: '180g cooked', calories: 235, proteinGrams: 4.8, carbsGrams: 51.0, fatsGrams: 0.6, cuisine: 'Indian' },
          { id: 'dp5-13', name: 'Fresh Curd / Dahi', servingSize: '150g', calories: 95, proteinGrams: 5.5, carbsGrams: 6.5, fatsGrams: 5.2, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-veg-high-protein-with-whey',
    title: 'Pure-Veg High-Protein Hypertrophy (With Whey Protein)',
    titleHi: 'शाकाहारी हाई-प्रोटीन हाइपरट्रॉफी (व्हे प्रोटीन के साथ)',
    tagline: '155g High-Protein vegetarian muscle builder powered by Low-Fat Paneer, Moong Sprouts, Sattu, Besan Chilla, and Gold-Standard Post-Workout Whey.',
    goal: 'muscle_gain',
    targetGender: 'all',
    targetLevel: 'intermediate',
    cuisine: 'Indian',
    dietType: 'pure_veg',
    dietTypeLabel: '100% Pure Veg (With Whey Protein)',
    wheyOption: 'with_whey',
    isVeg: true,
    isVegan: false,
    dailyCalories: 2450,
    macros: {
      proteinGrams: 155,
      carbsGrams: 260,
      fatsGrams: 60,
    },
    waterTargetMl: 3800,
    recommendedSupplements: [
      'Whey Protein Isolate (1.5 scoops immediately post-workout)',
      'Creatine Monohydrate (5g daily with warm water)',
      'Daily Multivitamin & Zinc',
      'Ashwagandha KSM-66 (500mg before bedtime)'
    ],
    keyBenefits: [
      'Delivers 155g complete bio-available protein using high-grade whey isolate and low-fat dairy',
      'Spikes muscle protein synthesis (MPS) swiftly post-training to accelerate hypertrophy',
      'Rich in natural digestive spices (hing, cumin, ajwain) to prevent bloating from high protein'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'High-Protein Besan Paneer Chilla & Nuts',
        suggestedTime: '08:00 AM',
        prepTips: 'Make 2 gram flour (besan) chillas stuffed with 60g low-fat grated paneer, paired with curd.',
        items: [
          { id: 'vww-1', name: 'Besan & Paneer Stuffed Chilla (2 chillas)', servingSize: '2 chillas (160g)', calories: 310, proteinGrams: 22.0, carbsGrams: 28.0, fatsGrams: 11.5, cuisine: 'Indian' },
          { id: 'vww-2', name: 'Fresh Curd / Dahi', servingSize: '150g', calories: 95, proteinGrams: 5.5, carbsGrams: 6.5, fatsGrams: 5.2, cuisine: 'Indian' },
          { id: 'vww-3', name: 'Raw California Almonds', servingSize: '15g (~10 nuts)', calories: 87, proteinGrams: 3.2, carbsGrams: 3.0, fatsGrams: 7.5, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Desi Paneer & Dal Muscle Thali',
        suggestedTime: '01:15 PM',
        prepTips: 'Grill or sauté 140g low-fat paneer with turmeric and cumin; serve with thick yellow dal and rotis.',
        items: [
          { id: 'vww-4', name: 'Low-Fat / Diet Paneer (Grilled Tikka)', servingSize: '140g', calories: 203, proteinGrams: 34.3, carbsGrams: 5.8, fatsGrams: 4.9, cuisine: 'Indian' },
          { id: 'vww-5', name: 'Dal Tadka / Yellow Arhar-Moong Dal', servingSize: '200g', calories: 185, proteinGrams: 9.8, carbsGrams: 24.0, fatsGrams: 5.5, cuisine: 'Indian' },
          { id: 'vww-6', name: 'Whole Wheat Roti / Phulka (2 rotis)', servingSize: '90g', calories: 170, proteinGrams: 6.4, carbsGrams: 35.0, fatsGrams: 1.0, cuisine: 'Indian' },
          { id: 'vww-7', name: 'Sprouted Moong Bean Salad', servingSize: '100g', calories: 95, proteinGrams: 7.6, carbsGrams: 14.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Pre-Lift Desi Energy Fuel',
        suggestedTime: '04:45 PM',
        prepTips: 'Drink chilled sattu water with fresh lemon and pinch of rock salt 35 minutes before gym.',
        items: [
          { id: 'vww-8', name: 'Desi Sattu Protein Drink', servingSize: '1 glass (40g powder)', calories: 165, proteinGrams: 10.4, carbsGrams: 26.0, fatsGrams: 2.1, cuisine: 'Indian' },
          { id: 'vww-9', name: 'Fresh Banana', servingSize: '1 medium', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Rapid Anabolic Whey Isolate Shake',
        suggestedTime: '06:30 PM',
        prepTips: 'Mix 1.5 scoops whey isolate with cold water and 5g creatine; munch on roasted chana.',
        items: [
          { id: 'vww-10', name: '100% Whey Protein Isolate (1.5 scoops)', servingSize: '45g powder', calories: 180, proteinGrams: 37.5, carbsGrams: 2.2, fatsGrams: 1.2, cuisine: 'International' },
          { id: 'vww-11', name: 'Roasted Black Chana (Bengal Gram)', servingSize: '35g', calories: 130, proteinGrams: 8.0, carbsGrams: 20.3, fatsGrams: 1.8, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Soya Chunks Curry & Light Khichdi',
        suggestedTime: '08:45 PM',
        prepTips: 'Soak soya chunks in hot water, squeeze dry and simmer with tomato-onion gravy; serve with light khichdi.',
        items: [
          { id: 'vww-12', name: 'Soya Chunks / Nutrela Curry (Cooked)', servingSize: '160g (from 40g dry)', calories: 175, proteinGrams: 20.8, carbsGrams: 15.0, fatsGrams: 2.5, cuisine: 'Indian' },
          { id: 'vww-13', name: 'Moong Dal & Brown Rice Khichdi', servingSize: '180g', calories: 190, proteinGrams: 7.8, carbsGrams: 33.0, fatsGrams: 3.1, cuisine: 'Indian' },
          { id: 'vww-14', name: 'Roasted Foxnuts / Makhana', servingSize: '25g', calories: 92, proteinGrams: 2.5, carbsGrams: 17.5, fatsGrams: 1.4, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-veg-high-protein-no-whey',
    title: '100% Natural Pure-Veg High-Protein (Zero Whey / Kitchen Staples)',
    titleHi: '100% प्राकृतिक शाकाहारी हाई-प्रोटीन (बिना व्हे पाउडर)',
    tagline: '142g High-Protein muscle builder using zero synthetic supplements or whey powder — powered 100% by Low-Fat Paneer, Soya Chunks, Sattu, Besan, and Curd.',
    goal: 'muscle_gain',
    targetGender: 'all',
    targetLevel: 'intermediate',
    cuisine: 'Indian',
    dietType: 'pure_veg',
    dietTypeLabel: '100% Pure Veg (Zero Whey / Whole Foods)',
    wheyOption: 'without_whey',
    isVeg: true,
    isVegan: false,
    dailyCalories: 2380,
    macros: {
      proteinGrams: 142,
      carbsGrams: 275,
      fatsGrams: 58,
    },
    waterTargetMl: 3600,
    recommendedSupplements: [
      'No Synthetic Protein Powders Required',
      'Desi Roasted Sattu & Chana for natural post-workout amino acids',
      'Ashwagandha KSM-66 (500mg) for natural recovery & sleep',
      'Vitamin D3+K2 (Weekly)'
    ],
    keyBenefits: [
      'Proves you do not need expensive whey powders to build lean muscle on an Indian vegetarian diet',
      '142g clean protein sourced purely from low-fat paneer, soya chunks, roasted sattu, and legumes',
      'Zero artificial sweeteners, chemical emulsifiers, or supplement bloat'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Sprouted Moong & Paneer Besan Power Breakfast',
        suggestedTime: '08:00 AM',
        prepTips: 'Toss boiled/sprouted moong with chaat masala, lemon, onions, alongside 1 heavy besan paneer chilla.',
        items: [
          { id: 'vnow-1', name: 'Sprouted Moong Bean Salad (with Lemon & Chaat)', servingSize: '150g', calories: 140, proteinGrams: 11.5, carbsGrams: 22.0, fatsGrams: 0.8, cuisine: 'Indian' },
          { id: 'vnow-2', name: 'Besan & Paneer Stuffed Chilla (1 large)', servingSize: '150g', calories: 235, proteinGrams: 16.5, carbsGrams: 22.0, fatsGrams: 9.0, cuisine: 'Indian' },
          { id: 'vnow-3', name: 'Raw California Almonds', servingSize: '20g (~15 nuts)', calories: 116, proteinGrams: 4.2, carbsGrams: 4.0, fatsGrams: 10.0, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'High-Protein Low-Fat Paneer & Dal Thali',
        suggestedTime: '01:15 PM',
        prepTips: 'Grill 160g low-fat paneer with mild Indian spices; serve with 1 bowl moong dal and 2 phulkas.',
        items: [
          { id: 'vnow-4', name: 'Low-Fat / Diet Paneer (Dry Sauté)', servingSize: '160g', calories: 232, proteinGrams: 39.2, carbsGrams: 6.7, fatsGrams: 5.6, cuisine: 'Indian' },
          { id: 'vnow-5', name: 'Dal Tadka / Yellow Arhar-Moong Dal', servingSize: '200g', calories: 185, proteinGrams: 9.8, carbsGrams: 24.0, fatsGrams: 5.5, cuisine: 'Indian' },
          { id: 'vnow-6', name: 'Whole Wheat Roti / Phulka (2 rotis)', servingSize: '90g', calories: 170, proteinGrams: 6.4, carbsGrams: 35.0, fatsGrams: 1.0, cuisine: 'Indian' },
          { id: 'vnow-7', name: 'Fresh Curd / Dahi', servingSize: '120g', calories: 76, proteinGrams: 4.4, carbsGrams: 5.2, fatsGrams: 4.2, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Natural Pre-Workout Energy',
        suggestedTime: '04:30 PM',
        prepTips: 'Eat roasted chana and 1 banana 40 minutes before hitting the weights.',
        items: [
          { id: 'vnow-8', name: 'Roasted Black Chana (Bengal Gram)', servingSize: '50g', calories: 185, proteinGrams: 11.5, carbsGrams: 29.0, fatsGrams: 2.5, cuisine: 'Indian' },
          { id: 'vnow-9', name: 'Fresh Banana', servingSize: '1 medium', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Natural Desi Sattu & Curd Recovery Drink',
        suggestedTime: '06:30 PM',
        prepTips: 'Whisk 55g roasted sattu powder with chilled water, roasted cumin, black salt, lemon, and eat curd.',
        items: [
          { id: 'vnow-10', name: 'Desi Sattu Protein Drink (High Potency)', servingSize: '1 large glass (55g powder)', calories: 227, proteinGrams: 14.3, carbsGrams: 35.7, fatsGrams: 2.8, cuisine: 'Indian' },
          { id: 'vnow-11', name: 'Fresh Curd / Dahi', servingSize: '150g', calories: 95, proteinGrams: 5.5, carbsGrams: 6.5, fatsGrams: 5.2, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Soya Chunks Masala Curry & Khichdi',
        suggestedTime: '08:45 PM',
        prepTips: 'Cook 50g dry soya chunks (swells to 150g) in spiced tomato onion gravy with brown rice khichdi.',
        items: [
          { id: 'vnow-12', name: 'Soya Chunks / Nutrela Masala Curry', servingSize: '180g (from 50g dry)', calories: 215, proteinGrams: 26.0, carbsGrams: 19.5, fatsGrams: 3.5, cuisine: 'Indian' },
          { id: 'vnow-13', name: 'Moong Dal & Brown Rice Khichdi', servingSize: '200g', calories: 210, proteinGrams: 8.6, carbsGrams: 36.5, fatsGrams: 3.4, cuisine: 'Indian' },
          { id: 'vnow-14', name: 'Roasted Foxnuts / Makhana', servingSize: '20g', calories: 73, proteinGrams: 2.0, carbsGrams: 14.0, fatsGrams: 1.1, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-vegan-high-protein-with-plant-protein',
    title: 'Vegan High-Protein Powerhouse (With Pea & Rice Plant Protein)',
    titleHi: 'वीगन हाई-प्रोटीन पावरहाउस (प्लांट प्रोटीन के साथ)',
    tagline: '150g Complete Plant-Based muscle blueprint with Tofu, Soya Chunks, Quinoa, Edamame, Oats, and Organic Plant Protein Powder.',
    goal: 'muscle_gain',
    targetGender: 'all',
    targetLevel: 'intermediate',
    cuisine: 'Fusion',
    dietType: 'vegan',
    dietTypeLabel: '100% Vegan (With Plant Protein Powder)',
    wheyOption: 'with_plant_protein',
    isVeg: true,
    isVegan: true,
    dailyCalories: 2320,
    macros: {
      proteinGrams: 150,
      carbsGrams: 265,
      fatsGrams: 52,
    },
    waterTargetMl: 3800,
    recommendedSupplements: [
      'Organic Pea & Brown Rice Plant Protein (1.5 scoops post-workout)',
      'Creatine Monohydrate (5g daily - essential for vegans)',
      'Vitamin B12 (Cyanocobalamin / Methylcobalamin 1000mcg)',
      'Algal Oil Omega-3 (Vegan DHA/EPA)'
    ],
    keyBenefits: [
      '100% Dairy-free, lactose-free, ethical plant-based nutrition designed for serious muscle hypertrophy',
      'Blends pea and rice protein isolates to achieve a complete branched-chain amino acid (BCAA) profile',
      'High in plant fiber, antioxidants, and phytonutrients for swift cardiovascular and muscular recovery'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Vegan Power Oats with Soy Milk & Peanut Butter',
        suggestedTime: '08:00 AM',
        prepTips: 'Warm rolled oats cooked in unsweetened soy milk, topped with 2 tbsp natural peanut butter and chia seeds.',
        items: [
          { id: 'vpp-1', name: 'Rolled Whole Oats (Raw / Porridge)', servingSize: '60g raw', calories: 233, proteinGrams: 8.0, carbsGrams: 40.0, fatsGrams: 4.2, cuisine: 'International' },
          { id: 'vpp-2', name: 'Unsweetened Soy Milk (High Protein)', servingSize: '1 glass (250ml)', calories: 90, proteinGrams: 8.0, carbsGrams: 4.0, fatsGrams: 4.0, cuisine: 'Universal' },
          { id: 'vpp-3', name: 'Natural Peanut Butter (100% Peanuts)', servingSize: '2 tbsp (32g)', calories: 188, proteinGrams: 8.0, carbsGrams: 6.3, fatsGrams: 16.0, cuisine: 'Universal' },
          { id: 'vpp-4', name: 'Chia Seed Pudding / Seeds', servingSize: '15g seeds', calories: 73, proteinGrams: 2.5, carbsGrams: 6.3, fatsGrams: 4.6, cuisine: 'International' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'High-Protein Soya Chunks Curry & Quinoa Bowl',
        suggestedTime: '01:15 PM',
        prepTips: 'Cook 50g dry soya chunks in an aromatic Indian curry sauce; serve over a bowl of steamed quinoa and broccoli.',
        items: [
          { id: 'vpp-5', name: 'Soya Chunks / Nutrela Curry', servingSize: '160g (50g dry)', calories: 215, proteinGrams: 26.0, carbsGrams: 19.5, fatsGrams: 3.5, cuisine: 'Indian' },
          { id: 'vpp-6', name: 'Quinoa Bowl (Cooked)', servingSize: '150g cooked', calories: 180, proteinGrams: 6.5, carbsGrams: 32.0, fatsGrams: 2.8, cuisine: 'International' },
          { id: 'vpp-7', name: 'Steamed Broccoli & Green Veggies', servingSize: '150g', calories: 51, proteinGrams: 4.2, carbsGrams: 10.0, fatsGrams: 0.6, cuisine: 'Universal' },
          { id: 'vpp-8', name: 'Sprouted Moong Bean Salad', servingSize: '100g', calories: 95, proteinGrams: 7.6, carbsGrams: 14.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Roasted Chana & Electrolyte Boost',
        suggestedTime: '04:30 PM',
        prepTips: 'Crunch on roasted black chana with fresh banana and black coffee.',
        items: [
          { id: 'vpp-9', name: 'Roasted Black Chana (Bengal Gram)', servingSize: '40g', calories: 148, proteinGrams: 9.2, carbsGrams: 23.2, fatsGrams: 2.0, cuisine: 'Indian' },
          { id: 'vpp-10', name: 'Fresh Banana', servingSize: '1 medium', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Organic Pea & Rice Plant Protein Shake',
        suggestedTime: '06:30 PM',
        prepTips: 'Shake 1.5 scoops plant protein with 350ml cold water; pair with pumpkin seeds.',
        items: [
          { id: 'vpp-11', name: 'Organic Pea & Rice Plant Protein (1.5 scoops)', servingSize: '50g powder', calories: 188, proteinGrams: 37.5, carbsGrams: 3.8, fatsGrams: 2.3, cuisine: 'International' },
          { id: 'vpp-12', name: 'Roasted Pumpkin & Sunflower Seeds Mix', servingSize: '25g', calories: 138, proteinGrams: 7.1, carbsGrams: 4.2, fatsGrams: 11.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Pan-Seared Firm Tofu & Rajma Power Bowl',
        suggestedTime: '08:45 PM',
        prepTips: 'Cube firm tofu and pan-sear with garlic, ginger, and soy sauce; serve alongside Indian Rajma and 1 roti.',
        items: [
          { id: 'vpp-13', name: 'Firm Tofu / Bean Curd (Grilled/Pan-Seared)', servingSize: '160g', calories: 176, proteinGrams: 19.7, carbsGrams: 3.7, fatsGrams: 9.1, cuisine: 'International' },
          { id: 'vpp-14', name: 'Rajma Masala / Red Kidney Beans Curry', servingSize: '180g', calories: 198, proteinGrams: 11.2, carbsGrams: 29.7, fatsGrams: 4.3, cuisine: 'Indian' },
          { id: 'vpp-15', name: 'Whole Wheat Roti / Phulka (1 roti)', servingSize: '45g', calories: 85, proteinGrams: 3.2, carbsGrams: 17.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-vegan-high-protein-no-protein-powder',
    title: '100% Whole-Foods Vegan High-Protein (Zero Protein Powder)',
    titleHi: '100% प्राकृतिक वीगन हाई-प्रोटीन (बिना प्रोटीन पाउडर)',
    tagline: '135g Natural plant protein without any synthetic protein powders: Tofu Bhurji, Soya Chunks, Rajma, Roasted Chana, Sprouted Moong & Hemp Seeds.',
    goal: 'muscle_gain',
    targetGender: 'all',
    targetLevel: 'intermediate',
    cuisine: 'Indian',
    dietType: 'vegan',
    dietTypeLabel: '100% Vegan (Zero Powder / Pure Plant Foods)',
    wheyOption: 'zero_powders',
    isVeg: true,
    isVegan: true,
    dailyCalories: 2280,
    macros: {
      proteinGrams: 135,
      carbsGrams: 285,
      fatsGrams: 50,
    },
    waterTargetMl: 3600,
    recommendedSupplements: [
      'No Synthetic Protein Powders Required (100% Whole Food Nutrition)',
      'Vitamin B12 (Daily or Weekly Tablet - Vital for Vegans)',
      'Vegan Vitamin D3 (Lichen Sourced)',
      'Algal DHA/EPA Omega-3'
    ],
    keyBenefits: [
      'Achieves 135g pure protein without relying on processed protein isolates or factory powders',
      'Combines diverse plant amino acid pools (beans, soy, lentils, seeds, nuts) for complete protein completeness',
      'Massive natural dietary fiber (40g+) for superior gut microbiome biodiversity'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Desi Tofu Bhurji & Sprouted Moong Salad',
        suggestedTime: '08:00 AM',
        prepTips: 'Scramble 160g firm tofu with onions, tomatoes, turmeric and green chilies; eat with freshly sprouted moong bowl.',
        items: [
          { id: 'vpnp-1', name: 'Firm Tofu Scramble / Bhurji (Cooked)', servingSize: '160g', calories: 185, proteinGrams: 20.0, carbsGrams: 4.5, fatsGrams: 9.5, cuisine: 'Indian' },
          { id: 'vpnp-2', name: 'Sprouted Moong Bean Salad', servingSize: '150g', calories: 140, proteinGrams: 11.5, carbsGrams: 22.0, fatsGrams: 0.8, cuisine: 'Indian' },
          { id: 'vpnp-3', name: 'Raw California Almonds', servingSize: '20g', calories: 116, proteinGrams: 4.2, carbsGrams: 4.0, fatsGrams: 10.0, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'High-Protein Soya Chunks & Dal Tadka Feast',
        suggestedTime: '01:15 PM',
        prepTips: 'Cook 55g dry soya chunks with ginger-garlic gravy, serve with 1 bowl moong dal and 2 rotis.',
        items: [
          { id: 'vpnp-4', name: 'Soya Chunks / Nutrela (Dry)', servingSize: '55g dry (yields 165g cooked)', calories: 189, proteinGrams: 28.6, carbsGrams: 18.2, fatsGrams: 0.6, cuisine: 'Indian' },
          { id: 'vpnp-5', name: 'Dal Tadka / Yellow Arhar-Moong Dal', servingSize: '200g', calories: 185, proteinGrams: 9.8, carbsGrams: 24.0, fatsGrams: 5.5, cuisine: 'Indian' },
          { id: 'vpnp-6', name: 'Whole Wheat Roti / Phulka (2 rotis)', servingSize: '90g', calories: 170, proteinGrams: 6.4, carbsGrams: 35.0, fatsGrams: 1.0, cuisine: 'Indian' },
          { id: 'vpnp-7', name: 'Steamed Broccoli & Green Veggies', servingSize: '120g', calories: 41, proteinGrams: 3.4, carbsGrams: 8.0, fatsGrams: 0.5, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Pre-Workout Roasted Chana & Banana',
        suggestedTime: '04:30 PM',
        prepTips: 'Crisp roasted black chickpeas and 1 banana 40 minutes prior to physical training.',
        items: [
          { id: 'vpnp-8', name: 'Roasted Black Chana (Bengal Gram)', servingSize: '50g', calories: 185, proteinGrams: 11.5, carbsGrams: 29.0, fatsGrams: 2.5, cuisine: 'Indian' },
          { id: 'vpnp-9', name: 'Fresh Banana', servingSize: '1 medium', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Desi Sattu Shake & Boiled Kala Chana Chaat',
        suggestedTime: '06:30 PM',
        prepTips: 'Drink chilled roasted sattu in water with lemon; eat 1 small bowl boiled spiced black chana.',
        items: [
          { id: 'vpnp-10', name: 'Desi Sattu Protein Drink', servingSize: '1 glass (45g powder)', calories: 186, proteinGrams: 11.7, carbsGrams: 29.3, fatsGrams: 2.3, cuisine: 'Indian' },
          { id: 'vpnp-11', name: 'Boiled Kala Chana Chaat (Black Chickpeas)', servingSize: '120g', calories: 152, proteinGrams: 10.4, carbsGrams: 24.0, fatsGrams: 2.2, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Rajma Masala Curry & Roasted Seeds Bowl',
        suggestedTime: '08:45 PM',
        prepTips: 'Simmer red kidney beans in tomato gravy; serve with 1 roti and roasted pumpkin seeds.',
        items: [
          { id: 'vpnp-12', name: 'Rajma Masala / Red Kidney Beans Curry', servingSize: '200g', calories: 220, proteinGrams: 12.4, carbsGrams: 33.0, fatsGrams: 4.8, cuisine: 'Indian' },
          { id: 'vpnp-13', name: 'Roasted Pumpkin & Sunflower Seeds Mix', servingSize: '25g', calories: 138, proteinGrams: 7.1, carbsGrams: 4.2, fatsGrams: 11.3, cuisine: 'Universal' },
          { id: 'vpnp-14', name: 'Whole Wheat Roti / Phulka (1 roti)', servingSize: '45g', calories: 85, proteinGrams: 3.2, carbsGrams: 17.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-veg-shred-with-whey',
    title: 'Vegetarian Lean Shred & Belly Fat Burn (With Whey)',
    titleHi: 'शाकाहारी लीन श्रेड व बेली फैट बर्न (व्हे के साथ)',
    tagline: 'High-satiety, low-carb 1,820 kcal cutting protocol with 145g protein: Low-fat paneer, moong sprouts, leafy greens, and Whey Isolate.',
    goal: 'fat_loss',
    targetGender: 'all',
    targetLevel: 'intermediate',
    cuisine: 'Indian',
    dietType: 'pure_veg',
    dietTypeLabel: 'Pure Veg Fat Loss (With Whey)',
    wheyOption: 'with_whey',
    isVeg: true,
    isVegan: false,
    dailyCalories: 1820,
    macros: {
      proteinGrams: 145,
      carbsGrams: 155,
      fatsGrams: 42,
    },
    waterTargetMl: 4000,
    recommendedSupplements: [
      'Whey Protein Isolate (1 scoop post-workout with water)',
      'L-Carnitine L-Tartrate / Green Tea Extract',
      'Daily Multivitamin & Omega-3'
    ],
    keyBenefits: [
      'Aggressive caloric deficit while maintaining high 145g protein to spare muscle mass',
      'Sub-160g complex carbs timed strictly around workouts for fat mobilization',
      'Zero liquid sugars or hidden restaurant fats'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Sprouted Moong & Curd Fat Burner',
        suggestedTime: '08:00 AM',
        prepTips: 'Fresh sprout bowl with tomato, cucumber, chaat masala and low-fat curd.',
        items: [
          { id: 'vsw-1', name: 'Sprouted Moong Bean Salad', servingSize: '150g', calories: 140, proteinGrams: 11.5, carbsGrams: 22.0, fatsGrams: 0.8, cuisine: 'Indian' },
          { id: 'vsw-2', name: 'Fresh Curd / Dahi', servingSize: '150g', calories: 95, proteinGrams: 5.5, carbsGrams: 6.5, fatsGrams: 5.2, cuisine: 'Indian' },
          { id: 'vsw-3', name: 'Raw California Almonds', servingSize: '15g', calories: 87, proteinGrams: 3.2, carbsGrams: 3.0, fatsGrams: 7.5, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Low-Fat Grilled Paneer & Green Veggies',
        suggestedTime: '01:00 PM',
        prepTips: 'Grill 150g low-fat paneer with turmeric and black pepper; enjoy with 1 roti and cucumber salad.',
        items: [
          { id: 'vsw-4', name: 'Low-Fat / Diet Paneer', servingSize: '150g', calories: 218, proteinGrams: 36.8, carbsGrams: 6.3, fatsGrams: 5.3, cuisine: 'Indian' },
          { id: 'vsw-5', name: 'Steamed Broccoli & Green Veggies', servingSize: '150g', calories: 51, proteinGrams: 4.2, carbsGrams: 10.0, fatsGrams: 0.6, cuisine: 'Universal' },
          { id: 'vsw-6', name: 'Whole Wheat Roti / Phulka (1 roti)', servingSize: '45g', calories: 85, proteinGrams: 3.2, carbsGrams: 17.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Black Coffee & Light Carb Fuel',
        suggestedTime: '04:30 PM',
        prepTips: 'Black coffee with 1 small banana 30 mins before workout.',
        items: [
          { id: 'vsw-7', name: 'Fresh Banana (Medium)', servingSize: '1 small (90g)', calories: 80, proteinGrams: 1.0, carbsGrams: 20.5, fatsGrams: 0.2, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Whey Protein Isolate Recovery Shake',
        suggestedTime: '06:30 PM',
        prepTips: '1.5 scoops whey isolate in ice-cold water immediately post-lift.',
        items: [
          { id: 'vsw-8', name: '100% Whey Protein Isolate (1.5 scoops)', servingSize: '45g powder', calories: 180, proteinGrams: 37.5, carbsGrams: 2.2, fatsGrams: 1.2, cuisine: 'International' },
          { id: 'vsw-9', name: 'Roasted Foxnuts / Makhana', servingSize: '25g', calories: 92, proteinGrams: 2.5, carbsGrams: 17.5, fatsGrams: 1.4, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Soya Chunks Curry & Yellow Dal',
        suggestedTime: '08:30 PM',
        prepTips: 'Dry roasted soya chunks in tomato gravy with 1 cup yellow dal tadka.',
        items: [
          { id: 'vsw-10', name: 'Soya Chunks / Nutrela (Dry)', servingSize: '45g dry', calories: 155, proteinGrams: 23.4, carbsGrams: 14.8, fatsGrams: 0.5, cuisine: 'Indian' },
          { id: 'vsw-11', name: 'Dal Tadka / Yellow Arhar-Moong Dal', servingSize: '150g', calories: 139, proteinGrams: 7.4, carbsGrams: 18.0, fatsGrams: 4.1, cuisine: 'Indian' }
        ]
      }
    ]
  },
  {
    id: 'diet-vegan-shred-no-powder',
    title: 'Vegan Lean Fat Shred (Without Protein Powder)',
    titleHi: 'वीगन लीन फैट श्रेड (बिना प्रोटीन पाउडर)',
    tagline: 'High-fiber, zero-dairy 1,750 kcal cutting plan with 125g natural plant protein: Firm tofu, soya chunks, boiled black chana, and raw greens.',
    goal: 'fat_loss',
    targetGender: 'all',
    targetLevel: 'intermediate',
    cuisine: 'Fusion',
    dietType: 'vegan',
    dietTypeLabel: 'Vegan Fat Loss (Zero Powder / Whole Plants)',
    wheyOption: 'zero_powders',
    isVeg: true,
    isVegan: true,
    dailyCalories: 1750,
    macros: {
      proteinGrams: 125,
      carbsGrams: 175,
      fatsGrams: 38,
    },
    waterTargetMl: 4000,
    recommendedSupplements: [
      'No Synthetic Protein Powders Required',
      'Vitamin B12 Tablet (Essential)',
      'Green Tea Extract / Caffeine for metabolic boost'
    ],
    keyBenefits: [
      'Massive food volume keeps you full and stops cravings during aggressive fat loss',
      '125g pure plant protein without any synthetic protein powders or shakes',
      'Cholesterol-free, 100% cruelty-free, and gut-soothing whole foods'
    ],
    meals: [
      {
        mealType: 'breakfast',
        title: 'Firm Tofu Scramble with Turmeric & Greens',
        suggestedTime: '08:00 AM',
        prepTips: '160g firm tofu scrambled with bell peppers, spinach, and black pepper.',
        items: [
          { id: 'vsnp-1', name: 'Firm Tofu Scramble / Bhurji', servingSize: '160g', calories: 176, proteinGrams: 19.7, carbsGrams: 3.7, fatsGrams: 9.1, cuisine: 'International' },
          { id: 'vsnp-2', name: 'Sprouted Moong Bean Salad', servingSize: '120g', calories: 112, proteinGrams: 9.2, carbsGrams: 17.6, fatsGrams: 0.6, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'lunch',
        title: 'Soya Chunks Masala & Steamed Broccoli',
        suggestedTime: '01:00 PM',
        prepTips: '50g soya chunks cooked in light home gravy with steamed broccoli and 1 whole wheat roti.',
        items: [
          { id: 'vsnp-3', name: 'Soya Chunks / Nutrela (Dry)', servingSize: '50g dry', calories: 172, proteinGrams: 26.0, carbsGrams: 16.5, fatsGrams: 0.5, cuisine: 'Indian' },
          { id: 'vsnp-4', name: 'Steamed Broccoli & Green Veggies', servingSize: '180g', calories: 61, proteinGrams: 5.0, carbsGrams: 12.0, fatsGrams: 0.7, cuisine: 'Universal' },
          { id: 'vsnp-5', name: 'Whole Wheat Roti / Phulka (1 roti)', servingSize: '45g', calories: 85, proteinGrams: 3.2, carbsGrams: 17.5, fatsGrams: 0.5, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'pre_workout',
        title: 'Black Coffee & Roasted Chana',
        suggestedTime: '04:30 PM',
        prepTips: 'Crunch on roasted chana 40 minutes before workout.',
        items: [
          { id: 'vsnp-6', name: 'Roasted Black Chana (Bengal Gram)', servingSize: '40g', calories: 148, proteinGrams: 9.2, carbsGrams: 23.2, fatsGrams: 2.0, cuisine: 'Indian' }
        ]
      },
      {
        mealType: 'post_workout',
        title: 'Desi Sattu Recovery Drink & Pumpkin Seeds',
        suggestedTime: '06:30 PM',
        prepTips: 'Chilled sattu in water with lemon juice and salt; small serving of pumpkin seeds.',
        items: [
          { id: 'vsnp-7', name: 'Desi Sattu Protein Drink', servingSize: '1 glass (40g powder)', calories: 165, proteinGrams: 10.4, carbsGrams: 26.0, fatsGrams: 2.1, cuisine: 'Indian' },
          { id: 'vsnp-8', name: 'Roasted Pumpkin & Sunflower Seeds Mix', servingSize: '20g', calories: 110, proteinGrams: 5.7, carbsGrams: 3.3, fatsGrams: 9.0, cuisine: 'Universal' }
        ]
      },
      {
        mealType: 'dinner',
        title: 'Boiled Kala Chana Chaat & Rajma Bowl',
        suggestedTime: '08:30 PM',
        prepTips: 'Warm bowl of spiced boiled black chickpeas and kidney beans with raw salad.',
        items: [
          { id: 'vsnp-9', name: 'Boiled Kala Chana Chaat (Black Chickpeas)', servingSize: '150g', calories: 190, proteinGrams: 13.0, carbsGrams: 30.0, fatsGrams: 2.8, cuisine: 'Indian' },
          { id: 'vsnp-10', name: 'Rajma Masala / Red Kidney Beans Curry', servingSize: '150g', calories: 165, proteinGrams: 9.3, carbsGrams: 24.8, fatsGrams: 3.6, cuisine: 'Indian' }
        ]
      }
    ]
  }
];


export const DEFAULT_DAILY_ROUTINE: RoutineItem[] = [
  {
    id: 'r1',
    time: '06:30 AM',
    title: 'Morning Hydration & Sunlight',
    description: 'Drink 500ml water with pinch of sea salt/lemon. Get 10 mins direct morning sunlight.',
    category: 'morning',
    durationMins: 15,
    completed: false,
    importance: 'high',
  },
  {
    id: 'r2',
    time: '07:00 AM',
    title: 'High-Protein Breakfast & Nutrition',
    description: 'Consume 30-40g quality protein (e.g. eggs, oats, whey) to stimulate muscle protein synthesis.',
    category: 'morning',
    durationMins: 20,
    completed: false,
    importance: 'high',
  },
  {
    id: 'r-yoga-morning',
    time: '07:30 AM',
    title: 'Morning Yoga Sun Salutation & Spine Awakening',
    description: '10-minute dynamic breath flow to decompress spine, activate core, and loosen morning stiffness.',
    category: 'morning',
    durationMins: 10,
    completed: false,
    importance: 'medium',
  },
  {
    id: 'r3',
    time: '11:00 AM',
    title: 'Midday Hydration & Movement Break',
    description: 'Refill 750ml water bottle, take 500-step walking break to avoid sedentary stiffness.',
    category: 'habit',
    durationMins: 10,
    completed: false,
    importance: 'medium',
  },
  {
    id: 'r4',
    time: '04:30 PM',
    title: 'Pre-Workout Fuel & Warm-Up Prep',
    description: 'Fast-digesting carbs (banana/rice cake) + hydration. Review today’s lifting plan.',
    category: 'preworkout',
    durationMins: 15,
    completed: false,
    importance: 'high',
  },
  {
    id: 'r5',
    time: '05:00 PM',
    title: 'Workout Training Window (Pulse Session)',
    description: 'Execute planned workout: Focus on progressive overload, rest intervals, and mind-muscle connection.',
    category: 'workout',
    durationMins: 55,
    completed: false,
    importance: 'high',
  },
  {
    id: 'r6',
    time: '06:15 PM',
    title: 'Post-Workout Shake & Anabolic Recovery',
    description: 'Whey protein + 5g Creatine Monohydrate + electrolytes. Quick 5-min hamstring & chest stretch.',
    category: 'postworkout',
    durationMins: 15,
    completed: false,
    importance: 'high',
  },
  {
    id: 'r7',
    time: '08:00 PM',
    title: 'Nutrient-Dense Dinner & Micro-Nutrients',
    description: 'Lean protein (salmon/chicken/tofu), complex carbs (sweet potato/rice), and colorful greens.',
    category: 'evening',
    durationMins: 30,
    completed: false,
    importance: 'medium',
  },
  {
    id: 'r-evening-stretch',
    time: '09:30 PM',
    title: 'Evening Deep Stretch & Full-Body Recovery',
    description: '15-minute restorative stretches (Child’s pose, hip flexor release, supine twist) for parasympathetic calm and sleep.',
    category: 'evening',
    durationMins: 15,
    completed: false,
    importance: 'medium',
  },
  {
    id: 'r8',
    time: '10:00 PM',
    title: 'Nightly Wind-Down & Sleep Optimization',
    description: 'Dim screens, magnesium/chamomile, keep bedroom cold (19°C / 66°F) for deep 7-8 hour sleep.',
    category: 'evening',
    durationMins: 20,
    completed: false,
    importance: 'high',
  },
];

export const DEFAULT_HABITS: DailyHabit[] = [
  { id: 'h1', title: 'Daily Workout Session', targetCount: 1, currentCount: 0, unit: 'session', completed: false, iconName: 'Dumbbell', streakDays: 4 },
  { id: 'h2', title: 'Hit Protein Target (g)', targetCount: 150, currentCount: 95, unit: 'g', completed: false, iconName: 'Beef', streakDays: 6 },
  { id: 'h3', title: 'Hydration (3 Liters)', targetCount: 3000, currentCount: 2250, unit: 'ml', completed: false, iconName: 'Droplets', streakDays: 12 },
  { id: 'h4', title: '8,000+ Daily Steps', targetCount: 8000, currentCount: 6420, unit: 'steps', completed: false, iconName: 'Footprints', streakDays: 3 },
  { id: 'h5', title: '7+ Hours Quality Sleep', targetCount: 7, currentCount: 7.5, unit: 'hrs', completed: true, iconName: 'Moon', streakDays: 8 },
  { id: 'h6', title: 'Creatine & Supplements', targetCount: 1, currentCount: 1, unit: 'dose', completed: true, iconName: 'Pill', streakDays: 14 },
  { id: 'h7', title: '10-Min Mobility / Stretch', targetCount: 10, currentCount: 10, unit: 'mins', completed: true, iconName: 'Activity', streakDays: 2 },
];
