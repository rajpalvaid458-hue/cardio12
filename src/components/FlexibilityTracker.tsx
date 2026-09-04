import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  TrendingUp,
  Calendar,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useFitness } from '../context/FitnessContext';
import { FlexibilityAssessment, FlexibilityTestType } from '../types';

interface TestConfig {
  id: FlexibilityTestType;
  name: string;
  targetJoints: string;
  unit: string;
  minVal: number;
  maxVal: number;
  targetVal: number;
  description: string;
  protocol: string;
  levels: { min: number; label: 'Tight' | 'Normal' | 'Good' | 'Excellent' | 'Elite'; color: string }[];
}

const TEST_CONFIGS: Record<FlexibilityTestType, TestConfig> = {
  sit_and_reach: {
    id: 'sit_and_reach',
    name: 'Sit & Reach Test',
    targetJoints: 'Hamstrings, Calves & Lumbar Spine',
    unit: 'cm',
    minVal: -15,
    maxVal: 25,
    targetVal: 8,
    description: 'Gold-standard assessment of posterior chain flexibility measuring distance reached past toes.',
    protocol: 'Sit with legs extended straight against a step or box. Reach forward smoothly with both hands stacked.',
    levels: [
      { min: -15, label: 'Tight', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { min: 0, label: 'Normal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { min: 6, label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      { min: 12, label: 'Excellent', color: 'text-purple-600 bg-purple-50 border-purple-200' },
      { min: 18, label: 'Elite', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    ],
  },
  shoulder_apley: {
    id: 'shoulder_apley',
    name: 'Shoulder Apley Scratch Test',
    targetJoints: 'Rotator Cuff, Glenohumeral & Thoracic',
    unit: 'cm',
    minVal: -15,
    maxVal: 15,
    targetVal: 4,
    description: 'Measures shoulder internal/external rotation and scapular glide by overlapping fingers behind back.',
    protocol: 'Reach one arm overhead behind neck and the other arm behind back. Measure gap (-) or overlap (+) in cm.',
    levels: [
      { min: -15, label: 'Tight', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { min: -2, label: 'Normal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { min: 3, label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      { min: 7, label: 'Excellent', color: 'text-purple-600 bg-purple-50 border-purple-200' },
      { min: 11, label: 'Elite', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    ],
  },
  hip_90_90: {
    id: 'hip_90_90',
    name: 'Hip 90/90 Capsule Rotation',
    targetJoints: 'Hip Capsule, Glutes & Hip Adductors',
    unit: '°',
    minVal: 30,
    maxVal: 95,
    targetVal: 80,
    description: 'Evaluates rotational range of motion in both hip sockets while seated with knees bent at 90° angles.',
    protocol: 'Sit tall with lead hip in 90° external rotation and trail hip in 90° internal rotation. Transition without hands.',
    levels: [
      { min: 30, label: 'Tight', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { min: 55, label: 'Normal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { min: 72, label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      { min: 82, label: 'Excellent', color: 'text-purple-600 bg-purple-50 border-purple-200' },
      { min: 90, label: 'Elite', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    ],
  },
  ankle_dorsiflexion: {
    id: 'ankle_dorsiflexion',
    name: 'Ankle Knee-to-Wall Test',
    targetJoints: 'Talocrural Joint, Soleus & Achilles Tendon',
    unit: 'cm',
    minVal: 2,
    maxVal: 20,
    targetVal: 12,
    description: 'Essential for deep squatting and running ergonomics; measures maximal distance to wall with heel grounded.',
    protocol: 'Place toes away from wall in a half-kneeling stance. Lunge knee straight forward to touch wall without lifting heel.',
    levels: [
      { min: 2, label: 'Tight', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { min: 7, label: 'Normal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { min: 10, label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      { min: 13, label: 'Excellent', color: 'text-purple-600 bg-purple-50 border-purple-200' },
      { min: 16, label: 'Elite', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    ],
  },
  thoracic_rotation: {
    id: 'thoracic_rotation',
    name: 'Thoracic Spine Rotation',
    targetJoints: 'Mid-Back, Ribcage & Shoulder Girdle',
    unit: '°',
    minVal: 25,
    maxVal: 90,
    targetVal: 70,
    description: 'Measures rotational mobility of the thoracic spine to prevent lower back compensation and desk slouching.',
    protocol: 'Quadruped or seated straddle position with hands behind head; rotate chest upward toward ceiling.',
    levels: [
      { min: 25, label: 'Tight', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { min: 45, label: 'Normal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { min: 62, label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      { min: 74, label: 'Excellent', color: 'text-purple-600 bg-purple-50 border-purple-200' },
      { min: 84, label: 'Elite', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    ],
  },
  overhead_squat: {
    id: 'overhead_squat',
    name: 'Overhead Squat Mobility Score',
    targetJoints: 'Full Kinetic Chain (Ankles, Hips, Spine, Shoulders)',
    unit: '/100',
    minVal: 40,
    maxVal: 100,
    targetVal: 85,
    description: 'Comprehensive functional mobility screening assessing posture, depth, and upright torso under dowel hold.',
    protocol: 'Hold a light bar/dowel overhead with arms locked at 90°. Perform a full-depth squat without leaning excessively forward.',
    levels: [
      { min: 40, label: 'Tight', color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { min: 60, label: 'Normal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
      { min: 75, label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
      { min: 88, label: 'Excellent', color: 'text-purple-600 bg-purple-50 border-purple-200' },
      { min: 95, label: 'Elite', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    ],
  },
};

const INITIAL_ASSESSMENTS: FlexibilityAssessment[] = [
  // Sit & Reach baseline and improvements
  {
    id: 'flex-1',
    testType: 'sit_and_reach',
    testName: 'Sit & Reach Test',
    date: '2026-07-05',
    score: -2,
    unit: 'cm',
    status: 'Tight',
    notes: 'Baseline check. Unable to touch toes; stiff hamstrings.',
  },
  {
    id: 'flex-2',
    testType: 'sit_and_reach',
    testName: 'Sit & Reach Test',
    date: '2026-07-20',
    score: 1.5,
    unit: 'cm',
    status: 'Normal',
    notes: 'Past toes after 2 weeks of morning vinyasa and hamstring stretch.',
  },
  {
    id: 'flex-3',
    testType: 'sit_and_reach',
    testName: 'Sit & Reach Test',
    date: '2026-08-08',
    score: 5,
    unit: 'cm',
    status: 'Normal',
    notes: 'Feeling looser; posterior chain elongation.',
  },
  {
    id: 'flex-4',
    testType: 'sit_and_reach',
    testName: 'Sit & Reach Test',
    date: '2026-08-25',
    score: 8.5,
    unit: 'cm',
    status: 'Good',
    notes: 'Target achieved! Palms flat on feet comfortably.',
  },

  // Shoulder Apley
  {
    id: 'flex-5',
    testType: 'shoulder_apley',
    testName: 'Shoulder Apley Scratch Test',
    date: '2026-07-10',
    score: -3,
    unit: 'cm',
    status: 'Tight',
    notes: 'Right shoulder tight from heavy bench pressing.',
  },
  {
    id: 'flex-6',
    testType: 'shoulder_apley',
    testName: 'Shoulder Apley Scratch Test',
    date: '2026-08-01',
    score: 1,
    unit: 'cm',
    status: 'Normal',
    notes: 'Doorway pectoral stretch daily opened thoracic spine.',
  },
  {
    id: 'flex-7',
    testType: 'shoulder_apley',
    testName: 'Shoulder Apley Scratch Test',
    date: '2026-08-28',
    score: 4.5,
    unit: 'cm',
    status: 'Good',
    notes: 'Fingertips easily interlock behind back.',
  },

  // Hip 90/90
  {
    id: 'flex-8',
    testType: 'hip_90_90',
    testName: 'Hip 90/90 Capsule Rotation',
    date: '2026-07-15',
    score: 52,
    unit: '°',
    status: 'Tight',
    notes: 'Tight hip internal rotation when seated on floor.',
  },
  {
    id: 'flex-9',
    testType: 'hip_90_90',
    testName: 'Hip 90/90 Capsule Rotation',
    date: '2026-08-12',
    score: 68,
    unit: '°',
    status: 'Normal',
    notes: 'Significant improvement with pigeon pose and 90/90 transitions.',
  },
  {
    id: 'flex-10',
    testType: 'hip_90_90',
    testName: 'Hip 90/90 Capsule Rotation',
    date: '2026-08-30',
    score: 81,
    unit: '°',
    status: 'Good',
    notes: 'Both knees stay flat to the floor without leaning torso.',
  },

  // Ankle Dorsiflexion
  {
    id: 'flex-11',
    testType: 'ankle_dorsiflexion',
    testName: 'Ankle Knee-to-Wall Test',
    date: '2026-07-18',
    score: 8,
    unit: 'cm',
    status: 'Normal',
    notes: 'Slight calf stiffness after running.',
  },
  {
    id: 'flex-12',
    testType: 'ankle_dorsiflexion',
    testName: 'Ankle Knee-to-Wall Test',
    date: '2026-08-22',
    score: 12.5,
    unit: 'cm',
    status: 'Good',
    notes: 'Deep squatting is much more comfortable now.',
  },

  // Thoracic Rotation
  {
    id: 'flex-13',
    testType: 'thoracic_rotation',
    testName: 'Thoracic Spine Rotation',
    date: '2026-07-22',
    score: 48,
    unit: '°',
    status: 'Normal',
    notes: 'Mid-back stiff from desk work.',
  },
  {
    id: 'flex-14',
    testType: 'thoracic_rotation',
    testName: 'Thoracic Spine Rotation',
    date: '2026-08-26',
    score: 72,
    unit: '°',
    status: 'Good',
    notes: 'Cat-cow flow & reclined spinal twists freed ribcage rotation.',
  },

  // Overhead Squat
  {
    id: 'flex-15',
    testType: 'overhead_squat',
    testName: 'Overhead Squat Mobility Score',
    date: '2026-07-25',
    score: 62,
    unit: '/100',
    status: 'Normal',
    notes: 'Torso angled forward; arms drifted anterior.',
  },
  {
    id: 'flex-16',
    testType: 'overhead_squat',
    testName: 'Overhead Squat Mobility Score',
    date: '2026-08-29',
    score: 84,
    unit: '/100',
    status: 'Good',
    notes: 'Chest stays upright; arms vertical through parallel.',
  },
];

export const FlexibilityTracker: React.FC = () => {
  const { workoutLogs } = useFitness();

  // Stored assessments state
  const [assessments, setAssessments] = useState<FlexibilityAssessment[]>(() => {
    try {
      const saved = localStorage.getItem('pulsefit_flexibility_assessments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ASSESSMENTS;
  });

  // Active view tab & selected test
  const [activeTab, setActiveTab] = useState<'rom' | 'consistency'>('rom');
  const [selectedTest, setSelectedTest] = useState<FlexibilityTestType>('sit_and_reach');
  const [showLogModal, setShowLogModal] = useState(false);

  // New assessment form state
  const [formTest, setFormTest] = useState<FlexibilityTestType>('sit_and_reach');
  const [formScore, setFormScore] = useState<string>('9.0');
  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState<string>('');

  // Persist assessments
  useEffect(() => {
    try {
      localStorage.setItem('pulsefit_flexibility_assessments', JSON.stringify(assessments));
    } catch {
      // ignore
    }
  }, [assessments]);

  // Current config
  const currentConfig = TEST_CONFIGS[selectedTest];

  // Filter assessments for selected test and sort chronologically
  const currentTestLogs = useMemo(() => {
    return assessments
      .filter((a) => a.testType === selectedTest)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [assessments, selectedTest]);

  // Range of Motion progression chart data
  const chartData = useMemo(() => {
    return currentTestLogs.map((log) => {
      const dateObj = new Date(log.date);
      const shortDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return {
        date: shortDate,
        fullDate: log.date,
        score: log.score,
        target: currentConfig.targetVal,
        status: log.status,
        notes: log.notes || '',
      };
    });
  }, [currentTestLogs, currentConfig]);

  // ROM Improvement Calculation
  const romImprovement = useMemo(() => {
    if (currentTestLogs.length < 2) return null;
    const first = currentTestLogs[0].score;
    const last = currentTestLogs[currentTestLogs.length - 1].score;
    const diff = +(last - first).toFixed(1);
    const percent = first !== 0 ? Math.round(((last - first) / Math.abs(first)) * 100) : 0;
    return { diff, percent, first, last };
  }, [currentTestLogs]);

  // Weekly stretching consistency data (past 8 weeks)
  const consistencyData = useMemo(() => {
    // Generate 8 weeks
    const weeks: { weekLabel: string; sessions: number; minutes: number; target: number }[] = [];
    const now = new Date();

    // Scan workout logs for yoga/stretching/mobility
    const flexibilityWorkouts = workoutLogs.filter((w) => {
      const txt = (w.title + ' ' + (w.notes || '')).toLowerCase();
      return txt.includes('yoga') || txt.includes('stretch') || txt.includes('mobility') || txt.includes('flexibility') || txt.includes('yin') || txt.includes('vinyasa');
    });

    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const label = `W${8 - i}`;

      // Count workouts in this week
      const inWeek = flexibilityWorkouts.filter((w) => {
        const wDate = new Date(w.date);
        return wDate >= startOfWeek && wDate <= endOfWeek;
      });

      // Also count flexibility assessments logged in this week
      const assessInWeek = assessments.filter((a) => {
        const aDate = new Date(a.date);
        return aDate >= startOfWeek && aDate <= endOfWeek;
      });

      // Default baseline activity curve if no logs yet to provide immediate visual guidance
      const baseSessions = [3, 4, 3, 5, 4, 4, 5, 4][7 - i];
      const baseMinutes = [60, 80, 65, 110, 85, 90, 115, 95][7 - i];

      const actualSessions = inWeek.length + assessInWeek.length;
      const actualMinutes = inWeek.reduce((acc, l) => acc + Math.round(l.durationSeconds / 60), 0);

      weeks.push({
        weekLabel: label,
        sessions: Math.max(baseSessions, actualSessions),
        minutes: Math.max(baseMinutes, actualMinutes),
        target: 4,
      });
    }
    return weeks;
  }, [workoutLogs, assessments]);

  // Calculate high-level KPIs
  const totalStretchingSessions = useMemo(() => {
    const fromWorkouts = workoutLogs.filter((w) => {
      const txt = (w.title + ' ' + (w.notes || '')).toLowerCase();
      return txt.includes('yoga') || txt.includes('stretch') || txt.includes('mobility') || txt.includes('flexibility');
    }).length;
    return fromWorkouts + assessments.length;
  }, [workoutLogs, assessments]);

  // Latest status across all tests
  const latestByTest = useMemo(() => {
    const result: Partial<Record<FlexibilityTestType, FlexibilityAssessment>> = {};
    (Object.keys(TEST_CONFIGS) as FlexibilityTestType[]).forEach((t) => {
      const match = assessments
        .filter((a) => a.testType === t)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      if (match) result[t] = match;
    });
    return result;
  }, [assessments]);

  // Handle logging new assessment
  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseFloat(formScore);
    if (isNaN(scoreNum)) return;

    const conf = TEST_CONFIGS[formTest];

    // Determine status from levels
    let status: 'Tight' | 'Normal' | 'Good' | 'Excellent' | 'Elite' = 'Normal';
    for (const lvl of conf.levels) {
      if (scoreNum >= lvl.min) {
        status = lvl.label;
      }
    }

    const newAssessment: FlexibilityAssessment = {
      id: `flex-${Date.now()}`,
      testType: formTest,
      testName: conf.name,
      date: formDate,
      score: scoreNum,
      unit: conf.unit,
      status,
      notes: formNotes.trim() || undefined,
    };

    setAssessments((prev) => [...prev, newAssessment]);
    setSelectedTest(formTest);
    setShowLogModal(false);
    setFormNotes('');
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleResetToBaseline = () => {
    if (confirm('Reset flexibility assessments to baseline demonstration data?')) {
      setAssessments(INITIAL_ASSESSMENTS);
    }
  };

  return (
    <section className="space-y-6">
      {/* Container Header */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 text-purple-600" /> Flexibility & Mobility Analytics
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Range of Motion & Stretching Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
              Track joint range-of-motion progression across standardized flexibility assessments, monitor consistency of your yoga and stretching sessions, and prevent postural stiffness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setFormTest(selectedTest);
                setFormScore(String(currentConfig.targetVal));
                setShowLogModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Log Assessment
            </button>
            <button
              onClick={handleResetToBaseline}
              title="Reset to default baseline logs"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High-Level Mobility KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <div className="text-xs text-purple-900 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" /> Flexibility Sessions
            </div>
            <div className="text-2xl font-black text-purple-950 font-mono mt-1">
              {totalStretchingSessions}
            </div>
            <div className="text-[10px] text-purple-700 mt-0.5">Yoga & mobility workouts</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Avg ROM Progress
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              +18.4%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across measured joints</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" /> Weekly Frequency
            </div>
            <div className="text-2xl font-black text-blue-600 font-mono mt-1">
              4.2 / wk
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Target: 4 sessions / wk</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Posture Status
            </div>
            <div className="text-xl font-black text-slate-900 mt-1 truncate">
              Optimal & Mobile
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Low desk-stiffness risk</div>
          </div>
        </div>

        {/* Primary View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('rom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rom'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📐 Range of Motion Progression
            </button>
            <button
              onClick={() => setActiveTab('consistency')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'consistency'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Stretching Consistency & Frequency
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {activeTab === 'rom'
              ? 'Select assessment test below to inspect specific joint angles'
              : 'Weekly training volume across Yoga, Mobility & Stretch routines'}
          </span>
        </div>

        {/* 1. Range of Motion View */}
        {activeTab === 'rom' && (
          <div className="space-y-6 pt-2">
            {/* Standardized Test Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TEST_CONFIGS) as FlexibilityTestType[]).map((type) => {
                const conf = TEST_CONFIGS[type];
                const isSelected = selectedTest === type;
                const latest = latestByTest[type];

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedTest(type)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-purple-50/50 border-slate-200'
                    }`}
                  >
                    <span>{conf.name}</span>
                    {latest && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isSelected ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {latest.score}
                        {conf.unit}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Test Detail & Improvement Card */}
            <div className="bg-gradient-to-br from-purple-50/60 to-slate-50 border border-purple-100 rounded-3xl p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{currentConfig.name}</h3>
                    <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {currentConfig.targetJoints}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">{currentConfig.description}</p>
                </div>

                {romImprovement && (
                  <div className="bg-white px-4 py-2.5 rounded-2xl border border-purple-200 shadow-2xs flex items-center gap-3">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Total Improvement
                      </div>
                      <div className="text-base font-black text-emerald-600 font-mono">
                        {romImprovement.diff > 0 ? `+${romImprovement.diff}` : romImprovement.diff} {currentConfig.unit}
                        <span className="text-xs ml-1 text-emerald-600 font-sans font-bold">
                          ({romImprovement.percent > 0 ? `+${romImprovement.percent}%` : `${romImprovement.percent}%`})
                        </span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Target Standard
                      </div>
                      <div className="text-base font-black text-purple-700 font-mono">
                        {currentConfig.targetVal} {currentConfig.unit}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Protocol Tip Box */}
              <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-2xl border border-slate-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Testing Protocol: </span>
                  {currentConfig.protocol}
                </div>
              </div>

              {/* Interactive Area Chart */}
              <div className="h-64 sm:h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlex" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#7e22ce" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                    />
                    <YAxis
                      domain={[
                        Math.min(currentConfig.minVal, ...chartData.map((d) => d.score - 2)),
                        Math.max(currentConfig.maxVal, ...chartData.map((d) => d.score + 2)),
                      ]}
                      unit={currentConfig.unit}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1">
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {data.fullDate}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-black text-purple-300 font-mono">
                                  {data.score} {currentConfig.unit}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-800 text-purple-200 font-bold">
                                  {data.status}
                                </span>
                              </div>
                              {data.notes && (
                                <div className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800">
                                  "{data.notes}"
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine
                      y={currentConfig.targetVal}
                      stroke="#059669"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Optimal Benchmark (${currentConfig.targetVal}${currentConfig.unit})`,
                        fill: '#059669',
                        fontSize: 10,
                        fontWeight: 700,
                        position: 'insideTopRight',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#7e22ce"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorFlex)"
                      dot={{ fill: '#7e22ce', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 6, stroke: '#581c87', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Levels / Standardized Benchmark Range Indicators */}
              <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Classification Tiers:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentConfig.levels.map((lvl) => (
                    <span
                      key={lvl.label}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${lvl.color}`}
                    >
                      {lvl.label}: ≥ {lvl.min}
                      {currentConfig.unit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Consistency & Frequency View */}
        {activeTab === 'consistency' && (
          <div className="space-y-6 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" /> Weekly Flexibility Routine Frequency
                  </h3>
                  <p className="text-xs text-slate-500">
                    Stretching and yoga consistency across the past 8 weeks compared to your 4x weekly target.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-purple-700" /> Completed Sessions
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500" /> Weekly Goal (4x)
                  </div>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consistencyData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="weekLabel"
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                    />
                    <YAxis
                      domain={[0, 7]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      unit=" sess"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-1">
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                {data.weekLabel} Overview
                              </div>
                              <div className="text-base font-black text-purple-300 font-mono">
                                {data.sessions} Sessions Completed
                              </div>
                              <div className="text-xs text-slate-300">
                                Total Duration: <span className="font-bold text-white">{data.minutes} mins</span>
                              </div>
                              <div className="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                                {data.sessions >= data.target ? '✓ Target Met' : 'Approaching Target'}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine
                      y={4}
                      stroke="#059669"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: 'Goal: 4 Sessions/Wk',
                        fill: '#059669',
                        fontSize: 10,
                        fontWeight: 700,
                        position: 'insideTopRight',
                      }}
                    />
                    <Bar dataKey="sessions" fill="#7e22ce" radius={[8, 8, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Streak & Habit Alignment Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Current Mobility Streak</div>
                  <div className="text-xl font-black text-purple-700 font-mono mt-0.5">5 Consecutive Days</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Keep up daily evening flow</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Average Stretch Duration</div>
                  <div className="text-xl font-black text-slate-900 font-mono mt-0.5">22 Minutes</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Ideal for myofascial release</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Consistency Rating</div>
                  <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">92% On-Track</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Exceeds national athletic benchmarks</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Joint-by-Joint Range of Motion Overview Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" /> Anatomical Range of Motion Diagnostic
            </h3>
            <p className="text-xs text-slate-500">
              Latest assessment checks across primary kinetic chain junctions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(TEST_CONFIGS) as FlexibilityTestType[]).map((type) => {
            const conf = TEST_CONFIGS[type];
            const latest = latestByTest[type];
            const isSelected = selectedTest === type;

            const badgeConfig = conf.levels.find((l) => l.label === (latest?.status || 'Normal')) || conf.levels[1];

            return (
              <div
                key={type}
                onClick={() => {
                  setSelectedTest(type);
                  setActiveTab('rom');
                }}
                className={`p-4 rounded-3xl bg-white border cursor-pointer transition-all hover:shadow-sm ${
                  isSelected ? 'border-purple-400 ring-2 ring-purple-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {conf.targetJoints}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeConfig.color}`}>
                    {latest ? latest.status : 'Pending'}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 mt-1 truncate">{conf.name}</div>

                <div className="flex items-baseline justify-between mt-3">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-2xl font-black text-slate-900">
                      {latest ? latest.score : '--'}
                    </span>
                    <span className="text-xs text-slate-500 font-sans font-bold">{conf.unit}</span>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 font-mono">
                    Goal: {conf.targetVal}
                    {conf.unit}
                  </div>
                </div>

                {latest?.notes && (
                  <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-1">
                    "{latest.notes}"
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
                  <span>View Progression Curve</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Mobility Assessment Logs Table */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Assessment History Log
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log of range of motion checks and feel notes
            </p>
          </div>
          <button
            onClick={() => {
              setFormTest(selectedTest);
              setFormScore(String(currentConfig.targetVal));
              setShowLogModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Check-in
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="pb-3 pl-2">Date</th>
                <th className="pb-3">Test & Joint Focus</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Tier</th>
                <th className="pb-3">Observation / Notes</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...assessments]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((log) => {
                  const conf = TEST_CONFIGS[log.testType];
                  const lvl = conf.levels.find((l) => l.label === log.status) || conf.levels[1];

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pl-2 font-mono text-slate-500 font-semibold">
                        {log.date}
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{log.testName}</div>
                        <div className="text-[10px] text-slate-400">{conf.targetJoints}</div>
                      </td>
                      <td className="py-3 font-mono font-black text-slate-900">
                        {log.score} {log.unit}
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvl.color}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 max-w-xs truncate">
                        {log.notes || '—'}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => handleDeleteAssessment(log.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log New Mobility Assessment */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" /> Log Mobility Assessment
                </h3>
                <p className="text-xs text-slate-500">Record a new range of motion benchmark</p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Test
                </label>
                <select
                  value={formTest}
                  onChange={(e) => {
                    const nextTest = e.target.value as FlexibilityTestType;
                    setFormTest(nextTest);
                    setFormScore(String(TEST_CONFIGS[nextTest].targetVal));
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600"
                >
                  {(Object.keys(TEST_CONFIGS) as FlexibilityTestType[]).map((t) => (
                    <option key={t} value={t}>
                      {TEST_CONFIGS[t].name} ({TEST_CONFIGS[t].unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Measurement ({TEST_CONFIGS[formTest].unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formScore}
                    onChange={(e) => setFormScore(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notes & Joint Sensation
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Felt deep stretch in left hamstring; pain-free shoulder rotation..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
