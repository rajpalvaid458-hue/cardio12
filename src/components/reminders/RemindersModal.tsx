import React, { useState, useEffect } from 'react';
import { useFitness } from '../../context/FitnessContext';
import { MealType } from '../../types';
import {
  requestNotificationPermission,
  getNotificationPermission,
  NotificationPermissionState,
} from '../../utils/notifications';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Dumbbell,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  X,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Flame,
  Check,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'training' | 'diet') => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const {
    workoutReminder,
    updateWorkoutReminder,
    mealReminders,
    updateMealReminder,
    toggleMealReminder,
    addMealReminder,
    deleteMealReminder,
    activeInAppAlerts,
    dismissAlert,
    clearAllAlerts,
    triggerTestReminder,
    plans,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition' | 'alerts'>('workout');
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>('default');

  // Custom meal reminder creator state
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMealLabel, setNewMealLabel] = useState('');
  const [newMealType, setNewMealType] = useState<MealType>('snack');
  const [newMealTime, setNewMealTime] = useState('03:30 PM');
  const [newMealCals, setNewMealCals] = useState('250');
  const [newMealProtein, setNewMealProtein] = useState('20');
  const [newMealTip, setNewMealTip] = useState('Time to refuel and log macros!');

  // Check notification permission on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      setPermissionState(getNotificationPermission());
    }
  }, [isOpen]);

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermissionState(perm);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    const currentDays = workoutReminder.workoutDays || [];
    const updated = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    updateWorkoutReminder({ workoutDays: updated });
  };

  const handleCreateCustomMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealLabel.trim()) return;

    addMealReminder({
      mealType: newMealType,
      label: newMealLabel.trim(),
      time: newMealTime,
      enabled: true,
      soundAlert: true,
      browserNotification: true,
      suggestedCalories: parseInt(newMealCals, 10) || 200,
      suggestedProteinGrams: parseInt(newMealProtein, 10) || 15,
      reminderTip: newMealTip.trim(),
    });

    setNewMealLabel('');
    setShowAddMealForm(false);
  };

  const unreadAlertsCount = activeInAppAlerts.filter((a) => a.unread).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  Smart Reminders & Notifications
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live System
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Scheduled browser alerts, audio cues & timely checkpoints for workouts and nutrition
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Reminders"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Permission Alert Bar */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  permissionState === 'granted'
                    ? 'bg-emerald-400 animate-pulse'
                    : permissionState === 'denied'
                    ? 'bg-rose-400'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-xs font-semibold text-slate-200">
                Browser Push Notifications:{' '}
                <span
                  className={
                    permissionState === 'granted'
                      ? 'text-emerald-400 font-bold'
                      : permissionState === 'denied'
                      ? 'text-rose-400 font-bold'
                      : 'text-amber-400 font-bold'
                  }
                >
                  {permissionState === 'granted'
                    ? 'Active & Enabled'
                    : permissionState === 'denied'
                    ? 'Blocked by Browser'
                    : 'Permission Not Yet Granted'}
                </span>
              </span>
            </div>

            {permissionState !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm"
              >
                Enable Push Alerts
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'workout'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Workout Schedule</span>
              {workoutReminder.enabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'nutrition'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Nutrition & Meals</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-900/60 text-emerald-300 font-mono">
                {mealReminders.filter((m) => m.enabled).length}/{mealReminders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'alerts'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Recent Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-extrabold">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
          {/* TAB 1: WORKOUT REMINDER */}
          {activeTab === 'workout' && (
            <div className="space-y-6">
              {/* Primary Master Toggle */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Scheduled Workout Reminders
                    </h3>
                    <p className="text-xs text-slate-500">
                      Proactively chimes and sends browser notifications when it's training time.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workoutReminder.enabled}
                    onChange={(e) => updateWorkoutReminder({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Time & Plan Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Scheduled Workout Time
                  </label>
                  <select
                    value={workoutReminder.scheduledTime}
                    onChange={(e) => updateWorkoutReminder({ scheduledTime: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
                  >
                    {[
                      '05:00 AM',
                      '05:30 AM',
                      '06:00 AM',
                      '06:30 AM',
                      '07:00 AM',
                      '07:30 AM',
                      '08:00 AM',
                      '08:30 AM',
                      '09:00 AM',
                      '10:00 AM',
                      '11:00 AM',
                      '12:00 PM',
                      '01:00 PM',
                      '02:00 PM',
                      '03:00 PM',
                      '04:00 PM',
                      '04:30 PM',
                      '05:00 PM',
                      '05:30 PM',
                      '06:00 PM',
                      '06:30 PM',
                      '07:00 PM',
                      '07:30 PM',
                      '08:00 PM',
                      '08:30 PM',
                      '09:00 PM',
                    ].map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    The app monitors your clock and triggers alerts when this time strikes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Target Routine / Workout Plan
                  </label>
                  <select
                    value={workoutReminder.targetPlanTitle || ''}
                    onChange={(e) => updateWorkoutReminder({ targetPlanTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
                  >
                    <option value="">General Daily Session</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.splitDays.length} split)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    Displayed in notification banner and quick start link.
                  </p>
                </div>
              </div>

              {/* Active Training Days */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Active Reminder Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isSelected = (workoutReminder.workoutDays || []).includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        <span>{day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Workout Timing: Pre-workout Fuel & Warm-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pre-workout Fuel */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Pre-Workout Fuel Alert
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workoutReminder.preWorkoutFuelEnabled}
                        onChange={(e) =>
                          updateWorkoutReminder({ preWorkoutFuelEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={workoutReminder.preWorkoutFuelReminderMins}
                      onChange={(e) =>
                        updateWorkoutReminder({
                          preWorkoutFuelReminderMins: parseInt(e.target.value, 10),
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value={30}>30 mins before</option>
                      <option value={45}>45 mins before</option>
                      <option value={60}>60 mins before</option>
                    </select>
                    <span className="text-xs text-slate-500">to eat carbs & hydrate</span>
                  </div>
                </div>

                {/* Warm-up Alert */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-emerald-600" />
                      Dynamic Warm-Up Chime
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workoutReminder.warmupEnabled}
                        onChange={(e) =>
                          updateWorkoutReminder({ warmupEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={workoutReminder.warmupReminderMins}
                      onChange={(e) =>
                        updateWorkoutReminder({
                          warmupReminderMins: parseInt(e.target.value, 10),
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value={10}>10 mins before</option>
                      <option value={15}>15 mins before</option>
                      <option value={20}>20 mins before</option>
                    </select>
                    <span className="text-xs text-slate-500">to start joint mobility</span>
                  </div>
                </div>
              </div>

              {/* Alert Mode Toggles & Test Trigger */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={workoutReminder.soundAlert}
                      onChange={(e) => updateWorkoutReminder({ soundAlert: e.target.checked })}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <Volume2 className="w-4 h-4 text-slate-500" />
                    <span>Audio Fanfare Chime</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={workoutReminder.browserNotification}
                      onChange={(e) =>
                        updateWorkoutReminder({ browserNotification: e.target.checked })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <Bell className="w-4 h-4 text-slate-500" />
                    <span>Browser Notification</span>
                  </label>
                </div>

                <button
                  onClick={() => triggerTestReminder('workout')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Workout Alert Now</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: NUTRITION & MEAL REMINDERS */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Scheduled Nutrition Log Reminders
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get alerted at your scheduled meal times so you never miss logging protein & calories.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerTestReminder('meal', 'lunch')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test Chime</span>
                  </button>
                  <button
                    onClick={() => setShowAddMealForm(!showAddMealForm)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Reminder</span>
                  </button>
                </div>
              </div>

              {/* Add Custom Meal Reminder Form */}
              <AnimatePresence>
                {showAddMealForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleCreateCustomMeal}
                    className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">
                        Create New Meal / Snack Reminder
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddMealForm(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Meal Label
                        </label>
                        <input
                          type="text"
                          required
                          value={newMealLabel}
                          onChange={(e) => setNewMealLabel(e.target.value)}
                          placeholder="e.g. Afternoon Protein Shake"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Category
                        </label>
                        <select
                          value={newMealType}
                          onChange={(e) => setNewMealType(e.target.value as MealType)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="snack">Snack / Refuel</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Scheduled Time
                        </label>
                        <select
                          value={newMealTime}
                          onChange={(e) => setNewMealTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {[
                            '07:00 AM',
                            '08:00 AM',
                            '08:30 AM',
                            '09:30 AM',
                            '10:30 AM',
                            '11:00 AM',
                            '12:00 PM',
                            '01:00 PM',
                            '01:30 PM',
                            '02:30 PM',
                            '03:30 PM',
                            '04:30 PM',
                            '05:30 PM',
                            '06:30 PM',
                            '07:30 PM',
                            '08:00 PM',
                            '08:30 PM',
                            '09:30 PM',
                            '10:00 PM',
                          ].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Target Calories & Protein
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={newMealCals}
                            onChange={(e) => setNewMealCals(e.target.value)}
                            placeholder="Cals (e.g. 350)"
                            className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                          />
                          <input
                            type="number"
                            value={newMealProtein}
                            onChange={(e) => setNewMealProtein(e.target.value)}
                            placeholder="Protein (g)"
                            className="w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Reminder Coaching Tip
                        </label>
                        <input
                          type="text"
                          value={newMealTip}
                          onChange={(e) => setNewMealTip(e.target.value)}
                          placeholder="Tip in notification"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddMealForm(false)}
                        className="px-3 py-1.5 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-sm"
                      >
                        Save Reminder
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Meal Reminders List */}
              <div className="space-y-3">
                {mealReminders.map((meal) => (
                  <div
                    key={meal.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      meal.enabled
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            meal.enabled
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <UtensilsCrossed className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{meal.label}</h4>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              {meal.mealType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {meal.reminderTip || 'Log your macros and hit today’s targets.'}
                          </p>
                        </div>
                      </div>

                      {/* Right controls: time selector, toggles & delete */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <select
                          value={meal.time}
                          onChange={(e) => updateMealReminder(meal.id, { time: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800"
                        >
                          {[
                            '06:00 AM',
                            '07:00 AM',
                            '07:30 AM',
                            '08:00 AM',
                            '08:30 AM',
                            '09:00 AM',
                            '10:00 AM',
                            '11:00 AM',
                            '11:30 AM',
                            '12:00 PM',
                            '12:30 PM',
                            '01:00 PM',
                            '01:30 PM',
                            '02:00 PM',
                            '03:00 PM',
                            '04:00 PM',
                            '04:30 PM',
                            '05:00 PM',
                            '06:00 PM',
                            '07:00 PM',
                            '07:30 PM',
                            '08:00 PM',
                            '08:30 PM',
                            '09:00 PM',
                            '09:30 PM',
                            '10:00 PM',
                          ].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        {/* Sound toggle */}
                        <button
                          onClick={() =>
                            updateMealReminder(meal.id, { soundAlert: !meal.soundAlert })
                          }
                          className={`p-1.5 rounded-lg transition ${
                            meal.soundAlert !== false
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                          }`}
                          title="Toggle sound chime"
                        >
                          {meal.soundAlert !== false ? (
                            <Volume2 className="w-4 h-4" />
                          ) : (
                            <VolumeX className="w-4 h-4" />
                          )}
                        </button>

                        {/* On/Off Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meal.enabled}
                            onChange={() => toggleMealReminder(meal.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>

                        {/* Delete button if custom */}
                        {meal.id.startsWith('meal-') &&
                          !['meal-breakfast', 'meal-lunch', 'meal-dinner'].includes(meal.id) && (
                            <button
                              onClick={() => deleteMealReminder(meal.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                              title="Delete custom reminder"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECENT ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Reminder History & Notifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review triggered workout and nutrition alerts with instant log shortcuts.
                  </p>
                </div>

                {activeInAppAlerts.length > 0 && (
                  <button
                    onClick={clearAllAlerts}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {activeInAppAlerts.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">No Notifications Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When your scheduled workout time arrives or it's time to log a meal, alerts will
                    appear here and as browser push notifications.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      onClick={() => triggerTestReminder('workout')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                      Trigger Test Workout Alert
                    </button>
                    <button
                      onClick={() => triggerTestReminder('meal', 'dinner')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                    >
                      Trigger Test Nutrition Alert
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeInAppAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition ${
                        alert.type === 'workout'
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                            alert.type === 'workout'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {alert.type === 'workout' ? (
                            <Dumbbell className="w-5 h-5" />
                          ) : (
                            <UtensilsCrossed className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(alert.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>

                          {/* Quick action jump */}
                          {alert.actionType && (
                            <div className="pt-1.5">
                              {alert.actionType === 'start_workout' && (
                                <button
                                  onClick={() => {
                                    onClose();
                                    onNavigateTab?.('training');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 transition shadow-sm"
                                >
                                  <Dumbbell className="w-3.5 h-3.5" />
                                  <span>Open Workouts</span>
                                </button>
                              )}
                              {alert.actionType === 'log_meal' && (
                                <button
                                  onClick={() => {
                                    onClose();
                                    onNavigateTab?.('diet');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-500 transition shadow-sm"
                                >
                                  <UtensilsCrossed className="w-3.5 h-3.5" />
                                  <span>Open Nutrition Log</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition"
                        title="Dismiss alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Active in background while app is open</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
