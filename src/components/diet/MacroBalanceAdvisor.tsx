import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FitnessGoal,
  DailyDietLog,
  LoggedMeal,
  FoodItem,
  MealType,
} from '../../types';
import { POPULAR_FOODS_DATABASE } from '../../data/fitnessPresets';
import {
  Sparkles,
  Zap,
  Flame,
  Apple,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  Target,
  ArrowRight,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  Scale,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playClickFeedback, playNotificationChime } from '../../utils/audio';

interface MacroBalanceAdvisorProps {
  dailyDiet: DailyDietLog;
  userGoal: FitnessGoal;
  onLogFoodItem?: (mealType: MealType, food: FoodItem) => void;
  onUpdateGoal?: (goal: FitnessGoal) => void;
}

interface MacroRecommendation {
  id: string;
  category: 'protein' | 'carbs' | 'fats' | 'timing' | 'balance';
  severity: 'success' | 'warning' | 'tip';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  actionItem?: string;
  actionItemHi?: string;
  recommendedFoodIds?: string[];
}

const GOAL_META: Record<
  FitnessGoal,
  {
    name: string;
    nameHi: string;
    icon: string;
    idealSplit: { proteinPct: number; carbsPct: number; fatsPct: number };
    tagline: string;
    taglineHi: string;
    proteinPerKg: string;
  }
> = {
  muscle_gain: {
    name: 'Muscle Gain & Hypertrophy',
    nameHi: 'मांसपेशी वृद्धि (मसल गेन)',
    icon: '💪',
    idealSplit: { proteinPct: 30, carbsPct: 48, fatsPct: 22 },
    tagline: 'High protein for muscle protein synthesis + energy-dense carbs for hard lifting.',
    taglineHi: 'मसल रिकवरी के लिए प्रचुर प्रोटीन + भारी ट्रेनिंग के लिए गुणवत्तापूर्ण कार्बोहाइड्रेट।',
    proteinPerKg: '1.8 - 2.2g / kg',
  },
  fat_loss: {
    name: 'Fat Loss & Shredding',
    nameHi: 'फैट लॉस व कटिंग (चर्बी घटाना)',
    icon: '🔥',
    idealSplit: { proteinPct: 38, carbsPct: 32, fatsPct: 30 },
    tagline: 'Elevated protein to spare lean mass + controlled low-GI carbs and satiety fats.',
    taglineHi: 'मांसपेशी बचाने के लिए उच्च प्रोटीन + भूख नियंत्रित रखने के लिए सीमित कार्ब्स और गुड फैट्स।',
    proteinPerKg: '2.0 - 2.4g / kg',
  },
  strength: {
    name: 'Raw Strength & Power',
    nameHi: 'ताकत और स्ट्रेंथ',
    icon: '🏋️',
    idealSplit: { proteinPct: 30, carbsPct: 45, fatsPct: 25 },
    tagline: 'Optimal protein pacing + complex carbs for central nervous system and ATP output.',
    taglineHi: 'नर्वस सिस्टम और भारी लिफ्टिंग के लिए संतुलित प्रोटीन व स्थिर ऊर्जा।',
    proteinPerKg: '1.7 - 2.0g / kg',
  },
  recomposition: {
    name: 'Body Recomposition',
    nameHi: 'बॉडी रिकम्पोजिशन (फैट कम + मसल ज्यादा)',
    icon: '⚡',
    idealSplit: { proteinPct: 35, carbsPct: 35, fatsPct: 30 },
    tagline: 'Equalized macro split with tight nutrient timing around your training sessions.',
    taglineHi: 'संतुलित मैक्रोज़ और वर्कआउट के समय सही खान-पान।',
    proteinPerKg: '2.0 - 2.2g / kg',
  },
  endurance: {
    name: 'Endurance & Stamina',
    nameHi: 'धीरज व सहनशक्ति (एन्ड्योरेंस)',
    icon: '🏃',
    idealSplit: { proteinPct: 20, carbsPct: 60, fatsPct: 20 },
    tagline: 'Carb-loaded glycogen reserves + moderate protein for continuous aerobic output.',
    taglineHi: 'ग्लाइकोजन स्टोर भरने के लिए उच्च कार्ब्स + मध्यम प्रोटीन।',
    proteinPerKg: '1.4 - 1.6g / kg',
  },
  general_health: {
    name: 'General Health & Longevity',
    nameHi: 'सामान्य स्वास्थ्य व दीर्घायु',
    icon: '🥗',
    idealSplit: { proteinPct: 25, carbsPct: 45, fatsPct: 30 },
    tagline: 'Whole-food balanced plate rich in essential amino acids, fiber, and omega fats.',
    taglineHi: 'आवश्यक अमीनो एसिड, फाइबर और ओमेगा-3 फैट्स से भरपूर संतुलित आहार।',
    proteinPerKg: '1.2 - 1.6g / kg',
  },
};

export const MacroBalanceAdvisor: React.FC<MacroBalanceAdvisorProps> = ({
  dailyDiet,
  userGoal,
  onLogFoodItem,
  onUpdateGoal,
}) => {
  const { isHindi } = useLanguage();

  // Active goal override for testing / simulation
  const [activeGoal, setActiveGoal] = useState<FitnessGoal>(userGoal || 'muscle_gain');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedQuickMeal, setSelectedQuickMeal] = useState<MealType>('dinner');
  const [justLoggedFoodId, setJustLoggedFoodId] = useState<string | null>(null);

  // Sync if external goal changes
  React.useEffect(() => {
    if (userGoal) {
      setActiveGoal(userGoal);
    }
  }, [userGoal]);

  // Aggregate current daily intake
  const totalCalories = dailyDiet.meals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = Number(dailyDiet.meals.reduce((acc, m) => acc + m.totalProtein, 0).toFixed(1));
  const totalCarbs = Number(dailyDiet.meals.reduce((acc, m) => acc + m.totalCarbs, 0).toFixed(1));
  const totalFats = Number(dailyDiet.meals.reduce((acc, m) => acc + m.totalFats, 0).toFixed(1));

  // Calories from macros (4 kcal/g for P & C, 9 kcal/g for F)
  const proteinCals = totalProtein * 4;
  const carbsCals = totalCarbs * 4;
  const fatsCals = totalFats * 9;
  const macroCalorieSum = Math.max(1, proteinCals + carbsCals + fatsCals);

  const consumedProteinPct = Math.round((proteinCals / macroCalorieSum) * 100);
  const consumedCarbsPct = Math.round((carbsCals / macroCalorieSum) * 100);
  const consumedFatsPct = Math.round((fatsCals / macroCalorieSum) * 100);

  const targetProteinGrams = dailyDiet.proteinGoalGrams || 140;
  const targetCarbsGrams = dailyDiet.carbsGoalGrams || 200;
  const targetFatsGrams = dailyDiet.fatsGoalGrams || 60;
  const targetCalories = dailyDiet.calorieGoal || 2000;

  const proteinDiff = totalProtein - targetProteinGrams;
  const carbsDiff = totalCarbs - targetCarbsGrams;
  const fatsDiff = totalFats - targetFatsGrams;
  const calsDiff = totalCalories - targetCalories;

  const currentGoalMeta = GOAL_META[activeGoal] || GOAL_META.muscle_gain;

  // Macro Balance Score Calculation (0 - 100)
  const { score, grade, gradeColor, statusText, statusTextHi } = useMemo(() => {
    if (dailyDiet.meals.length === 0 || totalCalories === 0) {
      return {
        score: 0,
        grade: 'N/A',
        gradeColor: 'text-slate-400 bg-slate-100 border-slate-300',
        statusText: 'No meals logged yet today. Log breakfast or lunch to generate real-time balance advice!',
        statusTextHi: 'आज अभी तक कोई भोजन लॉग नहीं किया गया। वास्तविक विश्लेषण के लिए भोजन जोड़ें!',
      };
    }

    let calculatedScore = 100;

    // 1. Protein adherence (Weight: 35%)
    const proteinRatio = totalProtein / Math.max(1, targetProteinGrams);
    if (proteinRatio < 0.6) {
      calculatedScore -= 25;
    } else if (proteinRatio < 0.85) {
      calculatedScore -= 12;
    } else if (proteinRatio > 1.35) {
      calculatedScore -= 5;
    }

    // 2. Fat health threshold (Weight: 20%)
    if (consumedFatsPct < 15 && totalCalories > 600) {
      calculatedScore -= 15; // Dangerously low fat
    } else if (consumedFatsPct > 45) {
      calculatedScore -= 12;
    }

    // 3. Caloric alignment (Weight: 25%)
    const calRatio = totalCalories / Math.max(1, targetCalories);
    if (activeGoal === 'fat_loss') {
      if (calRatio > 1.15) calculatedScore -= 20;
    } else if (activeGoal === 'muscle_gain') {
      if (calRatio < 0.65 && dailyDiet.meals.length >= 2) calculatedScore -= 15;
    }

    // 4. Macro ratio deviation from ideal (Weight: 20%)
    const ideal = currentGoalMeta.idealSplit;
    const proteinPctDev = Math.abs(consumedProteinPct - ideal.proteinPct);
    const carbsPctDev = Math.abs(consumedCarbsPct - ideal.carbsPct);
    const fatsPctDev = Math.abs(consumedFatsPct - ideal.fatsPct);
    const avgDev = (proteinPctDev + carbsPctDev + fatsPctDev) / 3;

    if (avgDev > 15) calculatedScore -= 15;
    else if (avgDev > 8) calculatedScore -= 8;

    calculatedScore = Math.max(15, Math.min(100, Math.round(calculatedScore)));

    if (calculatedScore >= 88) {
      return {
        score: calculatedScore,
        grade: 'A+ Optimal',
        gradeColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        statusText: 'Excellent Macro Symmetry! Your macros align closely with your physiological goal.',
        statusTextHi: 'उत्कृष्ट मैक्रो संतुलन! आपका आहार आपके फिटनेस लक्ष्य से बहुत अच्छी तरह मेल खाता है।',
      };
    } else if (calculatedScore >= 75) {
      return {
        score: calculatedScore,
        grade: 'B+ Solid',
        gradeColor: 'text-blue-700 bg-blue-100 border-blue-300',
        statusText: 'Good Pacing. A few minor macro adjustments will maximize your training response.',
        statusTextHi: 'अच्छा प्रोग्रेस। कुछ छोटे बदलाव आपके वर्कआउट परिणामों को और तेज कर देंगे।',
      };
    } else if (calculatedScore >= 55) {
      return {
        score: calculatedScore,
        grade: 'C Skewed',
        gradeColor: 'text-amber-700 bg-amber-100 border-amber-300',
        statusText: 'Macro Imbalance Detected. Follow the targeted tips below to rebalance before day end.',
        statusTextHi: 'मैक्रोज़ में असंतुलन देखा गया। दिन पूरा होने से पहले नीचे दिए गए सुझावों का पालन करें।',
      };
    } else {
      return {
        score: calculatedScore,
        grade: 'D Deficit',
        gradeColor: 'text-rose-700 bg-rose-100 border-rose-300',
        statusText: 'Critical Macro Deviation. Key macronutrients are significantly under or over target.',
        statusTextHi: 'गंभीर मैक्रो अंतर। मुख्य पोषक तत्व आपके लक्ष्य से काफी कम या ज्यादा हैं।',
      };
    }
  }, [
    dailyDiet.meals,
    totalCalories,
    totalProtein,
    targetProteinGrams,
    consumedFatsPct,
    activeGoal,
    targetCalories,
    consumedProteinPct,
    consumedCarbsPct,
    currentGoalMeta.idealSplit,
  ]);

  // Generate Personalized Tips
  const recommendations: MacroRecommendation[] = useMemo(() => {
    const list: MacroRecommendation[] = [];

    if (dailyDiet.meals.length === 0) {
      list.push({
        id: 'start-logging',
        category: 'balance',
        severity: 'tip',
        title: 'Start by Logging Your Morning Meal',
        titleHi: 'सुबह का नाश्ता या पहला भोजन जोड़कर शुरुआत करें',
        description: `For ${currentGoalMeta.name}, kicking off the day with 25-35g of bioavailable protein anchors muscle protein synthesis and minimizes cortisol spikes.`,
        descriptionHi: `${currentGoalMeta.nameHi} के लिए दिन की शुरुआत 25-35 ग्राम प्रोटीन से करें ताकि दिनभर ऊर्जा और मांसपेशियों का विकास बना रहे।`,
        actionItem: 'Log eggs, oats with whey, sprouts, or paneer.',
        actionItemHi: 'अंडे, व्हे प्रोटीन के साथ ओट्स, अंकुरित अनाज या पनीर लॉग करें।',
        recommendedFoodIds: ['boiled-egg-whole', 'rolled-oats-raw', 'whey-protein-isolate', 'sprouted-moong'],
      });
      return list;
    }

    // 1. Protein Specific Tips
    if (proteinDiff < -25) {
      const missing = Math.abs(Math.round(proteinDiff));
      list.push({
        id: 'protein-shortfall',
        category: 'protein',
        severity: 'warning',
        title: `Protein Deficit: Short by ${missing}g for ${currentGoalMeta.name}`,
        titleHi: `प्रोटीन की कमी: लक्ष्य से ${missing} ग्राम पीछे हैं`,
        description:
          activeGoal === 'fat_loss'
            ? `During fat loss, inadequate protein increases the risk of burning lean muscle instead of fat. You need ~${missing}g more today to preserve resting metabolic rate (BMR).`
            : `To maximize myofibrillar hypertrophy, muscle tissue needs continuous amino acid saturation. You are ${missing}g below your hypertrophy threshold.`,
        descriptionHi:
          activeGoal === 'fat_loss'
            ? `फैट लॉस में प्रोटीन कम होने पर शरीर चर्बी की जगह मांसपेशियां घटाने लगता है। मेटाबॉलिज्म बनाए रखने के लिए ${missing} ग्राम प्रोटीन और लें।`
            : `मांसपेशियों के विकास के लिए आपको आज लगभग ${missing} ग्राम और प्रोटीन की आवश्यकता है।`,
        actionItem: `Add 1 scoop of whey (24g) or 150g paneer/chicken breast to your remaining meals.`,
        actionItemHi: 'अपने अगले भोजन में 1 स्कूप व्हे प्रोटीन (24g) या 150g पनीर/चिकन जोड़ें।',
        recommendedFoodIds: ['whey-protein-isolate', 'chicken-breast-raw', 'paneer-lowfat', 'soya-chunks-raw', 'greek-yogurt-plain'],
      });
    } else if (proteinDiff >= 0 && totalProtein >= targetProteinGrams) {
      list.push({
        id: 'protein-hit',
        category: 'protein',
        severity: 'success',
        title: `Protein Target Locked (${totalProtein}g / ${targetProteinGrams}g)`,
        titleHi: `प्रोटीन लक्ष्य पूरा हुआ (${totalProtein}g / ${targetProteinGrams}g)`,
        description: `Great job! You have satisfied your amino acid requirement for ${currentGoalMeta.name}. Extra fluid intake (+400-500ml) helps kidneys process urea safely.`,
        descriptionHi: `शानदार! आपने अपना प्रोटीन लक्ष्य हासिल कर लिया है। अतिरिक्त पानी (400-500ml) पिएं।`,
      });
    }

    // 2. Fat & Hormone Tips
    if (consumedFatsPct < 18 && totalCalories > 700) {
      list.push({
        id: 'fats-too-low',
        category: 'fats',
        severity: 'warning',
        title: 'Dietary Fat Too Low (<18% of Total Calories)',
        titleHi: 'डाइट में फैट्स बहुत कम हैं (कुल कैलोरी का <18%)',
        description:
          'Dietary fats under 20% suppress endogenous testosterone production, impede fat-soluble vitamin (A, D, E, K) uptake, and cause joint dryness during heavy lifting.',
        descriptionHi:
          'फैट्स 20% से कम रहने पर टेस्टोस्टेरोन और हार्मोन उत्पादन घट सकता है तथा जोड़ों में सूखापन आ सकता है। स्वस्थ वसा शामिल करें।',
        actionItem: 'Add 12-15 almonds/walnuts, 1 tbsp peanut butter, or 1 tsp desi cow ghee.',
        actionItemHi: '12-15 बादाम/अखरोट, 1 चम्मच पीनट बटर या 1 चम्मच शुद्ध देसी घी शामिल करें।',
        recommendedFoodIds: ['almonds-raw', 'peanut-butter-natural', 'walnuts-raw', 'desi-cow-ghee'],
      });
    } else if (consumedFatsPct > 40 && activeGoal === 'fat_loss') {
      list.push({
        id: 'fats-too-high-fatloss',
        category: 'fats',
        severity: 'warning',
        title: 'Fat Intake Exceeding 40% on a Fat Loss Goal',
        titleHi: 'फैट लॉस लक्ष्य पर वसा (फैट्स) 40% से अधिक',
        description:
          'At 9 calories per gram, dietary fat easily causes caloric surplus without triggering high gastric satiety stretch. Shift upcoming snacks toward lean protein or water-dense veggies.',
        descriptionHi:
          '1 ग्राम फैट में 9 कैलोरी होती हैं, जिससे वजन घटाना धीमा पड़ सकता है। अगले भोजन में तले-भुने खाने की जगह उबली सब्जियां व लीन प्रोटीन चुनें।',
        actionItem: 'Swap full-cream dairy with low-fat versions; moderate cooking oils.',
        actionItemHi: 'फुल-क्रीम दूध/पनीर की जगह लो-फैट विकल्प चुनें और तेल कम रखें।',
      });
    }

    // 3. Carbohydrate & Glycogen Optimization Tips
    if (activeGoal === 'fat_loss' && consumedCarbsPct > 48) {
      list.push({
        id: 'carbs-elevated-cut',
        category: 'carbs',
        severity: 'tip',
        title: 'High Carbohydrate Share for Fat Loss Mode',
        titleHi: 'फैट लॉस मोड के लिए कार्ब्स का अनुपात अधिक है',
        description:
          'Carbohydrates currently account for over 48% of your intake. To optimize lipolysis (fat burning) while sedentary, prioritize complex fiber and push remaining carbs around your workout.',
        descriptionHi:
          'फैट बर्निंग तेज करने के लिए सादे चीनी या मैदे वाले कार्ब्स घटाएं और जटिल फाइबर (दलिया, ओट्स, सलाद) चुनें।',
        actionItem: 'Replace refined grains with crunchy salads or clear dal soups tonight.',
        actionItemHi: 'शाम के भोजन में रोटी/चावल की मात्रा हल्की रखकर हरी सब्जियां व दाल बढ़ाएं।',
      });
    } else if ((activeGoal === 'muscle_gain' || activeGoal === 'strength') && carbsDiff < -40) {
      list.push({
        id: 'carbs-fuel-hypertrophy',
        category: 'carbs',
        severity: 'tip',
        title: 'Carbohydrate Fuel Needed for Lifting Intensity',
        titleHi: 'भारी लिफ्टिंग और ताकत के लिए कार्ब्स की आवश्यकता',
        description:
          'Intense weight training rapidly depletes intracellular muscle glycogen. Consuming healthy carbs today will spare your protein from being converted to fuel (gluconeogenesis).',
        descriptionHi:
          'वर्कआउट में ऊर्जा बनाए रखने और प्रोटीन को मसल रिपेयर के लिए सुरक्षित रखने हेतु जटिल कार्ब्स लें।',
        actionItem: 'Add a medium sweet potato, bowl of brown rice, or a banana before training.',
        actionItemHi: 'वर्कआउट से पहले एक केला, उबला शकरकंद या ब्राउन राइस शामिल करें।',
        recommendedFoodIds: ['sweet-potato-boiled', 'banana-ripe', 'brown-rice-cooked', 'chana-roasted-black'],
      });
    }

    // 4. Protein Distribution Across Meals (Meal Pacing Check)
    const mealProteinAmounts = dailyDiet.meals.map((m) => m.totalProtein);
    const maxProteinInOneMeal = Math.max(0, ...mealProteinAmounts);
    if (dailyDiet.meals.length >= 2 && maxProteinInOneMeal > 0.6 * totalProtein && totalProtein > 50) {
      list.push({
        id: 'protein-distribution',
        category: 'timing',
        severity: 'tip',
        title: 'Protein Backloading: Distribute Across Feedings',
        titleHi: 'प्रोटीन का वितरण: भोजन को दिनभर में बांटें',
        description:
          'Over 60% of your daily protein was consumed in a single meal. Skeletal muscle protein synthesis (MPS) is triggered multiple times when 25-40g protein is spaced 3-4 hours apart.',
        descriptionHi:
          'एक ही समय में बहुत अधिक प्रोटीन लेने के बजाय, इसे दिन के 3-4 भोजन में 25-35 ग्राम करके बांटें।',
        actionItem: 'Aim for 25-35g in breakfast, lunch, and dinner rather than a single giant feeding.',
        actionItemHi: 'नाश्ते, दोपहर और रात के खाने में बराबर प्रोटीन बांटने की कोशिश करें।',
      });
    }

    // 5. General Overall Balance
    if (list.length === 0) {
      list.push({
        id: 'ideal-harmony',
        category: 'balance',
        severity: 'success',
        title: `Macro Ratios Harmonized for ${currentGoalMeta.name}`,
        titleHi: `आपके मैक्रोज़ ${currentGoalMeta.nameHi} के बिल्कुल अनुकूल हैं`,
        description: `Your protein, carb, and fat partition is tracking tightly within the ideal physiological distribution. Maintain this nutritional consistency to accelerate results.`,
        descriptionHi: `आपका प्रोटीन, कार्ब और फैट विभाजन आदर्श स्तर पर है। इसी अनुशासन को बनाए रखें।`,
      });
    }

    return list;
  }, [
    dailyDiet.meals,
    totalProtein,
    targetProteinGrams,
    proteinDiff,
    activeGoal,
    currentGoalMeta,
    consumedFatsPct,
    totalCalories,
    consumedCarbsPct,
    carbsDiff,
  ]);

  // Extract recommended food items from database based on current tips
  const suggestedFoodItems: FoodItem[] = useMemo(() => {
    const idsToInclude = new Set<string>();
    recommendations.forEach((r) => {
      r.recommendedFoodIds?.forEach((id) => idsToInclude.add(id));
    });

    // If no specific recommendations, supply high-quality macro gap fillers
    if (idsToInclude.size === 0) {
      if (proteinDiff < 0) {
        ['whey-protein-isolate', 'paneer-lowfat', 'boiled-egg-whole', 'soya-chunks-raw'].forEach((id) =>
          idsToInclude.add(id)
        );
      } else if (fatsDiff < 0) {
        ['almonds-raw', 'peanut-butter-natural', 'walnuts-raw'].forEach((id) => idsToInclude.add(id));
      } else {
        ['sprouted-moong', 'rolled-oats-raw', 'greek-yogurt-plain'].forEach((id) => idsToInclude.add(id));
      }
    }

    return POPULAR_FOODS_DATABASE.filter((f) => idsToInclude.has(f.id)).slice(0, 4);
  }, [recommendations, proteinDiff, fatsDiff]);

  const handleQuickLog = (food: FoodItem) => {
    playClickFeedback();
    if (onLogFoodItem) {
      onLogFoodItem(selectedQuickMeal, food);
      playNotificationChime();
      setJustLoggedFoodId(food.id);
      setTimeout(() => setJustLoggedFoodId(null), 2500);
    }
  };

  return (
    <div
      id="macro-balance-advisor"
      className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all"
    >
      {/* Top Interactive Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {isHindi ? 'मैक्रोन्यूट्रिएंट बैलेंस सलाहकार' : 'AI Macro Balance Advisor'}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${gradeColor}`}>
                <Award className="w-3.5 h-3.5" />
                {grade} ({score}/100)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 pt-1">
              <span>{isHindi ? 'दैनिक मैक्रो विश्लेषण व वैयक्तिकृत सुझाव' : 'Logged Meals Macro Analysis & Daily Tips'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {isHindi ? statusTextHi : statusText}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={() => {
                playClickFeedback();
                setIsExpanded((prev) => !prev);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isExpanded ? (isHindi ? 'कम देखें' : 'Collapse') : (isHindi ? 'विस्तार से देखें' : 'View Full Details')}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Goal Selector Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isHindi ? 'लक्ष्य अनुसार विश्लेषण:' : 'Target Goal Optimization:'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {(Object.keys(GOAL_META) as FitnessGoal[]).map((g) => {
              const meta = GOAL_META[g];
              const isSelected = activeGoal === g;

              return (
                <button
                  key={g}
                  onClick={() => {
                    playClickFeedback();
                    setActiveGoal(g);
                    if (onUpdateGoal) onUpdateGoal(g);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{isHindi ? meta.nameHi : meta.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 sm:p-6 space-y-6"
          >
            {/* Macro Ratio Split Comparison (Consumed vs Ideal Target) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Consumed Ratio Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      {isHindi ? 'आपका आज का मैक्रो विभाजन' : 'Today’s Consumed Calorie Split'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {totalCalories} kcal ({totalProtein}g P • {totalCarbs}g C • {totalFats}g F)
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {dailyDiet.meals.length} {isHindi ? 'भोजन' : 'meals'}
                  </span>
                </div>

                {/* Stacked Percentage Bar */}
                <div className="space-y-1.5">
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{ width: `${consumedProteinPct}%` }}
                      title={`Protein: ${consumedProteinPct}%`}
                    />
                    <div
                      className="bg-blue-600 h-full transition-all duration-500"
                      style={{ width: `${consumedCarbsPct}%` }}
                      title={`Carbs: ${consumedCarbsPct}%`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${consumedFatsPct}%` }}
                      title={`Fats: ${consumedFatsPct}%`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-1">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> {isHindi ? 'प्रोटीन' : 'Protein'}: {consumedProteinPct}%
                    </span>
                    <span className="text-blue-700 flex items-center gap-1">
                      <Apple className="w-3.5 h-3.5" /> {isHindi ? 'कार्ब्स' : 'Carbs'}: {consumedCarbsPct}%
                    </span>
                    <span className="text-rose-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> {isHindi ? 'फैट्स' : 'Fats'}: {consumedFatsPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Ideal Target Ratio Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                      {isHindi ? 'लक्ष्य के लिए अनुशंसित आदर्श विभाजन' : 'Recommended Split for Your Goal'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{currentGoalMeta.icon}</span>
                      <span>{isHindi ? currentGoalMeta.nameHi : currentGoalMeta.name}</span>
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                    {currentGoalMeta.proteinPerKg}
                  </span>
                </div>

                {/* Target Stacked Bar */}
                <div className="space-y-1.5">
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${currentGoalMeta.idealSplit.proteinPct}%` }}
                    />
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${currentGoalMeta.idealSplit.carbsPct}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${currentGoalMeta.idealSplit.fatsPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-1">
                    <span className="text-emerald-700">
                      {currentGoalMeta.idealSplit.proteinPct}% {isHindi ? 'प्रोटीन' : 'Protein'}
                    </span>
                    <span className="text-blue-700">
                      {currentGoalMeta.idealSplit.carbsPct}% {isHindi ? 'कार्ब्स' : 'Carbs'}
                    </span>
                    <span className="text-rose-600">
                      {currentGoalMeta.idealSplit.fatsPct}% {isHindi ? 'फैट्स' : 'Fats'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Personalized Tips List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? 'आज के लिए वैयक्तिकृत पोषण सुधार' : 'Personalized Macro Balance Recommendations'}</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {recommendations.length} {isHindi ? 'सुझाव सक्रिय' : 'active insights'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.map((rec) => {
                  const isSuccess = rec.severity === 'success';
                  const isWarning = rec.severity === 'warning';

                  return (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        isSuccess
                          ? 'bg-emerald-50/60 border-emerald-200/90'
                          : isWarning
                          ? 'bg-amber-50/60 border-amber-200/90'
                          : 'bg-slate-50/80 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-700'
                              : isWarning
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Info className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4
                            className={`text-sm font-bold ${
                              isSuccess
                                ? 'text-emerald-950'
                                : isWarning
                                ? 'text-amber-950'
                                : 'text-slate-900'
                            }`}
                          >
                            {isHindi ? rec.titleHi : rec.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {isHindi ? rec.descriptionHi : rec.description}
                          </p>

                          {rec.actionItem && (
                            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-center gap-2 mt-2 shadow-2xs">
                              <span className="text-emerald-600 font-bold">👉</span>
                              <span>{isHindi ? rec.actionItemHi || rec.actionItem : rec.actionItem}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* One-Tap Macro Balancers (Quick Food Suggestions to Close Gaps) */}
            {suggestedFoodItems.length > 0 && onLogFoodItem && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-sm border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {isHindi ? 'मैक्रो गैप-फिलर्स' : 'Instant Macro Gap Fillers'}
                    </div>
                    <h4 className="text-sm font-extrabold text-white">
                      {isHindi
                        ? 'आज के मैक्रो अंतर को तुरंत संतुलित करने वाले खाद्य पदार्थ'
                        : 'Recommended Foods to Rebalance Your Missing Macros'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {isHindi ? 'लॉग करें:' : 'Add to:'}
                    </span>
                    <select
                      value={selectedQuickMeal}
                      onChange={(e) => setSelectedQuickMeal(e.target.value as MealType)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="dinner">{isHindi ? 'डिनर' : 'Dinner'}</option>
                      <option value="lunch">{isHindi ? 'लंच' : 'Lunch'}</option>
                      <option value="snack">{isHindi ? 'स्नैक' : 'Snack'}</option>
                      <option value="post_workout">{isHindi ? 'पोस्ट-वर्कआउट' : 'Post-Workout'}</option>
                      <option value="pre_workout">{isHindi ? 'प्री-वर्कआउट' : 'Pre-Workout'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {suggestedFoodItems.map((food) => {
                    const isJustAdded = justLoggedFoodId === food.id;

                    return (
                      <div
                        key={food.id}
                        className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/90 flex flex-col justify-between gap-3 hover:border-slate-600 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-white line-clamp-1">
                              {isHindi && food.hindiName ? food.hindiName : food.name}
                            </span>
                            <span className="text-[10px] font-mono text-amber-300 font-bold shrink-0">
                              {food.calories} kcal
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {food.servingSize}
                          </span>

                          <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold">
                            <span className="text-emerald-400">{food.proteinGrams}g P</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-blue-400">{food.carbsGrams}g C</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-rose-400">{food.fatsGrams}g F</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickLog(food)}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-500 text-slate-950 font-black'
                              : 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white border border-slate-600'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-slate-950" />
                              <span>{isHindi ? 'लॉग हो गया!' : 'Added!'}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'जोड़ें' : 'Quick Log'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
