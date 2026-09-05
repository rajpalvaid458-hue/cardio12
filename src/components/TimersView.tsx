import React, { useState, useEffect, useRef } from 'react';
import { useFitness } from '../context/FitnessContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  Hourglass,
} from 'lucide-react';
import {
  playCountdownBeep,
  playWorkStartTone,
  playRestStartTone,
  playVictoryFanfare,
} from '../utils/audio';

type TimerMode = 'rest' | 'tabata' | 'emom' | 'stopwatch';

const TIMERS_STORAGE_KEY = 'pulsefit_timers_config_v1';

interface SavedTimersState {
  activeMode?: TimerMode;
  soundEnabled?: boolean;
  restDuration?: number;
  tabataWork?: number;
  tabataRest?: number;
  tabataTotalRounds?: number;
  emomTotalMins?: number;
  stopwatchMs?: number;
  laps?: { id: number; timeMs: number; splitMs: number }[];
}

const getSavedTimers = (): SavedTimersState => {
  try {
    const data = localStorage.getItem(TIMERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const TimersView: React.FC = () => {
  const { startRestTimer } = useFitness();
  const savedState = useRef(getSavedTimers()).current;

  const [activeMode, setActiveMode] = useState<TimerMode>(savedState.activeMode || 'rest');
  const [soundEnabled, setSoundEnabled] = useState(savedState.soundEnabled ?? true);

  // 1. REST TIMER STATE
  const [restDuration, setRestDuration] = useState<number>(savedState.restDuration || 60);
  const [restRemaining, setRestRemaining] = useState<number>(savedState.restDuration || 60);
  const [isRestRunning, setIsRestRunning] = useState<boolean>(false);

  // 2. TABATA / HIIT STATE
  const [tabataWork, setTabataWork] = useState<number>(savedState.tabataWork || 20);
  const [tabataRest, setTabataRest] = useState<number>(savedState.tabataRest || 10);
  const [tabataTotalRounds, setTabataTotalRounds] = useState<number>(savedState.tabataTotalRounds || 8);
  const [tabataCurrentRound, setTabataCurrentRound] = useState<number>(1);
  const [tabataPhase, setTabataPhase] = useState<'prepare' | 'work' | 'rest' | 'done'>('prepare');
  const [tabataRemaining, setTabataRemaining] = useState<number>(5);
  const [isTabataRunning, setIsTabataRunning] = useState<boolean>(false);

  // 3. EMOM STATE
  const [emomTotalMins, setEmomTotalMins] = useState<number>(savedState.emomTotalMins || 12);
  const [emomCurrentMin, setEmomCurrentMin] = useState<number>(1);
  const [emomSecRemaining, setEmomSecRemaining] = useState<number>(60);
  const [isEmomRunning, setIsEmomRunning] = useState<boolean>(false);

  // 4. STOPWATCH STATE
  const [stopwatchMs, setStopwatchMs] = useState<number>(savedState.stopwatchMs || 0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<{ id: number; timeMs: number; splitMs: number }[]>(savedState.laps || []);

  // Persist timer configurations to localStorage
  useEffect(() => {
    try {
      const stateToSave: SavedTimersState = {
        activeMode,
        soundEnabled,
        restDuration,
        tabataWork,
        tabataRest,
        tabataTotalRounds,
        emomTotalMins,
        stopwatchMs,
        laps,
      };
      localStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignore quota errors if storage full
    }
  }, [
    activeMode,
    soundEnabled,
    restDuration,
    tabataWork,
    tabataRest,
    tabataTotalRounds,
    emomTotalMins,
    stopwatchMs,
    laps,
  ]);

  // Rest Timer Ticking
  useEffect(() => {
    let interval: any = null;
    if (isRestRunning && restRemaining > 0) {
      interval = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            if (soundEnabled) playWorkStartTone();
            setIsRestRunning(false);
            return 0;
          }
          if (soundEnabled && (prev === 4 || prev === 3 || prev === 2)) {
            playCountdownBeep(880, 0.08);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestRunning, restRemaining, soundEnabled]);

  // Tabata / HIIT Ticking
  useEffect(() => {
    let interval: any = null;
    if (isTabataRunning && tabataPhase !== 'done') {
      interval = setInterval(() => {
        setTabataRemaining((prev) => {
          if (soundEnabled && (prev === 4 || prev === 3 || prev === 2)) {
            playCountdownBeep(prev === 2 ? 1046 : 880, 0.08);
          }

          if (prev <= 1) {
            // Transition phase
            if (tabataPhase === 'prepare') {
              if (soundEnabled) playWorkStartTone();
              setTabataPhase('work');
              return tabataWork;
            } else if (tabataPhase === 'work') {
              if (soundEnabled) playRestStartTone();
              if (tabataCurrentRound >= tabataTotalRounds) {
                if (soundEnabled) playVictoryFanfare();
                setTabataPhase('done');
                setIsTabataRunning(false);
                return 0;
              } else {
                setTabataPhase('rest');
                return tabataRest;
              }
            } else if (tabataPhase === 'rest') {
              if (soundEnabled) playWorkStartTone();
              setTabataCurrentRound((r) => r + 1);
              setTabataPhase('work');
              return tabataWork;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [
    isTabataRunning,
    tabataPhase,
    tabataRemaining,
    tabataWork,
    tabataRest,
    tabataCurrentRound,
    tabataTotalRounds,
    soundEnabled,
  ]);

  // EMOM Ticking
  useEffect(() => {
    let interval: any = null;
    if (isEmomRunning) {
      interval = setInterval(() => {
        setEmomSecRemaining((prev) => {
          if (soundEnabled && (prev === 4 || prev === 3 || prev === 2)) {
            playCountdownBeep(880, 0.08);
          }

          if (prev <= 1) {
            if (emomCurrentMin >= emomTotalMins) {
              if (soundEnabled) playVictoryFanfare();
              setIsEmomRunning(false);
              return 0;
            } else {
              if (soundEnabled) playWorkStartTone();
              setEmomCurrentMin((m) => m + 1);
              return 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEmomRunning, emomSecRemaining, emomCurrentMin, emomTotalMins, soundEnabled]);

  // Stopwatch Ticking
  useEffect(() => {
    let interval: any = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Rest Timer Helpers
  const handleSetRestPreset = (secs: number) => {
    setRestDuration(secs);
    setRestRemaining(secs);
    setIsRestRunning(false);
  };

  const handleStartRest = () => {
    if (restRemaining === 0) setRestRemaining(restDuration);
    setIsRestRunning(true);
  };

  const handleResetRest = () => {
    setIsRestRunning(false);
    setRestRemaining(restDuration);
  };

  // Tabata Helpers
  const handleStartTabata = () => {
    setTabataPhase('prepare');
    setTabataRemaining(5);
    setTabataCurrentRound(1);
    setIsTabataRunning(true);
  };

  const handleResetTabata = () => {
    setIsTabataRunning(false);
    setTabataPhase('prepare');
    setTabataRemaining(5);
    setTabataCurrentRound(1);
  };

  // EMOM Helpers
  const handleStartEmom = () => {
    setEmomCurrentMin(1);
    setEmomSecRemaining(60);
    setIsEmomRunning(true);
  };

  const handleResetEmom = () => {
    setIsEmomRunning(false);
    setEmomCurrentMin(1);
    setEmomSecRemaining(60);
  };

  // Stopwatch Helpers
  const handleAddLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].timeMs : 0;
    const split = stopwatchMs - lastLapTime;
    setLaps([{ id: laps.length + 1, timeMs: stopwatchMs, splitMs: split }, ...laps]);
  };

  const handleResetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
  };

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${millis < 10 ? '0' : ''}${millis}`;
  };

  const formatMinutesSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Sound Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Timer className="w-3.5 h-3.5" /> Workout Timing & Intervals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Precision Gym Timers</h1>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            soundEnabled
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-white border border-slate-200 text-slate-500'
          }`}
          title="Toggle Audio Cues"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Audio On' : 'Muted'}</span>
        </button>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60 shadow-xs">
        <button
          onClick={() => setActiveMode('rest')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'rest'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Hourglass className="w-4 h-4" />
          <span>Rest Timer</span>
        </button>
        <button
          onClick={() => setActiveMode('tabata')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'tabata'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>HIIT / Tabata</span>
        </button>
        <button
          onClick={() => setActiveMode('emom')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'emom'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>EMOM Round</span>
        </button>
        <button
          onClick={() => setActiveMode('stopwatch')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeMode === 'stopwatch'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Stopwatch</span>
        </button>
      </div>

      {/* 1. REST TIMER TAB */}
      {activeMode === 'rest' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-8 shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Big Countdown Circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-100"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-emerald-600 transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 * (1 - restRemaining / (restDuration || 1))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-5xl sm:text-6xl font-black font-mono text-slate-900 tracking-wider">
                  {formatMinutesSeconds(restRemaining)}
                </span>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 mt-2">
                  {isRestRunning ? 'RESTING' : 'REST INTERVAL'}
                </span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetRest}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={isRestRunning ? () => setIsRestRunning(false) : handleStartRest}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-sm transition-all hover:scale-105"
              >
                {isRestRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                <span>{isRestRunning ? 'PAUSE' : 'START REST'}</span>
              </button>

              <button
                onClick={() => setRestRemaining((prev) => prev + 30)}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs transition-colors border border-slate-200"
                title="+30s"
              >
                +30s
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Rest Presets
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: '30s (Pump)', sec: 30 },
                { label: '45s (Hypertrophy)', sec: 45 },
                { label: '60s (Standard)', sec: 60 },
                { label: '90s (Compound)', sec: 90 },
                { label: '2m (Heavy Squats)', sec: 120 },
                { label: '3m (Powerlifting)', sec: 180 },
              ].map((p) => (
                <button
                  key={p.sec}
                  onClick={() => handleSetRestPreset(p.sec)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    restDuration === p.sec
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-base font-black font-mono">{p.sec}s</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{p.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TABATA & HIIT INTERVAL TAB */}
      {activeMode === 'tabata' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-8 shadow-sm">
          {/* Main Visual Display */}
          <div
            className={`rounded-3xl p-8 text-center transition-colors border ${
              tabataPhase === 'work'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : tabataPhase === 'rest'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : tabataPhase === 'prepare'
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest">
              {tabataPhase === 'prepare' && 'GET READY!'}
              {tabataPhase === 'work' && '🔥 WORK - MAX EFFORT!'}
              {tabataPhase === 'rest' && '💤 RECOVER & BREATHE'}
              {tabataPhase === 'done' && '🏆 TABATA COMPLETE!'}
            </div>

            <div className="text-6xl sm:text-8xl font-black font-mono my-4 tracking-wider">
              {tabataRemaining}s
            </div>

            <div className="text-sm sm:text-base font-bold">
              Round {tabataCurrentRound} of {tabataTotalRounds}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetTabata}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={isTabataRunning ? () => setIsTabataRunning(false) : handleStartTabata}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-sm transition-all hover:scale-105"
            >
              {isTabataRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              <span>{isTabataRunning ? 'PAUSE' : 'START HIIT'}</span>
            </button>
          </div>

          {/* Tabata Configuration Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs text-slate-600 font-semibold block">Work Interval (sec)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={tabataWork}
                disabled={isTabataRunning}
                onChange={(e) => setTabataWork(parseInt(e.target.value, 10) || 20)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-center focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs text-slate-600 font-semibold block">Rest Interval (sec)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={tabataRest}
                disabled={isTabataRunning}
                onChange={(e) => setTabataRest(parseInt(e.target.value, 10) || 10)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-center focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs text-slate-600 font-semibold block">Total Rounds</label>
              <input
                type="number"
                min="1"
                max="30"
                value={tabataTotalRounds}
                disabled={isTabataRunning}
                onChange={(e) => setTabataTotalRounds(parseInt(e.target.value, 10) || 8)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-center focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. EMOM (Every Minute on the Minute) TAB */}
      {activeMode === 'emom' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-8 shadow-sm">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Minute {emomCurrentMin} of {emomTotalMins}
            </div>

            <div className="text-6xl sm:text-8xl font-black font-mono text-slate-900 tracking-wider">
              {emomSecRemaining < 10 ? `0${emomSecRemaining}` : emomSecRemaining}s
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete target reps within the minute. Remaining seconds are your rest before the next minute bell!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetEmom}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={isEmomRunning ? () => setIsEmomRunning(false) : handleStartEmom}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-sm transition-all hover:scale-105"
            >
              {isEmomRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              <span>{isEmomRunning ? 'PAUSE' : 'START EMOM'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {[10, 15, 20].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setEmomTotalMins(mins);
                  handleResetEmom();
                }}
                className={`p-3 rounded-2xl border text-center font-bold text-xs ${
                  emomTotalMins === mins
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mins} Minutes EMOM
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. GYM STOPWATCH TAB */}
      {activeMode === 'stopwatch' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center">
            <div className="text-5xl sm:text-7xl font-black font-mono text-slate-900 tracking-wider">
              {formatStopwatch(stopwatchMs)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetStopwatch}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-sm transition-all hover:scale-105"
            >
              {isStopwatchRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              <span>{isStopwatchRunning ? 'PAUSE' : 'START'}</span>
            </button>

            <button
              onClick={handleAddLap}
              disabled={!isStopwatchRunning}
              className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-sm transition-colors border border-slate-200"
            >
              Lap Split
            </button>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-100 max-h-60 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Lap Splits ({laps.length})
              </div>
              {laps.map((lap) => (
                <div
                  key={lap.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono"
                >
                  <span className="text-slate-500 font-bold">Lap {lap.id}</span>
                  <span className="text-emerald-700">+{formatStopwatch(lap.splitMs)}</span>
                  <span className="text-slate-900 font-bold">{formatStopwatch(lap.timeMs)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
