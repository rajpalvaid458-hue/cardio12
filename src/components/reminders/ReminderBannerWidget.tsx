import React from 'react';
import { useFitness } from '../../context/FitnessContext';
import { Bell, Dumbbell, UtensilsCrossed, Clock, ChevronRight, Sparkles, Volume2 } from 'lucide-react';

interface ReminderBannerWidgetProps {
  onOpenRemindersModal: () => void;
  variant?: 'routine' | 'diet' | 'compact';
}

export const ReminderBannerWidget: React.FC<ReminderBannerWidgetProps> = ({
  onOpenRemindersModal,
  variant = 'routine',
}) => {
  const { workoutReminder, mealReminders, triggerTestReminder } = useFitness();

  const activeMealsCount = mealReminders.filter((m) => m.enabled).length;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/80 shadow-sm relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Bell className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">
                Workout & Daily Nutrition Reminders
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {variant === 'diet' ? (
                <>
                  Scheduled nutrition checkpoints:{' '}
                  <span className="text-emerald-400 font-semibold font-mono">
                    {activeMealsCount} active meal alerts
                  </span>
                  . Receive audio cues and browser notifications when it's time to log fuel.
                </>
              ) : (
                <>
                  Next scheduled workout:{' '}
                  <span className="text-emerald-400 font-semibold font-mono">
                    {workoutReminder.enabled ? workoutReminder.scheduledTime : 'Disabled'}
                  </span>
                  {' '}• Pre-workout fuel & warm-up chimes active.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Workout:{' '}
                  <strong className="text-slate-200">
                    {workoutReminder.enabled ? workoutReminder.scheduledTime : 'Off'}
                  </strong>
                </span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Meals:{' '}
                  <strong className="text-slate-200">{activeMealsCount} scheduled</strong>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => triggerTestReminder(variant === 'diet' ? 'meal' : 'workout')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
            title="Test reminder sound and alert"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Chime</span>
          </button>

          <button
            onClick={onOpenRemindersModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <span>Manage Reminders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
