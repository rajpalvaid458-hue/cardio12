import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Timer,
  Utensils,
  Droplet,
  Sparkles,
  Users,
  Flame,
  Dumbbell,
  ArrowRight,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Zap,
  Clock,
  Heart,
  Target,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuickWorkout?: () => void;
  onGoToDiet?: () => void;
  onGoToCoach?: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  isOpen,
  onClose,
  onStartQuickWorkout,
  onGoToDiet,
  onGoToCoach,
}) => {
  const { isHindi } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      icon: Dumbbell,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: isHindi ? '1. वर्कआउट कैसे शुरू करें?' : '1. How to Start a Workout',
      desc: isHindi
        ? 'ट्रेनिंग पेज पर जाएं और किसी भी वर्कआउट प्लान पर हरा "Start Workout" बटन दबाएं।'
        : 'Go to Training view and tap the green "Start Workout" button on any workout plan.',
      details: [
        {
          icon: Play,
          highlight: isHindi ? 'Start दबाएं:' : 'Tap Start:',
          text: isHindi
            ? 'नीचे दिए गए कार्ड्स में से अपनी पसंद का वर्कआउट चुनें (जैसे Full Body, Push Day, या Cardio)।'
            : 'Choose any workout from the list (like Full Body, Push Day, or Cardio).',
        },
        {
          icon: CheckCircle2,
          highlight: isHindi ? 'सेट पूरा होने पर टिक लगाएं:' : 'Check each set:',
          text: isHindi
            ? 'जैसे ही आप एक सेट (जैसे 10 रेप्स) कर लें, हरा टिक ✔️ दबाएं। आपका टनेज अपने आप जुड़ जाएगा।'
            : 'Whenever you finish a set, tap the checkmark ✔️. Your lifted volume tracks automatically.',
        },
        {
          icon: Timer,
          highlight: isHindi ? 'ऑटोमैटिक रेस्ट टाइमर:' : 'Auto Rest Timer:',
          text: isHindi
            ? 'टिक लगाते ही आराम करने के लिए 60 सेकंड का टाइमर खुद शुरू हो जाता है। आपको कुछ करने की जरूरत नहीं।'
            : 'As soon as you tick a set, an optimal 60s rest timer counts down automatically.',
        },
        {
          icon: Target,
          highlight: isHindi ? 'Finish दबाएं:' : 'Finish & Save:',
          text: isHindi
            ? 'सारे सेट्स पूरे होने पर "Finish Workout" दबाएं। आपकी आज की कसरत और स्ट्रीक सुरक्षित हो जाएगी।'
            : 'When done, tap "Finish Workout". Your streak, volume, and history are saved permanently.',
        },
      ],
    },
    {
      id: 2,
      icon: Utensils,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      title: isHindi ? '2. डाइट और पानी कैसे ट्रैक करें?' : '2. How to Track Diet & Water',
      desc: isHindi
        ? 'ऊपर "डाइट" टैब में जाएं और 1-क्लिक में पानी और भोजन नोट करें।'
        : 'Head to the "Diet" tab to log your hydration and meals in a single tap.',
      details: [
        {
          icon: Droplet,
          highlight: isHindi ? 'पानी का 1-टैप ट्रैकर:' : '1-Tap Water Tracker:',
          text: isHindi
            ? 'जब भी 1 ग्लास पानी पिएं, बस "+1 ग्लास" पर टैप करें। रोजाना 8-10 ग्लास का टारगेट रखें।'
            : 'Whenever you drink a glass of water, tap "+1 Glass". Aim for 8-10 glasses daily.',
        },
        {
          icon: Utensils,
          highlight: isHindi ? 'भोजन व कैलोरी:' : 'Meals & Calories:',
          text: isHindi
            ? 'नाश्ता, दोपहर का खाना और डिनर में खाए गए भोजन का नाम या आइटम चुनें। कैलोरी और प्रोटीन खुद कैलकुलेट होंगे।'
            : 'Log breakfast, lunch, or dinner. Calories and protein are calculated automatically.',
        },
        {
          icon: Heart,
          highlight: isHindi ? 'भारतीय भोजन विकल्प:' : 'Indian Food Options:',
          text: isHindi
            ? 'रोटी, दाल, पनीर, चावल, अंडे आदि सभी सामान्य खाद्य पदार्थों की कैलोरी पहले से फीड हैं।'
            : 'Roti, dal, paneer, rice, eggs, and all staple foods are pre-loaded for quick selection.',
        },
      ],
    },
    {
      id: 3,
      icon: Sparkles,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: isHindi ? '3. AI स्मार्ट कोच का उपयोग' : '3. Using the AI Smart Coach',
      desc: isHindi
        ? 'कुछ भी समझ न आए तो AI कोच से अपनी भाषा (हिंदी या इंग्लिश) में पूछें।'
        : 'Confused about anything? Ask the AI Coach in natural Hindi, Hinglish, or English.',
      details: [
        {
          icon: Sparkles,
          highlight: isHindi ? 'पर्सनलाइज़्ड वर्कआउट बनवाएं:' : 'Create Custom Workout:',
          text: isHindi
            ? '"मुझे 15 मिनट का बिना डंबल वाला वर्कआउट बताओ" लिखें और 5 सेकंड में पूरा चार्ट पाएं।'
            : 'Type "Give me a 15-min home workout with no equipment" and get an instant plan.',
        },
        {
          icon: Zap,
          highlight: isHindi ? 'डाइट और वजन घटाने की सलाह:' : 'Diet & Weight Loss Advice:',
          text: isHindi
            ? '"पेट की चर्बी घटाने के लिए शाम को क्या खाऊं?" जैसा कोई भी सवाल पूछें।'
            : 'Ask questions like "What should I eat post-workout?" or "How to burn belly fat?".',
        },
      ],
    },
    {
      id: 4,
      icon: Users,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      title: isHindi ? '4. परिवार या दोस्तों के लिए अलग सेक्शन' : '4. Multiple Profiles for Family',
      desc: isHindi
        ? 'एक ही मोबाइल में कई लोग अपना अलग-अलग रिकॉर्ड रख सकते हैं।'
        : 'Multiple people can track their own independent workouts and weight on one device.',
      details: [
        {
          icon: Users,
          highlight: isHindi ? 'अलग सेक्शन बटन:' : 'Switch Section Button:',
          text: isHindi
            ? 'शीर्ष बार में "अलग सेक्शन" बटन दबाएं और किसी भी नए व्यक्ति (जैसे भाई, पत्नी, दोस्त) का नाम जोड़ें।'
            : 'Tap "Switch Section" at the top to add a new profile for a family member or client.',
        },
        {
          icon: CheckCircle2,
          highlight: isHindi ? 'अलग-अलग डेटा सुरक्षित:' : 'Completely Separate Data:',
          text: isHindi
            ? 'उनका वर्कआउट, वजन और स्ट्रीक आपके डेटा से बिल्कुल अलग और सुरक्षित रहेगा।'
            : 'Their weight, logs, and streak remain completely isolated from yours.',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#070C1A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/90 dark:border-white/[0.1] overflow-hidden my-6">
        {/* Top ambient highlight line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-sm shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <BookOpen className="w-3 h-3" />
                <span>{isHindi ? 'नये यूज़र के लिए आसान गाइड' : 'Quick Beginner Guide'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {isHindi ? 'PulseFit कैसे इस्तेमाल करें?' : 'How to Use PulseFit'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/60 pb-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 scale-102'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.id}. {isHindi ? (step.id === 1 ? 'वर्कआउट' : step.id === 2 ? 'डाइट' : step.id === 3 ? 'AI कोच' : 'सेक्शन') : (step.id === 1 ? 'Workout' : step.id === 2 ? 'Diet' : step.id === 3 ? 'AI Coach' : 'Profiles')}</span>
              </button>
            );
          })}
        </div>

        {/* Step Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {(() => {
            const current = steps.find((s) => s.id === activeStep) || steps[0];
            const StepIcon = current.icon;
            return (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <StepIcon className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {current.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                      {current.desc}
                    </p>
                  </div>
                </div>

                {/* Sub-steps / Details list */}
                <div className="grid grid-cols-1 gap-2.5">
                  {current.details.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed">
                          <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                            {item.highlight}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300 font-normal">
                            {item.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Footer with One-Click Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-300 transition-colors"
              >
                {isHindi ? 'पिछला' : 'Back'}
              </button>
            )}
            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <span>{isHindi ? 'अगला स्टेप' : 'Next Step'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                {isHindi ? 'समझ गया' : 'Got it'}
              </button>
            )}
          </div>

          {/* Direct 1-Click Action to instantly test */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onStartQuickWorkout && (
              <button
                onClick={() => {
                  onClose();
                  onStartQuickWorkout();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-102 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isHindi ? '🟢 अभी 1-क्लिक वर्कआउट शुरू करें' : '🟢 Start 1-Click Workout Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
