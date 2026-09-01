import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Google GenAI initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Fitness & Workout Plan Generator
app.post("/api/ai/generate-plan", async (req, res) => {
  try {
    const { goal, fitnessLevel, daysPerWeek, workoutDuration, dietaryPreference, targetCalories, healthNotes } = req.body;

    const prompt = `Generate a comprehensive, scientifically-backed weekly fitness training plan, daily routine, and daily diet meal plan based on these parameters:
- Goal: ${goal || "Muscle Building & Strength"}
- Fitness Level: ${fitnessLevel || "Intermediate"}
- Days per week: ${daysPerWeek || 4} days
- Workout duration: ${workoutDuration || 45} minutes per session
- Dietary preference: ${dietaryPreference || "High Protein Balanced"}
- Target calories: ${targetCalories || "Calculated optimal based on goal"}
- Specific notes / focus: ${healthNotes || "None"}

Please return a structured JSON with:
1. planTitle: Catchy realistic title
2. overview: Summary of strategy
3. weeklySplits: Array of days with dayName, focus, exercises list (name, sets, reps, restSec, targetMuscle, formTip)
4. dailyDiet: Array of meals (mealType, name, calories, protein, carbs, fats, ingredientsDescription)
5. dailyRoutine: Array of routine steps (timeOfDay, title, description, category: 'morning'|'preworkout'|'workout'|'postworkout'|'evening'|'habit')
6. coachAdvice: 3 key golden rules for success
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite certified strength & conditioning specialist (CSCS) and sports nutritionist. Provide actionable, well-balanced fitness, diet, and routine protocols in valid JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            overview: { type: Type.STRING },
            targetDailyCalories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatsGrams: { type: Type.NUMBER },
              },
            },
            weeklySplits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  isRestDay: { type: Type.BOOLEAN },
                  estimatedMinutes: { type: Type.NUMBER },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.STRING },
                        restSec: { type: Type.NUMBER },
                        targetMuscle: { type: Type.STRING },
                        formTip: { type: Type.STRING },
                      },
                    },
                  },
                },
              },
            },
            dailyDiet: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: { type: Type.STRING },
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  proteinGrams: { type: Type.NUMBER },
                  carbsGrams: { type: Type.NUMBER },
                  fatsGrams: { type: Type.NUMBER },
                  ingredientsDescription: { type: Type.STRING },
                  mealTimeSuggestion: { type: Type.STRING },
                },
              },
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
              },
            },
            coachAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["planTitle", "overview", "weeklySplits", "dailyDiet", "dailyRoutine"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);
    res.json({ success: true, plan: parsedData });
  } catch (error: any) {
    console.error("Error generating plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI fitness plan" });
  }
});

// AI Fitness Coach & Chat Advisor
app.post("/api/ai/coach-chat", async (req, res) => {
  try {
    const { message, chatHistory, userStats } = req.body;

    const historyFormatted = Array.isArray(chatHistory)
      ? chatHistory.map((msg: any) => `${msg.sender === "user" ? "User" : "Coach"}: ${msg.text}`).join("\n")
      : "";

    const statsContext = userStats
      ? `User context: Goal: ${userStats.goal || "Fitness"}, Weight: ${userStats.weightKg || 70}kg, Level: ${userStats.fitnessLevel || "Intermediate"}, Daily streak: ${userStats.streak || 1} days.`
      : "";

    const prompt = `${statsContext}
Previous conversation:
${historyFormatted}

User asked: "${message}"

Respond with expert, encouraging, and clear fitness/training/diet/routine advice. Keep response concise, structured with bullet points where appropriate, and highly practical.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are 'PulseCoach', a world-class certified fitness coach, personal trainer, and sports nutritionist. You give science-backed, friendly, motivating, and actionable advice on workout form, workout timing, diet macros, hydration, recovery, daily routines, and progressive overload. Use clean markdown formatting.",
      },
    });

    res.json({ reply: response.text || "Keep pushing hard and staying consistent!" });
  } catch (error: any) {
    console.error("Error in coach chat:", error);
    res.status(500).json({ error: error.message || "Failed to get coach response" });
  }
});

// AI Meal Macro Estimator
app.post("/api/ai/estimate-meal", async (req, res) => {
  try {
    const { mealDescription } = req.body;
    if (!mealDescription) {
      return res.status(400).json({ error: "Meal description is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Estimate nutritional content and provide brief health insights for: "${mealDescription}"`,
      config: {
        systemInstruction: "You are a professional sports dietitian. Estimate calories and macronutrients accurately based on standard USDA nutritional data.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
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
    res.status(500).json({ error: error.message || "Failed to estimate meal nutrition" });
  }
});

// AI Exercise Substitution / Injury Modifier
app.post("/api/ai/substitute-exercise", async (req, res) => {
  try {
    const { exerciseName, targetMuscle, reason, availableEquipment } = req.body;
    const prompt = `Give 3 best alternative exercises for "${exerciseName}" (Target Muscle: ${targetMuscle}).
Reason for substitution: ${reason || "No specific reason"}
Available Equipment: ${availableEquipment || "Full gym equipment"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
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
    res.status(500).json({ error: error.message || "Failed to suggest alternatives" });
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
