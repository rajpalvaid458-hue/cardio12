import React from 'react';
import { WorkoutPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  Flame,
  Moon,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface ProgramScheduleModalProps {
  plan: WorkoutPlan | null;
  onClose: () => void;
  onStartWorkout: (plan: WorkoutPlan) => void;
}

export const ProgramScheduleModal: React.FC<ProgramScheduleModalProps> = ({
  plan,
  onClose,
  onStartWorkout,
}) => {
  const { isHindi } = useLanguage();

  if (!plan) return null;

  const isWeekly = plan.programType === '1-week' || !!plan.weeklySchedule;
  const isMonthly = plan.programType === '1-month' || !!plan.monthlySchedule;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calendar className="w-3.5 h-3.5" />
              {isWeekly
                ? isHindi
                  ? '1-सप्ताह का शेड्यूल (7 Days Roadmap)'
                  : '1-Week Schedule (7 Days Roadmap)'
                : isMonthly
                ? isHindi
                  ? '1-महीने का प्रोग्राम (4 Weeks Roadmap)'
                  : '1-Month Program (4 Weeks Roadmap)'
                : isHindi
                ? 'वर्कआउट शेड्यूल'
                : 'Workout Schedule'}
            </span>

            <span className="text-xs text-slate-400 font-medium">
              {plan.daysPerWeek ? `${plan.daysPerWeek} ${isHindi ? 'दिन/सप्ताह' : 'days/week'}` : ''}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{plan.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
            {plan.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{plan.durationMinutes} {isHindi ? 'मिनट/सत्र' : 'min/session'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>{plan.exercises.length} {isHindi ? 'व्यायाम' : 'exercises in library'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="capitalize">{plan.level || 'All Levels'}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {/* If 1-Month Schedule */}
          {isMonthly && plan.monthlySchedule && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{isHindi ? '4-सप्ताह का प्रगतिशील रोडमैप' : '4-Week Progressive Overload Roadmap'}</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {isHindi ? 'चरणबद्ध प्रगति' : 'Phase-by-Phase'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {plan.monthlySchedule.map((block) => (
                  <div
                    key={block.weekNumber}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {isHindi ? `सप्ताह ${block.weekNumber}` : `Week ${block.weekNumber}`}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{block.title}</h4>
                      </div>
                      {block.intensity && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            block.intensity === 'High' || block.intensity === 'Peak'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : block.intensity === 'Moderate'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {block.intensity} Intensity
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">{isHindi ? 'लक्ष्य:' : 'Goal:'}</strong> {block.goal}
                      </p>
                      <p className="text-slate-600">
                        <strong className="text-slate-800">{isHindi ? 'फोकस:' : 'Focus:'}</strong> {block.focus}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 italic">
                      💡 {block.scheduleTips}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Day-by-Day Schedule */}
          {plan.weeklySchedule && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? '7-दिन की दिनचर्या (Daily Breakdown)' : '7-Day Routine (Day-by-Day Breakdown)'}</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {plan.daysPerWeek ? `${plan.daysPerWeek} Active Days` : 'Weekly Schedule'}
                </span>
              </div>

              <div className="space-y-2.5">
                {plan.weeklySchedule.map((day) => (
                  <div
                    key={day.dayNumber}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      day.restDay
                        ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                        : 'bg-emerald-50/30 border-emerald-200/90 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            day.restDay
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          D{day.dayNumber}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{day.dayName}</span>
                            {day.restDay ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                <Moon className="w-3 h-3" />
                                {isHindi ? 'आराम / रिकवरी' : 'Rest / Recovery'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {isHindi ? 'वर्कआउट दिवस' : 'Training Day'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-700 mt-0.5">{day.focus}</p>
                        </div>
                      </div>

                      {day.exerciseCount && (
                        <div className="text-xs text-slate-500 font-medium sm:text-right shrink-0">
                          {day.exerciseCount} {isHindi ? 'व्यायाम' : 'exercises'}
                        </div>
                      )}
                    </div>

                    {day.exercisesSummary && day.exercisesSummary.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                        {day.exercisesSummary.map((ex, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}

                    {day.tips && (
                      <div className="mt-2 text-[11px] text-slate-500 flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">Tip:</span>
                        <span>{day.tips}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routine Exercises Preview */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'प्रोग्राम में शामिल मुख्य व्यायाम:' : 'Primary Workout Exercises:'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.exercises.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-800 block truncate">{ex.name}</span>
                    <span className="text-[10px] text-slate-500">{ex.targetMuscle}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold shrink-0">
                    {ex.sets.length} sets
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartWorkout(plan);
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHindi ? 'आज का वर्कआउट शुरू करें' : "Start Today's Workout Now"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
