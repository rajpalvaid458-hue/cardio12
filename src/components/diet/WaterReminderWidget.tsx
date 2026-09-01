import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import {
  Droplets,
  Plus,
  Minus,
  Bell,
  BellOff,
  Volume2,
  Settings,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WaterReminderWidget: React.FC = () => {
  const {
    dailyDiet,
    addWater,
    setWaterGoal,
    waterReminder,
    updateWaterReminderSettings,
    triggerWaterReminderAlert,
  } = useFitness();

  const [showSettings, setShowSettings] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState(dailyDiet.waterGoalMl.toString());
  const [secondsToNext, setSecondsToNext] = useState<number>(0);

  const waterPercent = Math.min(
    100,
    Math.round((dailyDiet.waterMl / (dailyDiet.waterGoalMl || 3000)) * 100)
  );

  // Live countdown timer to next water reminder
  useEffect(() => {
    const updateCountdown = () => {
      if (!waterReminder.enabled) {
        setSecondsToNext(0);
        return;
      }
      const remainingMs = Math.max(0, waterReminder.nextReminderTimestamp - Date.now());
      setSecondsToNext(Math.floor(remainingMs / 1000));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [waterReminder.enabled, waterReminder.nextReminderTimestamp]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customGoalInput, 10);
    if (val && val >= 1000 && val <= 8000) {
      setWaterGoal(val);
      updateWaterReminderSettings({ dailyGoalMl: val });
      setShowSettings(false);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
      {/* Background ambient water glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Droplets className="w-6 h-6 fill-blue-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Smart Hydration & Reminder</span>
              {waterReminder.enabled && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  Active
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-white">Daily Water Tracker</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerWaterReminderAlert()}
            title="Test water drop notification sound"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test Tone</span>
          </button>

          <button
            onClick={() => updateWaterReminderSettings({ enabled: !waterReminder.enabled })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              waterReminder.enabled
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-200 hover:bg-blue-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {waterReminder.enabled ? (
              <>
                <Bell className="w-3.5 h-3.5 text-blue-400" />
                <span>Reminder ON</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5" />
                <span>Reminder OFF</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Water reminder interval settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Next Alert Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Main Stats Card */}
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Logged Hydration</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-white font-mono">{dailyDiet.waterMl}</span>
                <span className="text-sm font-semibold text-slate-400 font-mono">/ {dailyDiet.waterGoalMl} ml</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-blue-400 font-mono">{waterPercent}%</span>
              <span className="text-[11px] text-slate-400 block">of daily goal</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-600/40">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${waterPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Status Message */}
          <div className="flex items-center justify-between text-xs pt-1">
            {dailyDiet.waterMl >= dailyDiet.waterGoalMl ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Daily target crushed! Keep sipping steadily.
              </span>
            ) : (
              <span className="text-slate-300 font-medium">
                💧 {(Math.max(0, dailyDiet.waterGoalMl - dailyDiet.waterMl) / 1000).toFixed(1)}L remaining today
              </span>
            )}

            {waterReminder.enabled && (
              <span className="text-blue-300 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Next alert in <strong className="text-white font-bold">{formatCountdown(secondsToNext)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Reminder Settings Summary Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Reminder Schedule</span>
            <div className="text-base font-bold text-white mt-1">
              Every {waterReminder.intervalMinutes} Minutes
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active between {waterReminder.remindBetweenStart} - {waterReminder.remindBetweenEnd}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
            <span className="text-[11px] text-slate-400">Audio Tone:</span>
            <button
              onClick={() => updateWaterReminderSettings({ soundAlert: !waterReminder.soundAlert })}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                waterReminder.soundAlert
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {waterReminder.soundAlert ? 'Water Drop (ON)' : 'Muted'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Water Logging Actions */}
      <div className="space-y-2 relative z-10">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Drink Log</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => addWater(250)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-200 font-semibold text-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>+250ml Glass</span>
          </button>

          <button
            onClick={() => addWater(500)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/40 text-blue-100 font-semibold text-xs transition-all active:scale-95 shadow-xs"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>+500ml Shaker</span>
          </button>

          <button
            onClick={() => addWater(750)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600/40 hover:bg-blue-600/50 border border-blue-400/50 text-white font-semibold text-xs transition-all active:scale-95 shadow-xs"
          >
            <Plus className="w-4 h-4 text-blue-300" />
            <span>+750ml Bottle</span>
          </button>

          <button
            onClick={() => addWater(1000)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-blue-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>+1000ml Jug</span>
          </button>
        </div>

        {dailyDiet.waterMl > 0 && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => addWater(-250)}
              className="text-[11px] text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <Minus className="w-3 h-3" /> Undo last 250ml
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal Drawer */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" /> Configure Water Reminder Intervals
              </h4>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Interval Selection */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold">Reminder Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => updateWaterReminderSettings({ intervalMinutes: mins })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        waterReminder.intervalMinutes === mins
                          ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Input */}
              <form onSubmit={handleSaveGoal} className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold">Daily Water Goal (ml)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="100"
                    min="1000"
                    max="8000"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
