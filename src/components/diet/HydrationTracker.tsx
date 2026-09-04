import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { WaterLogEntry } from '../../types';
import {
  Droplets,
  Plus,
  Minus,
  RotateCcw,
  Clock,
  CheckCircle2,
  Volume2,
  Bell,
  BellOff,
  Settings,
  Flame,
  Zap,
  Trash2,
  Star,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playWaterDropTone } from '../../utils/audio';
import { WeeklyHydrationChart } from './WeeklyHydrationChart';

// Container size definition
export interface CommonContainer {
  id: string;
  name: string;
  subtitle: string;
  volumeMl: number;
  type: 'small_glass' | 'glass' | 'mug' | 'shaker' | 'bottle' | 'jug' | 'gallon';
  icon: string;
  badge?: string;
}

export const COMMON_CONTAINERS: CommonContainer[] = [
  {
    id: 'c-small',
    name: 'Small Glass',
    subtitle: 'Chai / Quick Sip',
    volumeMl: 150,
    type: 'small_glass',
    icon: '🥛',
  },
  {
    id: 'c-glass',
    name: 'Standard Glass',
    subtitle: 'Everyday Cup',
    volumeMl: 250,
    type: 'glass',
    icon: '🥛',
    badge: 'Popular',
  },
  {
    id: 'c-mug',
    name: 'Coffee Mug',
    subtitle: 'Tea / Warm Infusion',
    volumeMl: 350,
    type: 'mug',
    icon: '☕',
  },
  {
    id: 'c-shaker',
    name: 'Gym Shaker',
    subtitle: 'Workout Bottle',
    volumeMl: 500,
    type: 'shaker',
    icon: '🥤',
    badge: 'Fitness',
  },
  {
    id: 'c-sports',
    name: 'Sports Bottle',
    subtitle: 'Cycling / Running Canteen',
    volumeMl: 750,
    type: 'bottle',
    icon: '🍶',
  },
  {
    id: 'c-flask',
    name: '1-Liter Flask',
    subtitle: 'Hydro Flask / Thermos',
    volumeMl: 1000,
    type: 'jug',
    icon: '🧊',
    badge: 'High Capacity',
  },
  {
    id: 'c-jug',
    name: 'Large Jug',
    subtitle: '1.5L Daily Desk Jug',
    volumeMl: 1500,
    type: 'jug',
    icon: '🫙',
  },
  {
    id: 'c-gallon',
    name: 'Half Gallon',
    subtitle: 'Hardcore Athlete Pitcher',
    volumeMl: 2000,
    type: 'gallon',
    icon: '💧',
  },
];

const ML_TO_FLOZ = 0.033814;

export const HydrationTracker: React.FC = () => {
  const {
    dailyDiet,
    addWater,
    removeWaterLog,
    resetDailyWater,
    setWaterGoal,
    waterReminder,
    updateWaterReminderSettings,
    triggerWaterReminderAlert,
  } = useFitness();

  // Unit toggle: ml vs fl oz
  const [unit, setUnit] = useState<'ml' | 'oz'>('ml');

  // Custom logging input state
  const [customAmount, setCustomAmount] = useState<string>('300');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Quick favorite container (stored in localStorage)
  const [favoriteContainerId, setFavoriteContainerId] = useState<string>(() => {
    try {
      return localStorage.getItem('pulsefit_fav_water_container') || 'c-glass';
    } catch {
      return 'c-glass';
    }
  });

  // Goal & settings drawer
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [tempGoalInput, setTempGoalInput] = useState<string>(
    dailyDiet.waterGoalMl ? dailyDiet.waterGoalMl.toString() : '3000'
  );

  // Recent action feedback flash
  const [recentFlashMessage, setRecentFlashMessage] = useState<string | null>(null);

  // Countdown to next water reminder
  const [secondsToNext, setSecondsToNext] = useState<number>(0);

  const waterMl = dailyDiet.waterMl || 0;
  const waterGoalMl = dailyDiet.waterGoalMl || 3000;
  const waterPercent = Math.min(100, Math.round((waterMl / waterGoalMl) * 100));
  const waterLogs = dailyDiet.waterLogs || [];

  // Live countdown timer for water reminder
  useEffect(() => {
    const updateCountdown = () => {
      if (!waterReminder?.enabled) {
        setSecondsToNext(0);
        return;
      }
      const remainingMs = Math.max(0, waterReminder.nextReminderTimestamp - Date.now());
      setSecondsToNext(Math.floor(remainingMs / 1000));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [waterReminder?.enabled, waterReminder?.nextReminderTimestamp]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFavoriteChange = (containerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteContainerId(containerId);
    try {
      localStorage.setItem('pulsefit_fav_water_container', containerId);
    } catch {}
  };

  const favoriteContainer =
    COMMON_CONTAINERS.find((c) => c.id === favoriteContainerId) || COMMON_CONTAINERS[1];

  const handleLogContainer = (container: CommonContainer) => {
    addWater(container.volumeMl, container.name, container.type);
    showFlashNotification(`+${container.volumeMl}ml ${container.name} logged!`);
  };

  const handleLogCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (parsed && parsed > 0) {
      const ml = unit === 'oz' ? Math.round(parsed / ML_TO_FLOZ) : parsed;
      const label = customLabel.trim() || `${ml}ml Intake`;
      addWater(ml, label, 'custom');
      showFlashNotification(`+${ml}ml custom intake logged!`);
      setCustomLabel('');
    }
  };

  const showFlashNotification = (msg: string) => {
    setRecentFlashMessage(msg);
    setTimeout(() => {
      setRecentFlashMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempGoalInput, 10);
    if (val && val >= 1000 && val <= 8000) {
      setWaterGoal(val);
      updateWaterReminderSettings({ dailyGoalMl: val });
      setShowSettingsDrawer(false);
      showFlashNotification(`Daily goal updated to ${val}ml!`);
    }
  };

  const formatVolume = (valMl: number) => {
    if (unit === 'oz') {
      return `${(valMl * ML_TO_FLOZ).toFixed(1)} fl oz`;
    }
    return `${valMl.toLocaleString()} ml`;
  };

  // Milestone calculations
  const milestones = [
    { percent: 25, label: 'Morning Kickstart', ml: Math.round(waterGoalMl * 0.25) },
    { percent: 50, label: 'Midday Fuel', ml: Math.round(waterGoalMl * 0.5) },
    { percent: 75, label: 'Afternoon Peak', ml: Math.round(waterGoalMl * 0.75) },
    { percent: 100, label: 'Goal Conquered', ml: waterGoalMl },
  ];

  return (
    <div className="space-y-6" id="hydration-tracking-section">
      {/* Flash Alert notification */}
      <AnimatePresence>
        {recentFlashMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-blue-400/40 flex items-center gap-2.5 text-xs font-bold"
          >
            <Droplets className="w-4 h-4 fill-white" />
            <span>{recentFlashMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hydration Dashboard Card */}
      <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Droplets className="w-6 h-6 fill-blue-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  Smart Hydration Log
                </span>
                {waterReminder?.enabled && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                    <Bell className="w-3 h-3" /> Scheduled
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Daily Water & Container Tracker
              </h2>
            </div>
          </div>

          {/* Unit Toggle & Settings Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Unit Switcher */}
            <div className="bg-slate-800 p-0.5 rounded-xl border border-slate-700 flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setUnit('ml')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  unit === 'ml'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ml
              </button>
              <button
                type="button"
                onClick={() => setUnit('oz')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  unit === 'oz'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                fl oz
              </button>
            </div>

            {/* Test Droplet Sound */}
            <button
              type="button"
              onClick={() => {
                playWaterDropTone();
                showFlashNotification('Audio tone tested: Water Drop bloop');
              }}
              title="Test water droplet sound"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className={`p-2 rounded-xl border transition-colors ${
                showSettingsDrawer
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Configure daily goal and reminder intervals"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Favorite Fast-Log Shortcut Bar */}
        <div className="bg-gradient-to-r from-blue-950/70 to-slate-800/80 border border-blue-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{favoriteContainer.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Quick-Log Favorite
                </span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-sm font-bold text-white">
                {favoriteContainer.name} ({formatVolume(favoriteContainer.volumeMl)})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLogContainer(favoriteContainer)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-900/40 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log 1 {favoriteContainer.name}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress & Water Cylinder Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
          {/* Fluid Cylinder Visualizer */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-800/60 border border-slate-700/60 rounded-3xl relative">
            {/* Visual Bottle / Glass */}
            <div className="w-36 h-52 rounded-b-3xl rounded-t-xl border-4 border-slate-600 bg-slate-900/90 relative overflow-hidden shadow-inner flex flex-col justify-end">
              {/* Measurement lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-4 px-2 pointer-events-none z-20 opacity-30">
                <div className="w-full border-b border-dashed border-white text-[9px] font-mono text-right">
                  100%
                </div>
                <div className="w-full border-b border-dashed border-white text-[9px] font-mono text-right">
                  75%
                </div>
                <div className="w-full border-b border-dashed border-white text-[9px] font-mono text-right">
                  50%
                </div>
                <div className="w-full border-b border-dashed border-white text-[9px] font-mono text-right">
                  25%
                </div>
              </div>

              {/* Animated Liquid Level */}
              <motion.div
                className={`w-full relative transition-all duration-700 ${
                  waterPercent >= 100
                    ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400'
                    : 'bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400'
                }`}
                style={{ height: `${waterPercent}%` }}
              >
                {/* Wave surface shimmer */}
                <div className="absolute top-0 inset-x-0 h-3 bg-white/30 rounded-t-full blur-xs -translate-y-1 animate-pulse" />
              </motion.div>

              {/* Center readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                <span className="text-3xl font-black text-white font-mono drop-shadow-md">
                  {waterPercent}%
                </span>
                <span className="text-[10px] uppercase font-bold text-cyan-200 tracking-wider drop-shadow-xs">
                  {waterMl >= waterGoalMl ? 'Goal Met!' : 'Hydrated'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-slate-400 font-medium">Current Intake</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {formatVolume(waterMl)}{' '}
                <span className="text-xs text-slate-500 font-normal font-sans">
                  / {formatVolume(waterGoalMl)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats, Milestones & Reminder Schedule */}
          <div className="lg:col-span-8 space-y-5">
            {/* Progress Bar & Status Text */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Hydration Status</span>
                  <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                    {waterMl >= waterGoalMl ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5" /> Target Achieved! Great job staying fueled.
                      </span>
                    ) : (
                      <span className="text-slate-200">
                        💧 {formatVolume(Math.max(0, waterGoalMl - waterMl))} needed to reach daily target
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-cyan-400 font-mono">
                    {waterLogs.length}
                  </span>
                  <span className="text-[11px] text-slate-400 block">drinks logged</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-700/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-600/40">
                <motion.div
                  className={`h-full rounded-full ${
                    waterPercent >= 100
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${waterPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {/* 4 Milestones */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/50">
                {milestones.map((m) => {
                  const reached = waterMl >= m.ml;
                  return (
                    <div
                      key={m.percent}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        reached
                          ? 'bg-blue-900/30 border-blue-500/40 text-blue-200'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase">{m.label}</div>
                      <div className="text-xs font-black font-mono mt-0.5">
                        {m.percent}% ({formatVolume(m.ml)})
                      </div>
                      <div className="text-[10px] mt-0.5">
                        {reached ? (
                          <span className="text-emerald-400 font-bold">✓ Reached</span>
                        ) : (
                          <span className="text-slate-500">Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Reminder & Schedule Strip */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Hydration Interval Chime</div>
                  <div className="text-[11px] text-slate-400">
                    {waterReminder?.enabled ? (
                      <>
                        Interval: Every{' '}
                        <strong className="text-blue-300">
                          {waterReminder.intervalMinutes}m
                        </strong>{' '}
                        • Next chime in{' '}
                        <strong className="text-white font-mono">
                          {formatCountdown(secondsToNext)}
                        </strong>
                      </>
                    ) : (
                      'Reminders currently muted'
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateWaterReminderSettings({ enabled: !waterReminder?.enabled })
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    waterReminder?.enabled
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-200 hover:bg-blue-500/30'
                      : 'bg-slate-700 border-slate-600 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {waterReminder?.enabled ? 'Alerts ON' : 'Turn ON'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Add Container Buttons (Core Feature) */}
        <div className="space-y-3 pt-2 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Quick-Add by Container Size
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                (Click any container to log instantly)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1"
            >
              <span>{showCustomInput ? 'Hide Custom' : '+ Custom Amount'}</span>
            </button>
          </div>

          {/* Container Size Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COMMON_CONTAINERS.map((container) => {
              const isFav = container.id === favoriteContainerId;
              return (
                <div
                  key={container.id}
                  onClick={() => handleLogContainer(container)}
                  className="group relative cursor-pointer p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-blue-500/50 transition-all duration-200 active:scale-[0.98] shadow-xs flex flex-col justify-between"
                >
                  {/* Top Bar inside Card: Icon & Favorite Toggle */}
                  <div className="flex items-start justify-between">
                    <span className="text-2xl filter drop-shadow-sm">{container.icon}</span>
                    <button
                      type="button"
                      onClick={(e) => handleFavoriteChange(container.id, e)}
                      title={isFav ? 'Current Favorite' : 'Mark as Quick-Log Favorite'}
                      className={`p-1 rounded-lg transition-colors ${
                        isFav
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-600 hover:text-slate-400 opacity-60 group-hover:opacity-100'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Body: Name & Subtitle */}
                  <div className="mt-2 space-y-0.5">
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {container.name}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {container.subtitle}
                    </div>
                  </div>

                  {/* Footer: Volume & Quick-Add Button */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-cyan-400 font-mono">
                        {formatVolume(container.volumeMl)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 group-hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition-colors">
                      <Plus className="w-3 h-3 stroke-[3]" /> Add
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Custom Amount Input Drawer */}
          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3"
              >
                <form
                  onSubmit={handleLogCustom}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Log Custom Container / Intake
                    </h4>
                    <span className="text-[11px] text-slate-400">Unit: {unit}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5 space-y-1">
                      <label className="text-[11px] text-slate-400">Volume Amount ({unit})</label>
                      <input
                        type="number"
                        min="10"
                        max="5000"
                        step="10"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. 400"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] text-slate-400">Optional Label</label>
                      <input
                        type="text"
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Coconut water, Infused bottle"
                      />
                    </div>

                    <div className="sm:col-span-3 flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        + Log Water
                      </button>
                    </div>
                  </div>

                  {/* Preset quick chips */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400">Quick set:</span>
                    {[200, 300, 450, 600, 800].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomAmount(preset.toString())}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono"
                      >
                        {preset} {unit}
                      </button>
                    ))}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Drawer */}
        <AnimatePresence>
          {showSettingsDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-slate-800 space-y-4 relative z-10"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-400" /> Hydration Goal & Reminder Preferences
                </h4>
                <button
                  type="button"
                  onClick={() => setShowSettingsDrawer(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Done
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Interval Selection */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-semibold">
                    Reminder Frequency
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[30, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => updateWaterReminderSettings({ intervalMinutes: mins })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          waterReminder?.intervalMinutes === mins
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
                  <label className="text-xs text-slate-300 font-semibold">
                    Daily Water Goal (ml)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="100"
                      min="1000"
                      max="8000"
                      value={tempGoalInput}
                      onChange={(e) => setTempGoalInput(e.target.value)}
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

              {/* Goal Quick Presets */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">Popular Targets:</span>
                {[2500, 3000, 3500, 4000].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setWaterGoal(g);
                      updateWaterReminderSettings({ dailyGoalMl: g });
                      setTempGoalInput(g.toString());
                      showFlashNotification(`Goal set to ${g}ml!`);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono ${
                      waterGoalMl === g
                        ? 'bg-blue-600/30 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {g}ml
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Weekly Hydration Bar Chart Trend Analysis (Recharts) */}
      <WeeklyHydrationChart
        currentTodayWaterMl={waterMl}
        dailyGoalMl={waterGoalMl}
        unit={unit}
        formatVolume={formatVolume}
      />

      {/* Daily Intake Timeline Log & Management */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Today's Hydration History</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
                {waterLogs.length} Entries
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Time-stamped log of every glass, bottle, and shaker consumed today
            </p>
          </div>

          <div className="flex items-center gap-2">
            {waterLogs.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (waterLogs.length > 0) {
                      const latest = waterLogs[0];
                      removeWaterLog(latest.id);
                      showFlashNotification(`Undid last drink (${latest.amountMl}ml)`);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo Last</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset today’s water intake to zero?')) {
                      resetDailyWater();
                      showFlashNotification('Today’s water intake reset to 0');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Day</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Log Entries List */}
        {waterLogs.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 mx-auto flex items-center justify-center">
              <Droplets className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="text-sm font-bold text-slate-800">No drinks logged yet today</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tap any of the quick-add container buttons above (like the Standard Glass or Gym Shaker) to begin tracking your hydration.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {waterLogs.map((log: WaterLogEntry) => {
              // Find matching container icon if available
              const matchedContainer = COMMON_CONTAINERS.find(
                (c) => c.type === log.containerType || c.volumeMl === log.amountMl
              );
              const icon = matchedContainer?.icon || '💧';

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{log.containerLabel}</span>
                        <span className="text-[10px] text-blue-700 bg-blue-100/60 font-mono px-1.5 py-0.2 rounded">
                          +{formatVolume(log.amountMl)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{log.timeString}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeWaterLog(log.id);
                      showFlashNotification(`Removed ${log.amountMl}ml entry`);
                    }}
                    title="Delete this entry"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Science-Based Hydration Tips Card */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs text-blue-950">
            <div className="font-bold">Coach’s Hydration Rule of Thumb</div>
            <p className="text-blue-800 leading-relaxed">
              Start your day by drinking <strong>500ml of water</strong> right after waking up to reactivate metabolism. For intense workout sessions, add <strong>500–750ml with electrolytes</strong> to sustain muscle contractions and prevent premature cramping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
