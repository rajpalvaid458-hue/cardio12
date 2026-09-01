import { Exercise, WorkoutPlan, FoodItem, RoutineItem, DailyHabit, SupplementItem, PersonalDietPlan } from '../types';

export const EXERCISE_DATABASE: Exercise[] = [
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
];

export const PRESET_WORKOUT_PLANS: WorkoutPlan[] = [
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
