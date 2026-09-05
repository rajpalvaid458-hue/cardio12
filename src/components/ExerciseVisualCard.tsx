import React, { useState } from 'react';
import { MuscleGroup, TrainingDiscipline } from '../types';
import { getExerciseClipData } from '../utils/exerciseClips';
import {
  Target,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Maximize2,
  Zap,
  Flame,
  Shield,
  Dumbbell,
  Compass,
  ArrowDown,
  ArrowUp,
  Info,
  Play,
  Pause,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExerciseVisualCardProps {
  name: string;
  category: TrainingDiscipline | string;
  targetMuscle: MuscleGroup | string;
  equipment: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  formTips?: string[];
  className?: string;
  size?: 'compact' | 'md' | 'lg' | 'hero';
  showControls?: boolean;
  defaultMode?: 'clip' | 'anatomy';
}

// Biomechanical profiles and anatomical setup data for all major exercise movements
interface MovementBioData {
  primaryMuscles: string[];
  secondaryMuscles: string[];
  setupAngle: string;
  peakAngle: string;
  safetyCue: string;
  phase1Title: string;
  phase1Desc: string;
  phase2Title: string;
  phase2Desc: string;
  targetZone: 'chest' | 'back' | 'shoulders' | 'arms' | 'quads' | 'hamstrings' | 'glutes' | 'abs' | 'calves' | 'fullbody';
  accentColor: string;
  planeOfMotion: 'Sagittal' | 'Frontal' | 'Transverse' | 'Multi-Planar';
  jointLoad: string;
}

function getMovementBioData(name: string, targetMuscle: string, category: string): MovementBioData {
  const n = (name || '').toLowerCase();
  const t = (targetMuscle || '').toLowerCase();

  // 1. Bench Press & Chest Presses
  if (n.includes('bench') || (n.includes('press') && (t.includes('chest') || t.includes('pect')))) {
    return {
      primaryMuscles: ['Pectoralis Major (Sternal & Clavicular)', 'Anterior Deltoid'],
      secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior'],
      setupAngle: '45°-60° Elbow Flare',
      peakAngle: '180° Elbow Lockout',
      safetyCue: 'Pinch shoulder blades (scapular retraction) & keep feet planted firmly.',
      phase1Title: 'Starting Position / Setup',
      phase1Desc: 'Eyes directly under bar, 5-point body contact on bench, bar lowered to lower sternum.',
      phase2Title: 'Peak Contraction / Press',
      phase2Desc: 'Drive through palms in slight J-curve, squeeze chest at top without losing scapular pinch.',
      targetZone: 'chest',
      accentColor: '#f43f5e',
      planeOfMotion: 'Sagittal',
      jointLoad: 'Glenohumeral & Elbow Joints',
    };
  }

  // 2. Squats & Leg Press
  if (n.includes('squat') || n.includes('leg press')) {
    return {
      primaryMuscles: ['Quadriceps Femoris', 'Gluteus Maximus'],
      secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae'],
      setupAngle: '15°-30° Toe Flare Angle',
      peakAngle: 'Parallel (<90° Knee Angle)',
      safetyCue: 'Keep knees tracking in line with toes. Maintain neutral lumbar spine.',
      phase1Title: 'Descent / Eccentric',
      phase1Desc: 'Break at hips and knees simultaneously, chest upright, brace abdominal wall with air.',
      phase2Title: 'Ascent / Drive',
      phase2Desc: 'Drive floor away through mid-foot and heels, explosive hip extension to lockout.',
      targetZone: 'quads',
      accentColor: '#10b981',
      planeOfMotion: 'Sagittal',
      jointLoad: 'Tibiofemoral & Acetabulofemoral Joints',
    };
  }

  // 3. Deadlifts & RDL
  if (n.includes('deadlift') || n.includes('rdl') || n.includes('hinge')) {
    return {
      primaryMuscles: ['Gluteus Maximus', 'Hamstrings', 'Erector Spinae'],
      secondaryMuscles: ['Latissimus Dorsi', 'Trapezius', 'Forearms'],
      setupAngle: '1" Mid-Foot Bar Clearance',
      peakAngle: '180° Tall Postural Lockout',
      safetyCue: 'Drag bar against shins. Zero rounding in thoracic or lumbar spine.',
      phase1Title: 'Hinge Setup / Lift Off',
      phase1Desc: 'Bar over mid-foot, shins touching bar, hips higher than knees, lats clamped tight.',
      phase2Title: 'Hip Lockout',
      phase2Desc: 'Push hips forward to meet bar, squeeze glutes hard without leaning backward.',
      targetZone: 'hamstrings',
      accentColor: '#0ea5e9',
      planeOfMotion: 'Sagittal',
      jointLoad: 'Lumbopelvic & Coxafemoral Hinge',
    };
  }

  // 4. Rows & Lat Pulldown & Pull-ups
  if (n.includes('pull') || n.includes('row') || n.includes('chin')) {
    return {
      primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius (Mid/Lower)'],
      secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids', 'Brachialis'],
      setupAngle: 'Full Overhead / Forward Stretch',
      peakAngle: 'Maximum Scapular Adduction',
      safetyCue: 'Initiate movement by depressing shoulder blades before bending elbows.',
      phase1Title: 'Stretch / Extension',
      phase1Desc: 'Full dead-hang or horizontal stretch, ribcage closed, neutral cervical spine.',
      phase2Title: 'Contraction / Squeeze',
      phase2Desc: 'Drive elbows down and back towards hips, squeeze back muscles for 1 second.',
      targetZone: 'back',
      accentColor: '#0284c7',
      planeOfMotion: 'Frontal',
      jointLoad: 'Scapulothoracic & Elbow Flexion',
    };
  }

  // 5. Overhead Shoulder Press & Lateral Raises
  if (n.includes('shoulder') || n.includes('overhead') || n.includes('military') || n.includes('lateral') || n.includes('raise')) {
    return {
      primaryMuscles: ['Anterior & Lateral Deltoids', 'Supraspinatus'],
      secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core Stabilizers'],
      setupAngle: 'Vertical Forearms (90°)',
      peakAngle: '180° Overhead Lockout',
      safetyCue: 'Lock glutes and core to avoid hyperextending the lower back.',
      phase1Title: 'Rack / Lower Phase',
      phase1Desc: 'Bar/dumbbells at chin level, elbows slightly forward in the scapular plane (30°).',
      phase2Title: 'Overhead Drive',
      phase2Desc: 'Press directly upward, pushing head through "window" of arms at top.',
      targetZone: 'shoulders',
      accentColor: '#f59e0b',
      planeOfMotion: 'Frontal',
      jointLoad: 'Glenohumeral & Acromioclavicular',
    };
  }

  // 6. Arms (Curls & Triceps)
  if (n.includes('curl') || n.includes('tricep') || n.includes('skull') || n.includes('pushdown')) {
    return {
      primaryMuscles: ['Biceps Brachii / Triceps Brachii', 'Brachialis'],
      secondaryMuscles: ['Forearm Flexors/Extensors', 'Anterior/Posterior Deltoids'],
      setupAngle: 'Fixed Elbow Pivot (0° Sway)',
      peakAngle: 'Peak Peak Contraction',
      safetyCue: 'Pin elbows to your ribs. Do not swing torso or use momentum.',
      phase1Title: 'Full Range Stretch',
      phase1Desc: 'Arms fully extended with tricep contraction or controlled eccentric descent.',
      phase2Title: 'Peak Muscle Contraction',
      phase2Desc: 'Curl/extend weights with fixed elbow position, hard isometric squeeze at peak.',
      targetZone: 'arms',
      accentColor: '#a855f7',
      planeOfMotion: 'Sagittal',
      jointLoad: 'Humeroulnar & Radioulnar Joint',
    };
  }

  // 7. Core & Abs (Plank, Leg Raise, Woodchopper)
  if (n.includes('plank') || n.includes('abs') || n.includes('crunch') || n.includes('core') || n.includes('leg raise')) {
    return {
      primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques'],
      secondaryMuscles: ['Hip Flexors', 'Erector Spinae', 'Serratus'],
      setupAngle: '180° Neutral Pelvic Tilt',
      peakAngle: 'Full Abdominal Squeeze',
      safetyCue: 'Press lower back into ground (posterior tilt) to prevent spinal strain.',
      phase1Title: 'Core Bracing & Alignment',
      phase1Desc: 'Straight line from shoulders through hips to ankles. Belly button pulled to spine.',
      phase2Title: 'Isometric / Dynamic Flexion',
      phase2Desc: 'Squeeze ribcage toward pelvis, steady controlled breathing through braced abs.',
      targetZone: 'abs',
      accentColor: '#ea580c',
      planeOfMotion: 'Multi-Planar',
      jointLoad: 'Core Lumbopelvic Stability',
    };
  }

  // 8. Swimming & Aquatics
  if (n.includes('swim') || n.includes('water') || n.includes('freestyle') || n.includes('breaststroke')) {
    return {
      primaryMuscles: ['Latissimus Dorsi', 'Pectorals', 'Deltoids'],
      secondaryMuscles: ['Core Stabilizers', 'Glutes', 'Quadriceps', 'Calves'],
      setupAngle: '0° Streamline Hydrodynamic',
      peakAngle: 'High-Elbow Catch & Propel',
      safetyCue: 'Keep head neutral looking straight down at pool floor to maintain hip elevation.',
      phase1Title: 'Streamline Reach & Entry',
      phase1Desc: 'Hand enters water fingertip-first in line with shoulder, body rotated 45° on axis.',
      phase2Title: 'Catch & Propulsion Phase',
      phase2Desc: 'High elbow catch, accelerate water straight back past hips with steady rhythmic flutter kick.',
      targetZone: 'fullbody',
      accentColor: '#06b6d4',
      planeOfMotion: 'Multi-Planar',
      jointLoad: 'Rotator Cuff & Torso Propulsion',
    };
  }

  // 9. Zumba, Dance & HIIT Cardio
  if (n.includes('zumba') || n.includes('dance') || n.includes('salsa') || n.includes('hiit') || n.includes('burpee') || n.includes('jump')) {
    return {
      primaryMuscles: ['Cardiorespiratory System', 'Glutes', 'Calves', 'Quadriceps'],
      secondaryMuscles: ['Core Obliques', 'Hip Abductors', 'Deltoids'],
      setupAngle: 'Athletic Ready Stance (20° Knee Flex)',
      peakAngle: 'Dynamic Cadence Burst',
      safetyCue: 'Land softly on balls of feet with knees spring-loaded to absorb impact.',
      phase1Title: 'Rhythmic Step / Load',
      phase1Desc: 'Weight on balls of feet, athletic spring posture, core engaged for fast direction changes.',
      phase2Title: 'Explosive Pulse / Footwork',
      phase2Desc: 'Snappy hip articulation, synchronized arm drive, dynamic aerobic calorie burn.',
      targetZone: 'fullbody',
      accentColor: '#ec4899',
      planeOfMotion: 'Multi-Planar',
      jointLoad: 'Ankle Mortise & Knee Joint Shock Absorption',
    };
  }

  // 10. Boxing & Combat Drills
  if (n.includes('boxing') || n.includes('punch') || n.includes('bag') || n.includes('strike')) {
    return {
      primaryMuscles: ['Shoulders (Deltoids)', 'Core Rotators', 'Calves (Gastrocnemius)'],
      secondaryMuscles: ['Pectorals', 'Lats', 'Triceps', 'Glutes'],
      setupAngle: '45° Staggered Fight Guard',
      peakAngle: 'Full Kinetic Rotation',
      safetyCue: 'Keep rear hand glued to cheek. Power comes from pivot of feet, not just arm.',
      phase1Title: 'Stance & Guard Position',
      phase1Desc: 'Chin tucked, elbows tight to ribs, knees soft, dominant hand guarding chin.',
      phase2Title: 'Kinetic Strike Delivery',
      phase2Desc: 'Drive power from ground through hip pivot, snap fist at target, immediately return to guard.',
      targetZone: 'fullbody',
      accentColor: '#e11d48',
      planeOfMotion: 'Transverse',
      jointLoad: 'Wrist / Metacarpal & Glenohumeral',
    };
  }

  // Default Fallback
  return {
    primaryMuscles: [targetMuscle || 'Target Muscle Group'],
    secondaryMuscles: ['Stabilizing Synergists'],
    setupAngle: 'Neutral Alignment (180°)',
    peakAngle: 'Peak Contraction',
    safetyCue: 'Maintain controlled breathing and smooth tempo (2s down, 1s up).',
    phase1Title: 'Setup & Eccentric Phase',
    phase1Desc: 'Prepare posture, brace core, align joints into optimal mechanical leverage.',
    phase2Title: 'Peak Contraction & Squeeze',
    phase2Desc: 'Drive through target muscle fibers with strict form and full range of motion.',
    targetZone: 'fullbody',
    accentColor: '#10b981',
    planeOfMotion: 'Sagittal',
    jointLoad: 'Musculoskeletal Kinetic Chain',
  };
}

export const ExerciseVisualCard: React.FC<ExerciseVisualCardProps> = ({
  name,
  category,
  targetMuscle,
  equipment,
  secondaryMuscles = [],
  instructions = [],
  formTips = [],
  className = '',
  size = 'md',
  showControls = true,
  defaultMode = 'anatomy',
}) => {
  const [activeTab, setActiveTab] = useState<'technique' | 'anatomy'>(defaultMode === 'clip' ? 'anatomy' : defaultMode);
  const [activePhase, setActivePhase] = useState<'phase1' | 'phase2'>('phase1');

  const bio = getMovementBioData(name, targetMuscle, category);
  const clip = getExerciseClipData({ name, category: category as string });

  const isHero = size === 'hero';
  const isCompact = size === 'compact';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-xl flex flex-col justify-between select-none ${className}`}
    >
      {/* Dynamic Biomechanical Grid & Glow Layer */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${bio.accentColor} 1.5px, transparent 1.5px), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '24px 24px, 12px 12px, 12px 12px',
        }}
      />
      <div
        className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: bio.accentColor }}
      />

      {/* Top Header Bar with Mode Toggles */}
      <div className="relative z-10 p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border flex items-center gap-1 shrink-0"
            style={{
              backgroundColor: `${bio.accentColor}18`,
              borderColor: `${bio.accentColor}50`,
              color: bio.accentColor,
            }}
          >
            <Target className="w-3 h-3" />
            {targetMuscle}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/80 shrink-0">
            {equipment}
          </span>
        </div>

        {/* View Mode Switcher: Form Angles vs Technique Cues */}
        {showControls && (
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('anatomy')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'anatomy'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>🔬 Form Angles</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('technique')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'technique'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>📋 Step Cues</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Technique Mode OR Anatomy Mode */}
      {activeTab === 'technique' ? (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-4 sm:p-5 bg-slate-950/90">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Step-by-Step Technique & Coach Cues</span>
            </div>

            {instructions && instructions.length > 0 ? (
              <div className="space-y-2">
                {instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                {clip.demonstrationCue || 'Execute through strict biomechanical plane with controlled eccentric tempo.'}
              </div>
            )}

            {formTips && formTips.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <span>💡 Pro Form Tip:</span>
                </div>
                <div className="text-[11px] leading-relaxed">{formTips[0]}</div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary: <strong className="text-white">{targetMuscle}</strong></span>
            <span>Joint Load: <strong className="text-emerald-400">{bio.planeOfMotion}</strong></span>
          </div>
        </div>
      ) : (
        /* Biomechanical Anatomy Mode */
        <div className="relative z-10 p-4 sm:p-5 flex-1 flex flex-col justify-between">
          {/* Phase 1 vs Phase 2 Toggle */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-slate-400">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: bio.accentColor }} />
                <span>BIOMECHANICAL POSTURE ENGINE</span>
              </div>
              <h3 className={`font-black text-white tracking-tight ${isHero ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
                {name}
              </h3>
            </div>

            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActivePhase('phase1')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  activePhase === 'phase1'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDown className="w-3 h-3 text-emerald-400" />
                <span>Setup</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePhase('phase2')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                  activePhase === 'phase2'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUp className="w-3 h-3 text-amber-400" />
                <span>Peak</span>
              </button>
            </div>
          </div>

          {/* Movement Details Box */}
          <div className="relative my-2 p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 overflow-hidden">
            <AnimatePresence mode="wait">
              {activePhase === 'phase1' ? (
                <motion.div
                  key="phase1"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 font-mono">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[10px]">
                        1
                      </span>
                      {bio.phase1Title}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                      {bio.setupAngle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                    {bio.phase1Desc}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="phase2"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-400 font-mono">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px]">
                        2
                      </span>
                      {bio.phase2Title}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                      {bio.peakAngle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                    {bio.phase2Desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Muscle Activations */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-500 font-mono text-[10px] uppercase">Prime Mover:</span>
                <span className="font-bold text-emerald-400">{bio.primaryMuscles.join(', ')}</span>
              </div>
              {bio.secondaryMuscles.length > 0 && (
                <div className="text-slate-400 text-[10px]">
                  Synergists: <span className="text-slate-300">{bio.secondaryMuscles.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Safety Banner */}
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              <strong>Safety Cue:</strong> {bio.safetyCue}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="relative z-10 px-4 py-2 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Joint Focus: {bio.jointLoad}</span>
        </span>
        <span className="text-emerald-400 font-bold tracking-wider">VERIFIED DEMO CLIPS</span>
      </div>
    </div>
  );
};
