import { WorkoutPlan } from '../types';

export interface DynamicStretch {
  id: string;
  name: string;
  nameHi?: string;
  category: 'Upper Body' | 'Lower Body' | 'Spine & Core' | 'Full Body & Cardio' | 'Hips & Glutes';
  targetJoints: string[];
  targetMuscles: string[];
  durationSeconds: number;
  cadence: string;
  cadenceHi?: string;
  description: string;
  descriptionHi?: string;
  formCues: string[];
  whyItMatters: string;
  whyItMattersHi?: string;
  intensity: 'Gentle' | 'Moderate' | 'Dynamic';
}

export interface WarmUpRoutine {
  id: string;
  title: string;
  titleHi?: string;
  subtitle: string;
  subtitleHi?: string;
  targetFocus: string;
  totalDurationSeconds: number; // 300 (5 minutes)
  matchedWorkoutTitle?: string;
  rationale: string;
  rationaleHi?: string;
  stretches: DynamicStretch[];
}

// Master pool of dynamic stretches backed by exercise physiology
export const MASTER_DYNAMIC_STRETCHES: Record<string, DynamicStretch> = {
  // --- Upper Body / Push / Shoulders ---
  armCirclesChestOpeners: {
    id: 'arm-circles-chest-openers',
    name: 'Dynamic Arm Circles & Hug Openers',
    nameHi: 'डायनेमिक आर्म सर्कल्स और चेस्ट ओपनर्स',
    category: 'Upper Body',
    targetJoints: ['Glenohumeral (Shoulders)', 'Scapula', 'Sternoclavicular'],
    targetMuscles: ['Pectoralis Major/Minor', 'Anterior/Posterior Deltoids', 'Rhomboids'],
    durationSeconds: 50,
    cadence: '15s small circles, 15s large circles, 20s hug-and-open',
    cadenceHi: '15s छोटे चक्कर, 15s बड़े चक्कर, 20s चेस्ट हग-ओपन',
    description: 'Progress from small circular rotations to wide sweeping arm circles, then alternate cross-body hugs to open up the chest cavity.',
    descriptionHi: 'हाथों को धीरे-धीरे घुमाते हुए कंधों और सीने की मांसपेशियों में रक्त प्रवाह बढ़ाएं।',
    formCues: [
      'Keep your ribs locked down; do not hyperextend lumbar spine.',
      'Alternate which arm crosses on top during the hug phase.',
      'Maintain continuous rhythmic breathing without holding your breath.',
    ],
    whyItMatters: 'Stimulates synovial fluid secretion in the shoulder capsule and warms up rotator cuff tendons before heavy pressing.',
    whyItMattersHi: 'कंधों के जोड़ में साइनोवियल फ्लूइड सक्रिय करता है और हैवी प्रेस से पहले इंजरी रोकता है।',
    intensity: 'Gentle',
  },

  scapularPushupsPlank: {
    id: 'scapular-pushups-plank',
    name: 'Scapular Protraction & Retraction Wall/Floor Slides',
    nameHi: 'स्कैपुलर प्रोट्रैक्शन व वॉल/फ्लोर एक्टिवेशन',
    category: 'Upper Body',
    targetJoints: ['Scapulothoracic Joint', 'Thoracic Spine'],
    targetMuscles: ['Serratus Anterior', 'Lower Trapezius', 'Rotator Cuff'],
    durationSeconds: 50,
    cadence: '10-12 smooth controlled slides or floor protractions',
    cadenceHi: '10-12 नियंत्रित स्कैपुलर ग्लाइड्स',
    description: 'In a tall plank or wall position with straight elbows, squeeze shoulder blades together, then actively push the floor away to spread shoulder blades.',
    descriptionHi: 'कोहनी सीधी रखकर कंधों की हड्डियों को पीछे मिलाएं और फिर आगे की ओर धकेलें।',
    formCues: [
      'Elbows remain locked straight; all movement comes strictly from shoulder blades.',
      'Hold the pushed-away (protracted) position for 1 second at the top.',
      'Keep your core tightly braced in a hollow body position.',
    ],
    whyItMatters: 'Fires up the serratus anterior and lower traps, preventing shoulder impingement during overhead presses and benching.',
    whyItMattersHi: 'ओवरहेड और चेस्ट वर्कआउट के दौरान कंधे पर पड़ने वाले अनुचित दबाव को रोकता है।',
    intensity: 'Moderate',
  },

  wristAndForearmRolls: {
    id: 'wrist-forearm-prep',
    name: 'Multi-Angle Wrist Waves & Quadruped Palm Rocks',
    nameHi: 'कलाई और अग्रभुजा (फोरआर्म) मोबिलिटी रॉक्स',
    category: 'Upper Body',
    targetJoints: ['Radiocarpal Joint (Wrist)', 'Metacarpophalangeal'],
    targetMuscles: ['Forearm Flexors & Extensors', 'Brachioradialis'],
    durationSeconds: 50,
    cadence: '25s wrist waves & circles, 25s quadruped gentle palm rocks',
    cadenceHi: '25s कलाई रोटेशन, 25s हथेलियों पर जेंटल रॉक',
    description: 'Roll wrists fluidly, then place palms on floor (fingers pointing forward, sideways, and backward) gently rocking weight over palms.',
    descriptionHi: 'हाथों की कलाई को गोलाकार घुमाएं और फिर फर्श पर रखकर आगे-पीछे हल्का दबाव दें।',
    formCues: [
      'Apply only 30-40% bodyweight pressure; never force a painful angle.',
      'Spread fingers wide to distribute ground reaction forces.',
      'Perform figure-8 waves smoothly in both directions.',
    ],
    whyItMatters: 'Conditions wrist tendons and carpal joints for heavy barbell loads, dumbbells, push-ups, and front squats.',
    whyItMattersHi: 'बारबेल और डम्बल पकड़ने से पहले कलाई के टेंडन्स को मजबूत और लचीला बनाता है।',
    intensity: 'Gentle',
  },

  // --- Spine, Back & Pull ---
  thoracicCatCowDownDog: {
    id: 'cat-cow-downdog-flow',
    name: 'Cat-Cow Flow into Downward Dog Calf Pedals',
    nameHi: 'कैट-काउ स्पाइनल फ्लो व डाउनवर्ड डॉग पेडल',
    category: 'Spine & Core',
    targetJoints: ['Entire Spinal Column (Cervical to Lumbar)', 'Ankles', 'Shoulders'],
    targetMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Gastrocnemius & Soleus', 'Hamstrings'],
    durationSeconds: 50,
    cadence: '5 slow cat-cows + 25s alternating heel pedals in downward dog',
    cadenceHi: '5 धीमी कैट-काउ + 25s डाउनवर्ड डॉग हील पेडल',
    description: 'Arch and round spine with synchronized breathing on all fours, then tuck toes and press hips high into downward dog, pedaling heels.',
    descriptionHi: 'रीढ़ की हड्डी को लचीला बनाते हुए कैट-काउ करें और फिर कूल्हों को ऊपर उठाकर पिंडलियों को स्ट्रेच करें।',
    formCues: [
      'Inhale as belly drops and chest pulls through; exhale as you tuck chin and round spine.',
      'In down dog, press firmly through palms and lengthen the spine toward the ceiling.',
      'Allow knees to bend slightly if hamstrings feel tight.',
    ],
    whyItMatters: 'Decompresses the vertebral discs, engages spinal extensors, and opens the posterior kinetic chain.',
    whyItMattersHi: 'रीढ़ की हड्डी के तनाव को दूर करता है और पीठ तथा हैमस्ट्रिंग को फ्री करता है।',
    intensity: 'Moderate',
  },

  bandOrTowelOverheadPullThroughs: {
    id: 'overhead-pass-throughs',
    name: 'Dynamic Overhead Shoulder Dislocates & Torso Sweeps',
    nameHi: 'डायनेमिक ओवरहेड शोल्डर पास-थ्रू व स्वीप्स',
    category: 'Upper Body',
    targetJoints: ['Shoulders', 'Thoracic Spine', 'Ribcage'],
    targetMuscles: ['Pectoralis Major', 'Latissimus Dorsi', 'Subscapularis', 'Infraspinatus'],
    durationSeconds: 50,
    cadence: '10 smooth passes front-to-back, 10s lateral side-body reach each side',
    cadenceHi: '10 फ्रंट-टू-बैक पास, 10s साइड बॉडी रीच दोनों तरफ',
    description: 'Hold an imaginary band, towel, or PVC pipe with a wide grip and rotate arms up, overhead, and behind the back without bending elbows.',
    descriptionHi: 'हाथों को चौड़ा फैलाकर ऊपर और पीछे की ओर सहजता से घुमाते हुए सीने और कंधों को खोलें।',
    formCues: [
      'Start with a wider grip if shoulders are tight; gradually narrow grip as mobility increases.',
      'Keep glutes tight and core braced so your lower back does not arch excessively.',
      'Move slowly with continuous muscular control through the sticky sticking point.',
    ],
    whyItMatters: 'Maximizes active internal/external shoulder range of motion required for overhead work, pull-ups, and back squats.',
    whyItMattersHi: 'कंधे की 360-डिग्री मोबिलिटी बढ़ाता है ताकि पुल-अप्स और बैक स्क्वाट्स सुरक्षित रहें।',
    intensity: 'Moderate',
  },

  birdDogDynamicReach: {
    id: 'bird-dog-dynamic-reach',
    name: 'Alternating Bird-Dog Core & Posterior Activation',
    nameHi: 'अल्टरनेटिंग बर्ड-डॉग बैक व कोर एक्टिवेशन',
    category: 'Spine & Core',
    targetJoints: ['Hips', 'Shoulders', 'SI Joints'],
    targetMuscles: ['Gluteus Maximus', 'Erector Spinae', 'Multifidus', 'Transverse Abdominis'],
    durationSeconds: 50,
    cadence: '8-10 slow alternating reps with 2s squeeze at top',
    cadenceHi: '8-10 धीमी पुनरावृत्तियां, ऊपर 2 सेकंड होल्ड',
    description: 'From tabletop, extend opposite arm and leg simultaneously until parallel with floor; squeeze glute and lat, then return under control.',
    descriptionHi: 'विपरीत हाथ और पैर को सीधा फैलाएं, हिप्स को स्थिर रखें और कोर को टाइट रखें।',
    formCues: [
      'Imagine balancing a full cup of water on your lower back; zero hip tilting.',
      'Reach long through fingertips and heel rather than kicking high.',
      'Draw navel toward spine to engage deep abdominal stabilizers.',
    ],
    whyItMatters: 'Activates contralateral kinetic chains (glute + opposite lat), stabilizing the spine against shear forces before heavy lifting.',
    whyItMattersHi: 'पीठ के निचले हिस्से को सहारा देने वाली गहरी मांसपेशियों को सक्रिय करता है।',
    intensity: 'Moderate',
  },

  // --- Lower Body / Legs / Squat / Hips ---
  worldsGreatestStretch: {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Dynamic Lunge with Thoracic Reach",
    nameHi: "वर्ल्ड्स ग्रेटेस्ट स्ट्रेच (लंजेस + थोरेसिक रोटेशन)",
    category: 'Full Body & Cardio',
    targetJoints: ['Hips (Flexion/Extension)', 'Thoracic Spine', 'Ankles'],
    targetMuscles: ['Iliopsoas (Hip Flexors)', 'Glutes', 'Adductors', 'Hamstrings', 'Mid-Back'],
    durationSeconds: 50,
    cadence: '25s left side (3-4 lunging rotations), 25s right side',
    cadenceHi: '25s बायां पैर (3-4 रोटेशन), 25s दायां पैर',
    description: 'Step into a deep runner’s lunge, drop inside elbow toward the instep, then rotate and extend your arm toward the ceiling, looking up.',
    descriptionHi: 'एक गहरा लंज लें, कोहनी को टखने की तरफ लाएं और फिर हाथ को छत की तरफ घुमाकर सीना खोलें।',
    formCues: [
      'Squeeze the trailing glute to open the front of that hip flexor.',
      'Drive leading knee slightly outward over pinky toe.',
      'Follow your moving hand with your eyes to ensure genuine thoracic rotation.',
    ],
    whyItMatters: 'Universally praised as the gold standard compound stretch, unlocking hip mobility, adductor length, and thoracic extension in one dynamic drill.',
    whyItMattersHi: 'एक ही मूवमेंट में हिप फ्लेक्सर्स, जांघों और ऊपरी रीढ़ को पूरी तरह खोल देता है।',
    intensity: 'Dynamic',
  },

  dynamicLegSwingsFrontLateral: {
    id: 'dynamic-leg-swings',
    name: 'Dynamic Pendulum Leg Swings (Forward/Back & Lateral)',
    nameHi: 'डायनेमिक लेग स्विंग्स (आगे-पीछे व साइड-टू-साइड)',
    category: 'Lower Body',
    targetJoints: ['Acetabulofemoral (Hip Ball & Socket)', 'Pelvis'],
    targetMuscles: ['Hamstrings', 'Hip Flexors', 'Adductors', 'Gluteus Medius'],
    durationSeconds: 50,
    cadence: '12s forward/back (Left), 12s forward/back (Right), 13s lateral (L), 13s lateral (R)',
    cadenceHi: '12s आगे-पीछे (बायां), 12s आगे-पीछे (दायां), 13s साइड (बायां), 13s साइड (दायां)',
    description: 'Support against a wall or post; swing one leg forward into hamstring stretch and back into hip flexor opening, then across the body side-to-side.',
    descriptionHi: 'दीवार का सहारा लेकर पैर को आगे-पीछे और फिर दोनों तरफ एक पेंडुलम की तरह झुलाएं।',
    formCues: [
      'Maintain an upright torso; do not swing by arching and collapsing lower back.',
      'Start with a conservative arc and gradually increase amplitude as tissue warms.',
      'Support leg stays lightly bent with foot grounded securely.',
    ],
    whyItMatters: 'Uses dynamic inertia to lengthen hamstrings and adductors dynamically without inhibiting neural muscle power.',
    whyItMattersHi: 'हैमस्ट्रिंग और हिप्स के जोड़ को खोलता है ताकि भारी स्क्वाट्स और स्प्रिंट्स में खिंचाव न आए।',
    intensity: 'Dynamic',
  },

  deepCossackSquatsSideShift: {
    id: 'cossack-lateral-shifts',
    name: 'Deep Cossack Squats & Lateral Groin Shifts',
    nameHi: 'डीप कोस्सैक स्क्वाट्स व साइड हिप शिफ्ट्स',
    category: 'Hips & Glutes',
    targetJoints: ['Hips', 'Knees', 'Ankles (Talocrural)'],
    targetMuscles: ['Adductor Magnus', 'Gluteus Medius', 'Quadriceps', 'Soleus'],
    durationSeconds: 50,
    cadence: '8-10 slow alternating lateral lunges with active ankle dorsiflexion',
    cadenceHi: '8-10 धीमे साइड लंज, एड़ी को जमीन पर रखते हुए',
    description: 'Take a very wide sumo stance; shift hips deep to one side while keeping that heel glued to the floor, straightening other leg with toe pointed up.',
    descriptionHi: 'पैरों को चौड़ा फैलाएं, एक तरफ गहरा बैठें और दूसरी टांग सीधी रखकर भीतरी जांघ को स्ट्रेच करें।',
    formCues: [
      'Keep the working foot’s heel flat on the floor; push knees out.',
      'Sink hips backwards as if sitting into a tiny chair.',
      'Use hands in front for counterbalance or floor support if needed.',
    ],
    whyItMatters: 'Primes deep squat depth, mobilizes tight groin adductors, and increases ankle dorsiflexion angle for Olympic squats.',
    whyItMattersHi: 'गहरे स्क्वाट लगाने के लिए टखनों और जांघ के भीतरी हिस्से का लचीलापन तुरंत बढ़ाता है।',
    intensity: 'Moderate',
  },

  gluteBridgeDynamicReach: {
    id: 'glute-bridge-diagonal-reach',
    name: 'Glute Bridge with Diagonal Overhead Reach',
    nameHi: 'ग्लूट ब्रिज व डायगोनल ओवरहेड रीच',
    category: 'Hips & Glutes',
    targetJoints: ['Hips (Extension)', 'Thoracic Spine'],
    targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Thoracic Extensors', 'Core'],
    durationSeconds: 50,
    cadence: '10 alternating bridge reaches, holding peak 1.5 seconds',
    cadenceHi: '10 ब्रिज रीच, ऊपर 1.5 सेकंड ग्लूट्स स्क्वीज करें',
    description: 'Lie on back with knees bent; drive hips up through heels into a glute bridge, simultaneously reaching one arm diagonally over opposite shoulder.',
    descriptionHi: 'पीठ के बल लेटें, कूल्हों को ऊपर उठाएं और एक हाथ को विपरीत कंधे के ऊपर घुमाकर स्ट्रेच करें।',
    formCues: [
      'Drive through heels and squeeze glutes hard at top lockout.',
      'Do not overarch the lower back; pivot on shoulder blade blades.',
      'Alternate reaching left arm over right shoulder and vice versa.',
    ],
    whyItMatters: 'Wakes up dormant glutes ("glute amnesia") and bridges lower and upper body kinetic integration.',
    whyItMattersHi: 'सोए हुए ग्लूट्स (हिप मसल्स) को जगाता है ताकि भारी वजन पीठ पर न आए।',
    intensity: 'Moderate',
  },

  inchwormToSpiderman: {
    id: 'inchworm-spiderman-walkout',
    name: 'Hand Walkout Inchworms to High Plank Hold',
    nameHi: 'इंचवॉर्म वॉकआउट व हाई प्लैंक एक्टिवेशन',
    category: 'Full Body & Cardio',
    targetJoints: ['Ankles', 'Hips', 'Wrists', 'Shoulders'],
    targetMuscles: ['Hamstrings', 'Core/Abs', 'Anterior Deltoids', 'Pectorals'],
    durationSeconds: 50,
    cadence: '5-6 full walkouts from standing to plank and back',
    cadenceHi: '5-6 बार खड़े होकर हाथों से आगे चलकर प्लैंक में जाएं',
    description: 'From standing, hinge at hips with soft knees, walk hands forward into high plank, pause for 1 second, then walk hands back to standing.',
    descriptionHi: 'खड़े होकर झुकें, हाथों के बल आगे चलकर प्लैंक बनाएं और फिर हाथों को वापस पैरों की ओर चलाएं।',
    formCues: [
      'Keep legs as straight as comfortably possible on the walkout to dynamically load hamstrings.',
      'Pause in a rock-solid plank with glutes squeezed tight.',
      'Stand all the way up and squeeze glutes between each repetition.',
    ],
    whyItMatters: 'Seamlessly blends posterior chain dynamic stretching with core activation and shoulder weight-bearing tolerance.',
    whyItMattersHi: 'पूरे शरीर को एक साथ एक्टिवेट करता है और हैमस्ट्रिंग को चोट से बचाता है।',
    intensity: 'Dynamic',
  },

  // --- Cardio & Full Body Activation ---
  lightJumpingJacksAnklePogo: {
    id: 'cardio-pogo-hops-jacks',
    name: 'Rhythmic Ankle Pogo Bounces & Light Jumping Jacks',
    nameHi: 'हल्के जंपिंग जैक्स व एंकल पोगो बाउंस',
    category: 'Full Body & Cardio',
    targetJoints: ['Ankles (Achilles Tendon)', 'Knees', 'Shoulders'],
    targetMuscles: ['Calves (Gastrocnemius/Soleus)', 'Cardiovascular System', 'Full Body'],
    durationSeconds: 50,
    cadence: '25s small elastic pogo hops on balls of feet, 25s rhythmic jumping jacks',
    cadenceHi: '25s पंजों पर हल्का बाउंस, 25s लयबद्ध जंपिंग जैक्स',
    description: 'Bounce lightly on balls of feet with stiff ankles to prime the Achilles tendon, then smoothly transition into rhythmic jumping jacks.',
    descriptionHi: 'पैरों के पंजों पर हल्का-फुल्का उछलें और फिर जंपिंग जैक्स करके हार्ट रेट को बढ़ाएं।',
    formCues: [
      'Land softly on the balls of your feet; knees remain springy and unlocked.',
      'Arms sweep wide in a full relaxed circle overhead.',
      'Breathe naturally in sync with your bounce cadence.',
    ],
    whyItMatters: 'Elevates core body temperature by 1-2 degrees, increases motor unit recruitment, and primes elastic tendon stiffness.',
    whyItMattersHi: 'शरीर का तापमान बढ़ाता है और दिल की धड़कन को वर्कआउट के लिए तैयार करता है।',
    intensity: 'Dynamic',
  },

  torsoRotationsHipSwivels: {
    id: 'standing-torso-hip-swivels',
    name: 'Standing Torso Rotations with Hip Openers (Gate Drills)',
    nameHi: 'स्टैंडिंग टॉर्सो ट्विस्ट व हिप गेट ओपनर्स',
    category: 'Spine & Core',
    targetJoints: ['Thoracic Spine', 'Pelvis', 'Hip Joint'],
    targetMuscles: ['Internal & External Obliques', 'Hip Rotators', 'Tensor Fasciae Latae'],
    durationSeconds: 50,
    cadence: '25s torso twists with heel pivot, 25s knee-up-and-out hip gate openers',
    cadenceHi: '25s एड़ी घुमाते हुए कमर का मोड़, 25s घुटने को ऊपर उठाकर बाहर खोलना',
    description: 'Rotate torso smoothly side-to-side allowing back heel to pivot naturally, then lift knee to 90 degrees and open outward in a circular gate motion.',
    descriptionHi: 'कमर को दोनों ओर ट्विस्ट करें और घुटने को ऊपर उठाकर बाहर की ओर घुमाते हुए हिप्स को खोलें।',
    formCues: [
      'Always pivot the trailing heel when twisting to protect the lumbar spine and knees.',
      'Maintain an upright spine during the hip gate circles.',
      'Control the hip circle without leaning your upper body to the opposite side.',
    ],
    whyItMatters: 'Lubricates spinal facet joints and unlocks internal/external hip rotators.',
    whyItMattersHi: 'कमर के जोड़ों को ढीला करता है और हिप्स के रोटेशन को आसान बनाता है।',
    intensity: 'Gentle',
  },

  squatToOverheadReach: {
    id: 'air-squat-overhead-reach',
    name: 'Bodyweight Air Squats with Sky Reach & Heel Rise',
    nameHi: 'बॉडीवेट स्क्वाट व स्काई रीच',
    category: 'Lower Body',
    targetJoints: ['Hips', 'Knees', 'Ankles', 'Shoulders'],
    targetMuscles: ['Quadriceps', 'Gluteals', 'Lats', 'Calves'],
    durationSeconds: 50,
    cadence: '10 smooth tempo squats (2s down, 1s up with tall reach)',
    cadenceHi: '10 सहज स्क्वाट्स, ऊपर उठते समय हाथों को ऊपर खींचें',
    description: 'Perform a comfortable bodyweight squat, sink hips between heels, then stand tall while sweeping both arms overhead and rising onto toes.',
    descriptionHi: 'सामान्य स्क्वाट लगाएं और ऊपर आते समय हाथों को आसमान की तरफ खींचकर पंजों पर आएं।',
    formCues: [
      'Knees track over the second and third toes.',
      'Keep chest tall and upright throughout the descent.',
      'Reach high with fingers as you stand, fully opening hip flexors.',
    ],
    whyItMatters: 'Rehearses foundational lower body squat mechanics under zero external fatigue while reinforcing extension.',
    whyItMattersHi: 'स्क्वाट के बुनियादी फॉर्म की प्रैक्टिस कराता है और पूरे शरीर को स्ट्रेच करता है।',
    intensity: 'Dynamic',
  },
};

// Generator logic to create a specialized 5-minute dynamic warm-up
export function generateWarmUpRoutine(
  plan?: WorkoutPlan | null,
  presetFocus?: string
): WarmUpRoutine {
  const planTitle = plan?.title || '';
  const planSplit = plan?.splitType || presetFocus || 'Full Body';
  const planDescription = plan?.description || '';
  const planTags = (plan?.tags || []).join(' ').toLowerCase();

  // Look at target muscles of exercises in the plan
  const targetMusclesInPlan = new Set<string>();
  if (plan && plan.exercises) {
    plan.exercises.forEach((ex) => {
      if (ex.targetMuscle) {
        targetMusclesInPlan.add(ex.targetMuscle.toLowerCase());
      }
      targetMusclesInPlan.add(ex.name.toLowerCase());
    });
  }

  const isChestOrPush =
    planSplit.toLowerCase().includes('push') ||
    planSplit.toLowerCase().includes('chest') ||
    planTitle.toLowerCase().includes('chest') ||
    planTitle.toLowerCase().includes('push') ||
    presetFocus === 'Push / Chest & Shoulders' ||
    targetMusclesInPlan.has('chest') ||
    targetMusclesInPlan.has('pectoral') ||
    targetMusclesInPlan.has('triceps');

  const isBackOrPull =
    planSplit.toLowerCase().includes('pull') ||
    planSplit.toLowerCase().includes('back') ||
    planTitle.toLowerCase().includes('back') ||
    planTitle.toLowerCase().includes('pull') ||
    presetFocus === 'Pull / Back & Biceps' ||
    targetMusclesInPlan.has('back') ||
    targetMusclesInPlan.has('lats') ||
    targetMusclesInPlan.has('biceps');

  const isLegsOrLower =
    planSplit.toLowerCase().includes('leg') ||
    planSplit.toLowerCase().includes('lower') ||
    planSplit.toLowerCase().includes('squat') ||
    planTitle.toLowerCase().includes('leg') ||
    planTitle.toLowerCase().includes('lower') ||
    presetFocus === 'Legs & Lower Body' ||
    targetMusclesInPlan.has('quads') ||
    targetMusclesInPlan.has('glutes') ||
    targetMusclesInPlan.has('hamstrings') ||
    targetMusclesInPlan.has('calves');

  const isCoreOrYoga =
    planSplit.toLowerCase().includes('core') ||
    planSplit.toLowerCase().includes('abs') ||
    planSplit.toLowerCase().includes('yoga') ||
    presetFocus === 'Core, Yoga & Calisthenics' ||
    planTags.includes('yoga') ||
    planTags.includes('core');

  const isCardioOrHIIT =
    planSplit.toLowerCase().includes('cardio') ||
    planSplit.toLowerCase().includes('hiit') ||
    planSplit.toLowerCase().includes('running') ||
    presetFocus === 'Cardio, HIIT & Endurance' ||
    planTags.includes('cardio') ||
    planTags.includes('hiit');

  // Select 6 custom dynamic stretches (6 x 50s = 300s = exactly 5 minutes)
  let chosenStretches: DynamicStretch[] = [];
  let rationale = '';
  let rationaleHi = '';
  let focusTitle = '';
  let focusTitleHi = '';

  if (isChestOrPush) {
    focusTitle = 'Push & Upper Body Pressing Warm-Up';
    focusTitleHi = 'पुश व अपर-बॉडी चेस्ट-शोल्डर वॉर्म-अप';
    rationale = `Tailored for ${planTitle || 'Push Workouts'}: Prioritizes anterior shoulder mobilization, scapular upward glide, and wrist tendon priming to maximize pressing power and prevent joint impingement.`;
    rationaleHi = `${planTitle || 'पुश वर्कआउट्स'} के लिए विशेष: कंधों के जोड़ को ढीला करता है, कलाई को तैयार करता है और भारी वजन से पहले चेस्ट को सक्रिय करता है।`;
    chosenStretches = [
      MASTER_DYNAMIC_STRETCHES.lightJumpingJacksAnklePogo,
      MASTER_DYNAMIC_STRETCHES.armCirclesChestOpeners,
      MASTER_DYNAMIC_STRETCHES.scapularPushupsPlank,
      MASTER_DYNAMIC_STRETCHES.bandOrTowelOverheadPullThroughs,
      MASTER_DYNAMIC_STRETCHES.wristAndForearmRolls,
      MASTER_DYNAMIC_STRETCHES.inchwormToSpiderman,
    ];
  } else if (isBackOrPull) {
    focusTitle = 'Pull & Posterior Chain Warm-Up';
    focusTitleHi = 'पुल व बैक-बाइसेप्स पोस्टीरियर वॉर्म-अप';
    rationale = `Tailored for ${planTitle || 'Pull Workouts'}: Focuses on thoracic extension, latissimus elongation, scapular depression, and contralateral spinal stability for rows, deadlifts, and pull-ups.`;
    rationaleHi = `${planTitle || 'पुल वर्कआउट्स'} के लिए विशेष: रीढ़ की हड्डी, लैट्स और कंधों को खोलता है ताकि भारी रोइंग और डेडलिफ्ट सुरक्षित रहे।`;
    chosenStretches = [
      MASTER_DYNAMIC_STRETCHES.lightJumpingJacksAnklePogo,
      MASTER_DYNAMIC_STRETCHES.thoracicCatCowDownDog,
      MASTER_DYNAMIC_STRETCHES.birdDogDynamicReach,
      MASTER_DYNAMIC_STRETCHES.bandOrTowelOverheadPullThroughs,
      MASTER_DYNAMIC_STRETCHES.worldsGreatestStretch,
      MASTER_DYNAMIC_STRETCHES.inchwormToSpiderman,
    ];
  } else if (isLegsOrLower) {
    focusTitle = 'Lower Body Squat & Hip Mechanics Warm-Up';
    focusTitleHi = 'लोअर बॉडी स्क्वाट व हिप मोबिलिटी वॉर्म-अप';
    rationale = `Tailored for ${planTitle || 'Leg Workouts'}: Unlocks hip capsule depth, adductor groin tissue, ankle dorsiflexion, and dormant glutes to ensure pain-free knee tracking and optimal squat depth.`;
    rationaleHi = `${planTitle || 'लेग वर्कआउट्स'} के लिए विशेष: हिप्स, घुटनों और टखनों को खोलता है ताकि गहरे स्क्वाट्स और लंज बिना किसी दर्द के लग सकें।`;
    chosenStretches = [
      MASTER_DYNAMIC_STRETCHES.lightJumpingJacksAnklePogo,
      MASTER_DYNAMIC_STRETCHES.dynamicLegSwingsFrontLateral,
      MASTER_DYNAMIC_STRETCHES.worldsGreatestStretch,
      MASTER_DYNAMIC_STRETCHES.deepCossackSquatsSideShift,
      MASTER_DYNAMIC_STRETCHES.gluteBridgeDynamicReach,
      MASTER_DYNAMIC_STRETCHES.squatToOverheadReach,
    ];
  } else if (isCoreOrYoga) {
    focusTitle = 'Spine, Core & Calisthenics Fluidity Warm-Up';
    focusTitleHi = 'रीढ़, कोर व कैलिस्थेनिक्स फ्लो वॉर्म-अप';
    rationale = `Tailored for ${planTitle || 'Core & Bodyweight Training'}: Mobilizes all 24 vertebrae in flexion, extension, and rotation while engaging transverse abdominis and scapular stabilizers.`;
    rationaleHi = `${planTitle || 'कोर व कैलिस्थेनिक्स'} के लिए विशेष: रीढ़ के सभी जोड़ों को लचीला बनाता है और एब्स को मजबूत होल्ड के लिए तैयार करता है।`;
    chosenStretches = [
      MASTER_DYNAMIC_STRETCHES.torsoRotationsHipSwivels,
      MASTER_DYNAMIC_STRETCHES.thoracicCatCowDownDog,
      MASTER_DYNAMIC_STRETCHES.birdDogDynamicReach,
      MASTER_DYNAMIC_STRETCHES.wristAndForearmRolls,
      MASTER_DYNAMIC_STRETCHES.worldsGreatestStretch,
      MASTER_DYNAMIC_STRETCHES.inchwormToSpiderman,
    ];
  } else if (isCardioOrHIIT) {
    focusTitle = 'High-Tempo Metabolic Dynamic Warm-Up';
    focusTitleHi = 'हाई-टेम्पो कार्डियो व एरोबिक डायनेमिक वॉर्म-अप';
    rationale = `Tailored for ${planTitle || 'Cardio & Conditioning'}: Progressively elevates heart rate, stimulates lung ventilation, and conditions Achilles and knee tendons for rapid plyometric impact.`;
    rationaleHi = `${planTitle || 'कार्डियो व कंडीशनिंग'} के लिए विशेष: दिल की धड़कन को सुरक्षित रूप से बढ़ाता है और पंजों व घुटनों को तैयार करता है।`;
    chosenStretches = [
      MASTER_DYNAMIC_STRETCHES.lightJumpingJacksAnklePogo,
      MASTER_DYNAMIC_STRETCHES.torsoRotationsHipSwivels,
      MASTER_DYNAMIC_STRETCHES.dynamicLegSwingsFrontLateral,
      MASTER_DYNAMIC_STRETCHES.worldsGreatestStretch,
      MASTER_DYNAMIC_STRETCHES.inchwormToSpiderman,
      MASTER_DYNAMIC_STRETCHES.squatToOverheadReach,
    ];
  } else {
    // Universal Full-Body Protocol
    focusTitle = 'Full-Body Universal Kinetic Warm-Up';
    focusTitleHi = 'संपूर्ण शरीर (फुल-बॉडी) यूनिवर्सल वॉर्म-अप';
    rationale = `Tailored for ${planTitle || 'Full Body Workout'}: A comprehensive head-to-toe dynamic sequence activating major motor patterns: squat, hinge, push, pull, and core rotational bracing.`;
    rationaleHi = `${planTitle || 'फुल बॉडी वर्कआउट'} के लिए विशेष: सिर से पैर तक पूरे शरीर की प्रमुख मांसपेशियों और जोड़ों को 5 मिनट में सक्रिय करता है।`;
    chosenStretches = [
      MASTER_DYNAMIC_STRETCHES.lightJumpingJacksAnklePogo,
      MASTER_DYNAMIC_STRETCHES.armCirclesChestOpeners,
      MASTER_DYNAMIC_STRETCHES.thoracicCatCowDownDog,
      MASTER_DYNAMIC_STRETCHES.worldsGreatestStretch,
      MASTER_DYNAMIC_STRETCHES.dynamicLegSwingsFrontLateral,
      MASTER_DYNAMIC_STRETCHES.squatToOverheadReach,
    ];
  }

  // Ensure total duration is exactly 300s (5 minutes)
  const totalDuration = chosenStretches.reduce((acc, s) => acc + s.durationSeconds, 0);

  return {
    id: `warmup-${Date.now()}`,
    title: focusTitle,
    titleHi: focusTitleHi,
    subtitle: '5-Minute Science-Based Dynamic Mobility Protocol',
    subtitleHi: '5-मिनट का वैज्ञानिक रूप से प्रमाणित डायनेमिक स्ट्रेचिंग रूटीन',
    targetFocus: planSplit,
    totalDurationSeconds: totalDuration,
    matchedWorkoutTitle: planTitle || undefined,
    rationale,
    rationaleHi,
    stretches: chosenStretches,
  };
}
