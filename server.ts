import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Server-side Google GenAI initialization with lazy loading & robust fallbacks
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient Gemini API caller with automatic retry on 503/429 and failover to alternative models
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
    fallbackModels?: string[];
    timeoutMs?: number;
  }
) {
  const modelsToTry = [
    params.primaryModel || "gemini-3.1-flash-lite",
    ...(params.fallbackModels || ["gemini-3.8-flash", "gemini-flash-latest"]),
  ];

  const timeoutMs = params.timeoutMs || 9000;
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${modelName} timed out after ${timeoutMs}ms`)), timeoutMs)
        );

        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });

        const response: any = await Promise.race([apiCall, timeoutPromise]);
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err || "");
        const isTransient =
          err?.status === "UNAVAILABLE" ||
          err?.status === 503 ||
          errStr.includes("503") ||
          errStr.includes("high demand") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("timed out") ||
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("429");

        if (isTransient && attempt === 0) {
          // Wait 500ms before retrying once
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        console.warn(`Model ${modelName} attempt ${attempt + 1} unavailable:`, err?.message || errStr);
        break; // try next fallback model
      }
    }
  }

  throw lastError;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Fallback plan generator in case API key is absent or network fails
function generateFallbackPlan(goal: string, daysPerWeek: number, dietPref: string, currentWeight: number, gender: string = 'all', experienceLevel: string = 'intermediate') {
  const isGain = goal.includes("muscle") || goal.includes("hypertrophy") || goal.includes("strength");
  const calories = isGain ? Math.round(currentWeight * 34) : Math.round(currentWeight * 26);
  const protein = Math.round(currentWeight * 2.0);
  const fats = Math.round(currentWeight * 0.9);
  const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);

  if (gender === 'female') {
    return {
      workoutPlans: [
        {
          title: "Female Glute Hypertrophy & Waist Sculpt",
          splitType: "Glutes & Lower Body",
          durationMinutes: 50,
          description: "Hypertrophy for upper glute shelf, hip stability, and a tight sculpted waist.",
          tags: ["Female Focus", "Glute Growth", "Sculpt"],
          exercises: [
            { name: "Barbell Hip Thrust", category: "Compound", targetMuscle: "Gluteus Maximus", equipment: "Barbell", formTip: "Hold 2-second squeeze at apex, chin tucked.", restSec: 90, sets: 4, reps: 10 },
            { name: "Bulgarian Split Squat", category: "Compound", targetMuscle: "Glutes & Quads", equipment: "Dumbbells", formTip: "Lean torso 20-degrees forward to bias glutes.", restSec: 75, sets: 3, reps: 10 },
            { name: "Romanian Deadlift (RDL)", category: "Compound", targetMuscle: "Hamstrings & Glute Tie-in", equipment: "Barbell / DB", formTip: "Hinge hips back, feel intense hamstring stretch.", restSec: 75, sets: 3, reps: 10 },
            { name: "Cable Glute Kickbacks", category: "Isolation", targetMuscle: "Glute Medius & Shelf", equipment: "Cable", formTip: "Kick diagonally back at 45 degrees.", restSec: 45, sets: 3, reps: 15 },
            { name: "Plank with Pelvic Tilt", category: "Core", targetMuscle: "Transverse Abdominis", equipment: "Bodyweight", formTip: "Pull navel into spine to tighten waistline.", restSec: 45, sets: 3, reps: 45 },
          ],
        },
        {
          title: "Female Upper Body Posture & Tone",
          splitType: "Upper Body & Posture",
          durationMinutes: 45,
          description: "Back contouring, sculpted shoulders, and posture alignment.",
          tags: ["Female Focus", "Upper Tone", "Posture"],
          exercises: [
            { name: "Lat Pulldown (Wide Grip)", category: "Compound", targetMuscle: "Lats & Back Contour", equipment: "Cable", formTip: "Pull shoulder blades down and back.", restSec: 60, sets: 3, reps: 12 },
            { name: "Incline Dumbbell Press", category: "Compound", targetMuscle: "Upper Chest & Shoulders", equipment: "Dumbbells", formTip: "Controlled smooth pressing motion.", restSec: 60, sets: 3, reps: 10 },
            { name: "Dumbbell Lateral Raises", category: "Isolation", targetMuscle: "Lateral Delts", equipment: "Dumbbells", formTip: "Light weight, feel cap of shoulder burn.", restSec: 45, sets: 3, reps: 15 },
            { name: "Tricep Rope Pushdowns", category: "Isolation", targetMuscle: "Triceps Arm Tightening", equipment: "Cable", formTip: "Flare rope at lockout.", restSec: 45, sets: 3, reps: 12 },
          ],
        },
      ],
      dietPlan: {
        dailyCalories: calories,
        proteinGrams: protein,
        carbsGrams: carbs,
        fatsGrams: fats,
        waterMlGoal: 3000,
      },
      dailyRoutine: [
        { time: "07:00 AM", title: "Morning Lemon Water & Glute Activation", description: "500ml water + 5 min glute bridge activations.", category: "morning", durationMins: 15 },
        { time: "08:00 AM", title: "High Protein Sculpt Breakfast", description: "Egg whites/paneer scramble + avocado toast.", category: "morning", durationMins: 20 },
        { time: "05:00 PM", title: "Female Strength & Glute Session", description: "Execute progressive overload lifting with focus on mind-muscle connection.", category: "workout", durationMins: 50 },
        { time: "06:30 PM", title: "Post-Workout Protein & Collagen", description: "Whey / Plant protein shake + handful of berries.", category: "postworkout", durationMins: 15 },
        { time: "10:30 PM", title: "Deep Rest & Recovery", description: "8 hours sleep for optimal muscle remodeling and hormones.", category: "habit", durationMins: 480 },
      ],
    };
  }

  if (experienceLevel === 'beginner') {
    return {
      workoutPlans: [
        {
          title: "Beginner 3-Day Full Body Foundation (शुरुआती)",
          splitType: "Full Body Foundation",
          durationMinutes: 40,
          description: "Low-injury, machine and dumbbell-based foundational routine for building neural coordination and joint integrity.",
          tags: ["Beginner", "Full Body", "Foundation", "Habit Building"],
          exercises: [
            { name: "Goblet Squat (Dumbbell)", category: "Compound", targetMuscle: "Quadriceps & Core", equipment: "Dumbbell", formTip: "Hold DB at chest, sit back onto imaginary chair.", restSec: 60, sets: 3, reps: 10 },
            { name: "Dumbbell Flat Bench Press", category: "Compound", targetMuscle: "Chest & Shoulders", equipment: "Dumbbells", formTip: "Plant feet firmly, lower dumbbells with control.", restSec: 60, sets: 3, reps: 10 },
            { name: "Lat Pulldown (Machine)", category: "Compound", targetMuscle: "Lats & Upper Back", equipment: "Cable / Machine", formTip: "Pull bar to chin height, squeeze shoulder blades.", restSec: 60, sets: 3, reps: 10 },
            { name: "Seated Cable Row", category: "Compound", targetMuscle: "Mid Back & Posture", equipment: "Cable", formTip: "Keep spine tall, pull towards belly button.", restSec: 60, sets: 3, reps: 10 },
            { name: "Dumbbell Bicep Curl", category: "Isolation", targetMuscle: "Biceps", equipment: "Dumbbells", formTip: "Stand tall without swinging hips.", restSec: 45, sets: 2, reps: 12 },
            { name: "Plank Hold", category: "Core", targetMuscle: "Core & Abs", equipment: "Bodyweight", formTip: "Hold straight line from head to heels.", restSec: 45, sets: 3, reps: 30 },
          ],
        },
      ],
      dietPlan: {
        dailyCalories: Math.round(currentWeight * 28),
        proteinGrams: Math.round(currentWeight * 1.6),
        carbsGrams: Math.round((Math.round(currentWeight * 28) - (Math.round(currentWeight * 1.6) * 4 + Math.round(currentWeight * 0.8) * 9)) / 4),
        fatsGrams: Math.round(currentWeight * 0.8),
        waterMlGoal: 3000,
      },
      dailyRoutine: [
        { time: "07:30 AM", title: "Gentle Morning Sunlight & Hydration", description: "Drink 2 glasses of warm water + 10 mins morning sun.", category: "morning", durationMins: 15 },
        { time: "08:30 AM", title: "Easy Balanced Breakfast", description: "Oats / Besan Chilla with curd or eggs.", category: "morning", durationMins: 20 },
        { time: "05:30 PM", title: "Beginner Workout Session", description: "Focus purely on clean form, 2-3 sets per movement.", category: "workout", durationMins: 40 },
        { time: "10:00 PM", title: "Restful Night Sleep", description: "Consistent sleep schedule to build steady fitness habits.", category: "habit", durationMins: 480 },
      ],
    };
  }

  if (experienceLevel === 'athlete') {
    return {
      workoutPlans: [
        {
          title: "Pro Athlete 1RM Strength & Powerlifting Peak",
          splitType: "Powerlifting & Heavy Compound",
          durationMinutes: 65,
          description: "High-intensity CNS loading on heavy squats, paused bench, and conventional deadlifts at RPE 8.5-9.5.",
          tags: ["Athlete", "Strength Peak", "Powerlifting", "1RM"],
          exercises: [
            { name: "Heavy Barbell Squats (1RM Peak)", category: "Compound", targetMuscle: "Max Lower Body Force", equipment: "Barbell", formTip: "Full brace, explode out of hole.", restSec: 180, sets: 5, reps: 3 },
            { name: "Paused Flat Barbell Bench Press", category: "Compound", targetMuscle: "Max Upper Pressing Force", equipment: "Barbell", formTip: "1s dead stop on sternum, violent leg drive.", restSec: 150, sets: 4, reps: 3 },
            { name: "Conventional Barbell Deadlift", category: "Compound", targetMuscle: "Posterior Chain Power", equipment: "Barbell", formTip: "Pack lats, push floor away.", restSec: 180, sets: 4, reps: 2 },
          ],
        },
        {
          title: "CrossFit WOD & High-Threshold Conditioning",
          splitType: "CrossFit & Functional Power",
          durationMinutes: 45,
          description: "Explosive thrusters, box jumps, pull-ups, and rowing sprint intervals.",
          tags: ["Athlete", "CrossFit", "VO2 Max", "Explosive"],
          exercises: [
            { name: "Dumbbell Thrusters", category: "CrossFit", targetMuscle: "Full Body Explosiveness", equipment: "Dumbbells", formTip: "Deep squat fluidly into overhead lock.", restSec: 45, sets: 4, reps: 15 },
            { name: "Plyometric Box Jumps", category: "CrossFit", targetMuscle: "Fast-Twitch Leg Spring", equipment: "Plyo Box", formTip: "Soft landing, aggressive triple extension.", restSec: 45, sets: 3, reps: 10 },
            { name: "Rowing Machine 500m Sprint", category: "Cardio", targetMuscle: "VO2 Max & Lactic Capacity", equipment: "Rower", formTip: "Hold sub 1:38/500m split pace.", restSec: 60, sets: 3, reps: 500 },
          ],
        },
      ],
      dietPlan: {
        dailyCalories: Math.round(currentWeight * 38),
        proteinGrams: Math.round(currentWeight * 2.2),
        carbsGrams: Math.round((Math.round(currentWeight * 38) - (Math.round(currentWeight * 2.2) * 4 + Math.round(currentWeight * 1.0) * 9)) / 4),
        fatsGrams: Math.round(currentWeight * 1.0),
        waterMlGoal: 4500,
      },
      dailyRoutine: [
        { time: "06:00 AM", title: "Athlete Hydration & Joint Flossing", description: "1 Liter water + pink Himalayan salt + dynamic flossing.", category: "morning", durationMins: 20 },
        { time: "07:30 AM", title: "Performance Fuel Breakfast", description: "Oats with berries, honey, whey + 4 whole eggs.", category: "morning", durationMins: 30 },
        { time: "04:30 PM", title: "Elite Strength & Conditioning Session", description: "Heavy compound lifting followed by high-threshold anaerobic intervals.", category: "workout", durationMins: 65 },
        { time: "06:00 PM", title: "Rapid Glycogen & Protein Replenishment", description: "Fast digesting carbs (dextrose/rice cakes) + 40g Whey Isolate.", category: "postworkout", durationMins: 15 },
        { time: "10:00 PM", title: "Athletic Recovery Sleep", description: "9 hours sleep with cold room temp (<19°C) for growth hormone release.", category: "habit", durationMins: 540 },
      ],
    };
  }

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
      gender,
      targetGender,
      daysPerWeek,
      equipment,
      dietaryPreference,
      currentWeightKg,
    } = req.body;

    const chosenGoal = goal || "muscle_hypertrophy";
    const chosenDays = daysPerWeek || 4;
    const chosenWeight = currentWeightKg || 75;
    const chosenGender = gender || targetGender || "all";
    const chosenLevel = experienceLevel || fitnessLevel || "intermediate";

    const ai = getAiClient();
    if (!ai) {
      const fallback = generateFallbackPlan(chosenGoal, chosenDays, dietaryPreference || "High Protein", chosenWeight, chosenGender, chosenLevel);
      return res.json({ success: true, plan: fallback });
    }

    const prompt = `Generate a high-performance, structured fitness training split, diet macros, and daily routine tailored specifically:
- Goal: ${chosenGoal}
- Experience Level: ${chosenLevel} (beginner = foundation safe movements; intermediate = hypertrophy volume; athlete = heavy compound 1RM peak & explosive conditioning)
- Gender Focus: ${chosenGender} ${chosenGender === 'female' ? '(emphasize glute hypertrophy, waist tightening, posture alignment and hip stability)' : ''}
- Days per week: ${chosenDays}
- Equipment: ${equipment || "Full Gym"}
- Dietary Preference: ${dietaryPreference || "High Protein Balanced"}
- Bodyweight: ${chosenWeight} kg

Return in exact JSON matching schema.`;

    const response = await callGeminiWithFallback(ai, {
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
    console.warn("Notice: Plan generation using local fallback:", error?.message || error);
    const fallback = generateFallbackPlan("muscle_hypertrophy", 4, "High Protein", 75);
    res.json({ success: true, plan: fallback });
  }
});

// Intelligent Fallback Coach Responses
function getFallbackCoachReply(userMsg: string): string {
  const query = userMsg.toLowerCase();
  if (query.includes("shoulder") || query.includes("bench press") || query.includes("bench")) {
    return `### How to Fix Shoulder Pain & Optimize Bench Press:

1. **Scapular Retraction**: Before unbarring, pinch your shoulder blades together and down ("put them in your back pockets").
2. **Tuck Your Elbows**: Avoid a 90° flare. Keep your elbows tucked at a **45°–75° angle** relative to your torso.
3. **Touch Point**: Lower the barbell to your **lower sternum / nipple line**, not your neck or upper collarbone.
4. **Warm-up & Substitutes**: Warm up with 3 sets of Face Pulls and Band Pull-aparts. If pain persists, switch to **Neutral Grip Dumbbell Press** or **Floor Press** for 2 weeks.`;
  }
  if (query.includes("protein") || query.includes("veg") || query.includes("diet") || query.includes("meal") || query.includes("food")) {
    return `### High-Protein Post-Workout Nutrition & Meal Planning:

* **Vegetarian Gold Standard**: 
  - 100g Grilled Paneer / Tofu (18g Protein) + 1 Scoop Whey/Plant Protein (25g Protein) + 1 Banana.
  - Sattu Protein Shake: 50g Roasted Chana Sattu + Water + Pinch of Black Salt + 1 Scoop Protein.
* **Non-Veg Standard**: 
  - 150g Grilled Chicken Breast / Boiled Eggs (35g Protein) + 1 cup Brown Rice / 2 Rotis + Green Salad.
* **Timing Tip**: Consume within 45–90 minutes post-training alongside 30–50g of clean carbohydrates to replenish glycogen and accelerate muscle protein synthesis!`;
  }
  if (query.includes("fat loss") || query.includes("cut") || query.includes("belly") || query.includes("weight loss") || query.includes("lose weight")) {
    return `### Science-Based Protocol for Sustainable Fat Loss:

1. **Caloric Deficit**: Target a moderate deficit of **300–500 kcal below maintenance** (approx. bodyweight in kg × 24-26).
2. **Preserve Muscle Mass**: Keep protein high at **1.8–2.2g per kg of bodyweight** so your body burns adipose tissue rather than muscle.
3. **Progressive Resistance Training**: Continue lifting heavy (6–12 rep range); do not drop the weight for high-rep "toning".
4. **Daily Step Count (NEAT)**: Aim for 8,000–10,000 daily steps. It burns calories without spiking cortisol or appetite.`;
  }
  if (query.includes("creatine") || query.includes("supplement")) {
    return `### Creatine Monohydrate & Essential Supplements Guide:

* **Creatine Monohydrate**: 3–5g daily, every single day at any convenient time. No loading phase required. Increases intramuscular phosphocreatine for strength output and intracellular cell hydration.
* **Whey / Plant Protein**: Fast, convenient source to hit your daily 1.6–2.2g/kg protein targets.
* **Electrolytes & Sodium**: Critical for heavy training sessions; 500mg sodium in your pre-workout water prevents intra-set cramping and maximizes muscle pumps.`;
  }
  if (query.includes("deadlift") || query.includes("back pain") || query.includes("lower back")) {
    return `### Deadlift Safety & Lower Back Protection:

1. **Bar Placement**: Start with the bar over your mid-foot (1 inch from your shins).
2. **Lat Engagement**: Pull your shoulder blades down and "bend the bar around your shins" to lock your lats before initiating the pull.
3. **Leg Drive First**: Push the floor away with your quads before hinging at the hips; avoid yanking the bar off the floor with your lower back.
4. **Alternative**: If conventional deadlifts irritate your lumbar spine, transition to **Trap Bar (Hex Bar) Deadlifts** or **Romanian Deadlifts (RDLs)** for a safer hip hinge.`;
  }
  if (query.includes("squat") || query.includes("plateau") || query.includes("strength")) {
    return `### Breaking Through Squat & Strength Plateaus:

1. **Pause Squats**: Add a 2-second pause at the absolute bottom (hole) with 70% of your 1RM for 3 sets of 4 reps to build explosive concentric power.
2. **Footwear & Ankle Mobility**: Ensure a solid, flat-soled shoe or elevated heel squat shoe to allow deep knee flexion without torso collapse.
3. **Core Bracing**: Practice the **Valsalva Maneuver** — deep diaphragmatic breath into your belt before initiating descent.
4. **Deload Week**: If you've pushed heavy for 5+ weeks, take a 50% volume deload week to allow central nervous system (CNS) supercompensation.`;
  }
  if (query.includes("sleep") || query.includes("recovery") || query.includes("sore")) {
    return `### Optimal Muscle Recovery & CNS Restoration:

1. **Sleep Duration**: Target **7.5–9 hours of quality sleep**. Over 80% of human growth hormone (HGH) is secreted during stage 3 deep slow-wave sleep.
2. **Hydration**: Drink 35–45ml of water per kg of bodyweight daily. Dehydrated muscle fibers take up to 40% longer to clear metabolic byproducts.
3. **Active Recovery**: On rest days, do 20–30 minutes of low-intensity walking or light cycling to promote nutrient-rich blood flow to sore tissues.`;
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
  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("who are you")) {
    return `### Hello! I am PulseCoach.

I am here to help you achieve your strength, hypertrophy, and nutrition goals. You can ask me about:

* **Exercise Form**: Bench press technique, squat depth, shoulder pain prevention, or deadlift cues.
* **Macro & Diet Planning**: High-protein Indian & international foods, post-workout meals, or cutting protocols.
* **Workout Splits**: PPL, Upper/Lower, Full Body, or progressive overload strategies.
* **Supplements**: Creatine monohydrate, protein powder, and recovery timing.

How can I assist your training today?`;
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

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: "You are 'PulseCoach', a world-class certified strength & conditioning specialist (CSCS) and sports nutritionist. You give science-backed, friendly, motivating, and actionable advice on workout form, workout timing, diet macros, hydration, recovery, daily routines, and progressive overload. Use clean markdown formatting.",
      },
    });

    const replyText = response.text || getFallbackCoachReply(userMsg);
    return res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.warn("Coach chat fallback engaged:", error?.message || error);
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

    const response = await callGeminiWithFallback(ai, {
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
    console.warn("Meal estimation using smart fallback:", error?.message || error);
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

// Snap & Log: Multimodal Vision Food & Macro Analyzer
app.post("/api/ai/snap-food", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", userNotes = "", userGoal = "muscle_gain" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "Image data is required" });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");

    const ai = getAiClient();
    if (!ai) {
      // Smart offline fallback
      const fallbackSnap = {
        dishName: userNotes || "Fresh Prepared Fitness Meal",
        hindiName: "पौष्टिक संतुलित भोजन",
        cuisine: "Universal",
        servingSizeDescription: "1 standard plate (~350g)",
        totalCalories: 420,
        totalProtein: 28,
        totalCarbs: 45,
        totalFats: 12,
        totalFiber: 6,
        confidenceScore: 88,
        dietaryType: "veg",
        detectedItems: [
          { name: "Primary Protein & Grain Base", portion: "1 bowl (200g)", calories: 260, proteinGrams: 18, carbsGrams: 32, fatsGrams: 6 },
          { name: "Sautéed Greens & Veggies", portion: "1 cup (100g)", calories: 90, proteinGrams: 4, carbsGrams: 11, fatsGrams: 3 },
          { name: "Healthy Dressing / Garnish", portion: "1 tbsp (15g)", calories: 70, proteinGrams: 6, carbsGrams: 2, fatsGrams: 3 }
        ],
        macroDistribution: { proteinPct: 27, carbsPct: 43, fatsPct: 30 },
        goalImpact: "Balanced macronutrient distribution supporting sustained muscle glycogen and satiety.",
        healthTips: [
          "Rich in dietary fiber and micronutrients",
          "Optimal post-workout or lunchtime fuel"
        ]
      };
      return res.json({ success: true, analysis: fallbackSnap });
    }

    const promptText = `Examine this photo of a food dish, snack, drink, or meal carefully.
User's additional note or context: "${userNotes || 'None provided'}"
User's current fitness goal: "${userGoal}"

Analyze the image like a certified sports dietitian and food vision specialist:
1. Identify the main dish and all visible constituent food items, side dishes, breads (rotis/naan/toast), gravies (dal/curry), proteins (paneer, chicken, eggs, tofu, fish), vegetables, and dressings.
2. Accurately identify Indian cuisine dishes (e.g., Dal Tadka, Paneer Bhurji, Roti, Chole, Poha, Idli, Dosa, Rajma, Biryani, Sabzi) as well as International dishes (e.g., Grilled Chicken Salad, Oatmeal, Pasta, Burrito Bowl, Sushi, Protein Shake, Omelette).
3. Estimate the total portion size and breakdown per item.
4. Calculate exact calories and macronutrients (protein in grams, carbs in grams, fats in grams, dietary fiber in grams).
5. Provide a confidence score (0-100), dietary category ('veg', 'non_veg', 'vegan', 'eggetarian'), macro percentage split, and a fitness coach tip on how this meal impacts their "${userGoal}" goal.`;

    const response = await callGeminiWithFallback(ai, {
      primaryModel: "gemini-3.8-flash",
      fallbackModels: ["gemini-flash-latest"],
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        systemInstruction: "You are an expert AI food vision analyzer, certified sports nutritionist, and culinary specialist. You examine food photography with exceptional precision to recognize portion weights, ingredients, cooking methods, calories, and macronutrients. Always return valid JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING },
            hindiName: { type: Type.STRING },
            cuisine: { type: Type.STRING, enum: ["Indian", "International", "Universal"] },
            servingSizeDescription: { type: Type.STRING },
            totalCalories: { type: Type.NUMBER },
            totalProtein: { type: Type.NUMBER },
            totalCarbs: { type: Type.NUMBER },
            totalFats: { type: Type.NUMBER },
            totalFiber: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER },
            dietaryType: { type: Type.STRING, enum: ["veg", "non_veg", "vegan", "eggetarian"] },
            detectedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  proteinGrams: { type: Type.NUMBER },
                  carbsGrams: { type: Type.NUMBER },
                  fatsGrams: { type: Type.NUMBER },
                },
                required: ["name", "portion", "calories", "proteinGrams", "carbsGrams", "fatsGrams"],
              },
            },
            macroDistribution: {
              type: Type.OBJECT,
              properties: {
                proteinPct: { type: Type.NUMBER },
                carbsPct: { type: Type.NUMBER },
                fatsPct: { type: Type.NUMBER },
              },
              required: ["proteinPct", "carbsPct", "fatsPct"],
            },
            goalImpact: { type: Type.STRING },
            healthTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "dishName",
            "totalCalories",
            "totalProtein",
            "totalCarbs",
            "totalFats",
            "detectedItems",
            "macroDistribution",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.warn("Snap food AI estimation error, using resilient fallback:", error?.message || error);
    const fallbackSnap = {
      dishName: req.body?.userNotes || "Scanned Food Plate",
      hindiName: "स्कैन किया गया पौष्टिक आहार",
      cuisine: "Universal",
      servingSizeDescription: "1 standard serving (~300-350g)",
      totalCalories: 380,
      totalProtein: 25,
      totalCarbs: 42,
      totalFats: 11,
      totalFiber: 5,
      confidenceScore: 82,
      dietaryType: "veg",
      detectedItems: [
        { name: req.body?.userNotes || "Wholesome Balanced Dish", portion: "1 serving", calories: 380, proteinGrams: 25, carbsGrams: 42, fatsGrams: 11 }
      ],
      macroDistribution: { proteinPct: 27, carbsPct: 45, fatsPct: 28 },
      goalImpact: "Nutrient-dense fuel supplying complex carbs and essential amino acids.",
      healthTips: ["Pair with plenty of water and raw green salad", "Ideal for workout recovery"]
    };
    res.json({ success: true, analysis: fallbackSnap });
  }
});

// Fallback Diet Plan Generator
// Fallback Diet Plan Generator
function generateFallbackDiet(goal: string, targetCalories: number, weightKg: number, dietType: string = '') {
  const calories = targetCalories || 2400;
  const protein = Math.round(weightKg * 2.0);
  const fats = Math.round(weightKg * 0.9);
  const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);

  const isVegan = dietType.toLowerCase().includes('vegan');
  const isPureVeg = !isVegan && (dietType.toLowerCase().includes('veg') || dietType.toLowerCase().includes('shakahari') || dietType.toLowerCase().includes('jain'));
  const noWhey = dietType.toLowerCase().includes('without whey') || dietType.toLowerCase().includes('zero powder') || dietType.toLowerCase().includes('no whey') || dietType.toLowerCase().includes('kitchen staples') || dietType.toLowerCase().includes('whole plants');

  let title = 'Elite High-Protein Indian & International Blueprint';
  let tagline = 'Scientifically calibrated macronutrient distribution for peak athletic performance';
  let dietTypeLabel = 'High Protein Muscle Fuel';
  let supplements = [
    'Whey Protein Isolate (1 scoop post-workout)',
    'Creatine Monohydrate (3-5g daily with water)',
    'Omega-3 Fish Oil / Flaxseed Oil (1000mg)',
    'Vitamin D3 + K2 (Weekly / Daily)',
  ];

  if (isVegan) {
    title = noWhey
      ? '100% Whole-Foods Vegan High-Protein Blueprint (Zero Powders)'
      : 'Elite Vegan High-Protein Blueprint (With Plant Protein Powder)';
    tagline = 'Cruelty-free, dairy-free complete plant amino acid distribution for natural muscle growth';
    dietTypeLabel = noWhey ? '100% Vegan (Zero Powder)' : '100% Vegan (With Plant Protein)';
    supplements = noWhey
      ? ['Zero Synthetic Powders (100% Whole Food Nutrition)', 'Vitamin B12 1000mcg', 'Algal Vegan Omega-3', 'Vegan Vitamin D3']
      : ['Organic Pea & Rice Plant Protein (1.5 scoops)', 'Creatine Monohydrate (5g)', 'Vitamin B12 1000mcg', 'Algal Vegan Omega-3'];
  } else if (isPureVeg) {
    title = noWhey
      ? '100% Natural Pure-Veg High-Protein Blueprint (Zero Whey / Desi Staples)'
      : 'Pure-Vegetarian High-Protein Hypertrophy Blueprint (With Whey)';
    tagline = 'Authentic Indian vegetarian nutrition powered by Low-Fat Paneer, Moong Sprouts, Sattu, and Legumes';
    dietTypeLabel = noWhey ? '100% Pure Veg (No Whey / Natural)' : '100% Pure Veg (With Whey)';
    supplements = noWhey
      ? ['Zero Synthetic Whey Required', 'Desi Sattu & Roasted Chana for Recovery', 'Ashwagandha KSM-66', 'Vitamin D3+K2']
      : ['Whey Protein Isolate (1-2 scoops post-workout)', 'Creatine Monohydrate (5g)', 'Ashwagandha KSM-66', 'Multivitamin & Zinc'];
  }

  const breakfastItem2 = isVegan
    ? { id: `fb-1-2`, name: 'Organic Tofu Scramble / Bhurji with Turmeric', hindiName: 'टोफू भुर्जी', cuisine: 'Indian', servingSize: '150g', calories: 180, proteinGrams: 20, carbsGrams: 4, fatsGrams: 9, benefits: 'Clean plant protein & isoflavones' }
    : { id: `fb-1-2`, name: 'Low-Fat Diet Paneer Besan Chilla', hindiName: 'पनीर बेसन चीला', cuisine: 'Indian', servingSize: '150g', calories: 240, proteinGrams: 20, carbsGrams: 22, fatsGrams: 8, benefits: 'Casein & chickpea amino acids' };

  const lunchItem1 = isVegan
    ? { id: `fb-2-1`, name: 'High-Protein Soya Chunks Masala Curry', hindiName: 'सोया चंक्स मसाला', cuisine: 'Indian', servingSize: '160g (50g dry)', calories: 215, proteinGrams: 26, carbsGrams: 18, fatsGrams: 3, benefits: 'Super high protein density' }
    : { id: `fb-2-1`, name: 'Low-Fat Paneer Tikka / Soya Chunks Curry', hindiName: 'पनीर टिक्का / सोया', cuisine: 'Indian', servingSize: '150g', calories: 230, proteinGrams: 36, carbsGrams: 6, fatsGrams: 6, benefits: 'Dense bioavailable vegetarian protein' };

  const postWorkoutItem1 = noWhey
    ? { id: `fb-4-1`, name: 'Desi Roasted Sattu High-Protein Drink', hindiName: 'देसी सत्तू शरबत', cuisine: 'Indian', servingSize: '1 large glass (50g powder)', calories: 205, proteinGrams: 13, carbsGrams: 33, fatsGrams: 2.5, benefits: 'Natural muscle glycogen & amino acid replenishment' }
    : isVegan
      ? { id: `fb-4-1`, name: 'Organic Pea & Rice Plant Protein Shake', hindiName: 'प्लांट प्रोटीन शेक', cuisine: 'International', servingSize: '1.5 scoops (45g)', calories: 175, proteinGrams: 35, carbsGrams: 3, fatsGrams: 2, benefits: 'Rapid dairy-free vegan protein synthesis' }
      : { id: `fb-4-1`, name: '100% Whey Protein Isolate Shake', hindiName: 'व्हे प्रोटीन आइसोलेट शेक', cuisine: 'International', servingSize: '1.5 scoops (45g)', calories: 180, proteinGrams: 37, carbsGrams: 2, fatsGrams: 1, benefits: 'Fastest leucine spike for hypertrophy' };

  const dinnerItem1 = isVegan
    ? { id: `fb-5-1`, name: 'Rajma Masala / Red Kidney Beans with Quinoa', hindiName: 'राजमा और क्विनोआ', cuisine: 'Indian', servingSize: '200g', calories: 230, proteinGrams: 14, carbsGrams: 36, fatsGrams: 4, benefits: 'Slow-burning complex plant recovery' }
    : { id: `fb-5-1`, name: 'Low-Fat Paneer Bhurji / Moong Dal Khichdi', hindiName: 'पनीर भुर्जी और दाल खिचड़ी', cuisine: 'Indian', servingSize: '180g', calories: 250, proteinGrams: 24, carbsGrams: 22, fatsGrams: 8, benefits: 'Slow-digesting casein for overnight repair' };

  return {
    id: `diet-ai-${Date.now()}`,
    title,
    tagline,
    dailyCalories: calories,
    macros: {
      proteinGrams: protein,
      carbsGrams: carbs,
      fatsGrams: fats,
    },
    waterTargetMl: 3600,
    cuisine: "Indian",
    dietTypeLabel,
    keyBenefits: [
      `Delivers ${protein}g targeted protein calibrated to your body weight`,
      isVegan ? '100% Plant-based, lactose-free and ethical' : isPureVeg ? '100% Vegetarian with authentic Indian kitchen ingredients' : 'Balanced macro distribution for steady energy',
      noWhey ? 'Zero synthetic powders or whey required — completely whole-food driven' : 'Includes premium protein shake post-workout for fast recovery',
    ],
    recommendedSupplements: supplements,
    meals: [
      {
        mealType: "breakfast",
        title: isVegan ? "Vegan Morning Protein Fuel" : "Desi High-Protein Breakfast",
        suggestedTime: "08:00 AM",
        prepTips: "Cook oats or chilla freshly with minimal oil.",
        items: [
          { id: `fb-1-1`, name: "Rolled Whole Oats with Almonds & Banana", hindiName: "ओट्स और बादाम", cuisine: "International", servingSize: "60g oats + 15g almonds", calories: 320, proteinGrams: 11, carbsGrams: 52, fatsGrams: 8, benefits: "Complex slow-release energy" },
          breakfastItem2,
        ],
      },
      {
        mealType: "lunch",
        title: "Clean Indian Athlete Thali",
        suggestedTime: "01:15 PM",
        prepTips: "Serve with warm multigrain phulkas and fresh green salad.",
        items: [
          lunchItem1,
          { id: `fb-2-2`, name: "Thick Yellow Moong Dal Tadka", hindiName: "दाल तड़का", cuisine: "Indian", servingSize: "1 bowl (180g)", calories: 165, proteinGrams: 9, carbsGrams: 22, fatsGrams: 3, benefits: "Dietary fiber & gut health" },
          { id: `fb-2-3`, name: "Whole Wheat Roti / Phulka (2 rotis)", hindiName: "रोटी (2 पीस)", cuisine: "Indian", servingSize: "90g", calories: 170, proteinGrams: 6.4, carbsGrams: 35, fatsGrams: 1, benefits: "Glycogen replenishment" },
        ],
      },
      {
        mealType: "pre_workout",
        title: "Explosive Energy Fuel",
        suggestedTime: "04:30 PM",
        prepTips: "Consume 30-45 minutes prior to training session.",
        items: [
          { id: `fb-3-1`, name: "Roasted Black Chana & Fresh Banana", hindiName: "भुना चना और केला", cuisine: "Indian", servingSize: "40g chana + 1 banana", calories: 230, proteinGrams: 9, carbsGrams: 42, fatsGrams: 2.5, benefits: "Natural potassium, complex carbs & ATP endurance" },
        ],
      },
      {
        mealType: "post_workout",
        title: noWhey ? "Natural Recovery Fuel" : "Rapid Muscle Protein Synthesis Recovery",
        suggestedTime: "06:30 PM",
        prepTips: noWhey ? "Whisk fresh sattu with cold water, roasted cumin, and black salt." : "Mix in shaker with 350ml cold water within 45 minutes of training.",
        items: [
          postWorkoutItem1,
          { id: `fb-4-2`, name: "Roasted Makhana / Foxnuts", hindiName: "भुना मखाना", cuisine: "Indian", servingSize: "25g", calories: 92, proteinGrams: 2.5, carbsGrams: 17.5, fatsGrams: 1.4, benefits: "Antioxidants and magnesium" },
        ],
      },
      {
        mealType: "dinner",
        title: "Light Digestive Evening Satiety",
        suggestedTime: "08:45 PM",
        prepTips: "Light on carbohydrates, rich in micronutrients and easy on digestion before sleep.",
        items: [
          dinnerItem1,
          { id: `fb-5-2`, name: "Sprouted Moong & Cucumber Salad", hindiName: "अंकुरित मूंग सलाद", cuisine: "Indian", servingSize: "100g", calories: 85, proteinGrams: 6, carbsGrams: 14, fatsGrams: 0.5, benefits: "Active enzymes and hydration" },
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
      const fallback = generateFallbackDiet(chosenGoal, chosenCalories, chosenWeight, dietType || "");
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

    const response = await callGeminiWithFallback(ai, {
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
    console.warn("Diet plan generation using smart fallback:", error?.message || error);
    const fallback = generateFallbackDiet(
      req.body?.goal || "Fitness",
      parseInt(req.body?.targetCalories, 10) || 2400,
      parseFloat(req.body?.weightKg) || 75,
      req.body?.dietType || ""
    );
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

    const response = await callGeminiWithFallback(ai, {
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
    console.warn("Substitute exercise using smart fallback:", error?.message || error);
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
