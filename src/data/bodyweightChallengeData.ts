import { BodyweightChallengeTrack, BodyweightChallengeDay } from '../types';

// Helper to generate 30 days for pushups
function generatePushupChallenge(): BodyweightChallengeDay[] {
  const variations = [
    { name: 'Standard Push-Ups', cue: 'Maintain a rigid plank line; screw palms into floor and touch chest to floor.' },
    { name: 'Wide-Grip Push-Ups', cue: 'Flared grip with 45° elbow angle; emphasize outer chest contraction.' },
    { name: 'Diamond Close-Grip Push-Ups', cue: 'Index and thumbs touching; tuck elbows tight to focus on triceps and inner chest.' },
    { name: 'Tempo Push-Ups (3s Down, 1s Pause)', cue: 'Lower under strict 3-second control; eliminate bounce at the bottom.' },
    { name: 'Decline / Incline Push-Ups', cue: 'Elevate feet for upper clavicular chest activation; brace glutes.' },
    { name: 'Hand-Release Push-Ups', cue: 'Lift hands off floor for a split second at the bottom to reset momentum.' },
    { name: 'Push-Up + Shoulder Tap', cue: 'Anti-rotational core stability; do not let hips sway when tapping opposite shoulder.' },
  ];

  const targets = [
    // Week 1 (Foundation)
    { day: 1, reps: 15, sets: 2, varIdx: 0, rest: false },
    { day: 2, reps: 20, sets: 2, varIdx: 0, rest: false },
    { day: 3, reps: 25, sets: 3, varIdx: 1, rest: false },
    { day: 4, reps: 25, sets: 3, varIdx: 0, rest: false },
    { day: 5, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Chest & shoulder doorway stretch, wrist mobility.' },
    { day: 6, reps: 30, sets: 3, varIdx: 2, rest: false },
    { day: 7, reps: 35, sets: 3, varIdx: 0, rest: false },

    // Week 2 (Volume Ramp)
    { day: 8, reps: 40, sets: 4, varIdx: 3, rest: false },
    { day: 9, reps: 45, sets: 4, varIdx: 1, rest: false },
    { day: 10, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Foam roll thoracic spine, light cardio walk.' },
    { day: 11, reps: 50, sets: 4, varIdx: 0, rest: false },
    { day: 12, reps: 50, sets: 5, varIdx: 2, rest: false },
    { day: 13, reps: 55, sets: 5, varIdx: 4, rest: false },
    { day: 14, reps: 60, sets: 5, varIdx: 0, rest: false },

    // Week 3 (Intensity & Density)
    { day: 15, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Child’s pose, triceps stretching, hydration.' },
    { day: 16, reps: 65, sets: 5, varIdx: 5, rest: false },
    { day: 17, reps: 70, sets: 5, varIdx: 1, rest: false },
    { day: 18, reps: 70, sets: 5, varIdx: 3, rest: false },
    { day: 19, reps: 75, sets: 5, varIdx: 2, rest: false },
    { day: 20, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Arm swings, yoga cat-cow, pectoral massage.' },
    { day: 21, reps: 80, sets: 6, varIdx: 6, rest: false },

    // Week 4 (Peak Calisthenics)
    { day: 22, reps: 80, sets: 6, varIdx: 0, rest: false },
    { day: 23, reps: 85, sets: 6, varIdx: 4, rest: false },
    { day: 24, reps: 90, sets: 6, varIdx: 1, rest: false },
    { day: 25, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Full upper body flush, light walk, restorative sleep.' },
    { day: 26, reps: 90, sets: 6, varIdx: 5, rest: false },
    { day: 27, reps: 95, sets: 6, varIdx: 3, rest: false },
    { day: 28, reps: 95, sets: 6, varIdx: 2, rest: false },
    { day: 29, reps: 80, sets: 4, varIdx: 0, rest: false, note: 'Taper Day: Smooth rhythmic cadence to prep for the final century test.' },
    { day: 30, reps: 100, sets: 5, varIdx: 0, rest: false, note: 'THE GRAND FINALE: 100 Push-ups milestone! Break into clean sets or test max unbroken volume.' },
  ];

  return targets.map((t) => {
    const v = variations[t.varIdx % variations.length];
    return {
      day: t.day,
      targetReps: t.reps,
      targetSets: t.sets,
      isRestDay: t.rest,
      exerciseName: t.rest ? 'Active Rest & Recovery' : v.name,
      variation: t.rest ? 'Stretching & Recovery' : v.name,
      formCue: t.note || v.cue,
      targetDescription: t.rest
        ? 'Rest your chest and triceps. Focus on mobility, deep breathing, and hydration.'
        : `${t.reps} total reps (recommended ${t.sets} sets of ~${Math.ceil(t.reps / (t.sets || 1))} reps)`,
      completed: false,
    };
  });
}

// Helper to generate 30 days for squats
function generateSquatChallenge(): BodyweightChallengeDay[] {
  const variations = [
    { name: 'Bodyweight Air Squats', cue: 'Feet shoulder-width apart; drive knees outward over toes, sink hips below parallel.' },
    { name: 'Sumo Wide Squats', cue: 'Wider stance with toes pointed 45°; focus on adductors and glute max lock.' },
    { name: 'Pause Squats (2s Isometric)', cue: 'Hold for 2 full seconds in the bottom deep pocket; no bouncing off tendons.' },
    { name: 'Pulse Squats', cue: 'Pulse 3 inches at the bottom before standing up for deep quad burn.' },
    { name: 'Bulgarian Split Squats (L/R)', cue: 'Elevate back foot; drop vertically into lead hip flexor and quad.' },
    { name: 'Explosive Jump Squats', cue: 'Absorb landing quietly through midfoot to heel, then immediately rebound upward.' },
    { name: 'Narrow Stance Squats', cue: 'Feet closer together; targets outer sweep of vastus lateralis.' },
  ];

  const targets = [
    // Week 1 (Base Engine)
    { day: 1, reps: 30, sets: 2, varIdx: 0, rest: false },
    { day: 2, reps: 35, sets: 2, varIdx: 0, rest: false },
    { day: 3, reps: 40, sets: 3, varIdx: 1, rest: false },
    { day: 4, reps: 45, sets: 3, varIdx: 0, rest: false },
    { day: 5, reps: 50, sets: 3, varIdx: 2, rest: false },
    { day: 6, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Couch stretch for hip flexors, quad foam rolling.' },
    { day: 7, reps: 55, sets: 3, varIdx: 0, rest: false },

    // Week 2 (Hypertrophy & Endurance)
    { day: 8, reps: 60, sets: 4, varIdx: 3, rest: false },
    { day: 9, reps: 65, sets: 4, varIdx: 1, rest: false },
    { day: 10, reps: 70, sets: 4, varIdx: 0, rest: false },
    { day: 11, reps: 75, sets: 4, varIdx: 4, rest: false },
    { day: 12, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Hamstring sweep stretch, pigeon pose for tight glutes.' },
    { day: 13, reps: 80, sets: 4, varIdx: 2, rest: false },
    { day: 14, reps: 85, sets: 5, varIdx: 0, rest: false },

    // Week 3 (Leg Power)
    { day: 15, reps: 90, sets: 5, varIdx: 5, rest: false },
    { day: 16, reps: 95, sets: 5, varIdx: 1, rest: false },
    { day: 17, reps: 100, sets: 5, varIdx: 0, rest: false },
    { day: 18, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: 15-minute restorative walk, calf stretches on a curb.' },
    { day: 19, reps: 105, sets: 5, varIdx: 3, rest: false },
    { day: 20, reps: 110, sets: 5, varIdx: 2, rest: false },
    { day: 21, reps: 115, sets: 5, varIdx: 4, rest: false },

    // Week 4 (The Iron Quad Ladder)
    { day: 22, reps: 120, sets: 5, varIdx: 0, rest: false },
    { day: 23, reps: 125, sets: 5, varIdx: 1, rest: false },
    { day: 24, reps: 0, sets: 0, varIdx: 0, rest: true, note: 'Active Rest: Deep squat mobility sit (Malasana), hip openers.' },
    { day: 25, reps: 130, sets: 6, varIdx: 5, rest: false },
    { day: 26, reps: 135, sets: 6, varIdx: 3, rest: false },
    { day: 27, reps: 140, sets: 6, varIdx: 0, rest: false },
    { day: 28, reps: 140, sets: 6, varIdx: 2, rest: false },
    { day: 29, reps: 100, sets: 4, varIdx: 0, rest: false, note: 'Taper Day: Dynamic stretch & light rhythmic cadence to prime legs.' },
    { day: 30, reps: 150, sets: 6, varIdx: 0, rest: false, note: 'THE SQUAT SUMMIT: 150 Deep Bodyweight Squats! You have built unbreakable legs.' },
  ];

  return targets.map((t) => {
    const v = variations[t.varIdx % variations.length];
    return {
      day: t.day,
      targetReps: t.reps,
      targetSets: t.sets,
      isRestDay: t.rest,
      exerciseName: t.rest ? 'Active Rest & Recovery' : v.name,
      variation: t.rest ? 'Leg Mobility & Recovery' : v.name,
      formCue: t.note || v.cue,
      targetDescription: t.rest
        ? 'Rest your lower body. Stretch hip flexors and quads to accelerate muscular rebuilding.'
        : `${t.reps} total squats (recommended ${t.sets} sets of ~${Math.ceil(t.reps / (t.sets || 1))} reps)`,
      completed: false,
    };
  });
}

// Helper to generate 30 days for plank
function generatePlankChallenge(): BodyweightChallengeDay[] {
  const variations = [
    { name: 'Forearm Elbow Plank', cue: 'Lock ribcage down to pelvis; squeeze glutes and push floor away with forearms.' },
    { name: 'Side Plank (L & R)', cue: 'Stack hips, drive bottom obliques upward, raise top arm to vertical ceiling.' },
    { name: 'Plank Shoulder Taps', cue: 'Maintain zero hip rotation while tapping alternating shoulders from tall plank.' },
    { name: 'Commando (Plank-to-Pushup)', cue: 'Drop from hand plank to elbow plank smoothly without rock-wobbling pelvis.' },
    { name: 'Hollow Body Hold', cue: 'Press lumbar spine flush against ground; elevate shoulders and feet 6 inches.' },
  ];

  const targets = [
    { day: 1, seconds: 30, varIdx: 0, rest: false },
    { day: 2, seconds: 35, varIdx: 0, rest: false },
    { day: 3, seconds: 40, varIdx: 1, rest: false },
    { day: 4, seconds: 45, varIdx: 0, rest: false },
    { day: 5, seconds: 50, varIdx: 2, rest: false },
    { day: 6, seconds: 0, varIdx: 0, rest: true, note: 'Active Rest: Cobra stretch, child’s pose, spinal decompression.' },
    { day: 7, seconds: 60, varIdx: 0, rest: false },

    { day: 8, seconds: 65, varIdx: 0, rest: false },
    { day: 9, seconds: 75, varIdx: 1, rest: false },
    { day: 10, seconds: 80, varIdx: 2, rest: false },
    { day: 11, seconds: 90, varIdx: 0, rest: false },
    { day: 12, seconds: 0, varIdx: 0, rest: true, note: 'Active Rest: Cat-cow flow, deep diaphragm abdominal breathing.' },
    { day: 13, seconds: 95, varIdx: 3, rest: false },
    { day: 14, seconds: 100, varIdx: 0, rest: false },

    { day: 15, seconds: 110, varIdx: 4, rest: false },
    { day: 16, seconds: 120, varIdx: 0, rest: false }, // 2 mins!
    { day: 17, seconds: 125, varIdx: 1, rest: false },
    { day: 18, seconds: 130, varIdx: 2, rest: false },
    { day: 19, seconds: 0, varIdx: 0, rest: true, note: 'Active Rest: Thoracic twists, side body lateral stretches.' },
    { day: 20, seconds: 135, varIdx: 0, rest: false },
    { day: 21, seconds: 140, varIdx: 3, rest: false },

    { day: 22, seconds: 150, varIdx: 0, rest: false },
    { day: 23, seconds: 155, varIdx: 1, rest: false },
    { day: 24, seconds: 160, varIdx: 4, rest: false },
    { day: 25, seconds: 0, varIdx: 0, rest: true, note: 'Active Rest: Relax core, walk in nature, ensure electrolyte hydration.' },
    { day: 26, seconds: 165, varIdx: 0, rest: false },
    { day: 27, seconds: 170, varIdx: 2, rest: false },
    { day: 28, seconds: 175, varIdx: 0, rest: false },
    { day: 29, seconds: 120, varIdx: 0, rest: false, note: 'Taper Hold: 2 mins easy unbroken plank to prepare your mindset.' },
    { day: 30, seconds: 180, varIdx: 0, rest: false, note: 'IRON CORE APEX: 3 Full Minutes (180s) of Unbroken Plank! Elite core endurance.' },
  ];

  return targets.map((t) => {
    const v = variations[t.varIdx % variations.length];
    return {
      day: t.day,
      targetReps: t.seconds,
      targetSets: 1,
      isRestDay: t.rest,
      exerciseName: t.rest ? 'Active Rest & Recovery' : v.name,
      variation: t.rest ? 'Core Mobility & Recovery' : v.name,
      formCue: t.note || v.cue,
      targetDescription: t.rest
        ? 'Rest your abdominals and lower back. Maintain good posture throughout the day.'
        : `${t.seconds} seconds total isometric hold (can be unbroken or 2 chunks)`,
      completed: false,
    };
  });
}

// Helper to generate 30 days for Full Body Calisthenics Beast
function generateFullBodyCalisthenicsChallenge(): BodyweightChallengeDay[] {
  const milestones = [
    // 30 days of progressive bodyweight circuit
    { day: 1, pushups: 15, squats: 25, plankSec: 30, rest: false },
    { day: 2, pushups: 18, squats: 30, plankSec: 35, rest: false },
    { day: 3, pushups: 20, squats: 35, plankSec: 40, rest: false },
    { day: 4, pushups: 22, squats: 40, plankSec: 45, rest: false },
    { day: 5, pushups: 0, squats: 0, plankSec: 0, rest: true, note: 'Active Recovery: 20-min mobility walk & joint rotations.' },
    { day: 6, pushups: 25, squats: 45, plankSec: 50, rest: false },
    { day: 7, pushups: 30, squats: 50, plankSec: 60, rest: false },

    { day: 8, pushups: 32, squats: 55, plankSec: 60, rest: false },
    { day: 9, pushups: 35, squats: 60, plankSec: 65, rest: false },
    { day: 10, pushups: 38, squats: 65, plankSec: 70, rest: false },
    { day: 11, pushups: 0, squats: 0, plankSec: 0, rest: true, note: 'Active Recovery: Foam rolling & full body dynamic yoga flow.' },
    { day: 12, pushups: 40, squats: 70, plankSec: 75, rest: false },
    { day: 13, pushups: 42, squats: 75, plankSec: 80, rest: false },
    { day: 14, pushups: 45, squats: 80, plankSec: 90, rest: false },

    { day: 15, pushups: 0, squats: 0, plankSec: 0, rest: true, note: 'Midway Checkpoint: Hydrate, stretch, celebrate 2 weeks of grit!' },
    { day: 16, pushups: 50, squats: 85, plankSec: 90, rest: false },
    { day: 17, pushups: 52, squats: 90, plankSec: 95, rest: false },
    { day: 18, pushups: 55, squats: 95, plankSec: 100, rest: false },
    { day: 19, pushups: 58, squats: 100, plankSec: 105, rest: false },
    { day: 20, pushups: 0, squats: 0, plankSec: 0, rest: true, note: 'Active Recovery: Light swimming or outdoor walk & hip opening.' },
    { day: 21, pushups: 60, squats: 105, plankSec: 110, rest: false },

    { day: 22, pushups: 65, squats: 110, plankSec: 115, rest: false },
    { day: 23, pushups: 68, squats: 115, plankSec: 120, rest: false },
    { day: 24, pushups: 70, squats: 120, plankSec: 120, rest: false },
    { day: 25, pushups: 0, squats: 0, plankSec: 0, rest: true, note: 'Active Recovery: Deep sleep and nervous system reset.' },
    { day: 26, pushups: 75, squats: 125, plankSec: 130, rest: false },
    { day: 27, pushups: 80, squats: 130, plankSec: 140, rest: false },
    { day: 28, pushups: 85, squats: 135, plankSec: 150, rest: false },
    { day: 29, pushups: 50, squats: 80, plankSec: 90, rest: false, note: 'Taper Circuit: Light smooth repetitions before final test.' },
    { day: 30, pushups: 100, squats: 150, plankSec: 180, rest: false, note: 'CHALLENGE FINALE: The 100 Pushups + 150 Squats + 3-Min Plank Triad!' },
  ];

  return milestones.map((m) => {
    const totalReps = m.pushups + m.squats;
    return {
      day: m.day,
      targetReps: totalReps,
      targetSets: 4,
      isRestDay: m.rest,
      exerciseName: m.rest ? 'Active Recovery Day' : 'Push-ups + Squats + Plank Circuit',
      variation: m.rest ? 'Restorative Recovery' : `${m.pushups} Push-ups • ${m.squats} Squats • ${m.plankSec}s Plank`,
      formCue: m.note || `Perform as 3-4 rounds: ${Math.ceil(m.pushups / 3)} pushups, ${Math.ceil(m.squats / 3)} squats, and ${Math.ceil(m.plankSec / 3)}s plank per round.`,
      targetDescription: m.rest
        ? 'Rest your full body muscles and recharge tendons.'
        : `${m.pushups} Push-ups + ${m.squats} Squats + ${m.plankSec}s Plank Hold`,
      completed: false,
    };
  });
}

// Preset tracks
export const PRESET_BODYWEIGHT_CHALLENGES: BodyweightChallengeTrack[] = [
  {
    id: 'pushups-30',
    title: '30-Day Push-Up Mastery',
    titleHi: '30-दिन पुश-अप मास्टरी चैलेंज',
    subtitle: 'From 15 reps to 100 daily volume with multiple grip variations',
    subtitleHi: '15 रेप्स से 100 दैनिक पुश-अप्स और मजबूत छाती-ट्राईसेप्स',
    exercise: 'Push-Ups',
    category: 'Chest & Arms',
    unit: 'reps',
    difficulty: 'Intermediate',
    description: 'A scientifically structured progressive overload challenge targeting pectoral thickness, tricep power, and shoulder stability over 30 days.',
    days: generatePushupChallenge(),
  },
  {
    id: 'squats-30',
    title: '30-Day Bodyweight Squat Quest',
    titleHi: '30-दिन बॉडीवेट स्क्वाट क्वेस्ट',
    subtitle: 'Build unbreakable quads, glutes and leg endurance from 30 to 150 reps',
    subtitleHi: 'मजबूत पैर और जांघों के लिए 30 से 150 स्क्वाट्स की यात्रा',
    exercise: 'Bodyweight Squats',
    category: 'Legs & Glutes',
    unit: 'reps',
    difficulty: 'Beginner',
    description: 'Transform your lower body strength and muscular endurance without needing a barbell, using tempo, pauses, and high-volume air squats.',
    days: generateSquatChallenge(),
  },
  {
    id: 'plank-30',
    title: '30-Day Iron Core Plank Challenge',
    titleHi: '30-दिन आयरन कोर प्लैंक चैलेंज',
    subtitle: 'Advance from a 30-second plank to an elite 3-minute unbroken hold',
    subtitleHi: '30 सेकंड से 3 मिनट तक अटूट कोर व एब्स स्टेमिना',
    exercise: 'Plank Holds',
    category: 'Core & Abs',
    unit: 'seconds',
    difficulty: 'Intermediate',
    description: 'Strengthen transverse abdominis, rectus abdominis, obliques, and spinal erectors with daily timed holds and anti-rotation drills.',
    days: generatePlankChallenge(),
  },
  {
    id: 'fullbody-calisthenics-30',
    title: '30-Day Calisthenics Beast Triad',
    titleHi: '30-दिन फुल-बॉडी कैलिस्थेनिक्स बीस्ट',
    subtitle: 'The ultimate bodyweight triad: Push-ups + Squats + Core Planks daily',
    subtitleHi: 'पुश-अप्स + स्क्वाट्स + प्लैंक का संपूर्ण 30-दिवसीय कॉम्बो',
    exercise: 'Full Body Triad',
    category: 'Full Body',
    unit: 'reps',
    difficulty: 'Advanced',
    description: 'Combines upper body pressing, lower body knee flexion, and isometric core stabilization into a progressive 30-day daily ritual.',
    days: generateFullBodyCalisthenicsChallenge(),
  },
];
