// Curated high-definition fitness exercise imagery tailored to anatomical movements and disciplines

const EXERCISE_SPECIFIC_IMAGES: Record<string, string> = {
  // Chest & Push
  'bench-press-bb': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
  'barbell-flat-bench-press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
  'incline-db-press': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  'incline-dumbbell-press': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  'cable-crossover-fly': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'cable-chest-fly': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'bodyweight-dips': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
  'parallel-bar-dips': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',

  // Additional Chest & Push
  'push-ups': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
  'pushup': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
  'diamond-push-ups': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
  'chest-fly': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'pec-deck-fly': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',

  // Back & Pull
  'deadlift-bb': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'conventional-barbell-deadlift': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'lat-pulldown': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80',
  'bent-over-bb-row': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
  'barbell-bent-over-row': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
  'pull-ups': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=80',

  // Shoulders
  'overhead-db-press': 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&auto=format&fit=crop&q=80',
  'seated-dumbbell-shoulder-press': 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&auto=format&fit=crop&q=80',
  'db-lateral-raise': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
  'dumbbell-lateral-raise': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
  'face-pulls': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=80',
  'cable-rope-face-pulls': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=80',

  // Legs & Glutes
  'barbell-squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
  'barbell-back-squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
  'romanian-deadlift': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&auto=format&fit=crop&q=80',
  'leg-press': 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
  '45-degree-leg-press': 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
  'walking-lunges': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
  'dumbbell-walking-lunges': 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
  'standing-calf-raise': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'barbell-hip-thrust': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'bulgarian-split-squat': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80',
  'cable-glute-kickback': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',
  'db-goblet-squat': 'https://images.unsplash.com/photo-1567598508481-65985588e295?w=800&auto=format&fit=crop&q=80',
  'dumbbell-goblet-squat': 'https://images.unsplash.com/photo-1567598508481-65985588e295?w=800&auto=format&fit=crop&q=80',

  // Arms
  'barbell-bicep-curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  'tricep-rope-pushdown': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'cable-tricep-rope-pushdown': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  'incline-db-curl': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
  'incline-dumbbell-bicep-curl': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
  'skull-crushers': 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&auto=format&fit=crop&q=80',
  'ez-bar-skull-crushers': 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&auto=format&fit=crop&q=80',

  // Core & Abs
  'hanging-leg-raise': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
  'cable-woodchopper': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'plank-hold': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',
  'forearm-plank': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',

  // Cardio, HIIT & Plyometrics
  'hiit-burpees': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
  'burpees': 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
  'kettlebell-swing': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'kettlebell-swings': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'treadmill-incline-walk': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80',
  'treadmill-walk': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80',
  'rowing-intervals': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'rowing-machine': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'speed-jump-rope': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',
  'jump-rope': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',
  'dumbbell-thruster': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
  'dumbbell-thrusters': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
  'box-jump-explosive': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&auto=format&fit=crop&q=80',
  'plyometric-box-jumps': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&auto=format&fit=crop&q=80',

  // Zumba & Dance
  'zumba-salsa-cardio': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'zumba-salsa-merengue': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'zumba-reggaeton-bounce': 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&auto=format&fit=crop&q=80',
  'reggaeton-dance-squat': 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&auto=format&fit=crop&q=80',
  'zumba-cumbia-cross': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  'cumbia-dance': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  'zumba-toning-sticks': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',
  'zumba-toning': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',

  // Swimming
  'swim-freestyle-laps': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  'swimming-freestyle': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  'swim-breaststroke': 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&auto=format&fit=crop&q=80',
  'swimming-breaststroke': 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&auto=format&fit=crop&q=80',
  'swim-butterfly-intervals': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  'swimming-butterfly': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  'swim-backstroke': 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80',
  'swimming-backstroke': 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80',
  'treading-water-intervals': 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&auto=format&fit=crop&q=80',
  'swimming-treading-water': 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&auto=format&fit=crop&q=80',

  // Calisthenics
  'muscle-up-rings': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=80',
  'muscle-up': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=80',
  'pistol-squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',

  // Yoga & Flow
  'vinyasa-flow-sun-salutation': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'sun-salutation': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'downward-facing-dog': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  'downward-dog': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  'cat-cow-spinal-flow': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  'cat-cow': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  'warrior-two-pose': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'warrior-two': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'childs-pose-restorative': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'childs-pose': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'cobra-upward-dog-stretch': 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=80',
  'cobra-pose': 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=80',
  'triangle-pose-flow': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'triangle-pose': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'reclined-spinal-twist': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'spinal-twist': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',

  // Deep Stretching & Mobility
  'pigeon-pose-mobility': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'pigeon-pose': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'worlds-greatest-stretch': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'spiderman-stretch': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'seated-forward-fold-stretch': 'https://images.unsplash.com/photo-1552196563-5523b0365774?w=800&auto=format&fit=crop&q=80',
  'forward-fold': 'https://images.unsplash.com/photo-1552196563-5523b0365774?w=800&auto=format&fit=crop&q=80',
  'low-lunge-quad-hip-flexor': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'butterfly-adductor-stretch': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'butterfly-stretch': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  'ninety-ninety-hip-switch': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'doorway-chest-shoulder-stretch': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  'desk-tech-neck-trap-stretch': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',

  // Pilates
  'pilates-the-hundred': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  'pilates-teaser': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',

  // Boxing
  'boxing-heavy-bag-combos': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
  'heavy-bag-combos': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
  'boxing-shadow-footwork': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'shadow-boxing': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
};

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  Weights: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  Calisthenics: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=80',
  Cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80',
  Yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
  Stretching: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  Mobility: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  Pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  Boxing: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80',
  Swimming: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
  Zumba: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&auto=format&fit=crop&q=80',
};

export function getExerciseImageUrl(params: {
  id?: string;
  name?: string;
  category?: string;
  equipment?: string;
  imageUrl?: string;
}): string {
  if (params.imageUrl && params.imageUrl.trim() !== '') {
    return params.imageUrl;
  }

  const id = (params.id || '').toLowerCase();
  const name = (params.name || '').toLowerCase();

  // 1. Direct ID match first
  if (id && EXERCISE_SPECIFIC_IMAGES[id]) {
    return EXERCISE_SPECIFIC_IMAGES[id];
  }

  // 2. Specific exercise keyword checks
  if (id.includes('bench') || name.includes('bench press')) return EXERCISE_SPECIFIC_IMAGES['bench-press-bb'];
  if (name.includes('incline dumbbell') || name.includes('incline db')) return EXERCISE_SPECIFIC_IMAGES['incline-db-press'];
  if (name.includes('chest fly') || name.includes('crossover')) return EXERCISE_SPECIFIC_IMAGES['cable-crossover-fly'];
  if (name.includes('dip')) return EXERCISE_SPECIFIC_IMAGES['bodyweight-dips'];
  if (name.includes('deadlift') && !name.includes('romanian')) return EXERCISE_SPECIFIC_IMAGES['deadlift-bb'];
  if (name.includes('romanian') || name.includes('rdl')) return EXERCISE_SPECIFIC_IMAGES['romanian-deadlift'];
  if (name.includes('lat pulldown')) return EXERCISE_SPECIFIC_IMAGES['lat-pulldown'];
  if (name.includes('row') && !name.includes('rowing machine')) return EXERCISE_SPECIFIC_IMAGES['bent-over-bb-row'];
  if (name.includes('pull-up') || name.includes('pull up') || name.includes('chin-up')) return EXERCISE_SPECIFIC_IMAGES['pull-ups'];
  if (name.includes('shoulder press') || name.includes('military press') || name.includes('overhead press')) return EXERCISE_SPECIFIC_IMAGES['overhead-db-press'];
  if (name.includes('lateral raise')) return EXERCISE_SPECIFIC_IMAGES['db-lateral-raise'];
  if (name.includes('face pull')) return EXERCISE_SPECIFIC_IMAGES['face-pulls'];
  if (name.includes('back squat') || (name.includes('squat') && name.includes('barbell'))) return EXERCISE_SPECIFIC_IMAGES['barbell-squat'];
  if (name.includes('leg press')) return EXERCISE_SPECIFIC_IMAGES['leg-press'];
  if (name.includes('lunge') && !name.includes('low lunge')) return EXERCISE_SPECIFIC_IMAGES['walking-lunges'];
  if (name.includes('calf')) return EXERCISE_SPECIFIC_IMAGES['standing-calf-raise'];
  if (name.includes('hip thrust')) return EXERCISE_SPECIFIC_IMAGES['barbell-hip-thrust'];
  if (name.includes('split squat') || name.includes('bulgarian')) return EXERCISE_SPECIFIC_IMAGES['bulgarian-split-squat'];
  if (name.includes('glute kickback') || name.includes('abduction')) return EXERCISE_SPECIFIC_IMAGES['cable-glute-kickback'];
  if (name.includes('goblet squat')) return EXERCISE_SPECIFIC_IMAGES['db-goblet-squat'];
  if (name.includes('bicep curl') || name.includes('barbell curl')) return EXERCISE_SPECIFIC_IMAGES['barbell-bicep-curl'];
  if (name.includes('tricep rope') || name.includes('pushdown')) return EXERCISE_SPECIFIC_IMAGES['tricep-rope-pushdown'];
  if (name.includes('skull crusher')) return EXERCISE_SPECIFIC_IMAGES['skull-crushers'];
  if (name.includes('leg raise') || name.includes('knee raise')) return EXERCISE_SPECIFIC_IMAGES['hanging-leg-raise'];
  if (name.includes('woodchopper') || name.includes('rotational twist')) return EXERCISE_SPECIFIC_IMAGES['cable-woodchopper'];
  if (name.includes('plank')) return EXERCISE_SPECIFIC_IMAGES['plank-hold'];
  if (name.includes('burpee')) return EXERCISE_SPECIFIC_IMAGES['hiit-burpees'];
  if (name.includes('kettlebell')) return EXERCISE_SPECIFIC_IMAGES['kettlebell-swing'];
  if (name.includes('treadmill')) return EXERCISE_SPECIFIC_IMAGES['treadmill-incline-walk'];
  if (name.includes('rowing machine') || name.includes('rowing intervals')) return EXERCISE_SPECIFIC_IMAGES['rowing-intervals'];
  if (name.includes('jump rope') || name.includes('skipping')) return EXERCISE_SPECIFIC_IMAGES['speed-jump-rope'];
  if (name.includes('thruster')) return EXERCISE_SPECIFIC_IMAGES['dumbbell-thruster'];
  if (name.includes('box jump')) return EXERCISE_SPECIFIC_IMAGES['box-jump-explosive'];

  // Zumba & Dance
  if (name.includes('salsa') || name.includes('merengue')) return EXERCISE_SPECIFIC_IMAGES['zumba-salsa-cardio'];
  if (name.includes('reggaeton')) return EXERCISE_SPECIFIC_IMAGES['zumba-reggaeton-bounce'];
  if (name.includes('cumbia')) return EXERCISE_SPECIFIC_IMAGES['zumba-cumbia-cross'];
  if (name.includes('zumba') || name.includes('toning stick')) return EXERCISE_SPECIFIC_IMAGES['zumba-toning-sticks'];

  // Swimming
  if (name.includes('freestyle') || name.includes('crawl')) return EXERCISE_SPECIFIC_IMAGES['swim-freestyle-laps'];
  if (name.includes('breaststroke')) return EXERCISE_SPECIFIC_IMAGES['swim-breaststroke'];
  if (name.includes('butterfly') && !name.includes('stretch') && !name.includes('adductor')) return EXERCISE_SPECIFIC_IMAGES['swim-butterfly-intervals'];
  if (name.includes('backstroke')) return EXERCISE_SPECIFIC_IMAGES['swim-backstroke'];
  if (name.includes('treading water')) return EXERCISE_SPECIFIC_IMAGES['treading-water-intervals'];

  // Calisthenics
  if (name.includes('muscle-up') || name.includes('muscle up')) return EXERCISE_SPECIFIC_IMAGES['muscle-up-rings'];
  if (name.includes('pistol squat')) return EXERCISE_SPECIFIC_IMAGES['pistol-squat'];

  // Yoga Asanas & Poses
  if (name.includes('sun salutation') || name.includes('surya namaskar') || name.includes('vinyasa')) return EXERCISE_SPECIFIC_IMAGES['vinyasa-flow-sun-salutation'];
  if (name.includes('downward') || name.includes('adho mukha') || name.includes('dog hold') || name.includes('dog stretch')) return EXERCISE_SPECIFIC_IMAGES['downward-facing-dog'];
  if (name.includes('warrior') || name.includes('virabhadrasana')) return EXERCISE_SPECIFIC_IMAGES['warrior-two-pose'];
  if (name.includes('child') || name.includes('balasana')) return EXERCISE_SPECIFIC_IMAGES['childs-pose-restorative'];
  if (name.includes('cobra') || name.includes('upward-facing') || name.includes('bhujangasana')) return EXERCISE_SPECIFIC_IMAGES['cobra-upward-dog-stretch'];
  if (name.includes('triangle') || name.includes('trikonasana')) return EXERCISE_SPECIFIC_IMAGES['triangle-pose-flow'];
  if (name.includes('cat-cow') || name.includes('marjaryasana') || name.includes('bitilasana')) return EXERCISE_SPECIFIC_IMAGES['cat-cow-spinal-flow'];
  if (name.includes('spinal twist') || name.includes('matsyendrasana') || name.includes('supine twist')) return EXERCISE_SPECIFIC_IMAGES['reclined-spinal-twist'];

  // Deep Stretches & Mobility
  if (name.includes('pigeon') || name.includes('kapotasana') || name.includes('hip opener')) return EXERCISE_SPECIFIC_IMAGES['pigeon-pose-mobility'];
  if (name.includes('greatest stretch') || name.includes('spiderman')) return EXERCISE_SPECIFIC_IMAGES['worlds-greatest-stretch'];
  if (name.includes('forward fold') || name.includes('paschimottanasana') || name.includes('hamstring stretch')) return EXERCISE_SPECIFIC_IMAGES['seated-forward-fold-stretch'];
  if (name.includes('low lunge') || name.includes('hip flexor') || name.includes('psoas') || name.includes('anjaneyasana')) return EXERCISE_SPECIFIC_IMAGES['low-lunge-quad-hip-flexor'];
  if (name.includes('butterfly') || name.includes('baddha') || name.includes('groin') || name.includes('adductor')) return EXERCISE_SPECIFIC_IMAGES['butterfly-adductor-stretch'];
  if (name.includes('90/90') || name.includes('ninety') || name.includes('hip switch') || name.includes('hip capsule')) return EXERCISE_SPECIFIC_IMAGES['ninety-ninety-hip-switch'];
  if (name.includes('doorway') || name.includes('pectoral stretch') || name.includes('chest stretch') || name.includes('shoulder stretch')) return EXERCISE_SPECIFIC_IMAGES['doorway-chest-shoulder-stretch'];
  if (name.includes('neck') || name.includes('tech-neck') || name.includes('trap stretch') || name.includes('cervical')) return EXERCISE_SPECIFIC_IMAGES['desk-tech-neck-trap-stretch'];

  // Pilates
  if (name.includes('hundred')) return EXERCISE_SPECIFIC_IMAGES['pilates-the-hundred'];
  if (name.includes('teaser')) return EXERCISE_SPECIFIC_IMAGES['pilates-teaser'];

  // Boxing
  if (name.includes('heavy bag') || name.includes('punch')) return EXERCISE_SPECIFIC_IMAGES['boxing-heavy-bag-combos'];
  if (name.includes('shadow boxing') || name.includes('boxing') || name.includes('footwork')) return EXERCISE_SPECIFIC_IMAGES['boxing-shadow-footwork'];

  // General Yoga / Stretching fallback by keyword
  if (name.includes('yoga') || name.includes('flow') || name.includes('asana')) {
    return EXERCISE_SPECIFIC_IMAGES['vinyasa-flow-sun-salutation'];
  }
  if (name.includes('stretch') || name.includes('flexibility') || name.includes('mobility')) {
    return EXERCISE_SPECIFIC_IMAGES['downward-facing-dog'];
  }

  // 3. Category fallbacks
  if (params.category) {
    if (CATEGORY_DEFAULT_IMAGES[params.category]) return CATEGORY_DEFAULT_IMAGES[params.category];
    if (params.category.includes('Yoga')) return CATEGORY_DEFAULT_IMAGES['Yoga'];
    if (params.category.includes('Stretch')) return CATEGORY_DEFAULT_IMAGES['Stretching'];
    if (params.category.includes('Mobility')) return CATEGORY_DEFAULT_IMAGES['Mobility'];
    if (params.category.includes('Swim')) return CATEGORY_DEFAULT_IMAGES['Swimming'];
    if (params.category.includes('Dance') || params.category.includes('Zumba')) return CATEGORY_DEFAULT_IMAGES['Zumba'];
    if (params.category.includes('Boxing')) return CATEGORY_DEFAULT_IMAGES['Boxing'];
    if (params.category.includes('Pilates')) return CATEGORY_DEFAULT_IMAGES['Pilates'];
  }

  return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80';
}

export const getExerciseImage = getExerciseImageUrl;

export function isChestExercise(exercise?: {
  id?: string;
  name?: string;
  category?: string;
  targetMuscle?: string;
  secondaryMuscles?: string[];
}): boolean {
  if (!exercise) return false;
  const cat = (exercise.category || '').toLowerCase();
  const name = (exercise.name || '').toLowerCase();
  const target = (exercise.targetMuscle || '').toLowerCase();
  const id = (exercise.id || '').toLowerCase();

  if (cat === 'chest') return true;
  if (target.includes('chest') || target.includes('pectoral') || target.includes('pecs')) return true;
  if (
    id.includes('bench') ||
    id.includes('chest') ||
    name.includes('bench press') ||
    name.includes('chest fly') ||
    name.includes('cable crossover') ||
    name.includes('incline dumbbell press') ||
    name.includes('incline db press') ||
    name.includes('parallel bar dips') ||
    name.includes('push-up') ||
    name.includes('pushup') ||
    name.includes('pec deck')
  ) {
    return true;
  }
  return false;
}
