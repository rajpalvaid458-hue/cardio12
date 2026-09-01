import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Google GenAI initialization with lazy loading & robust fallbacks
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Fallback plan generator in case API key is absent or network fails
function generateFallbackPlan(goal: string, daysPerWeek: number, dietPref: string, currentWeight: number) {
  const isGain = goal.includes("muscle") || goal.includes("hypertrophy") || goal.includes("strength");
  const calories = isGain ? Math.round(currentWeight * 34) : Math.round(currentWeight * 26);
  const protein = Math.round(currentWeight * 2.0);
  const fats = Math.round(currentWeight * 0.9);
  const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);

  return {
    workoutPlans: [
      {
        title: "Push Focus: Chest, Shoulders & Triceps",
        splitType: "Push",
        durationMinutes: 50,
        description: "Hypertrophy and pressing strength with progressive overload.",
        tags: ["Push", "Hypertrophy", "Strength"],
        exercises: [
          { name: "Barbell Bench Press", category: "Compound", targetMuscle: "Chest", equipment: "Barbell", formTip: "Retract scapula and arch back slightly.", restSec: 90, sets: 4, reps: 8 },
          { name: "Incline Dumbbell Press", category: "Compound", targetMuscle: "Upper Chest", equipment: "Dumbbells", formTip: "30-degree incline angle, full stretch at bottom.", restSec: 75, sets: 3, reps: 10 },
          { name: "Seated Dumbbell Shoulder Press", category: "Compound", targetMuscle: "Deltoids", equipment: "Dumbbells", formTip: "Keep core tight, press without flaring elbows excessively.", restSec: 60, sets: 3, reps: 10 },
          { name: "Cable Lateral Raises", category: "Isolation", targetMuscle: "Lateral Deltoids", equipment: "Cable", formTip: "Lead with elbows, pause 1s at top.", restSec: 60, sets: 4, reps: 15 },
          { name: "Rope Tricep Pushdown", category: "Isolation", targetMuscle: "Triceps", equipment: "Cable", formTip: "Lock elbows in place, flare rope at bottom.", restSec: 60, sets: 3, reps: 12 },
        ],
      },
      {
        title: "Pull Focus: Back, Rear Delts & Biceps",
        splitType: "Pull",
        durationMinutes: 50,
        description: "Vertical and horizontal pulling density and grip strength.",
        tags: ["Pull", "Back", "Biceps"],
        exercises: [
          { name: "Lat Pulldown / Pull-ups", category: "Compound", targetMuscle: "Lats", equipment: "Cable / Bar", formTip: "Pull down with elbows toward your hips.", restSec: 90, sets: 4, reps: 10 },
          { name: "Chest-Supported Row", category: "Compound", targetMuscle: "Mid Back", equipment: "Machine / DB", formTip: "Squeeze shoulder blades for 1 second.", restSec: 75, sets: 3, reps: 10 },
          { name: "Face Pulls", category: "Isolation", targetMuscle: "Rear Delts", equipment: "Cable", formTip: "Pull toward forehead, rotate shoulders back.", restSec: 60, sets: 3, reps: 15 },
          { name: "Incline Dumbbell Bicep Curl", category: "Isolation", targetMuscle: "Biceps", equipment: "Dumbbells", formTip: "Keep upper arms stationary, maximum stretch.", restSec: 60, sets: 3, reps: 12 },
          { name: "Hammer Curls", category: "Isolation", targetMuscle: "Brachialis & Forearms", equipment: "Dumbbells", formTip: "Neutral grip, controlled tempo.", restSec: 60, sets: 3, reps: 12 },
        ],
      },
      {
        title: "Legs & Core Power: Quads, Hamstrings & Calves",
        splitType: "Legs",
        durationMinutes: 55,
        description: "Lower body foundational strength and stability.",
        tags: ["Legs", "Quads", "Hamstrings"],
        exercises: [
          { name: "Barbell Back Squat", category: "Compound", targetMuscle: "Quads & Glutes", equipment: "Barbell", formTip: "Chest up, brace core, drive through mid-foot.", restSec: 120, sets: 4, reps: 8 },
          { name: "Romanian Deadlift (RDL)", category: "Compound", targetMuscle: "Hamstrings", equipment: "Barbell / DB", formTip: "Hinge at hips, slight knee bend, flat back.", restSec: 90, sets: 3, reps: 10 },
          { name: "Leg Press", category: "Compound", targetMuscle: "Quads", equipment: "Machine", formTip: "Do not lock knees at the top.", restSec: 75, sets: 3, reps: 12 },
          { name: "Lying Leg Curl", category: "Isolation", targetMuscle: "Hamstrings", equipment: "Machine", formTip: "Control the eccentric descent.", restSec: 60, sets: 3, reps: 12 },
          { name: "Standing Calf Raises", category: "Isolation", targetMuscle: "Calves", equipment: "Machine", formTip: "Deep stretch at bottom, 2s peak contraction.", restSec: 45, sets: 4, reps: 15 },
        ],
      },
    ],
    dietPlan: {
      dailyCalories: calories,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatsGrams: fats,
      waterMlGoal: 3500,
    },
    dailyRoutine: [
      { time: "06:30 AM", title: "Morning Hydration & Light Mobility", description: "Drink 500ml warm water with lemon/electrolytes + 5 min thoracic mobility.", category: "morning", durationMins: 15 },
      { time: "07:30 AM", title: "High Protein Breakfast", description: "Oats with whey/paneer + almonds and banana.", category: "morning", durationMins: 20 },
      { time: "04:30 PM", title: "Pre-Workout Fuel & Caffeine", description: "1 Banana + black coffee / pre-workout 30 mins before training.", category: "preworkout", durationMins: 15 },
      { time: "05:00 PM", title: "Gym Training Session", description: "Execute progressive overload lifting routine + warmup.", category: "workout", durationMins: 55 },
      { time: "06:15 PM", title: "Post-Workout Recovery Shake / Meal", description: "1 Scoop Whey / Sattu Paneer drink + 1 Apple or Dates.", category: "postworkout", durationMins: 15 },
      { time: "08:30 PM", title: "Balanced Dinner", description: "Chicken breast / Paneer tikka + dal + brown rice/roti + green salad.", category: "evening", durationMins: 30 },
      { time: "10:30 PM", title: "Sleep Recovery Protocol", description: "Screen-off 30 mins prior, 8 hours uninterrupted sleep.", category: "habit", durationMins: 480 },
    ],
  };
}

// AI Fitness & Workout Plan Generator
app.post("/api/ai/generate-plan", async (req, res) => {
  try {
    const {
      goal,
      experienceLevel,
      fitnessLevel,
      daysPerWeek,
      equipment,
      dietaryPreference,
      currentWeightKg,
    } = req.body;

    const chosenGoal = goal || "muscle_hypertrophy";
    const chosenDays = daysPerWeek || 4;
    const chosenWeight = currentWeightKg || 75;

    const ai = getAiClient();
    if (!ai) {
      const fallback = generateFallbackPlan(chosenGoal, chosenDays, dietaryPreference || "High Protein", chosenWeight);
      return res.json({ success: true, plan: fallback });
    }

    const prompt = `Generate a high-performance, structured fitness training split, diet macros, and daily routine:
- Goal: ${chosenGoal}
- Experience: ${experienceLevel || fitnessLevel || "Intermediate"}
- Days per week: ${chosenDays}
- Equipment: ${equipment || "Full Gym"}
- Dietary Preference: ${dietaryPreference || "High Protein Balanced"}
- Bodyweight: ${chosenWeight} kg

Return in exact JSON matching schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite CSCS strength coach and sports nutritionist. Create a comprehensive, science-backed workout routine split, macro targets, and daily routine. Output valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workoutPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  splitType: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        targetMuscle: { type: Type.STRING },
                        equipment: { type: Type.STRING },
                        formTip: { type: Type.STRING },
                        restSec: { type: Type.NUMBER },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.NUMBER },
                      },
                      required: ["name", "targetMuscle", "sets", "reps"],
                    },
                  },
                },
                required: ["title", "splitType", "durationMinutes", "exercises"],
              },
            },
            dietPlan: {
              type: Type.OBJECT,
              properties: {
                dailyCalories: { type: Type.NUMBER },
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatsGrams: { type: Type.NUMBER },
                waterMlGoal: { type: Type.NUMBER },
              },
              required: ["dailyCalories", "proteinGrams", "carbsGrams", "fatsGrams", "waterMlGoal"],
            },
            dailyRoutine: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  durationMins: { type: Type.NUMBER },
                },
                required: ["time", "title", "category"],
              },
            },
          },
          required: ["workoutPlans", "dietPlan", "dailyRoutine"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);
    res.json({ success: true, plan: parsedData });
  } catch (error: any) {
    console.error("Error generating plan, serving smart fallback:", error);
    const fallback = generateFallbackPlan("muscle_hypertrophy", 4, "High Protein", 75);
    res.json({ success: true, plan: fallback });
  }
});

// Intelligent Fallback Coach Responses
function getFallbackCoachReply(userMsg: string): string {
  const query = userMsg.toLowerCase();
  if (query.includes("shoulder") || query.includes("bench press")) {
    return `### How to Fix Shoulder Pain During Bench Press:

1. **Scapular Retraction**: Before unbarring, pinch your shoulder blades together and down ("put them in your back pockets").
2. **Tuck Your Elbows**: Avoid a 90° flare. Keep your elbows tucked at a **45°–75° angle** relative to your torso.
3. **Touch Point**: Lower the barbell to your **lower sternum / nipple line**, not your neck or upper collarbone.
4. **Warm-up & Substitutes**: Warm up with 3 sets of Face Pulls and Band Pull-aparts. If pain persists, switch to **Neutral Grip Dumbbell Press** or **Floor Press** for 2 weeks.`;
  }
  if (query.includes("protein") || query.includes("veg") || query.includes("diet") || query.includes("meal")) {
    return `### High-Protein Indian & International Post-Workout Nutrition:

* **Vegetarian Gold Standard**: 
  - 100g Grilled Paneer / Tofu (18g Protein) + 1 Scoop Whey/Plant Protein (25g Protein) + 1 Banana.
  - Sattu Protein Shake: 50g Roasted Chana Sattu + Water + Pinch of Black Salt + 1 Scoop Protein.
* **Non-Veg Standard**: 
  - 150g Grilled Chicken Breast / Boiled Eggs (35g Protein) + 1 cup Brown Rice / 2 Rotis + Green Salad.
* **Timing Tip**: Consume within 45–90 minutes post-training alongside 30–50g of clean carbohydrates to replenish glycogen and accelerate muscle protein synthesis!`;
  }
  if (query.includes("squat") || query.includes("plateau") || query.includes("strength")) {
    return `### Breaking Through Squat & Strength Plateaus:

1. **Pause Squats**: Add a 2-second pause at the absolute bottom (hole) with 70% of your 1RM for 3 sets of 4 reps to build explosive concentric power.
2. **Footwear & Ankle Mobility**: Ensure a solid, flat-soled shoe or elevated heel squat shoe to allow deep knee flexion without torso collapse.
3. **Core Bracing**: Practice the **Valsalva Maneuver** — deep diaphragmatic breath into your belt before initiating descent.
4. **Deload Week**: If you've pushed heavy for 5+ weeks, take a 50% volume deload week to allow central nervous system (CNS) supercompensation.`;
  }
  if (query.includes("warm") || query.includes("pre")) {
    return `### Complete 7-Minute Pre-Workout Warm-Up:

1. **General Blood Flow (2 mins)**: Incline treadmill walk or jump rope.
2. **Dynamic Mobility (3 mins)**:
   - World's Greatest Stretch (5 reps/side)
   - Arm circles & Band pull-aparts (20 reps)
   - Bodyweight deep squats with 3s hold (10 reps)
3. **Pyramid Warm-up Sets (2 mins)**:
   - Empty Barbell x 10 reps
   - 50% working weight x 5 reps
   - 75% working weight x 3 reps -> Rest 90s -> Start working set!`;
  }

  return `### Coach Pulse Training & Recovery Advice:

* **Progressive Overload**: Focus on adding 1 rep or +1.25kg to your main lifts each week.
* **Protein Target**: Aim for **1.6g – 2.0g of protein per kg of bodyweight** daily.
* **Hydration**: Drink 3.5 to 4 Liters of water daily, especially around your workout window.
* **Sleep**: Prioritize 7.5–8.5 hours of sleep to optimize natural testosterone and muscle tissue repair.

What specific exercise, muscle group, or meal plan would you like help with today?`;
}

// AI Fitness Coach & Chat Advisor
app.post("/api/ai/coach-chat", async (req, res) => {
  try {
    const { message, conversationHistory, chatHistory, userContext, userStats } = req.body;
    const userMsg = message || "";

    const ai = getAiClient();
    if (!ai) {
      const fallbackReply = getFallbackCoachReply(userMsg);
      return res.json({ success: true, reply: fallbackReply });
    }

    const historyFormatted = Array.isArray(conversationHistory)
      ? conversationHistory.map((msg: any) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.text}`).join("\n")
      : Array.isArray(chatHistory)
      ? chatHistory.map((msg: any) => `${msg.sender === "user" ? "User" : "Coach"}: ${msg.text}`).join("\n")
      : "";

    const context = userContext || userStats || {};
    const statsContext = `User context: Name: ${context.name || "Athlete"}, Goal: ${context.goal || "Fitness"}, Weight: ${context.weightKg || 70}kg, Level: ${context.experience || context.fitnessLevel || "Intermediate"}.`;

    const prompt = `${statsContext}
Previous conversation:
${historyFormatted}

User asked: "${userMsg}"

Respond with expert, encouraging, and clear fitness/training/diet/routine advice. Keep response concise, structured with clean markdown headers and bullet points, and highly actionable.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are 'PulseCoach', a world-class certified strength & conditioning specialist (CSCS) and sports nutritionist. You give science-backed, friendly, motivating, and actionable advice on workout form, workout timing, diet macros, hydration, recovery, daily routines, and progressive overload. Use clean markdown formatting.",
      },
    });

    const replyText = response.text || getFallbackCoachReply(userMsg);
    return res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error("Error in coach chat, returning fallback:", error);
    const fallbackReply = getFallbackCoachReply(req.body?.message || "");
    return res.json({ success: true, reply: fallbackReply });
  }
});

// AI Meal Macro Estimator & Calories Checker
app.post("/api/ai/estimate-meal", async (req, res) => {
  try {
    const { mealDescription } = req.body;
    if (!mealDescription) {
      return res.status(400).json({ success: false, error: "Meal description is required" });
    }

    const ai = getAiClient();
    if (!ai) {
      // Fallback estimator
      const fallbackItem = {
        foodName: mealDescription,
        hindiName: mealDescription,
        cuisine: "Universal",
        servingSize: "1 standard serving",
        calories: 320,
        proteinGrams: 22,
        carbsGrams: 35,
        fatsGrams: 9,
        fiberGrams: 5,
        healthScore: 8.5,
        dietaryTags: ["High Protein", "Balanced Fuel"],
        coachTip: "Great wholesome choice! Balance with plenty of green salad and adequate hydration.",
      };
      return res.json({ success: true, item: fallbackItem });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Accurately estimate calories and macronutrients for this food/meal input (supports English, Hindi, Hinglish, regional dishes & international items): "${mealDescription}"`,
      config: {
        systemInstruction: "You are an expert sports dietitian and Indian & International food nutrition specialist. Understand Indian household measures (katori, roti, bowl, piece, plate, glass, scoop, cup, grams) as well as international culinary portions. Provide exact calories and macros.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            hindiName: { type: Type.STRING },
            cuisine: { type: Type.STRING, enum: ["Indian", "International", "Universal"] },
            servingSize: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            proteinGrams: { type: Type.NUMBER },
            carbsGrams: { type: Type.NUMBER },
            fatsGrams: { type: Type.NUMBER },
            fiberGrams: { type: Type.NUMBER },
            healthScore: { type: Type.NUMBER, description: "1 to 10 rating" },
            dietaryTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            coachTip: { type: Type.STRING },
          },
          required: ["foodName", "calories", "proteinGrams", "carbsGrams", "fatsGrams"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, item: parsed });
  } catch (error: any) {
    console.error("Error estimating meal:", error);
    const fallbackItem = {
      foodName: req.body?.mealDescription || "Custom Meal",
      hindiName: "पौष्टिक भोजन",
      cuisine: "Universal",
      servingSize: "1 portion",
      calories: 350,
      proteinGrams: 24,
      carbsGrams: 38,
      fatsGrams: 10,
      fiberGrams: 6,
      healthScore: 8.0,
      dietaryTags: ["Clean Energy"],
      coachTip: "Solid nutrition profile for workout performance and steady energy.",
    };
    res.json({ success: true, item: fallbackItem });
  }
});

// Fallback Diet Plan Generator
function generateFallbackDiet(goal: string, targetCalories: number, weightKg: number) {
  const calories = targetCalories || 2400;
  const protein = Math.round(weightKg * 2.0);
  const fats = Math.round(weightKg * 0.9);
  const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);

  return {
    id: `diet-ai-${Date.now()}`,
    title: "Elite High-Protein Indian & International Blueprint",
    tagline: "Scientifically calibrated macronutrient distribution for peak athletic performance",
    dailyCalories: calories,
    macros: {
      proteinGrams: protein,
      carbsGrams: carbs,
      fatsGrams: fats,
    },
    waterTargetMl: 3500,
    cuisine: "Fusion",
    dietTypeLabel: "High Protein Muscle Fuel",
    keyBenefits: [
      "Optimal 2.0g/kg protein synthesis",
      "Authentic Desi vegetarian & clean non-veg options",
      "Stable blood glucose & energy levels throughout the day",
    ],
    recommendedSupplements: [
      "Whey Protein Isolate (1 scoop post-workout)",
      "Creatine Monohydrate (3-5g daily with water)",
      "Omega-3 Fish Oil / Flaxseed Oil (1000mg)",
      "Vitamin D3 + K2 (Weekly / Daily)",
    ],
    meals: [
      {
        mealType: "breakfast",
        title: "Power Muscle Oats & Eggs / Paneer",
        suggestedTime: "08:00 AM",
        prepTips: "Cook oats in milk or water, stir in whey/sattu powder after heat is off.",
        items: [
          { id: `fb-1-1`, name: "Rolled Oats with Almonds & Banana", hindiName: "ओट्स और बादाम", cuisine: "International", servingSize: "60g oats + 15g almonds", calories: 340, proteinGrams: 12, carbsGrams: 55, fatsGrams: 9, benefits: "Complex slow-release energy" },
          { id: `fb-1-2`, name: "Boiled Eggs (3 Whole + 2 Whites) / 100g Paneer", hindiName: "उबले अंडे / पनीर", cuisine: "Indian", servingSize: "100g", calories: 260, proteinGrams: 24, carbsGrams: 3, fatsGrams: 16, benefits: "Complete amino acid profile" },
        ],
      },
      {
        mealType: "lunch",
        title: "Clean Desi Athlete Thali",
        suggestedTime: "01:30 PM",
        prepTips: "Use minimal oil (1 tsp ghee), steam rice or dry roast multigrain rotis.",
        items: [
          { id: `fb-2-1`, name: "Grilled Chicken Breast / Soya Chunks Bhurji", hindiName: "सोया चंक्स / चिकन", cuisine: "Indian", servingSize: "150g", calories: 240, proteinGrams: 36, carbsGrams: 8, fatsGrams: 5, benefits: "High density lean protein" },
          { id: `fb-2-2`, name: "Thick Yellow Moong / Toor Dal", hindiName: "गाढ़ी दाल", cuisine: "Indian", servingSize: "1 large katori (150g)", calories: 150, proteinGrams: 9, carbsGrams: 22, fatsGrams: 2, benefits: "Dietary fiber & gut health" },
          { id: `fb-2-3`, name: "Multigrain Rotis / Brown Rice", hindiName: "रोटी / चावल", cuisine: "Indian", servingSize: "2 rotis (70g)", calories: 180, proteinGrams: 6, carbsGrams: 36, fatsGrams: 2, benefits: "Glycogen replenishment" },
        ],
      },
      {
        mealType: "pre_workout",
        title: "Explosive Energy Fuel",
        suggestedTime: "04:30 PM",
        prepTips: "Consume 30-45 minutes prior to training session.",
        items: [
          { id: `fb-3-1`, name: "Banana with Peanut Butter & Black Coffee", hindiName: "केला और पीनट बटर", cuisine: "Universal", servingSize: "1 medium banana + 15g PB", calories: 200, proteinGrams: 5, carbsGrams: 32, fatsGrams: 8, benefits: "Potassium, ATP pump & alertness" },
        ],
      },
      {
        mealType: "post_workout",
        title: "Rapid Muscle Synthesis Recovery",
        suggestedTime: "06:15 PM",
        prepTips: "Mix in cold water within 45 minutes of training.",
        items: [
          { id: `fb-4-1`, name: "Whey Protein / Roasted Chana Sattu Shake", hindiName: "सत्तू / व्हे प्रोटीन शेक", cuisine: "Universal", servingSize: "1 scoop (32g)", calories: 130, proteinGrams: 25, carbsGrams: 3, fatsGrams: 2, benefits: "Rapid leucine delivery to muscle fibers" },
        ],
      },
      {
        mealType: "dinner",
        title: "Lean Recovery & Evening Satiety",
        suggestedTime: "08:30 PM",
        prepTips: "Light on simple carbohydrates, rich in micronutrients and fiber.",
        items: [
          { id: `fb-5-1`, name: "Grilled Fish / Paneer Tikka with Sautéed Veggies", hindiName: "पनीर टिक्का और सब्ज़ी", cuisine: "Indian", servingSize: "150g", calories: 280, proteinGrams: 26, carbsGrams: 12, fatsGrams: 14, benefits: "Slow-digesting casein protein for overnight recovery" },
          { id: `fb-5-2`, name: "Fresh Cucumber, Tomato & Sprout Salad", hindiName: "खीरा टमाटर सलाद", cuisine: "Indian", servingSize: "1 bowl", calories: 60, proteinGrams: 3, carbsGrams: 10, fatsGrams: 0.5, benefits: "Hydration and digestive enzymes" },
        ],
      },
    ],
  };
}

// Dedicated Personal Diet Maker with Best Indian & International Foods
app.post("/api/ai/personal-diet-maker", async (req, res) => {
  try {
    const {
      goal,
      cuisinePreference,
      dietType,
      targetCalories,
      weightKg,
      targetWeightKg,
      activityLevel,
      allergiesOrDislikes,
      mealsPerDay,
    } = req.body;

    const chosenGoal = goal || "Muscle Building & Fat Loss";
    const chosenCalories = parseInt(targetCalories, 10) || 2400;
    const chosenWeight = parseFloat(weightKg) || 75;

    const ai = getAiClient();
    if (!ai) {
      const fallback = generateFallbackDiet(chosenGoal, chosenCalories, chosenWeight);
      return res.json({ success: true, dietPlan: fallback });
    }

    const prompt = `Create an elite, highly personalized daily diet plan combining authentic, delicious Indian delicacies and international healthy athlete foods:
- Goal: ${chosenGoal}
- Cuisine Preference: ${cuisinePreference || "Indian & International Fusion"}
- Dietary Type: ${dietType || "High Protein (Veg / Non-Veg)"}
- Target Daily Calories: ${chosenCalories} kcal
- User Stats: Current weight ${chosenWeight}kg, Target weight ${targetWeightKg || 80}kg, Activity: ${activityLevel || "Active"}
- Meals per day: ${mealsPerDay || 4} meals
- Specific Dislikes/Allergies/Preferences: ${allergiesOrDislikes || "None"}

Please design a comprehensive meal schedule featuring:
1. Exact meal timings (Breakfast, Lunch, Pre-Workout, Post-Workout, Dinner, Snacks)
2. Precise food items with both English and Hindi names, gram portions, calories, protein, carbs, fats
3. Practical preparation tips tailored for Indian kitchens & international meal-preppers
4. Recommended fitness supplements and timing
5. Scientifically aligned daily water target (e.g. 3000-4000ml)`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master sports nutritionist specializing in Indian fitness diets (Paneer, Soya, Dals, Sattu, Besan, Chicken Tikka, Roti, Khichdi, Makhana) and International athlete nutrition (Whey, Casein, Oats, Salmon, Chicken Breast, Eggs, Sweet Potato, Greek Yogurt, Quinoa). Generate precise, balanced nutritional plans in valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            dailyCalories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatsGrams: { type: Type.NUMBER },
              },
              required: ["proteinGrams", "carbsGrams", "fatsGrams"],
            },
            waterTargetMl: { type: Type.NUMBER },
            cuisine: { type: Type.STRING, enum: ["Indian", "International", "Fusion"] },
            dietTypeLabel: { type: Type.STRING },
            keyBenefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedSupplements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: { type: Type.STRING, enum: ["breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout"] },
                  title: { type: Type.STRING },
                  suggestedTime: { type: Type.STRING },
                  prepTips: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        hindiName: { type: Type.STRING },
                        cuisine: { type: Type.STRING, enum: ["Indian", "International", "Universal"] },
                        servingSize: { type: Type.STRING },
                        calories: { type: Type.NUMBER },
                        proteinGrams: { type: Type.NUMBER },
                        carbsGrams: { type: Type.NUMBER },
                        fatsGrams: { type: Type.NUMBER },
                        benefits: { type: Type.STRING },
                      },
                      required: ["name", "servingSize", "calories", "proteinGrams", "carbsGrams", "fatsGrams"],
                    },
                  },
                },
                required: ["mealType", "title", "suggestedTime", "items"],
              },
            },
          },
          required: ["title", "tagline", "dailyCalories", "macros", "waterTargetMl", "meals"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed.meals && Array.isArray(parsed.meals)) {
      parsed.id = `diet-ai-${Date.now()}`;
      parsed.meals.forEach((m: any, mIdx: number) => {
        if (m.items && Array.isArray(m.items)) {
          m.items.forEach((it: any, itIdx: number) => {
            it.id = `ai-item-${Date.now()}-${mIdx}-${itIdx}`;
          });
        }
      });
    }
    res.json({ success: true, dietPlan: parsed });
  } catch (error: any) {
    console.error("Error in personal-diet-maker, returning fallback:", error);
    const fallback = generateFallbackDiet(req.body?.goal || "Fitness", parseInt(req.body?.targetCalories, 10) || 2400, parseFloat(req.body?.weightKg) || 75);
    res.json({ success: true, dietPlan: fallback });
  }
});

// AI Exercise Substitution / Injury Modifier
app.post("/api/ai/substitute-exercise", async (req, res) => {
  try {
    const { exerciseName, targetMuscle, reason, availableEquipment } = req.body;
    const prompt = `Give 3 best alternative exercises for "${exerciseName}" (Target Muscle: ${targetMuscle}).
Reason for substitution: ${reason || "No specific reason"}
Available Equipment: ${availableEquipment || "Full gym equipment"}`;

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        alternatives: [
          {
            name: `Dumbbell Variation of ${exerciseName || "Exercise"}`,
            equipment: "Dumbbells",
            targetMuscle: targetMuscle || "Prime Mover",
            difficulty: "Intermediate",
            whyItWorks: "Allows natural joint freedom of motion without fixed barbell impingement.",
            formCues: "Keep core tight and maintain constant tension on target muscle.",
          },
          {
            name: `Cable / Machine Alternative for ${targetMuscle || "Muscle"}`,
            equipment: "Cables / Machine",
            targetMuscle: targetMuscle || "Target Muscle",
            difficulty: "All Levels",
            whyItWorks: "Continuous resistance curve across the full range of motion.",
            formCues: "Control the eccentric phase for 3 seconds.",
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  equipment: { type: Type.STRING },
                  targetMuscle: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  whyItWorks: { type: Type.STRING },
                  formCues: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error substituting exercise:", error);
    res.json({
      alternatives: [
        {
          name: "Dumbbell Variation",
          equipment: "Dumbbells",
          targetMuscle: req.body?.targetMuscle || "Target Muscle",
          difficulty: "Intermediate",
          whyItWorks: "Reduces joint stress and allows customized natural paths of motion.",
          formCues: "Focus on mind-muscle connection and full range of motion.",
        },
      ],
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PulseFit server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
