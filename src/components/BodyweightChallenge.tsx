import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Zap,
  CheckCircle2,
  Award,
  Trophy,
  RotateCcw,
  Share2,
  ChevronRight,
  TrendingUp,
  Clock,
  Dumbbell,
  Sparkles,
  Shield,
  Info,
  Check,
  Plus,
  Minus,
  Coffee,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { playClickFeedback, playVictoryFanfare, playNotificationChime } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import { PRESET_BODYWEIGHT_CHALLENGES } from '../data/bodyweightChallengeData';
import { BodyweightChallengeTrack, BodyweightChallengeDay } from '../types';

const STORAGE_KEY = 'pulsefit_30day_challenge_state';

interface DayProgressItem {
  completed: boolean;
  actualReps: number;
  completedAt: string;
  notes?: string;
}

interface SavedChallengeState {
  activeTrackId: string;
  progressByTrack: Record<string, Record<number, DayProgressItem>>;
}

export const BodyweightChallenge: React.FC = () => {
  const { isHindi } = useLanguage();

  // Load saved state or default
  const [savedState, setSavedState] = useState<SavedChallengeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load challenge state', e);
    }
    return {
      activeTrackId: PRESET_BODYWEIGHT_CHALLENGES[0].id,
      progressByTrack: {},
    };
  });

  const [activeTrackId, setActiveTrackId] = useState<string>(savedState.activeTrackId);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [inputReps, setInputReps] = useState<number>(15);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'weekly'>('weekly');

  // Active track object
  const activeTrack: BodyweightChallengeTrack = useMemo(() => {
    return (
      PRESET_BODYWEIGHT_CHALLENGES.find((t) => t.id === activeTrackId) ||
      PRESET_BODYWEIGHT_CHALLENGES[0]
    );
  }, [activeTrackId]);

  // Active track progress map
  const trackProgress = useMemo(() => {
    return savedState.progressByTrack[activeTrackId] || {};
  }, [savedState, activeTrackId]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeTrackId,
          progressByTrack: savedState.progressByTrack,
        })
      );
    } catch (e) {
      console.warn('Failed to save challenge progress', e);
    }
  }, [savedState, activeTrackId]);

  // Determine current active day (first incomplete day or day 1)
  const firstIncompleteDay = useMemo(() => {
    for (let day = 1; day <= 30; day++) {
      if (!trackProgress[day]?.completed) {
        return day;
      }
    }
    return 30; // All done!
  }, [trackProgress]);

  // When track changes, default selected day to first incomplete day
  useEffect(() => {
    setSelectedDayNumber(firstIncompleteDay);
  }, [activeTrackId, firstIncompleteDay]);

  // Current day data
  const selectedDayData: BodyweightChallengeDay = useMemo(() => {
    return (
      activeTrack.days.find((d) => d.day === selectedDayNumber) ||
      activeTrack.days[0]
    );
  }, [activeTrack, selectedDayNumber]);

  // Selected day completion info
  const selectedDayProgress = trackProgress[selectedDayNumber];
  const isSelectedDayCompleted = Boolean(selectedDayProgress?.completed);

  // Update input reps when selected day changes
  useEffect(() => {
    if (selectedDayProgress?.actualReps) {
      setInputReps(selectedDayProgress.actualReps);
    } else {
      setInputReps(selectedDayData.targetReps);
    }
  }, [selectedDayNumber, selectedDayData, selectedDayProgress]);

  // Derived statistics
  const completedDaysCount = useMemo(() => {
    const items = Object.values(trackProgress) as DayProgressItem[];
    return items.filter((p) => p.completed).length;
  }, [trackProgress]);

  const totalRepsLogged = useMemo(() => {
    const items = Object.values(trackProgress) as DayProgressItem[];
    return items.reduce(
      (sum, p) => sum + (p.completed ? p.actualReps || 0 : 0),
      0
    );
  }, [trackProgress]);

  const completionPercentage = Math.round((completedDaysCount / 30) * 100);

  // Calculate current active streak
  const streak = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= 30; day++) {
      if (trackProgress[day]?.completed) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [trackProgress]);

  // Actions
  const handleSelectTrack = (trackId: string) => {
    playClickFeedback();
    setActiveTrackId(trackId);
  };

  const handleMarkDayCompleted = (dayNum: number, reps: number) => {
    playVictoryFanfare();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#059669', '#34D399', '#F59E0B'],
      });
    } catch {
      // Confetti fallback
    }

    const nowIso = new Date().toISOString();
    setSavedState((prev) => {
      const currentTrackProgress = { ...(prev.progressByTrack[activeTrackId] || {}) };
      currentTrackProgress[dayNum] = {
        completed: true,
        actualReps: reps,
        completedAt: nowIso,
      };

      return {
        ...prev,
        progressByTrack: {
          ...prev.progressByTrack,
          [activeTrackId]: currentTrackProgress,
        },
      };
    });

    // If day was completed and next day exists, advance preview smoothly
    if (dayNum < 30) {
      setTimeout(() => {
        setSelectedDayNumber(dayNum + 1);
      }, 450);
    }
  };

  const handleMarkDayIncomplete = (dayNum: number) => {
    playClickFeedback();
    setSavedState((prev) => {
      const currentTrackProgress = { ...(prev.progressByTrack[activeTrackId] || {}) };
      delete currentTrackProgress[dayNum];

      return {
        ...prev,
        progressByTrack: {
          ...prev.progressByTrack,
          [activeTrackId]: currentTrackProgress,
        },
      };
    });
  };

  const handleResetTrack = () => {
    playClickFeedback();
    setSavedState((prev) => {
      const updated = { ...prev.progressByTrack };
      delete updated[activeTrackId];
      return {
        ...prev,
        progressByTrack: updated,
      };
    });
    setShowResetConfirm(false);
    setSelectedDayNumber(1);
    setInputReps(activeTrack.days[0].targetReps);
  };

  const handleShareProgress = () => {
    playNotificationChime();
    const text = isHindi
      ? `🔥 मैंने पल्सफिट (PulseFit) पर ${activeTrack.titleHi || activeTrack.title} का डे ${completedDaysCount}/30 पूरा कर लिया है! कुल ${totalRepsLogged} ${activeTrack.unit} पूरे किए। #PulseFit #Calisthenics`
      : `🔥 I have completed Day ${completedDaysCount}/30 of the ${activeTrack.title}! Total volume logged: ${totalRepsLogged} ${activeTrack.unit}. Stronger every day with PulseFit Calisthenics! #PulseFit #BodyweightChallenge`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <section className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm space-y-6 p-5 sm:p-7">
      {/* Top Header & Track Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
              {isHindi ? '30-दिवसीय बॉडीवेट चैलेंज' : '30-Day Bodyweight Challenge'}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
              {activeTrack.category} • {activeTrack.difficulty}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {isHindi ? (activeTrack.titleHi || activeTrack.title) : activeTrack.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {isHindi ? (activeTrack.subtitleHi || activeTrack.subtitle) : activeTrack.subtitle}
          </p>
        </div>

        {/* Action Buttons: Reset & Share */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            onClick={handleShareProgress}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Share or Copy Progress"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedNotification ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'शेयर प्रोग्रेस' : 'Share Progress')}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200 cursor-pointer"
            title={isHindi ? 'चैलेंज रीसेट करें' : 'Reset Track'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Challenge Track Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>{isHindi ? 'चैलेंज ट्रैक चुनें' : 'Select Challenge Track'}</span>
          <span className="text-[11px] font-normal text-slate-400">
            {PRESET_BODYWEIGHT_CHALLENGES.length} {isHindi ? 'चुनौतियां उपलब्ध' : 'tracks available'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_BODYWEIGHT_CHALLENGES.map((track) => {
            const isSelected = track.id === activeTrackId;
            const trackItems = Object.values(savedState.progressByTrack[track.id] || {}) as DayProgressItem[];
            const trackDone = trackItems.filter((p) => p.completed).length;
            const pct = Math.round((trackDone / 30) * 100);

            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                  isSelected
                    ? 'bg-slate-950 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {track.exercise}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">
                      {pct}%
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold mt-1.5 line-clamp-1">
                    {isHindi ? (track.titleHi || track.title) : track.title}
                  </h4>
                </div>

                <div className="w-full bg-slate-200/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              {isHindi ? 'पूर्ण किए गए दिन' : 'Days Completed'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {completedDaysCount} <span className="text-xs text-slate-400">/ 30</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              {isHindi ? 'कुल वॉल्यूम' : 'Total Volume'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {totalRepsLogged.toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-sans">{activeTrack.unit}</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              {isHindi ? 'वर्तमान स्ट्रीक' : 'Current Streak'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {streak} <span className="text-xs text-slate-400">{isHindi ? 'दिन' : 'days'}</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500">
              {isHindi ? 'चैलेंज प्रगति' : 'Challenge Progress'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            {isHindi ? '30-दिवसीय सफर' : '30-Day Milestone Tracker'}
          </span>
          <span className="font-mono text-emerald-600 font-bold">
            {completedDaysCount}/30 {isHindi ? 'दिन पूरे' : 'days finished'} ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/70">
          <div
            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Hero Focus: Selected Day Card & Logging Module */}
      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Day details & cues */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 uppercase tracking-wider font-mono">
                Day {selectedDayData.day} of 30
              </span>
              {selectedDayData.isRestDay ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" />
                  {isHindi ? 'सक्रिय विश्राम' : 'Active Recovery Day'}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedDayData.targetSets ? `${selectedDayData.targetSets} sets suggested` : 'Progressive volume'}
                </span>
              )}

              {isSelectedDayCompleted && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  {isHindi ? 'सफलतापूर्वक पूर्ण' : 'Completed'}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedDayData.exerciseName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {selectedDayData.targetDescription}
              </p>
            </div>

            {/* Form Cue Callout */}
            <div className="rounded-xl bg-slate-800/80 border border-slate-700/70 p-3 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-semibold text-emerald-400 block text-[11px] uppercase tracking-wider">
                  {isHindi ? 'कोचिंग संकेत और फॉर्म निर्देश' : 'Form Cue & Execution Instruction'}
                </span>
                <p className="mt-0.5 text-slate-300 leading-relaxed">{selectedDayData.formCue}</p>
              </div>
            </div>
          </div>

          {/* Quick Log Box */}
          <div className="w-full md:w-80 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-4 shrink-0 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isHindi ? 'दैनिक लक्ष्य' : "Day's Target"}</span>
              <span className="font-bold text-white font-mono text-sm">
                {selectedDayData.isRestDay
                  ? (isHindi ? 'विश्राम और स्ट्रेच' : 'Rest & Recharge')
                  : `${selectedDayData.targetReps} ${activeTrack.unit}`}
              </span>
            </div>

            {!selectedDayData.isRestDay ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      playClickFeedback();
                      setInputReps((prev) => Math.max(0, prev - 5));
                    }}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 text-center bg-slate-900 border border-slate-800 rounded-xl py-2 px-3">
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={inputReps}
                      onChange={(e) => setInputReps(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-transparent text-center font-mono font-bold text-2xl text-emerald-400 focus:outline-none"
                    />
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {activeTrack.unit} {isHindi ? 'पूरे किए' : 'logged'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playClickFeedback();
                      setInputReps((prev) => prev + 5);
                    }}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Add Chips */}
                <div className="flex items-center justify-center gap-1.5">
                  {[5, 10, 20].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => {
                        playClickFeedback();
                        setInputReps((prev) => prev + inc);
                      }}
                      className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      +{inc}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      playClickFeedback();
                      setInputReps(selectedDayData.targetReps);
                    }}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                  >
                    {isHindi ? 'टारगेट सेट' : 'Match Target'}
                  </button>
                </div>

                {/* Main Action Button */}
                {isSelectedDayCompleted ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleMarkDayCompleted(selectedDayNumber, inputReps)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isHindi ? 'अपडेट करें' : 'Update Logged Reps'}</span>
                    </button>
                    <button
                      onClick={() => handleMarkDayIncomplete(selectedDayNumber)}
                      className="w-full py-1.5 rounded-lg text-slate-400 hover:text-red-400 text-[11px] font-semibold transition-colors text-center"
                    >
                      {isHindi ? 'अपूर्ण चिह्नित करें' : 'Mark as Incomplete'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkDayCompleted(selectedDayNumber, inputReps)}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHindi ? `डे ${selectedDayNumber} पूर्ण हुआ दर्ज करें` : `Mark Day ${selectedDayNumber} Done`}</span>
                  </button>
                )}
              </div>
            ) : (
              /* Rest Day Action */
              <div className="space-y-3">
                <p className="text-xs text-slate-300 text-center leading-relaxed">
                  {isHindi
                    ? 'मांसपेशियों की रिकवरी और नई ताकत के लिए विश्राम महत्वपूर्ण है।'
                    : 'Rest allows micro-tears in muscle fibers to rebuild stronger.'}
                </p>
                {isSelectedDayCompleted ? (
                  <div className="space-y-2 text-center">
                    <span className="text-xs text-blue-400 font-bold block">
                      ✓ {isHindi ? 'विश्राम दर्ज कर लिया गया है' : 'Recovery Day Logged'}
                    </span>
                    <button
                      onClick={() => handleMarkDayIncomplete(selectedDayNumber)}
                      className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      {isHindi ? 'हटाएं' : 'Undo'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkDayCompleted(selectedDayNumber, 0)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>{isHindi ? 'रिकवरी डे पूरा चिह्नित करें' : 'Log Rest Taken'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 30-Day Interactive Calendar / Matrix Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? '30-दिन का दैनिक कैलेंडर व ग्रिड' : '30-Day Daily Roadmap'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'किसी भी दिन पर क्लिक करके लक्ष्य देखें या पूर्ण चिह्नित करें'
                : 'Click any day card to view target details, cues, or log completion'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDayNumber(firstIncompleteDay)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
            >
              {isHindi ? `अगला दिन (#${firstIncompleteDay})` : `Go to Next Pending (#${firstIncompleteDay})`}
            </button>
            <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                {isHindi ? 'सप्ताहिक' : 'Weekly'}
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                {isHindi ? 'ग्रिड' : 'Grid'}
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'weekly' ? (
          /* Weekly Grouped View */
          <div className="space-y-4">
            {[0, 1, 2, 3].map((weekIdx) => {
              const startDay = weekIdx * 7 + 1;
              const endDay = weekIdx === 3 ? 30 : (weekIdx + 1) * 7;
              const weekDays = activeTrack.days.slice(startDay - 1, endDay);
              const weekTitle = isHindi ? `सप्ताह ${weekIdx + 1}` : `Week ${weekIdx + 1}`;

              return (
                <div key={weekIdx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 pb-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {weekTitle} (Days {startDay}-{endDay})
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      {weekDays.filter((d) => trackProgress[d.day]?.completed).length}/{weekDays.length} {isHindi ? 'पूर्ण' : 'done'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const isCompleted = Boolean(trackProgress[day.day]?.completed);
                      const isSelected = selectedDayNumber === day.day;
                      const isCurrentNext = day.day === firstIncompleteDay;

                      return (
                        <button
                          key={day.day}
                          onClick={() => {
                            playClickFeedback();
                            setSelectedDayNumber(day.day);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-22 group ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30 shadow-xs'
                              : isCompleted
                              ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
                              : isCurrentNext
                              ? 'border-slate-800 bg-white ring-1 ring-slate-400 hover:border-slate-900'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                isCompleted
                                  ? 'text-emerald-700'
                                  : isSelected
                                  ? 'text-emerald-800'
                                  : 'text-slate-600'
                              }`}
                            >
                              Day {day.day}
                            </span>
                            {isCompleted ? (
                              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : day.isRestDay ? (
                              <Coffee className="w-3.5 h-3.5 text-blue-500" />
                            ) : isCurrentNext ? (
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            ) : null}
                          </div>

                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-800 truncate">
                              {day.isRestDay ? (isHindi ? 'विश्राम' : 'Rest') : `${day.targetReps} ${activeTrack.unit}`}
                            </div>
                            <div className="text-[9px] text-slate-400 truncate">
                              {isCompleted
                                ? `${trackProgress[day.day]?.actualReps || 0} ${activeTrack.unit} logged`
                                : day.exerciseName.split(' ')[0]}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 30-Day Grid View */
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {activeTrack.days.map((day) => {
              const isCompleted = Boolean(trackProgress[day.day]?.completed);
              const isSelected = selectedDayNumber === day.day;
              const isCurrentNext = day.day === firstIncompleteDay;

              return (
                <button
                  key={day.day}
                  onClick={() => {
                    playClickFeedback();
                    setSelectedDayNumber(day.day);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between items-center h-20 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
                      : isCurrentNext
                      ? 'border-slate-800 bg-white ring-1 ring-slate-400'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    Day {day.day}
                  </span>

                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center my-0.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : day.isRestDay ? (
                    <Coffee className="w-4 h-4 text-blue-500 my-0.5" />
                  ) : (
                    <div className="text-xs font-mono font-bold text-slate-800 my-0.5">
                      {day.targetReps}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 font-medium">
                    {day.isRestDay ? 'Rest' : activeTrack.unit}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">
                  {isHindi ? 'क्या आप यह चैलेंज रीसेट करना चाहते हैं?' : 'Reset this Challenge Track?'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi
                    ? 'आपके द्वारा लॉग किए गए सभी दिन और आंकड़े मिट जाएंगे। क्या आप नए सिरे से शुरुआत करना चाहते हैं?'
                    : `This will clear your ${completedDaysCount} completed days and logged reps for "${activeTrack.title}".`}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  onClick={handleResetTrack}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {isHindi ? 'हाँ, रीसेट करें' : 'Yes, Reset'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
