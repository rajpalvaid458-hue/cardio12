import React, { useState, useRef, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Flame,
  Dumbbell,
  UtensilsCrossed,
  CalendarCheck,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'How to fix shoulder pain during bench press?',
  'High protein vegetarian post-workout meal ideas',
  'How to break through a plateau on barbell squats',
  'Best warm-up routine before heavy lifting',
  'What should I eat 1 hour before a workout?',
];

export const AiCoachView: React.FC = () => {
  const { userProfile, setWorkoutPlans, setMacroGoals, setDailyRoutine } = useFitness();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'generator'>('chat');

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'coach',
      text: `Hey ${userProfile.name}! I'm Coach Pulse, your AI fitness & nutrition specialist. Whether you need workout adjustments, exercise form cues, macro fine-tuning, or injury alternatives, just ask!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // AI Plan Generator Wizard State
  const [goal, setGoal] = useState<'muscle_hypertrophy' | 'fat_loss' | 'strength' | 'endurance'>(
    'muscle_hypertrophy'
  );
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [equipment, setEquipment] = useState<'full_gym' | 'dumbbells_only' | 'bodyweight'>('full_gym');
  const [dietaryPref, setDietaryPref] = useState('High protein standard');
  const [targetWeight, setTargetWeight] = useState(userProfile.weightKg.toString());

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlanResult, setGeneratedPlanResult] = useState<any>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCoachThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || isCoachThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');
    setIsCoachThinking(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: historyPayload,
          userContext: {
            name: userProfile.name,
            weightKg: userProfile.weightKg,
            goal: userProfile.goal,
            experience: userProfile.experienceLevel,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const coachMessage: Message = {
          id: `coach-${Date.now()}`,
          sender: 'coach',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, coachMessage]);
      } else {
        throw new Error(data.error || 'Failed to get coach response');
      }
    } catch (err: any) {
      console.error('Coach chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'coach',
          text: "I'm having a brief connection issue. Please make sure your GEMINI_API_KEY is configured in settings, or try asking again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsCoachThinking(false);
    }
  };

  const handleGenerateCompletePlan = async () => {
    setIsGeneratingPlan(true);
    setGeneratedPlanResult(null);

    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          experienceLevel: experience,
          daysPerWeek,
          equipment,
          dietaryPreference: dietaryPref,
          currentWeightKg: parseFloat(targetWeight) || 75,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedPlanResult(data.plan);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error(data.error || 'Plan generation failed');
      }
    } catch (err) {
      console.error('Plan generation failed:', err);
      alert('Plan generation failed. Please ensure GEMINI_API_KEY is set.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleApplyGeneratedPlan = () => {
    if (!generatedPlanResult) return;

    // Apply workout splits
    if (generatedPlanResult.workoutPlans && generatedPlanResult.workoutPlans.length > 0) {
      const formattedPlans = generatedPlanResult.workoutPlans.map((p: any, idx: number) => ({
        id: `ai-plan-${Date.now()}-${idx}`,
        title: p.title,
        splitType: p.splitType || 'Custom Split',
        durationMinutes: p.durationMinutes || 50,
        description: p.description,
        tags: p.tags || ['AI-Generated', goal],
        exercises: (p.exercises || []).map((ex: any, exIdx: number) => ({
          id: `ai-ex-${Date.now()}-${exIdx}`,
          name: ex.name,
          category: ex.category || 'Compound',
          targetMuscle: ex.targetMuscle || 'Full Body',
          equipment: ex.equipment || 'Gym',
          instructions: ex.instructions || [],
          formTips: [ex.formTip || 'Focus on controlled tempo and full range of motion.'],
          restSec: ex.restSec || 60,
          defaultSets: ex.sets || 3,
          defaultReps: ex.reps || 10,
          sets: Array.from({ length: ex.sets || 3 }).map((_, sIdx) => ({
            id: `set-${exIdx}-${sIdx}`,
            setNumber: sIdx + 1,
            reps: ex.reps || 10,
            weightKg: 0,
            completed: false,
          })),
        })),
      }));

      setWorkoutPlans(formattedPlans);
    }

    // Apply Diet Macro Goals
    if (generatedPlanResult.dietPlan) {
      const dp = generatedPlanResult.dietPlan;
      setMacroGoals(
        dp.dailyCalories || 2400,
        dp.proteinGrams || 160,
        dp.carbsGrams || 260,
        dp.fatsGrams || 70,
        dp.waterMlGoal || 3500
      );
    }

    // Apply Daily Routine
    if (generatedPlanResult.dailyRoutine && generatedPlanResult.dailyRoutine.length > 0) {
      const formattedRoutine = generatedPlanResult.dailyRoutine.map((r: any, idx: number) => ({
        id: `ai-routine-${Date.now()}-${idx}`,
        time: r.time || '08:00 AM',
        title: r.title,
        description: r.description || '',
        category: r.category || 'morning',
        durationMins: r.durationMins || 15,
        completed: false,
        importance: 'high',
      }));
      setDailyRoutine(formattedRoutine);
    }

    alert('Success! Your AI custom workout routine, macro targets, and daily schedule have been loaded into PulseFit!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">AI Coach & Plan Generator</h1>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'chat'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coach Chat
          </button>
          <button
            onClick={() => setActiveSubTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'generator'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Plan Generator
          </button>
        </div>
      </div>

      {/* 1. COACH CHAT VIEW */}
      {activeSubTab === 'chat' && (
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden flex flex-col h-[650px] shadow-sm">
          {/* Chat Top Banner */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Coach Pulse <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </h3>
                <p className="text-[11px] text-slate-500">Exercise Form, Nutrition Strategy & Workout Science</p>
              </div>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'init',
                    sender: 'coach',
                    text: `Chat refreshed! What fitness or nutrition topic can I assist you with today, ${userProfile.name}?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-700 text-white'
                      : 'bg-emerald-600 text-white font-bold shadow-xs'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1.5 font-mono ${
                      msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isCoachThinking && (
              <div className="flex gap-3 max-w-[75%] mr-auto">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 font-mono text-[11px] text-slate-500">Coach is analyzing...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar flex gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isCoachThinking}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 hover:text-slate-900 whitespace-nowrap transition-colors shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask coach anything about training, diet, workout timing, or routine..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isCoachThinking}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isCoachThinking || !inputMsg.trim()}
              className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. AI PLAN GENERATOR WIZARD */}
      {activeSubTab === 'generator' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Full-Stack AI Program Builder</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Gemini will architect your custom workout split, precision macro targets, and daily routine schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Primary Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Primary Goal</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'muscle_hypertrophy', label: 'Muscle Building & Hypertrophy' },
                    { id: 'fat_loss', label: 'Fat Loss & Lean Definition' },
                    { id: 'strength', label: 'Strength & Powerlifting' },
                    { id: 'endurance', label: 'Athletic Conditioning & HIIT' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id as any)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                        goal === g.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Frequency */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Training Frequency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysPerWeek(days)}
                      className={`p-3 rounded-2xl border text-center font-mono font-bold text-sm transition-all ${
                        daysPerWeek === days
                          ? 'bg-slate-900 text-white font-black shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {days} Days / wk
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperience(lvl)}
                      className={`p-3 rounded-2xl border text-center capitalize text-xs font-bold transition-all ${
                        experience === lvl
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment Access */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Equipment Access
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'full_gym', label: 'Commercial Gym' },
                    { id: 'dumbbells_only', label: 'Dumbbells & Bench' },
                    { id: 'bodyweight', label: 'Bodyweight / Home' },
                  ].map((eq) => (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => setEquipment(eq.id as any)}
                      className={`p-3 rounded-2xl border text-center text-xs font-semibold transition-all ${
                        equipment === eq.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {eq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Preference */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Dietary Style & Food Preferences
                </label>
                <input
                  type="text"
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  placeholder="e.g. High protein, Vegetarian (eggs allowed), No dairy, Intermittent fasting..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleGenerateCompletePlan}
                disabled={isGeneratingPlan}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all hover:scale-102 disabled:opacity-50"
              >
                {isGeneratingPlan ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Architecting Your Program...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate Custom Fitness Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Plan Review Card */}
          {generatedPlanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white border-2 border-emerald-500 p-6 md:p-8 space-y-6 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Generated Program</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {generatedPlanResult.workoutPlans?.[0]?.title || 'AI Personalized Plan'}
                  </h3>
                </div>

                <button
                  onClick={handleApplyGeneratedPlan}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Apply & Save to My App</span>
                </button>
              </div>

              {/* Nutrition Blueprint */}
              {generatedPlanResult.dietPlan && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <UtensilsCrossed className="w-4 h-4" /> Nutrition & Macronutrient Targets
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500">Daily Calories</div>
                      <div className="text-base font-black text-amber-600 font-mono">
                        {generatedPlanResult.dietPlan.dailyCalories} kcal
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500">Protein</div>
                      <div className="text-base font-black text-emerald-600 font-mono">
                        {generatedPlanResult.dietPlan.proteinGrams}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500">Carbs</div>
                      <div className="text-base font-black text-blue-600 font-mono">
                        {generatedPlanResult.dietPlan.carbsGrams}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500">Fats</div>
                      <div className="text-base font-black text-rose-600 font-mono">
                        {generatedPlanResult.dietPlan.fatsGrams}g
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-500">Water Goal</div>
                      <div className="text-base font-black text-teal-600 font-mono">
                        {generatedPlanResult.dietPlan.waterMlGoal / 1000}L
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Workout Splits Blueprint */}
              {generatedPlanResult.workoutPlans && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <Dumbbell className="w-4 h-4" /> Training Splits ({generatedPlanResult.workoutPlans.length} Workouts)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedPlanResult.workoutPlans.map((plan: any, pIdx: number) => (
                      <div key={pIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{plan.title}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">{plan.durationMinutes}m</span>
                        </div>
                        <p className="text-xs text-slate-500">{plan.description}</p>
                        <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                          {plan.exercises?.length || 0} Exercises scheduled
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
