export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation & Brand
  app_title: string;
  app_subtitle: string;
  nav_workouts: string;
  nav_timers: string;
  nav_diet: string;
  nav_routine: string;
  nav_coach: string;
  nav_progress: string;

  // Header Actions
  resume_workout: string;
  streak_suffix: string;
  syncing: string;
  synced: string;
  login: string;
  logout: string;
  verified_health: string;
  reminders_title: string;
  profile_settings: string;
  language_toggle: string;

  // Common Actions & Labels
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  close: string;
  back: string;
  search: string;
  filter: string;
  all: string;
  start: string;
  pause: string;
  resume: string;
  reset: string;
  complete: string;
  completed: string;
  add: string;
  confirm: string;
  loading: string;
  today: string;
  yesterday: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;

  // Training View
  training_hub_title: string;
  training_hub_subtitle: string;
  start_active_workout: string;
  create_custom_plan: string;
  ai_smart_plan: string;
  browse_exercise_library: string;
  my_workout_plans: string;
  preset_plans: string;
  start_plan_now: string;
  view_form_guide: string;
  sets: string;
  reps: string;
  weight: string;
  rest: string;
  target_muscle: string;
  equipment: string;
  key_form_cue: string;
  cal_per_min: string;

  // Categories & Muscles
  cat_all: string;
  cat_chest: string;
  cat_back: string;
  cat_shoulders: string;
  cat_legs: string;
  cat_core: string;
  cat_arms: string;
  cat_cardio: string;
  cat_mobility: string;
  cat_yoga: string;
  cat_calisthenics: string;
  cat_swimming: string;
  cat_zumba: string;
  cat_boxing: string;

  // Active Workout Modal
  active_session_title: string;
  finish_workout: string;
  discard_session: string;
  add_exercise_to_workout: string;
  rest_timer_label: string;
  set_number: string;
  previous_best: string;
  mark_set_complete: string;
  workout_notes_placeholder: string;
  workout_complete_cheer: string;

  // Diet View
  diet_hub_title: string;
  diet_hub_subtitle: string;
  calories: string;
  calories_consumed: string;
  daily_calorie_target: string;
  protein: string;
  carbs: string;
  fats: string;
  water_tracker: string;
  add_water: string;
  log_food_item: string;
  quick_add_meal: string;
  meal_breakfast: string;
  meal_lunch: string;
  meal_dinner: string;
  meal_snack: string;
  meal_preworkout: string;
  supplements_tracker: string;
  calories_checker: string;
  personal_diet_maker: string;

  // Daily Routine View
  routine_hub_title: string;
  routine_hub_subtitle: string;
  core_fitness_habits: string;
  morning_routine: string;
  afternoon_routine: string;
  evening_routine: string;
  night_routine: string;
  add_routine_item: string;
  mark_habit_done: string;
  habit_streak: string;

  // Timers View
  timers_hub_title: string;
  timers_hub_subtitle: string;
  stopwatch: string;
  tabata_timer: string;
  hiit_timer: string;
  custom_interval: string;
  work_duration: string;
  rest_duration: string;
  rounds: string;
  lap: string;
  laps_history: string;

  // Progress & Analytics View
  analytics_hub_title: string;
  analytics_hub_subtitle: string;
  body_progress_photos: string;
  weight_trend: string;
  volume_progression: string;
  personal_records: string;
  compare_photos: string;
  before_after: string;
  take_photo_camera: string;
  upload_photo: string;
  current_weight: string;
  target_weight: string;

  // Reminders Modal
  reminders_modal_title: string;
  workout_schedules: string;
  nutrition_schedules: string;
  sound_alerts: string;
  browser_push_notifications: string;
  test_reminder_sound: string;
  enable_push_notifications: string;

  // Profile Modal & Settings
  profile_title: string;
  profile_tab_info: string;
  profile_tab_milestones: string;
  language_preference: string;
  language_select_en: string;
  language_select_hi: string;
  body_metrics: string;
  height: string;
  fitness_goal: string;
  goal_muscle_gain: string;
  goal_fat_loss: string;
  goal_endurance: string;
  goal_maintenance: string;
  save_changes: string;

  // Compliance & Footer
  evidence_based_engine: string;
  medical_disclaimer: string;
  trainer_standards: string;
  privacy_policy: string;
  terms_of_use: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation & Brand
    app_title: 'PULSEFIT PRO',
    app_subtitle: 'Executive Fitness, Nutrition & Schedule',
    nav_workouts: 'Workouts',
    nav_timers: 'Timers',
    nav_diet: 'Diet & Macros',
    nav_routine: 'Daily Routine',
    nav_coach: 'AI Coach',
    nav_progress: 'Progress',

    // Header Actions
    resume_workout: 'Resume',
    streak_suffix: 'd',
    syncing: 'Syncing',
    synced: 'Synced',
    login: 'Log In',
    logout: 'Log Out',
    verified_health: 'Verified Health',
    reminders_title: 'Workout & Nutrition Reminders',
    profile_settings: 'Profile & Settings',
    language_toggle: 'English / हिंदी',

    // Common Actions & Labels
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    search: 'Search...',
    filter: 'Filter',
    all: 'All',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    complete: 'Complete',
    completed: 'Completed',
    add: 'Add',
    confirm: 'Confirm',
    loading: 'Loading...',
    today: 'Today',
    yesterday: 'Yesterday',
    days: 'days',
    hours: 'hours',
    minutes: 'mins',
    seconds: 'secs',

    // Training View
    training_hub_title: 'Training & Workout Hub',
    training_hub_subtitle: 'Execute structured hypertrophy, strength, and conditioning protocols.',
    start_active_workout: 'Start Workout',
    create_custom_plan: 'Custom Plan',
    ai_smart_plan: 'Smart Plan',
    browse_exercise_library: 'Exercise Library',
    my_workout_plans: 'My Workout Plans',
    preset_plans: 'Curated Pro Routines',
    start_plan_now: 'Start Plan',
    view_form_guide: 'View Form Guide',
    sets: 'Sets',
    reps: 'Reps',
    weight: 'Weight',
    rest: 'Rest',
    target_muscle: 'Target',
    equipment: 'Equipment',
    key_form_cue: 'Key Form Cue',
    cal_per_min: 'cal/min',

    // Categories & Muscles
    cat_all: 'All',
    cat_chest: 'Chest',
    cat_back: 'Back',
    cat_shoulders: 'Shoulders',
    cat_legs: 'Legs',
    cat_core: 'Core & Abs',
    cat_arms: 'Arms',
    cat_cardio: 'Cardio & HIIT',
    cat_mobility: 'Mobility',
    cat_yoga: 'Yoga & Asanas',
    cat_calisthenics: 'Calisthenics',
    cat_swimming: 'Swimming',
    cat_zumba: 'Zumba & Dance',
    cat_boxing: 'Boxing',

    // Active Workout Modal
    active_session_title: 'Active Workout Session',
    finish_workout: 'Finish Workout',
    discard_session: 'Discard Session',
    add_exercise_to_workout: 'Add Exercise',
    rest_timer_label: 'Rest Timer',
    set_number: 'Set',
    previous_best: 'Previous',
    mark_set_complete: 'Complete Set',
    workout_notes_placeholder: 'Add workout notes, RPE, or feelings...',
    workout_complete_cheer: 'Awesome job! Workout recorded successfully.',

    // Diet View
    diet_hub_title: 'Nutrition & Macro Hub',
    diet_hub_subtitle: 'Fuel your physique with precision macronutrient tracking and hydration logging.',
    calories: 'Calories',
    calories_consumed: 'Calories Consumed',
    daily_calorie_target: 'Daily Calorie Target',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',
    water_tracker: 'Water Intake',
    add_water: 'Add Water',
    log_food_item: 'Log Food',
    quick_add_meal: 'Quick Add Meal',
    meal_breakfast: 'Breakfast',
    meal_lunch: 'Lunch',
    meal_dinner: 'Dinner',
    meal_snack: 'Snacks',
    meal_preworkout: 'Pre-Workout Fuel',
    supplements_tracker: 'Supplements',
    calories_checker: 'Calories Checker',
    personal_diet_maker: 'Custom Diet Maker',

    // Daily Routine View
    routine_hub_title: 'Daily Routine & Habits',
    routine_hub_subtitle: 'Build unwavering athletic discipline with sequential morning-to-night habits.',
    core_fitness_habits: 'Core Fitness Habits',
    morning_routine: 'Morning Routine',
    afternoon_routine: 'Afternoon Flow',
    evening_routine: 'Evening Routine',
    night_routine: 'Night & Recovery',
    add_routine_item: 'Add Habit',
    mark_habit_done: 'Mark Done',
    habit_streak: 'Habit Streak',

    // Timers View
    timers_hub_title: 'Precision Athletic Timers',
    timers_hub_subtitle: 'High-intensity interval, Tabata, and rest intervals with audio chimes.',
    stopwatch: 'Stopwatch',
    tabata_timer: 'Tabata (20s/10s)',
    hiit_timer: 'HIIT Intervals',
    custom_interval: 'Custom Interval',
    work_duration: 'Work Duration',
    rest_duration: 'Rest Duration',
    rounds: 'Rounds',
    lap: 'Lap',
    laps_history: 'Laps History',

    // Progress & Analytics View
    analytics_hub_title: 'Progress & Analytics',
    analytics_hub_subtitle: 'Quantify your transformation with body composition, volume metrics, and photos.',
    body_progress_photos: 'Body Progress Photos',
    weight_trend: 'Weight Trend',
    volume_progression: 'Volume Progression',
    personal_records: 'Personal Records',
    compare_photos: 'Compare Photos',
    before_after: 'Before & After',
    take_photo_camera: 'Take Photo',
    upload_photo: 'Upload Photo',
    current_weight: 'Current Weight',
    target_weight: 'Target Weight',

    // Reminders Modal
    reminders_modal_title: 'Workout & Nutrition Reminders',
    workout_schedules: 'Workout Schedules',
    nutrition_schedules: 'Nutrition Checkpoints',
    sound_alerts: 'Audio Chimes',
    browser_push_notifications: 'Push Notifications',
    test_reminder_sound: 'Test Sound',
    enable_push_notifications: 'Enable Browser Push',

    // Profile Modal & Settings
    profile_title: 'Profile & Settings',
    profile_tab_info: 'Personal Info & Goals',
    profile_tab_milestones: 'Badges & Milestones',
    language_preference: 'Language / भाषा',
    language_select_en: 'English',
    language_select_hi: 'हिंदी (Hindi)',
    body_metrics: 'Body Metrics',
    height: 'Height',
    fitness_goal: 'Primary Fitness Goal',
    goal_muscle_gain: 'Muscle Gain & Hypertrophy',
    goal_fat_loss: 'Fat Loss & Definition',
    goal_endurance: 'Cardio & Athletic Endurance',
    goal_maintenance: 'Strength Maintenance & Health',
    save_changes: 'Save Changes',

    // Compliance & Footer
    evidence_based_engine: 'Evidence-Based Training & Nutrition Engine',
    medical_disclaimer: 'Medical Disclaimer',
    trainer_standards: 'Trainer Standards',
    privacy_policy: 'Privacy Policy',
    terms_of_use: 'Terms of Use',
  },

  hi: {
    // Navigation & Brand
    app_title: 'पल्सफिट प्रो',
    app_subtitle: 'प्रीमियम फिटनेस, पोषण और दैनिक शेड्यूल',
    nav_workouts: 'वर्कआउट्स',
    nav_timers: 'टाइमर',
    nav_diet: 'डाइट और मैक्रोज़',
    nav_routine: 'दैनिक रूटीन',
    nav_coach: 'एआई कोच',
    nav_progress: 'प्रगति और रिपोर्ट',

    // Header Actions
    resume_workout: 'जारी रखें',
    streak_suffix: 'दिन',
    syncing: 'सिंक हो रहा है',
    synced: 'सिंक हुआ',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    verified_health: 'सत्यापित स्वास्थ्य',
    reminders_title: 'वर्कआउट और पोषण रिमाइंडर',
    profile_settings: 'प्रोफाइल और सेटिंग्स',
    language_toggle: 'हिंदी / English',

    // Common Actions & Labels
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    back: 'वापस',
    search: 'खोजें...',
    filter: 'फ़िल्टर',
    all: 'सभी',
    start: 'शुरू करें',
    pause: 'रोकें',
    resume: 'फिर शुरू करें',
    reset: 'रीसेट करें',
    complete: 'पूरा करें',
    completed: 'पूर्ण',
    add: 'जोड़ें',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    today: 'आज',
    yesterday: 'कल',
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',

    // Training View
    training_hub_title: 'ट्रेनिंग और वर्कआउट हब',
    training_hub_subtitle: 'वैज्ञानिक रूप से डिज़ाइन किए गए स्ट्रेंथ, मसल बिल्डिंग और कंडीशनिंग प्रोटोकॉल।',
    start_active_workout: 'वर्कआउट शुरू करें',
    create_custom_plan: 'कस्टम प्लान बनाएं',
    ai_smart_plan: 'स्मार्ट एआई प्लान',
    browse_exercise_library: 'व्यायाम लाइब्रेरी',
    my_workout_plans: 'मेरे वर्कआउट प्लान',
    preset_plans: 'विशेषज्ञ वर्कआउट रूटीन',
    start_plan_now: 'प्लान शुरू करें',
    view_form_guide: 'सही तकनीक देखें',
    sets: 'सेट्स',
    reps: 'रेप्स',
    weight: 'वज़न',
    rest: 'आराम',
    target_muscle: 'लक्षित मांसपेशी',
    equipment: 'उपकरण',
    key_form_cue: 'मुख्य फॉर्म निर्देश',
    cal_per_min: 'कैलोरी/मिनट',

    // Categories & Muscles
    cat_all: 'सभी',
    cat_chest: 'छाती (Chest)',
    cat_back: 'पीठ (Back)',
    cat_shoulders: 'कंधे (Shoulders)',
    cat_legs: 'पैर (Legs)',
    cat_core: 'कोर और एब्स (Core & Abs)',
    cat_arms: 'बाजुएं (Arms)',
    cat_cardio: 'कार्डियो और एचआईआईटी (Cardio & HIIT)',
    cat_mobility: 'लचीलापन (Mobility)',
    cat_yoga: 'योग और आसन (Yoga)',
    cat_calisthenics: 'कैलिस्थेनिक्स (Calisthenics)',
    cat_swimming: 'तैराकी (Swimming)',
    cat_zumba: 'ज़ुम्बा और डांस (Zumba)',
    cat_boxing: 'बॉक्सिंग (Boxing)',

    // Active Workout Modal
    active_session_title: 'सक्रिय वर्कआउट सत्र',
    finish_workout: 'वर्कआउट पूरा करें',
    discard_session: 'सत्र रद्द करें',
    add_exercise_to_workout: 'व्यायाम जोड़ें',
    rest_timer_label: 'रेस्ट टाइमर',
    set_number: 'सेट',
    previous_best: 'पिछला रिकॉर्ड',
    mark_set_complete: 'सेट पूरा करें',
    workout_notes_placeholder: 'वर्कआउट नोट्स या अनुभव लिखें...',
    workout_complete_cheer: 'शानदार! आपका वर्कआउट सफलतापूर्वक रिकॉर्ड हो गया।',

    // Diet View
    diet_hub_title: 'पोषण और मैक्रो हब',
    diet_hub_subtitle: 'सटीक मैक्रोन्यूट्रिएंट ट्रैकिंग, पानी का सेवन और स्वस्थ आहार लॉगिंग।',
    calories: 'कैलोरी',
    calories_consumed: 'कुल कैलोरी',
    daily_calorie_target: 'दैनिक कैलोरी लक्ष्य',
    protein: 'प्रोटीन',
    carbs: 'कार्ब्स',
    fats: 'फैट्स',
    water_tracker: 'पानी का सेवन',
    add_water: 'पानी जोड़ें',
    log_food_item: 'भोजन लॉग करें',
    quick_add_meal: 'त्वरित भोजन जोड़ें',
    meal_breakfast: 'सुबह का नाश्ता (Breakfast)',
    meal_lunch: 'दोपहर का भोजन (Lunch)',
    meal_dinner: 'रात का खाना (Dinner)',
    meal_snack: 'स्नैक्स और अल्पाहार',
    meal_preworkout: 'प्री-वर्कआउट पोषण',
    supplements_tracker: 'सप्लीमेंट्स ट्रैकर',
    calories_checker: 'कैलोरी चेकर',
    personal_diet_maker: 'कस्टम डाइट मेकर',

    // Daily Routine View
    routine_hub_title: 'दैनिक दिनचर्या और आदतें',
    routine_hub_subtitle: 'सुबह से लेकर रात तक अनुशासित दिनचर्या और स्वस्थ आदतों का निर्माण करें।',
    core_fitness_habits: 'दैनिक फिटनेस आदतें',
    morning_routine: 'सुबह की दिनचर्या',
    afternoon_routine: 'दोपहर का समय',
    evening_routine: 'शाम की दिनचर्या',
    night_routine: 'रात और रिकवरी',
    add_routine_item: 'नई आदत जोड़ें',
    mark_habit_done: 'पूर्ण चिह्नित करें',
    habit_streak: 'आदत की स्ट्रीक',

    // Timers View
    timers_hub_title: 'सटीक एथलेटिक टाइमर',
    timers_hub_subtitle: 'हाई-इंटेन्सिटी इंटरवल, तबाता और रेस्ट टाइमर बीप व साउंड अलर्ट्स के साथ।',
    stopwatch: 'स्टॉपवॉच',
    tabata_timer: 'तबाता टाइमर (20s/10s)',
    hiit_timer: 'एचआईआईटी इंटरवल',
    custom_interval: 'कस्टम इंटरवल',
    work_duration: 'व्यायाम समय',
    rest_duration: 'आराम का समय',
    rounds: 'राउंड्स',
    lap: 'लैप दर्ज करें',
    laps_history: 'लैप्स का इतिहास',

    // Progress & Analytics View
    analytics_hub_title: 'प्रगति और एनालिटिक्स',
    analytics_hub_subtitle: 'वज़न में बदलाव, वर्कआउट वॉल्यूम और बॉडी प्रोग्रेस तस्वीरों से परिणाम ट्रैक करें।',
    body_progress_photos: 'बॉडी प्रोग्रेस तस्वीरें',
    weight_trend: 'वज़न का ग्राफ',
    volume_progression: 'वॉल्यूम प्रगति',
    personal_records: 'व्यक्तिगत सर्वश्रेष्ठ रिकॉर्ड',
    compare_photos: 'तस्वीरों की तुलना करें',
    before_after: 'पहले और बाद (Before & After)',
    take_photo_camera: 'कैमरा से फोटो लें',
    upload_photo: 'फोटो अपलोड करें',
    current_weight: 'वर्तमान वज़न',
    target_weight: 'लक्ष्य वज़न',

    // Reminders Modal
    reminders_modal_title: 'वर्कआउट और पोषण रिमाइंडर',
    workout_schedules: 'वर्कआउट शेड्यूल',
    nutrition_schedules: 'भोजन और पोषण समय',
    sound_alerts: 'ऑडियो अलर्ट बीप',
    browser_push_notifications: 'ब्राउज़र पुश नोटिफिकेशन',
    test_reminder_sound: 'साउंड टेस्ट करें',
    enable_push_notifications: 'पुश अलर्ट चालू करें',

    // Profile Modal & Settings
    profile_title: 'प्रोफाइल और सेटिंग्स',
    profile_tab_info: 'व्यक्तिगत जानकारी और लक्ष्य',
    profile_tab_milestones: 'उपलब्धियां और बैज',
    language_preference: 'ऐप की भाषा (Language)',
    language_select_en: 'English (अंग्रेज़ी)',
    language_select_hi: 'हिंदी (Hindi)',
    body_metrics: 'शारीरिक माप',
    height: 'ऊंचाई',
    fitness_goal: 'मुख्य फिटनेस लक्ष्य',
    goal_muscle_gain: 'मांसपेशियां बढ़ाना (Muscle Gain)',
    goal_fat_loss: 'फैट कम करना (Fat Loss)',
    goal_endurance: 'सहनशक्ति और कार्डियो (Endurance)',
    goal_maintenance: 'फिटनेस और शक्ति बनाए रखना',
    save_changes: 'परिवर्तन सहेजें',

    // Compliance & Footer
    evidence_based_engine: 'प्रमाण-आधारित ट्रेनिंग और न्यूट्रिशन सिस्टम',
    medical_disclaimer: 'चिकित्सा अस्वीकरण (Medical Disclaimer)',
    trainer_standards: 'प्रशिक्षक मानक (Trainer Standards)',
    privacy_policy: 'गोपनीयता नीति (Privacy)',
    terms_of_use: 'उपयोग की शर्तें (Terms)',
  },
};
