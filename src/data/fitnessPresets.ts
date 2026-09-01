import { Exercise, WorkoutPlan, FoodItem, RoutineItem, DailyHabit } from '../types';

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
  { id: 'f1', name: 'Chicken Breast (Grilled/Cooked)', servingSize: '150g', calories: 247, proteinGrams: 46.5, carbsGrams: 0, fatsGrams: 5.4, fiberGrams: 0 },
  { id: 'f2', name: 'Whole Eggs (Boiled/Poached)', servingSize: '2 large (100g)', calories: 143, proteinGrams: 12.6, carbsGrams: 0.7, fatsGrams: 9.5, fiberGrams: 0 },
  { id: 'f3', name: 'Egg Whites', servingSize: '150g (4-5 whites)', calories: 78, proteinGrams: 16.5, carbsGrams: 1.1, fatsGrams: 0.3, fiberGrams: 0 },
  { id: 'f4', name: 'Greek Yogurt (0% Fat Plain)', servingSize: '200g', calories: 118, proteinGrams: 20.6, carbsGrams: 7.2, fatsGrams: 0.8, fiberGrams: 0 },
  { id: 'f5', name: 'Whey Protein Isolate', servingSize: '1 scoop (30g)', calories: 120, proteinGrams: 25.0, carbsGrams: 2.0, fatsGrams: 1.0, fiberGrams: 0 },
  { id: 'f6', name: 'Rolled Oats (Raw)', servingSize: '60g', calories: 233, proteinGrams: 8.0, carbsGrams: 40.0, fatsGrams: 4.2, fiberGrams: 6.2 },
  { id: 'f7', name: 'Brown Rice / Basmati (Cooked)', servingSize: '150g', calories: 195, proteinGrams: 4.5, carbsGrams: 41.0, fatsGrams: 1.5, fiberGrams: 2.5 },
  { id: 'f8', name: 'Sweet Potato (Baked)', servingSize: '200g', calories: 180, proteinGrams: 4.0, carbsGrams: 41.4, fatsGrams: 0.3, fiberGrams: 6.6 },
  { id: 'f9', name: 'Salmon Fillet (Pan-Seared)', servingSize: '150g', calories: 312, proteinGrams: 34.0, carbsGrams: 0, fatsGrams: 18.5, fiberGrams: 0 },
  { id: 'f10', name: 'Lean Ground Beef (93/7)', servingSize: '150g', calories: 228, proteinGrams: 31.5, carbsGrams: 0, fatsGrams: 10.5, fiberGrams: 0 },
  { id: 'f11', name: 'Peanut Butter (Natural)', servingSize: '2 tbsp (32g)', calories: 188, proteinGrams: 8.0, carbsGrams: 6.3, fatsGrams: 16.0, fiberGrams: 2.0 },
  { id: 'f12', name: 'Banana', servingSize: '1 medium (118g)', calories: 105, proteinGrams: 1.3, carbsGrams: 27.0, fatsGrams: 0.3, fiberGrams: 3.1 },
  { id: 'f13', name: 'Avocado', servingSize: '1/2 medium (100g)', calories: 160, proteinGrams: 2.0, carbsGrams: 8.5, fatsGrams: 14.7, fiberGrams: 6.7 },
  { id: 'f14', name: 'Cottage Cheese (Low Fat)', servingSize: '150g', calories: 110, proteinGrams: 18.0, carbsGrams: 5.0, fatsGrams: 2.0, fiberGrams: 0 },
  { id: 'f15', name: 'Broccoli / Green Veggies', servingSize: '150g', calories: 51, proteinGrams: 4.2, carbsGrams: 10.0, fatsGrams: 0.6, fiberGrams: 3.9 },
  { id: 'f16', name: 'Almonds (Raw)', servingSize: '30g (handful)', calories: 174, proteinGrams: 6.3, carbsGrams: 6.1, fatsGrams: 15.0, fiberGrams: 3.5 },
  { id: 'f17', name: 'Tofu / Tempeh (Firm)', servingSize: '150g', calories: 180, proteinGrams: 22.0, carbsGrams: 4.0, fatsGrams: 9.0, fiberGrams: 2.0 },
  { id: 'f18', name: 'Lentils / Chickpeas (Cooked)', servingSize: '150g', calories: 174, proteinGrams: 13.5, carbsGrams: 30.0, fatsGrams: 1.0, fiberGrams: 9.0 },
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
