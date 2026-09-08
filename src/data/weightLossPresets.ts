import { Exercise, WorkoutPlan } from '../types';

export const WEIGHT_LOSS_EXERCISES: Exercise[] = [
  {
    id: 'mountain-climbers-rapid',
    name: 'Rapid Mountain Climbers (रैपिड माउंटेन क्लाइम्बर्स)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Abdominal Core, Hip Flexors & High Cardio Burn',
    secondaryMuscles: ['Shoulders', 'Chest', 'Quadriceps', 'Calves'],
    instructions: [
      'Start in a high plank position with palms flat on floor, arms straight under shoulders, and body forming a straight line.',
      'Brace your core tight and explosively drive your right knee toward your chest.',
      'Quickly switch legs in continuous rhythm, extending right leg back while simultaneously driving left knee forward.',
      'Maintain steady, rapid pace as if sprinting horizontally on the floor for the entire set duration.'
    ],
    formTips: [
      'Keep hips down level with shoulders—do not hike your butt up into the air',
      'Keep wrists directly below shoulders and grip floor firmly to protect joints',
      'Breathe rhythmically in through nose, out through mouth'
    ],
    defaultSets: 4,
    defaultReps: '45-60 sec',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 14,
  },
  {
    id: 'high-knees-cardio-sprint',
    name: 'High Knees In-Place Sprint (हाई नीज़ कार्डियो स्प्रिंट)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'High Calorie Heart Rate & Quads',
    secondaryMuscles: ['Calves', 'Core & Abs', 'Glutes', 'Hip Flexors'],
    instructions: [
      'Stand upright with feet hip-width apart and arms bent at 90-degree running angles.',
      'Drive right knee up toward your chest until thigh is parallel to floor or higher.',
      'Quickly drop right foot and immediately explode left knee upward.',
      'Pump arms back and forth dynamically in sync with leg turnover to elevate heart rate into the fat-burning zone.'
    ],
    formTips: [
      'Stay light on the balls of your feet; do not land heavily on your heels',
      'Keep chest tall and proud, avoiding leaning back as you tire',
      'Aim for minimum 130-150 strides per minute for peak calorie burn'
    ],
    defaultSets: 4,
    defaultReps: '45 sec',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 15,
  },
  {
    id: 'jumping-jacks-power',
    name: 'Power Jumping Jacks & Star Hops (जंपिंग जैक्स व स्टार हॉप्स)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Full Body Aerobic Conditioning & Calves',
    secondaryMuscles: ['Deltoids', 'Glutes', 'Core & Abs'],
    instructions: [
      'Stand tall with feet together, arms resting by sides.',
      'Jump feet outward slightly wider than shoulder-width while sweeping arms out and clapping overhead.',
      'Instantly jump back to starting position with feet together and arms by sides.',
      'Maintain smooth, energetic cadence for active continuous aerobic fat expenditure.'
    ],
    formTips: [
      'Keep knees softly bent upon landing to absorb ground impact smoothly',
      'Engage lower core to protect spine',
      'Great for beginner warm-up and intermediate high-speed conditioning'
    ],
    defaultSets: 4,
    defaultReps: '50 reps / 60 sec',
    defaultRestSeconds: 25,
    caloriesBurnedPerMin: 12,
  },
  {
    id: 'squat-jumps-plyo',
    name: 'Explosive Squat Jumps (एक्सप्लोसिव स्क्वाट जंप्स - थाई व फैट बर्नर)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Quadriceps, Glutes & EPOC Afterburn',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core & Abs'],
    instructions: [
      'Stand feet shoulder-width apart, toes turned slightly outward.',
      'Lower into a deep parallel squat, sending hips back and keeping chest high.',
      'From bottom position, explode powerfully off the floor jumping as high as possible, reaching arms upward.',
      'Land softly and absorb the landing immediately by decelerating straight into the next squat repetition.'
    ],
    formTips: [
      'Focus on soft, silent landings (toe-ball-heel) to protect knee cartilage',
      'Push knees outward in line with toes during squatting and landing',
      'Creates high post-exercise oxygen consumption (EPOC) that burns calories hours after workout'
    ],
    defaultSets: 4,
    defaultReps: '15-20 jumps',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 14,
  },
  {
    id: 'skater-hops-lateral',
    name: 'Lateral Speed Skater Hops (लेटरल स्केटर हॉप्स - साइड फैट व हिप टोन)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Outer Hips, Glute Medius & Side Belly Fat Burn',
    secondaryMuscles: ['Quadriceps', 'Calves', 'Core Obliques', 'Ankle Stabilizers'],
    instructions: [
      'Begin in a small semi-squat on right leg, left leg tucked slightly behind.',
      'Bound laterally to the left side, landing softly on left foot while swinging right foot behind like an Olympic speed skater.',
      'Immediately push off left foot to leap back across to the right side.',
      'Coordinate arms diagonally across your torso to drive agility and burn upper-body energy.'
    ],
    formTips: [
      'Keep hips back and chest slightly forward with a neutral spine',
      'Focus on lateral distance and speed while maintaining balance on each landing',
      'Targets stubborn hip fat and activates deep core stabilizers'
    ],
    defaultSets: 4,
    defaultReps: '30 bounds',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 13,
  },
  {
    id: 'tuck-jump-burpees',
    name: 'Full-Body Tuck Jump Burpees (फुल बॉडी टक जंप बर्पीज)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Maximum Calorie Incineration (Chest, Quads, Core)',
    secondaryMuscles: ['Shoulders', 'Lats', 'Calves', 'Cardiovascular Engine'],
    instructions: [
      'From standing, squat down and place both hands flat on floor inside feet.',
      'Kick feet back into plank and immediately lower chest and thighs flat onto floor.',
      'Push up aggressively, snap feet forward under hips, and leap vertically into air while pulling knees up to waist (tuck jump).',
      'Land softly and transition fluidly into next repetition without pause.'
    ],
    formTips: [
      'The #1 highest calorie expenditure bodyweight exercise (up to 18 kcal per minute)',
      'If tuck jump feels too intense, do a standard reach-and-jump overhead',
      'Keep abdominal wall braced when kicking back to plank'
    ],
    defaultSets: 4,
    defaultReps: '10-15 reps',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 18,
  },
  {
    id: 'plank-jacks-core',
    name: 'Plank Jacks (प्लैंक जैक्स - बेली फैट व कोर स्ट्रेंथ)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Deep Transverse Abdominis & Cardio Stamina',
    secondaryMuscles: ['Shoulders', 'Glutes', 'Hip Abductors', 'Lower Back'],
    instructions: [
      'Assume a solid high plank position on hands with shoulders locked over wrists and feet together.',
      'Keeping upper body stationary and core braced like steel, hop feet out wide.',
      'Instantly hop feet back together to center.',
      'Continue rhythmic jumping jacks with legs while maintaining rock-solid core stability.'
    ],
    formTips: [
      'Do not allow hips to bounce up and down; keep body completely horizontal',
      'Excellent for trimming lower belly fat while building core endurance',
      'Keep neck aligned with spine by looking at the floor 6 inches ahead of hands'
    ],
    defaultSets: 4,
    defaultReps: '40-50 hops',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 11,
  },
  {
    id: 'bicycle-crunches-burn',
    name: 'Rapid Bicycle Crunches (बाइसिकिल क्रंचेज - लव हैंडल्स व पेट)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Internal & External Obliques & Lower Abs',
    secondaryMuscles: ['Rectus Abdominis', 'Hip Flexors', 'Upper Abs'],
    instructions: [
      'Lie face up on floor, hands lightly supporting head with elbows flared open wide.',
      'Lift shoulder blades off floor and raise bent knees to 90 degrees.',
      'Rotate torso to bring right elbow toward left knee while fully extending right leg out straight 6 inches off ground.',
      'Fluidly alternate sides like pedaling a bicycle at a rapid yet controlled cadence.'
    ],
    formTips: [
      'Turn from the ribcage, not just the elbows, to fully contract obliques',
      'Do not pull or yank forward on your neck',
      'Ranked by scientific EMG research as the #1 abdominal muscle activation exercise'
    ],
    defaultSets: 4,
    defaultReps: '30-40 reps (total)',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 10,
  },
  {
    id: 'low-impact-step-jacks',
    name: 'Low-Impact Step Jacks & Knee Drives (लो-इम्पैक्ट फैट बर्नर - जोड़ों के लिए सुरक्षित)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Gentle Joint-Friendly Fat Loss (Heart & Core)',
    secondaryMuscles: ['Quadriceps', 'Shoulders', 'Calves', 'Obliques'],
    instructions: [
      'Stand upright with feet together and hands at sides.',
      'Step right foot wide out to the side while raising both arms overhead, keeping left foot planted on the floor (no jumping).',
      'Step right foot back to center as arms return.',
      'Immediately step left foot wide out with arms overhead, and alternate in steady, brisk, non-stop movement.',
      'Every 10 reps, add 5 high-knee drives bringing knee forcefully toward chest while pulling hands down.'
    ],
    formTips: [
      '100% safe for individuals with knee pain, lower back discomfort, or high body weight',
      'Zero impact on joint cartilage, but elevates heart rate to 65-75% max for sustained fat burn',
      'Great for home workouts where jumping is not possible'
    ],
    defaultSets: 4,
    defaultReps: '60 sec',
    defaultRestSeconds: 20,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'bear-crawl-metabolic',
    name: 'Metabolic Bear Crawls (मेटाबॉलिक बेयर क्रॉल - फुल बॉडी बर्नर)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Total Body Kinetic Chain & Core Stability',
    secondaryMuscles: ['Shoulders', 'Quads', 'Serratus Anterior', 'Calves'],
    instructions: [
      'Get down on all fours with hands under shoulders and knees hovering 1-2 inches above ground at 90-degree angles.',
      'Crawl forward by moving opposite hand and opposite foot simultaneously in small, controlled 6-inch steps.',
      'Keep back flat like a tabletop—imagine balancing a bowl of water on your spine.',
      'Crawl forward 15 feet, then reverse crawl backward to start position.'
    ],
    formTips: [
      'Do not let hips sway or rotate excessively side-to-side',
      'Forces deep stabilization muscles throughout shoulders, hips, and core to burn massive energy',
      'Keep knees hovered close to the floor at all times'
    ],
    defaultSets: 3,
    defaultReps: '45 sec',
    defaultRestSeconds: 40,
    caloriesBurnedPerMin: 13,
  },
  {
    id: 'shadow-boxing-fatburn',
    name: 'High-Speed Shadow Boxing & Combos (हाई-स्पीड शैडो बॉक्सिंग)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Upper Body Tone, Core Rotation & Cardio',
    secondaryMuscles: ['Shoulders', 'Lats', 'Calves', 'Pectorals'],
    instructions: [
      'Assume boxing stance with hands guarding chin, knees soft, weight on balls of feet.',
      'Throw rapid 1-2 combinations: Left Jab, Right Cross, Left Hook, followed by a slip and duck.',
      'Stay light on your feet, constantly shuffling forwards, backwards, and pivoting in circles.',
      'Keep punches crisp, extending full arm and snapping fist back immediately to guard.'
    ],
    formTips: [
      'Rotate hips and pivot back foot on the cross punch to engage core power',
      'Never hyperextend elbows; keep slight softness at end of punch extension',
      'Burns fat quickly while building lean, defined shoulders and arms'
    ],
    defaultSets: 4,
    defaultReps: '2 min round',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 12,
  },
  {
    id: 'battle-ropes-slams',
    name: 'Battle Ropes Alternating Waves & Double Slams (बैटल रोप्स)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Other',
    targetMuscle: 'Upper Body Anaerobic Power & Calorie Shred',
    secondaryMuscles: ['Shoulders', 'Forearms', 'Core & Abs', 'Glutes'],
    instructions: [
      'Grip rope handles firmly with thumbs forward, standing in an athletic quarter squat stance.',
      'Perform 20 seconds of rapid alternating waves by pumping arms up and down alternately at maximum velocity.',
      'Transition immediately into 10 seconds of explosive double slams: raise both arms overhead on toes, then slam ropes down hard while dropping into squat.',
      'Rest 30 seconds and repeat.'
    ],
    formTips: [
      'Brace core firmly to protect lower back during forceful downward slams',
      'Keep weight back on heels and maintain broad chest',
      'One of the fastest gym conditioning tools for visceral fat reduction'
    ],
    defaultSets: 4,
    defaultReps: '30 sec all-out',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 16,
  },
  {
    id: 'stair-climber-hiit',
    name: 'Stair Climber HIIT Intervals (स्टेयर क्लाइम्बर हाई-इंटेंसिटी)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Cardio',
    targetMuscle: 'Glutes, Hamstrings & Lower Body Fat Burn',
    secondaryMuscles: ['Calves', 'Quadriceps', 'Core Balance'],
    instructions: [
      'Step onto revolving stair machine or real stadium/gym stairs.',
      'Warm up for 2 minutes at moderate pace (level 5-6).',
      'Sprint: Climb rapidly for 45 seconds at high speed (level 10-12) taking single or double steps with strong leg drive.',
      'Recover: Slow to moderate pace (level 4) for 30 seconds.',
      'Repeat interval pattern for total 15-20 minutes.'
    ],
    formTips: [
      'Do not lean forward and slouch onto the handrails—let your legs and core carry your bodyweight',
      'Step through the whole foot rather than just your toes to recruit maximum glute and hamstring power',
      'Burns high calories while lifting and toning glutes'
    ],
    defaultSets: 1,
    defaultReps: '15-20 min',
    defaultRestSeconds: 0,
    caloriesBurnedPerMin: 14,
  },
  {
    id: 'kettlebell-snatch-fatloss',
    name: 'Kettlebell One-Arm Snatch & Clean (कैटलबेल स्नैच - सुपर फैट बर्नर)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Kettlebell',
    targetMuscle: 'Posterior Chain Explosiveness & Fat Loss EPOC',
    secondaryMuscles: ['Shoulders', 'Lats', 'Traps', 'Core & Abs'],
    instructions: [
      'Stand feet shoulder-width, kettlebell on floor in front of you.',
      'Hinge hips back and grasp kettlebell with one hand.',
      'Hike kettlebell back between thighs, snap hips forward violently, and guide bell straight up close to body.',
      'Punch hand through at the top to lock out overhead without slamming forearm.',
      'Lower under control to rack or backswing and repeat, switching arms after designated reps.'
    ],
    formTips: [
      'Power is generated 100% by hip extension, not arm muscling',
      'Keep core braced at top lockout',
      'Combines strength, power, and high-aerobic output into a single movement'
    ],
    defaultSets: 4,
    defaultReps: '10-12 per arm',
    defaultRestSeconds: 45,
    caloriesBurnedPerMin: 15,
  },
  {
    id: 'dumbbell-manmakers',
    name: 'Dumbbell Man-Maker Complex (डंबल मैन-मेकर्स - अल्टीमेट फैट बर्नर)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Dumbbell',
    targetMuscle: 'Ultimate Full Body Compound Fat Annihilator',
    secondaryMuscles: ['Chest', 'Back & Lats', 'Shoulders', 'Quadriceps', 'Core'],
    instructions: [
      'Hold a dumbbell in each hand and assume push-up position with dumbbells resting on floor.',
      'Perform a strict push-up.',
      'At top of push-up, row right dumbbell up to ribcage, lower it, then row left dumbbell up.',
      'Jump feet forward outside dumbbells into a squat.',
      'Clean dumbbells to shoulders while rising from squat, and immediately drive straight up into an overhead dumbbell thruster press.',
      'Return dumbbells to floor and repeat sequence.'
    ],
    formTips: [
      'Use moderate weights—this is a demanding metabolic complex',
      'Keep wide feet during push-up and row to prevent hips from twisting',
      'One of the most comprehensive single-exercise fat burners known'
    ],
    defaultSets: 4,
    defaultReps: '8-10 reps',
    defaultRestSeconds: 60,
    caloriesBurnedPerMin: 16,
  },
  {
    id: 'weighted-russian-twists',
    name: 'Weighted Russian Twists (वेटेड रशियन ट्विस्ट्स - कमर व साइड फैट)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Dumbbell',
    targetMuscle: 'Obliques, Waist Tapering & Abdominal Wall',
    secondaryMuscles: ['Hip Flexors', 'Rectus Abdominis', 'Lower Back'],
    instructions: [
      'Sit on floor with knees bent, feet hovering 2 inches off floor (or heels gently resting for beginners).',
      'Lean back at a 45-degree angle with proud chest and braced abs.',
      'Hold dumbbell or weight plate with both hands at chest.',
      'Rotate torso smoothly from left to right, tapping weight gently on floor beside your hip on each side.',
      'Keep gaze following hands and maintain constant core tension.'
    ],
    formTips: [
      'Rotate your entire shoulder girdle and chest, not just your arms',
      'Keep spine long and straight; avoid rounding your lower back',
      'Targets love handles and tightens waist circumference'
    ],
    defaultSets: 4,
    defaultReps: '24-30 twists (total)',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 9,
  },
  {
    id: 'jump-rope-crisscross',
    name: 'Speed Jump Rope & Crisscross (स्पीड जंप रोप - रैपिड फैट बर्न)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Cardio',
    targetMuscle: 'Calves, Foot Agility, Aerobic Engine',
    secondaryMuscles: ['Shoulders', 'Forearms', 'Core & Abs'],
    instructions: [
      'Hold jump rope handles loosely with elbows held close to ribs.',
      'Turn rope with wrists, jumping only 1-2 inches off the floor on the balls of your feet.',
      'Alternate between basic bounce, high-knee skipping, and occasional arm cross (crisscross).',
      'Maintain continuous high speed for 60 to 90 seconds per round.'
    ],
    formTips: [
      'Jump softly with slightly bent knees',
      'Rotate only from the wrists, not whole arms or shoulders',
      'Burns approximately 14-16 calories per minute—twice as fast as moderate jogging'
    ],
    defaultSets: 4,
    defaultReps: '60-90 sec',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 15,
  },
  {
    id: 'incline-sprints-treadmill',
    name: 'HIIT Incline Treadmill Sprints (इन्क्लाइन ट्रेडमिल स्प्रिंट्स)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Cardio',
    targetMuscle: 'Anaerobic Sprint Power, Glutes & Massive Fat Burn',
    secondaryMuscles: ['Hamstrings', 'Quadriceps', 'Calves', 'Core'],
    instructions: [
      'Set treadmill to an 8% to 10% incline at a brisk warm-up walk for 3 minutes.',
      'Increase speed to your high sprint velocity (12-16 km/h).',
      'Sprint aggressively for 30 seconds, driving knees and pumping arms with full power.',
      'At 30 seconds, carefully straddle the side rails and reduce speed for a 30-second passive rest.',
      'Repeat for 8 to 12 total sprint rounds.'
    ],
    formTips: [
      'Running on an incline dramatically reduces joint impact on knees while quadrupling glute and hamstring burn',
      'Never grab handrails during sprint phase',
      'Triggers massive growth hormone release and post-workout fat burn'
    ],
    defaultSets: 8,
    defaultReps: '30 sec sprint / 30 sec rest',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 17,
  },
  {
    id: 'wall-sit-punches',
    name: 'Wall Sit with Continuous Boxing Punches (वॉल सिट विद पंचेज)',
    category: 'Weight Loss & Fat Burn',
    discipline: 'Weight Loss & Fat Burn',
    equipment: 'Bodyweight',
    targetMuscle: 'Quad Isometric Endurance & Upper Body Cardio',
    secondaryMuscles: ['Deltoids', 'Glutes', 'Core & Abs'],
    instructions: [
      'Lean back against a sturdy flat wall and slide down until thighs are parallel to floor at a 90-degree bend.',
      'Ensure knees are directly stacked over ankles and lower back is pressed flat into wall.',
      'While holding this demanding quad contraction, throw continuous straight boxing punches forward at eye level.',
      'Keep breathing steady and hold for full 45 to 60 seconds.'
    ],
    formTips: [
      'Do not rest hands on knees or thighs',
      'Keep chin tucked and throw light, snappy punches to distract from leg burn',
      'Strengthens knees and burns stubborn lower-body fat'
    ],
    defaultSets: 3,
    defaultReps: '45-60 sec',
    defaultRestSeconds: 30,
    caloriesBurnedPerMin: 10,
  },
];

export const WEIGHT_LOSS_WORKOUT_PLANS: WorkoutPlan[] = [
  // 1. FAST WEIGHT LOSS & BELLY FAT SHREDDER (30 MIN)
  {
    id: 'plan-fast-weight-loss-shred',
    title: '30-Min Fast Weight Loss & Belly Fat Shredder',
    titleHi: 'तेजी से वजन व पेट की चर्बी घटाने वाला 30-मिनट वर्कआउट',
    splitType: 'Weight Loss & Fat Burn',
    level: 'beginner',
    targetGender: 'all',
    durationMinutes: 30,
    daysPerWeek: 4,
    programType: 'daily',
    description:
      'High-efficiency metabolic fat-loss circuit designed to torch 350-450 calories in 30 minutes, spike post-workout EPOC afterburn, and trim stubborn belly fat without needing bulky gym equipment.',
    tags: ['Weight Loss', 'Fat Burn', 'Belly Fat', 'HIIT', 'Calorie Torcher', 'Home & Gym', 'Fast Results'],
    exercises: [
      {
        id: 'wls1',
        exerciseId: 'high-knees-cardio-sprint',
        name: 'High Knees In-Place Cardio Sprint',
        targetMuscle: 'Heart Rate Spike & Quads',
        restSec: 30,
        formTip: 'Drive knees to hip level, pump arms actively',
        sets: [
          { id: 'wls1_1', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'wls1_2', setNumber: 2, weightKg: 0, reps: 45, completed: false },
          { id: 'wls1_3', setNumber: 3, weightKg: 0, reps: 45, completed: false },
        ]
      },
      {
        id: 'wls2',
        exerciseId: 'mountain-climbers-rapid',
        name: 'Rapid Mountain Climbers',
        targetMuscle: 'Lower Belly Fat & Cardio',
        restSec: 30,
        formTip: 'Keep hips down, sprint knees forward continuously',
        sets: [
          { id: 'wls2_1', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'wls2_2', setNumber: 2, weightKg: 0, reps: 45, completed: false },
          { id: 'wls2_3', setNumber: 3, weightKg: 0, reps: 45, completed: false },
        ]
      },
      {
        id: 'wls3',
        exerciseId: 'squat-jumps-plyo',
        name: 'Explosive Squat Jumps',
        targetMuscle: 'Quads, Glutes & EPOC Afterburn',
        restSec: 40,
        formTip: 'Land softly toe-to-heel into deep squat',
        sets: [
          { id: 'wls3_1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 'wls3_2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
          { id: 'wls3_3', setNumber: 3, weightKg: 0, reps: 12, completed: false },
        ]
      },
      {
        id: 'wls4',
        exerciseId: 'plank-jacks-core',
        name: 'Plank Jacks (Core & Waist Tightening)',
        targetMuscle: 'Deep Abdominals & Obliques',
        restSec: 30,
        formTip: 'Keep back flat while hopping feet wide and in',
        sets: [
          { id: 'wls4_1', setNumber: 1, weightKg: 0, reps: 30, completed: false },
          { id: 'wls4_2', setNumber: 2, weightKg: 0, reps: 30, completed: false },
          { id: 'wls4_3', setNumber: 3, weightKg: 0, reps: 30, completed: false },
        ]
      },
      {
        id: 'wls5',
        exerciseId: 'skater-hops-lateral',
        name: 'Lateral Speed Skater Hops',
        targetMuscle: 'Side Hip & Oblique Fat Loss',
        restSec: 30,
        formTip: 'Bound side to side with athletic momentum',
        sets: [
          { id: 'wls5_1', setNumber: 1, weightKg: 0, reps: 24, completed: false },
          { id: 'wls5_2', setNumber: 2, weightKg: 0, reps: 24, completed: false },
        ]
      },
      {
        id: 'wls6',
        exerciseId: 'bicycle-crunches-burn',
        name: 'Rapid Bicycle Crunches',
        targetMuscle: 'Love Handles & Belly Flattening',
        restSec: 30,
        formTip: 'Rotate elbow across to knee, full leg extension',
        sets: [
          { id: 'wls6_1', setNumber: 1, weightKg: 0, reps: 30, completed: false },
          { id: 'wls6_2', setNumber: 2, weightKg: 0, reps: 30, completed: false },
        ]
      },
      {
        id: 'wls7',
        exerciseId: 'tuck-jump-burpees',
        name: 'Full-Body Tuck Jump Burpees (Finisher)',
        targetMuscle: 'Maximum Calorie Burn Finisher',
        restSec: 45,
        formTip: 'Chest to floor, push up and leap high',
        sets: [
          { id: 'wls7_1', setNumber: 1, weightKg: 0, reps: 10, completed: false },
          { id: 'wls7_2', setNumber: 2, weightKg: 0, reps: 10, completed: false },
        ]
      },
    ]
  },

  // 2. LOW IMPACT WEIGHT LOSS (JOINT & KNEE FRIENDLY, ZERO JUMPING)
  {
    id: 'plan-low-impact-weight-loss',
    title: 'Low-Impact Weight Loss (Knee & Joint Safe, No Jumping)',
    titleHi: 'घुटनों के लिए सुरक्षित बिना कूदने वाला वेट लॉस वर्कआउट',
    splitType: 'Weight Loss & Fat Burn',
    level: 'beginner',
    targetGender: 'all',
    durationMinutes: 35,
    daysPerWeek: 4,
    programType: 'daily',
    description:
      'Specially designed for beginners, overweight individuals, or anyone with knee/back sensitivity. 100% no-jump, low-impact movements that safely keep your heart in the optimal fat-burning zone without cartilage stress.',
    tags: ['Weight Loss', 'Low Impact', 'Knee Friendly', 'No Jump', 'Safe Cardio', 'Overweight Friendly', 'Beginner'],
    exercises: [
      {
        id: 'liw1',
        exerciseId: 'low-impact-step-jacks',
        name: 'Low-Impact Step Jacks & Knee Drives',
        targetMuscle: 'Aerobic Warm-up & Core',
        restSec: 20,
        formTip: 'Step out wide without jumping, reach arms tall',
        sets: [
          { id: 'liw1_1', setNumber: 1, weightKg: 0, reps: 50, completed: false },
          { id: 'liw1_2', setNumber: 2, weightKg: 0, reps: 50, completed: false },
          { id: 'liw1_3', setNumber: 3, weightKg: 0, reps: 50, completed: false },
        ]
      },
      {
        id: 'liw2',
        exerciseId: 'bodyweight-air-squats',
        name: 'Controlled Bodyweight Air Squats',
        targetMuscle: 'Thighs & Glutes',
        restSec: 45,
        formTip: 'Keep heels flat, descend gently to comfortable depth',
        sets: [
          { id: 'liw2_1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 'liw2_2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
          { id: 'liw2_3', setNumber: 3, weightKg: 0, reps: 15, completed: false },
        ]
      },
      {
        id: 'liw3',
        exerciseId: 'mountain-climbers-rapid',
        name: 'Controlled Tempo Mountain Climbers (Incline / Mat)',
        targetMuscle: 'Abdominals & Safe Cardio',
        restSec: 30,
        formTip: 'Step knees forward at a smooth, steady walking pace',
        sets: [
          { id: 'liw3_1', setNumber: 1, weightKg: 0, reps: 30, completed: false },
          { id: 'liw3_2', setNumber: 2, weightKg: 0, reps: 30, completed: false },
        ]
      },
      {
        id: 'liw4',
        exerciseId: 'wall-sit-punches',
        name: 'Wall Sit with Continuous Punches',
        targetMuscle: 'Quad Strength & Upper Body Burn',
        restSec: 30,
        formTip: 'Press spine firmly against wall, throw continuous straight punches',
        sets: [
          { id: 'liw4_1', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'liw4_2', setNumber: 2, weightKg: 0, reps: 45, completed: false },
        ]
      },
      {
        id: 'liw5',
        exerciseId: 'glute-bridges-bw',
        name: 'Bodyweight Glute Bridges',
        targetMuscle: 'Glutes & Lower Back Stability',
        restSec: 30,
        formTip: 'Squeeze glutes hard at the top for 2 seconds',
        sets: [
          { id: 'liw5_1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 'liw5_2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
        ]
      },
      {
        id: 'liw6',
        exerciseId: 'treadmill-incline-walk',
        name: 'Zone 2 Fat-Burning Incline Walk',
        targetMuscle: 'Continuous Aerobic Fat Oxidation',
        restSec: 0,
        formTip: '10% incline at 4.5 km/h, maintain upright posture',
        sets: [
          { id: 'liw6_1', setNumber: 1, weightKg: 0, reps: 20, completed: false },
        ]
      },
    ]
  },

  // 3. DUMBBELL METABOLIC WEIGHT LOSS & MUSCLE TONING
  {
    id: 'plan-dumbbell-metabolic-fatloss',
    title: 'Dumbbell Metabolic Fat Loss & Full-Body Tone',
    titleHi: 'डंबल मेटाबॉलिक वेट लॉस व बॉडी टोनिंग',
    splitType: 'Weight Loss & Fat Burn',
    level: 'intermediate',
    targetGender: 'all',
    durationMinutes: 40,
    daysPerWeek: 4,
    programType: 'daily',
    description:
      'Blends multi-joint dumbbell compound movements with cardio pacing to keep your metabolic rate elevated for up to 36 hours while keeping muscles firm, toned, and defined.',
    tags: ['Weight Loss', 'Dumbbells', 'Metabolic Conditioning', 'Body Sculpt', 'Tone & Burn', 'Full Body'],
    exercises: [
      {
        id: 'dbm1',
        exerciseId: 'dumbbell-thruster',
        name: 'Dumbbell Thrusters (Squat to Overhead Press)',
        targetMuscle: 'Full Body Explosive Power',
        restSec: 45,
        formTip: 'Drive out of deep squat directly into overhead press',
        sets: [
          { id: 'dbm1_1', setNumber: 1, weightKg: 8, reps: 12, completed: false },
          { id: 'dbm1_2', setNumber: 2, weightKg: 8, reps: 12, completed: false },
          { id: 'dbm1_3', setNumber: 3, weightKg: 10, reps: 10, completed: false },
        ]
      },
      {
        id: 'dbm2',
        exerciseId: 'kettlebell-swing',
        name: 'Kettlebell / Dumbbell Hip Swings',
        targetMuscle: 'Posterior Chain & High Cardio Burn',
        restSec: 30,
        formTip: 'Snap hips forward violently, squeeze glutes at top',
        sets: [
          { id: 'dbm2_1', setNumber: 1, weightKg: 12, reps: 20, completed: false },
          { id: 'dbm2_2', setNumber: 2, weightKg: 12, reps: 20, completed: false },
          { id: 'dbm2_3', setNumber: 3, weightKg: 12, reps: 20, completed: false },
        ]
      },
      {
        id: 'dbm3',
        exerciseId: 'walking-lunges-bw',
        name: 'Dumbbell Walking Lunges',
        targetMuscle: 'Glutes, Quads & Hamstrings',
        restSec: 45,
        formTip: 'Keep torso upright, take long confident strides',
        sets: [
          { id: 'dbm3_1', setNumber: 1, weightKg: 6, reps: 20, completed: false },
          { id: 'dbm3_2', setNumber: 2, weightKg: 8, reps: 20, completed: false },
        ]
      },
      {
        id: 'dbm4',
        exerciseId: 'dumbbell-manmakers',
        name: 'Dumbbell Man-Maker Complex',
        targetMuscle: 'Full-Body Muscle Recruiter & Calorie Torcher',
        restSec: 60,
        formTip: 'Push-up, row each side, clean to squat, and press overhead',
        sets: [
          { id: 'dbm4_1', setNumber: 1, weightKg: 6, reps: 8, completed: false },
          { id: 'dbm4_2', setNumber: 2, weightKg: 6, reps: 8, completed: false },
        ]
      },
      {
        id: 'dbm5',
        exerciseId: 'weighted-russian-twists',
        name: 'Weighted Russian Twists',
        targetMuscle: 'Obliques & Waist Tightening',
        restSec: 30,
        formTip: 'Recline 45 degrees, rotate torso smoothly side to side',
        sets: [
          { id: 'dbm5_1', setNumber: 1, weightKg: 5, reps: 24, completed: false },
          { id: 'dbm5_2', setNumber: 2, weightKg: 5, reps: 24, completed: false },
        ]
      },
      {
        id: 'dbm6',
        exerciseId: 'speed-jump-rope',
        name: 'Speed Jump Rope Finisher',
        targetMuscle: 'Calves, Foot Agility & Cardio Engine',
        restSec: 30,
        formTip: 'Stay on balls of feet, turn rope purely from wrists',
        sets: [
          { id: 'dbm6_1', setNumber: 1, weightKg: 0, reps: 60, completed: false },
          { id: 'dbm6_2', setNumber: 2, weightKg: 0, reps: 60, completed: false },
        ]
      },
    ]
  },

  // 4. 1-WEEK COMPLETE WEIGHT LOSS & CALORIE BURN PROGRAM (5-DAY SPLIT)
  {
    id: 'plan-1week-weight-loss-complete',
    title: '1-Week Weight Loss & Calorie Burn Program',
    titleHi: '1-सप्ताह संपूर्ण वेट लॉस रूटीन (5-दिन शेड्यूल)',
    splitType: 'Weight Loss & Fat Burn',
    level: 'beginner',
    targetGender: 'all',
    durationMinutes: 35,
    daysPerWeek: 5,
    programType: '1-week',
    description:
      'Scientifically sequenced 7-day fat-loss roadmap with alternating high-burn metabolic intervals, core & waist sculpting, joint recovery walks, and nutrition tips to jumpstart fat loss.',
    tags: ['Weight Loss', '1-Week Plan', 'Fat Loss Schedule', 'Belly Fat', 'Calorie Deficit', 'Structured Routine'],
    weeklySchedule: [
      {
        dayNumber: 1,
        dayName: 'Monday',
        dayNameHi: 'सोमवार',
        focus: 'Full-Body High-Calorie HIIT Circuit',
        focusHi: 'हाई-कैलोरी फैट बर्नर सर्किट',
        restDay: false,
        exerciseCount: 6,
        exercisesSummary: ['High Knees Sprint', 'Rapid Mountain Climbers', 'Squat Jumps', 'Plank Jacks', 'Push-ups', 'Jumping Jacks'],
        tips: 'Target 350+ active calorie expenditure. Stay hydrated with 500ml water 30 minutes before training.',
      },
      {
        dayNumber: 2,
        dayName: 'Tuesday',
        dayNameHi: 'मंगलवार',
        focus: 'Core, Love Handles & Waist Trim',
        focusHi: 'कमर व पेट टोनिंग',
        restDay: false,
        exerciseCount: 5,
        exercisesSummary: ['Bicycle Crunches', 'Russian Twists', 'Plank Jacks', 'Glute Bridges', 'Wall Sit Punches'],
        tips: 'Maintain continuous ab contraction. Focus on slow, controlled rotation rather than jerking speed.',
      },
      {
        dayNumber: 3,
        dayName: 'Wednesday',
        dayNameHi: 'बुधवार',
        focus: 'Active Recovery & 7,000 Step Walk',
        focusHi: 'सक्रिय रिकवरी व ब्रिस्क वॉक',
        restDay: true,
        tips: 'Walk at least 7,000 to 10,000 brisk steps outdoors or on treadmill. Keep calorie burn steady without fatigue.',
      },
      {
        dayNumber: 4,
        dayName: 'Thursday',
        dayNameHi: 'गुरुवार',
        focus: 'Lower Body & Glute Fat Shredder',
        focusHi: 'थाई व लेग फैट बर्न',
        restDay: false,
        exerciseCount: 5,
        exercisesSummary: ['Walking Lunges', 'Air Squats', 'Skater Hops', 'Kettlebell / DB Swings', 'Wall Sit Punches'],
        tips: 'Lower body muscles are the largest in the body; working them burns the most glycogen and body fat.',
      },
      {
        dayNumber: 5,
        dayName: 'Friday',
        dayNameHi: 'शुक्रवार',
        focus: 'Tabata Cardio & Metabolic Blast',
        focusHi: 'तबाता कार्डियो ब्लास्ट',
        restDay: false,
        exerciseCount: 5,
        exercisesSummary: ['Tuck Jump Burpees', 'High Knees Sprint', 'Mountain Climbers', 'Speed Jump Rope', 'Shadow Boxing'],
        tips: 'Give 100% effort during work intervals, then breathe deeply during short rest pauses.',
      },
      {
        dayNumber: 6,
        dayName: 'Saturday',
        dayNameHi: 'शनिवार',
        focus: 'Zone 2 Steady Cardio or Outdoor Activity',
        focusHi: 'हल्की जॉगिंग या आउटडोर साइकिलिंग',
        restDay: false,
        exerciseCount: 1,
        exercisesSummary: ['Zone 2 Incline Treadmill Walk or Outdoor Brisk Walk (35-45 min)'],
        tips: 'Zone 2 heart rate (60-70% max) primarily burns stored body fat as fuel. You should be able to hold a conversation while walking.',
      },
      {
        dayNumber: 7,
        dayName: 'Sunday',
        dayNameHi: 'रविवार',
        focus: 'Rest, Weekly Weigh-In & Meal Prep',
        focusHi: 'विश्राम, वजन माप व हेल्दी मील प्रेप',
        restDay: true,
        tips: 'Weigh yourself in the morning on an empty stomach. Review your calorie deficit and prep fresh high-protein meals for next week.',
      },
    ],
    exercises: [
      {
        id: 'wlp1',
        exerciseId: 'high-knees-cardio-sprint',
        name: 'High Knees In-Place Cardio Sprint',
        targetMuscle: 'High Calorie Heart Rate & Quads',
        restSec: 30,
        formTip: 'Drive knees to hip height, pump arms',
        sets: [
          { id: 'wlp1_1', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'wlp1_2', setNumber: 2, weightKg: 0, reps: 45, completed: false },
          { id: 'wlp1_3', setNumber: 3, weightKg: 0, reps: 45, completed: false },
        ]
      },
      {
        id: 'wlp2',
        exerciseId: 'mountain-climbers-rapid',
        name: 'Rapid Mountain Climbers',
        targetMuscle: 'Abdominal Core & High Cardio Burn',
        restSec: 30,
        formTip: 'Keep hips level, sprint knees forward',
        sets: [
          { id: 'wlp2_1', setNumber: 1, weightKg: 0, reps: 45, completed: false },
          { id: 'wlp2_2', setNumber: 2, weightKg: 0, reps: 45, completed: false },
          { id: 'wlp2_3', setNumber: 3, weightKg: 0, reps: 45, completed: false },
        ]
      },
      {
        id: 'wlp3',
        exerciseId: 'squat-jumps-plyo',
        name: 'Explosive Squat Jumps',
        targetMuscle: 'Quads & Glute Fat Loss',
        restSec: 40,
        formTip: 'Soft toe-to-heel landing into deep squat',
        sets: [
          { id: 'wlp3_1', setNumber: 1, weightKg: 0, reps: 15, completed: false },
          { id: 'wlp3_2', setNumber: 2, weightKg: 0, reps: 15, completed: false },
        ]
      },
      {
        id: 'wlp4',
        exerciseId: 'bicycle-crunches-burn',
        name: 'Rapid Bicycle Crunches',
        targetMuscle: 'Obliques & Lower Belly',
        restSec: 30,
        formTip: 'Rotate elbow across to opposite knee',
        sets: [
          { id: 'wlp4_1', setNumber: 1, weightKg: 0, reps: 30, completed: false },
          { id: 'wlp4_2', setNumber: 2, weightKg: 0, reps: 30, completed: false },
        ]
      },
      {
        id: 'wlp5',
        exerciseId: 'skater-hops-lateral',
        name: 'Lateral Speed Skater Hops',
        targetMuscle: 'Outer Hips & Side Belly Fat',
        restSec: 30,
        formTip: 'Bound side-to-side with athletic speed',
        sets: [
          { id: 'wlp5_1', setNumber: 1, weightKg: 0, reps: 24, completed: false },
          { id: 'wlp5_2', setNumber: 2, weightKg: 0, reps: 24, completed: false },
        ]
      },
      {
        id: 'wlp6',
        exerciseId: 'tuck-jump-burpees',
        name: 'Full-Body Tuck Jump Burpees (Finisher)',
        targetMuscle: 'Full Body Maximum Calorie Burn',
        restSec: 45,
        formTip: 'Chest to floor, leap explosively with knees tucked',
        sets: [
          { id: 'wlp6_1', setNumber: 1, weightKg: 0, reps: 12, completed: false },
          { id: 'wlp6_2', setNumber: 2, weightKg: 0, reps: 10, completed: false },
        ]
      },
    ]
  },
];
