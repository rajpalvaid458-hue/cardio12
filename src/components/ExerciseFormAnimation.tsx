import React, { useState, useEffect, useMemo } from 'react';
import { Exercise } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Wind,
  Target,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Activity,
  Maximize2,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExerciseFormAnimationProps {
  exercise: Exercise;
  className?: string;
}

type DemonstrationMode = 'animated' | 'dos_donts';

interface FormCheckpoint {
  id: string;
  name: string;
  xPercent: number; // For overlay positioning
  yPercent: number;
  cue: string;
  warning?: string;
}

export const ExerciseFormAnimation: React.FC<ExerciseFormAnimationProps> = ({
  exercise,
  className = '',
}) => {
  const [mode, setMode] = useState<DemonstrationMode>('animated');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 1.5
  const [animationProgress, setAnimationProgress] = useState<number>(0); // 0 to 1
  const [repCount, setRepCount] = useState<number>(1);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | null>(null);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showSpineGuide, setShowSpineGuide] = useState<boolean>(true);

  // Determine movement archetype: yoga, stretch, weight_squat, weight_push, weight_pull, weight_hinge, weight_arm, cardio
  const movementArchetype = useMemo(() => {
    const n = exercise.name.toLowerCase();
    const c = (exercise.category || '').toLowerCase();
    const d = (exercise.discipline || '').toLowerCase();

    if (c.includes('yoga') || d.includes('yoga') || n.includes('dog') || n.includes('warrior') || n.includes('cobra') || n.includes('child') || n.includes('salutation') || n.includes('vinyasa') || n.includes('asana') || n.includes('tree')) {
      return 'yoga';
    }
    if (c.includes('stretch') || c.includes('mobility') || n.includes('stretch') || n.includes('90/90') || n.includes('pigeon') || n.includes('fold') || n.includes('pec') || n.includes('hip flexor')) {
      return 'stretching';
    }
    if (n.includes('squat') || n.includes('leg press') || n.includes('lunge') || n.includes('thrust') || n.includes('hack')) {
      return 'weight_squat';
    }
    if (n.includes('deadlift') || n.includes('rdl') || n.includes('hinge') || n.includes('good morning')) {
      return 'weight_hinge';
    }
    if (n.includes('press') || n.includes('push') || n.includes('dip') || n.includes('fly')) {
      return 'weight_push';
    }
    if (n.includes('pull') || n.includes('row') || n.includes('lat') || n.includes('chin')) {
      return 'weight_pull';
    }
    if (n.includes('curl') || n.includes('tricep') || n.includes('skull')) {
      return 'weight_arm';
    }
    if (n.includes('plank') || n.includes('crunch') || n.includes('leg raise')) {
      return 'core';
    }
    return 'weight_squat';
  }, [exercise]);

  // Cycle animation progress timer
  const cycleDurationSeconds = useMemo(() => {
    if (movementArchetype === 'yoga' || movementArchetype === 'stretching') return 6 / playbackSpeed;
    return 3 / playbackSpeed;
  }, [movementArchetype, playbackSpeed]);

  useEffect(() => {
    if (!isPlaying) return;

    let startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = (elapsed % cycleDurationSeconds) / cycleDurationSeconds;
      setAnimationProgress(progress);

      const currentCycle = Math.floor(elapsed / cycleDurationSeconds) + 1;
      setRepCount(currentCycle);

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, cycleDurationSeconds]);

  // Specific checkpoints for interactive inspection
  const checkpoints: FormCheckpoint[] = useMemo(() => {
    switch (movementArchetype) {
      case 'yoga':
        return [
          {
            id: 'c-head',
            name: 'Cervical Spine & Drishti',
            xPercent: 32,
            yPercent: 28,
            cue: 'Relax neck completely, gaze softly toward navel or fingertips without strain.',
            warning: 'Avoid craning neck backward or compressing cervical vertebrae.',
          },
          {
            id: 'c-hands',
            name: 'Hasta Bandha (Palm Foundation)',
            xPercent: 20,
            yPercent: 78,
            cue: 'Spread fingers wide like starfish; press through the base of index finger and thumb.',
            warning: 'Do not dump all bodyweight into outer wrists.',
          },
          {
            id: 'c-pelvis',
            name: 'Sits Bones & Tailbone',
            xPercent: 55,
            yPercent: 32,
            cue: 'Rotate pelvis anteriorly, tilting sits bones toward ceiling to decompress lower back.',
            warning: 'Avoid rounding lumbar spine; micro-bend knees if hamstrings are tight.',
          },
          {
            id: 'c-feet',
            name: 'Pada Bandha (Foot Rooting)',
            xPercent: 82,
            yPercent: 80,
            cue: 'Ground heels toward mat with quadriceps gently engaged to support hamstrings.',
            warning: 'Do not lock knee joints into hyper-extension.',
          },
        ];
      case 'stretching':
        return [
          {
            id: 'c-breath',
            name: 'Diaphragmatic Relaxation',
            xPercent: 50,
            yPercent: 25,
            cue: 'Inhale to lengthen spine; exhale deeply to allow myofascial tension release.',
            warning: 'Never hold breath during static mobility holds.',
          },
          {
            id: 'c-joint',
            name: 'Joint Capsule Alignment',
            xPercent: 42,
            yPercent: 55,
            cue: 'Maintain square hips and square shoulders; let gravity ease the tension.',
            warning: 'Stop immediately if feeling sharp impingement rather than a muscular stretch.',
          },
          {
            id: 'c-target',
            name: 'Target Fascia Zone',
            xPercent: 68,
            yPercent: 62,
            cue: 'Feel elongation in the belly of the muscle, progressing from 4/10 to 6/10 intensity.',
            warning: 'Bouncing (ballistic stretch) can trigger the myotatic stretch reflex and tighten muscles.',
          },
        ];
      case 'weight_squat':
        return [
          {
            id: 'c-chest',
            name: 'Thoracic Extension & Chest Up',
            xPercent: 48,
            yPercent: 25,
            cue: 'Pull shoulder blades together to build an upper-shelf cushion, keeping chest proud.',
            warning: 'Do not let torso fold forward like a good morning.',
          },
          {
            id: 'c-core',
            name: 'Intra-Abdominal 360° Brace',
            xPercent: 48,
            yPercent: 45,
            cue: 'Breathe into belly and expand obliques like a pressurized cylinder before descent.',
            warning: 'Do not exhale mid-rep; hold pressure until clearing the sticking point.',
          },
          {
            id: 'c-knees',
            name: 'Knee Tracking & Hip Abduction',
            xPercent: 38,
            yPercent: 65,
            cue: 'Drive knees outward in direct line with your second and third toes.',
            warning: 'Prevent valgus knee cave (knees collapsing inward upon ascent).',
          },
          {
            id: 'c-feet',
            name: 'Tripod Foot Rooting',
            xPercent: 50,
            yPercent: 88,
            cue: 'Claw floor with big toe, pinky toe, and heel; keep weight centered over midfoot.',
            warning: 'Never allow heels to lift off floor during bottom depth.',
          },
        ];
      case 'weight_hinge':
        return [
          {
            id: 'c-grip',
            name: 'Barbell Proximity & Lats',
            xPercent: 45,
            yPercent: 40,
            cue: 'Squeeze armpits as if protecting $100 bills; scrape bar against shins & thighs.',
            warning: 'If bar drifts away from shins, spinal shear forces quadruple.',
          },
          {
            id: 'c-spine',
            name: 'Neutral Lumbar & Cervical',
            xPercent: 60,
            yPercent: 32,
            cue: 'Keep spine straight from tailbone to crown; pack neck in slight double-chin.',
            warning: 'Hyperextending neck or rounding lumbar spine risks disc herniation.',
          },
          {
            id: 'c-hips',
            name: 'Posterior Hip Displacement',
            xPercent: 70,
            yPercent: 50,
            cue: 'Push hips backward into the room behind you; knees remain soft and spring-loaded.',
            warning: 'Do not squat the weight down; this is a horizontal hip hinge, not a vertical squat.',
          },
        ];
      case 'weight_push':
        return [
          {
            id: 'c-scapula',
            name: 'Scapular Retraction & Depression',
            xPercent: 45,
            yPercent: 35,
            cue: 'Pinch shoulder blades together and tuck them into your back pockets.',
            warning: 'Reaching forward at lockout unglues the scapulae and strains the rotator cuff.',
          },
          {
            id: 'c-elbows',
            name: '45° Elbow Tuck Angle',
            xPercent: 35,
            yPercent: 50,
            cue: 'Flare elbows at approximately 45° to 60° relative to torso (arrow shape, not T-shape).',
            warning: 'Flaring elbows at 90° impinges the supraspinatus tendon.',
          },
          {
            id: 'c-wrists',
            name: 'Stacked Wrists Over Elbows',
            xPercent: 62,
            yPercent: 42,
            cue: 'Keep wrists straight and knuckle-aligned; rest load in the heel of the palm.',
            warning: 'Bent wrists overload wrist flexors and lose upward driving force.',
          },
        ];
      default:
        return [
          {
            id: 'c-core',
            name: 'Core Bracing',
            xPercent: 50,
            yPercent: 45,
            cue: 'Maintain tight abdominal wall and neutral pelvic alignment throughout motion.',
            warning: 'Do not hyperextend lower back.',
          },
          {
            id: 'c-joints',
            name: 'Smooth Kinetic Path',
            xPercent: 50,
            yPercent: 65,
            cue: 'Controlled concentric drive and smooth 2-second eccentric return.',
            warning: 'Avoid bouncing or relying on inertia.',
          },
        ];
    }
  }, [movementArchetype]);

  // Current phase descriptions & labels
  const phaseInfo = useMemo(() => {
    if (movementArchetype === 'yoga') {
      if (animationProgress < 0.45) {
        return {
          title: 'Pranayama Inhale / Expansion',
          sub: 'Lengthen spine, decompress joints, draw breath into lowest ribs',
          badge: 'Inhale Phase',
          color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
        };
      } else if (animationProgress < 0.55) {
        return {
          title: 'Kumbhaka (Retention & Alignment)',
          sub: 'Hold structural integrity with effortless stillness and micro-corrections',
          badge: 'Hold & Ground',
          color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        };
      } else {
        return {
          title: 'Pranayama Exhale / Release',
          sub: 'Sink deeper into the posture, surrender tension in jaw and shoulders',
          badge: 'Exhale Phase',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        };
      }
    } else if (movementArchetype === 'stretching') {
      if (animationProgress < 0.5) {
        return {
          title: 'Initial Lengthening & Alignment',
          sub: 'Establish comfortable baseline stretch, stabilize supporting joints',
          badge: 'Stretch Inhale',
          color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        };
      } else {
        return {
          title: 'Myofascial Tissue Release',
          sub: 'Gentle expansion of range of motion; maintain steady calm breathing',
          badge: 'Deepen on Exhale',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        };
      }
    } else {
      // Weightlifting / Strength
      if (animationProgress < 0.45) {
        return {
          title: 'Eccentric Phase (Controlled Lowering)',
          sub: 'Resist gravity with 2-3s tempo, loading muscle fibers under stretch',
          badge: 'Eccentric (Negative)',
          color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        };
      } else if (animationProgress < 0.55) {
        return {
          title: 'Isometric Turnaround / Depth Transition',
          sub: 'Hit target range of motion with tight tension (zero bounce/momentum)',
          badge: 'Target Depth',
          color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        };
      } else {
        return {
          title: 'Concentric Phase (Explosive Drive)',
          sub: 'Drive powerfully through target muscles, exhale through the sticking point',
          badge: 'Concentric (Drive)',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        };
      }
    }
  }, [movementArchetype, animationProgress]);

  // Calculate animated joint angles / positions for Vector Kinematics
  // Sine-wave oscillation between 0 (start) -> 1 (peak depth) -> 0 (finish)
  const motionPhase = useMemo(() => {
    // Smooth cosine wave 0 -> 1 -> 0
    return (1 - Math.cos(animationProgress * Math.PI * 2)) / 2;
  }, [animationProgress]);

  return (
    <div className={`rounded-2xl bg-slate-950 border border-slate-800 text-white overflow-hidden flex flex-col ${className}`}>
      {/* Top Controls & Navigation Bar */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Proper Form Animation Studio
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
            {movementArchetype === 'yoga' ? 'Yoga Asana Flow' : movementArchetype === 'stretching' ? 'Mobility & Stretch' : 'Kinematic Biomechanics'}
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1">
          <button
            onClick={() => setMode('animated')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'animated' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-300" />
            <span>Kinematic Loop</span>
          </button>
          <button
            onClick={() => setMode('dos_donts')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'dos_donts' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Dos & Don'ts</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Canvas */}
      <div className="relative w-full aspect-16/10 sm:aspect-16/9 bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#a855f7 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '28px 28px, 14px 14px, 14px 14px',
          }}
        />

        {/* MODE 1: KINEMATIC SVG VECTOR ANIMATION LOOP */}
        {mode === 'animated' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {/* SVG Biomechanical Avatar Rig */}
            <svg
              className="w-full h-full max-h-72 sm:max-h-80"
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Floor / Ground Platform */}
              <line x1="40" y1="265" x2="360" y2="265" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="272" x2="320" y2="272" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Archetype: YOGA ASANA (Downward Dog / Flow) */}
              {movementArchetype === 'yoga' && (
                <g>
                  {/* Breath expansion aura */}
                  <circle
                    cx="200"
                    cy="140"
                    r={65 + motionPhase * 20}
                    fill="url(#yogaGlow)"
                    opacity={0.35 + motionPhase * 0.25}
                  />

                  {/* Alignment guide laser line: Hands to Hips */}
                  {showSpineGuide && (
                    <line
                      x1="120"
                      y1="260"
                      x2="200"
                      y2={110 - motionPhase * 15}
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.8"
                    />
                  )}
                  {showSpineGuide && (
                    <line
                      x1="200"
                      y1={110 - motionPhase * 15}
                      x2="280"
                      y2="260"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      opacity="0.8"
                    />
                  )}

                  {/* Body Kinematic Lines (Downward Dog V-Shape) */}
                  {/* Arms & Torso */}
                  <path
                    d={`M 120 260 L 155 200 L 200 ${110 - motionPhase * 15}`}
                    stroke="#a855f7"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Pelvis & Legs */}
                  <path
                    d={`M 200 ${110 - motionPhase * 15} L 245 ${180 + motionPhase * 5} L 280 260`}
                    stroke="#ec4899"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Head & Neck */}
                  <circle
                    cx={150 - motionPhase * 5}
                    cy={185 + motionPhase * 5}
                    r="12"
                    fill="#cbd5e1"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />

                  {/* Hand & Foot Anchor Pads */}
                  <circle cx="120" cy="260" r="6" fill="#06b6d4" />
                  <circle cx="280" cy="260" r="6" fill="#06b6d4" />

                  {/* Tailbone Apex Callout Marker */}
                  <circle cx="200" cy={110 - motionPhase * 15} r="8" fill="#ec4899" />
                  <circle
                    cx="200"
                    cy={110 - motionPhase * 15}
                    r={12 + motionPhase * 6}
                    stroke="#ec4899"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />

                  {/* Pranayama Breathing Ring in Center */}
                  <circle
                    cx="200"
                    cy="165"
                    r={22 + motionPhase * 14}
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    fill="#38bdf815"
                  />
                  <text
                    x="200"
                    y="170"
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {motionPhase > 0.5 ? 'EXHALE' : 'INHALE'}
                  </text>

                  {/* Joint Angle Callout Badge */}
                  {showAngles && (
                    <g transform={`translate(210, ${95 - motionPhase * 15})`}>
                      <rect x="0" y="0" width="75" height="20" rx="6" fill="#0f172a" stroke="#ec4899" strokeWidth="1" />
                      <text x="37" y="14" textAnchor="middle" fill="#f472b6" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        Hip Angle: 72°
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Archetype: STRETCHING & MOBILITY */}
              {movementArchetype === 'stretching' && (
                <g>
                  {/* Stretch Tension Waves */}
                  <ellipse
                    cx="200"
                    cy={180 - motionPhase * 10}
                    rx={60 + motionPhase * 25}
                    ry={35 + motionPhase * 15}
                    fill="url(#stretchGlow)"
                    opacity="0.4"
                  />

                  {/* Mat representation */}
                  <rect x="70" y="258" width="260" height="7" rx="3" fill="#3b82f6" opacity="0.3" />

                  {/* Seated / Lunging Stretch Mannequin */}
                  {/* Torso */}
                  <line
                    x1="200"
                    y1={210}
                    x2={160 - motionPhase * 25}
                    y2={150 - motionPhase * 20}
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Head */}
                  <circle
                    cx={150 - motionPhase * 30}
                    cy={130 - motionPhase * 20}
                    r="12"
                    fill="#cbd5e1"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  {/* Lead Leg (Deep Stretch) */}
                  <path
                    d={`M 200 210 Q ${220 + motionPhase * 10} 220 270 255`}
                    stroke="#10b981"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Rear Leg */}
                  <path
                    d="M 200 210 Q 170 240 130 255"
                    stroke="#64748b"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Arms Reaching smoothly */}
                  <path
                    d={`M ${160 - motionPhase * 25} ${150 - motionPhase * 20} Q ${200 + motionPhase * 10} ${190 - motionPhase * 10} ${250 + motionPhase * 15} 245`}
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Tension Hotspot Callout */}
                  <circle cx="235" cy="235" r={8 + motionPhase * 6} fill="#10b981" opacity="0.4" />
                  <circle cx="235" cy="235" r="4" fill="#10b981" />

                  {showAngles && (
                    <g transform="translate(245, 215)">
                      <rect x="0" y="0" width="85" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                      <text x="42" y="15" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        ROM Stretch: +{Math.round(motionPhase * 18)}°
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Archetype: WEIGHTLIFTING SQUAT / LOWER BODY */}
              {movementArchetype === 'weight_squat' && (
                <g>
                  {/* Vertical Bar Path Guide Laser */}
                  {showSpineGuide && (
                    <line x1="200" y1="70" x2="200" y2="265" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                  )}

                  {/* Barbell Weight on Trapezius */}
                  {/* Barbell moving down and up: y changes from 105 (standing) to 175 (deep squat) */}
                  {(() => {
                    const barY = 105 + motionPhase * 70;
                    const hipY = 150 + motionPhase * 60;
                    const hipX = 180 - motionPhase * 20;
                    const kneeY = 205 + motionPhase * 15;
                    const kneeX = 210 + motionPhase * 15;
                    const footX = 195;
                    const footY = 265;

                    return (
                      <>
                        {/* Barbell weights and collar */}
                        <line x1="130" y1={barY} x2="270" y2={barY} stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                        <rect x="120" y={barY - 16} width="10" height="32" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                        <rect x="270" y={barY - 16} width="10" height="32" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />

                        {/* Head & Neck */}
                        <circle cx={hipX + 18} cy={barY - 14} r="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />

                        {/* Torso line from Bar to Hip */}
                        <line
                          x1={hipX + 15}
                          y1={barY}
                          x2={hipX}
                          y2={hipY}
                          stroke="#38bdf8"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* Thigh / Femur from Hip to Knee */}
                        <line
                          x1={hipX}
                          y1={hipY}
                          x2={kneeX}
                          y2={kneeY}
                          stroke="#10b981"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />

                        {/* Shin / Tibia from Knee to Ankle */}
                        <line
                          x1={kneeX}
                          y1={kneeY}
                          x2={footX}
                          y2={footY}
                          stroke="#38bdf8"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />

                        {/* Foot Plant base */}
                        <line x1={footX - 10} y1={footY} x2={footX + 25} y2={footY} stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />

                        {/* Arms gripping bar */}
                        <path
                          d={`M ${hipX + 15} ${barY} L ${hipX + 5} ${barY + 20} L ${hipX + 20} ${barY}`}
                          stroke="#94a3b8"
                          strokeWidth="3"
                          fill="none"
                        />

                        {/* Depth Caliper Arc indicator at 90 degrees */}
                        {showAngles && (
                          <g transform={`translate(${kneeX + 15}, ${kneeY - 10})`}>
                            <rect x="0" y="0" width="70" height="20" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                            <text x="35" y="14" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              Knee: {Math.round(170 - motionPhase * 80)}°
                            </text>
                          </g>
                        )}

                        {/* Parallel Depth Indicator Line */}
                        {motionPhase > 0.8 && (
                          <g>
                            <line x1="140" y1={hipY} x2="260" y2={hipY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
                            <text x="265" y={hipY + 3} fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              ✓ Parallel Depth
                            </text>
                          </g>
                        )}
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Archetype: WEIGHTLIFTING PUSH / BENCH / OVERHEAD */}
              {movementArchetype === 'weight_push' && (
                <g>
                  {/* Bench surface representation */}
                  <rect x="110" y="210" width="180" height="12" rx="4" fill="#334155" />
                  <rect x="195" y="222" width="10" height="43" fill="#1e293b" />

                  {/* Body resting on bench */}
                  {(() => {
                    const barY = 130 + motionPhase * 45; // bar touches chest
                    const elbowX = 165 - motionPhase * 10;
                    const elbowY = 165 + motionPhase * 25;

                    return (
                      <>
                        {/* Torso horizontal */}
                        <line x1="130" y1="205" x2="250" y2="205" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                        {/* Head on bench */}
                        <circle cx="125" cy="198" r="11" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                        {/* Legs planted on floor */}
                        <path d="M 245 205 L 270 230 L 270 265" stroke="#38bdf8" strokeWidth="5" fill="none" strokeLinecap="round" />

                        {/* Arms: Shoulder -> Elbow -> Wrist */}
                        <line x1="160" y1="200" x2={elbowX} y2={elbowY} stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                        <line x1={elbowX} y1={elbowY} x2="185" y2={barY} stroke="#10b981" strokeWidth="6" strokeLinecap="round" />

                        {/* Barbell Path */}
                        <line x1="120" y1={barY} x2="280" y2={barY} stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                        <rect x="110" y={barY - 14} width="10" height="28" rx="2" fill="#e2e8f0" />
                        <rect x="280" y={barY - 14} width="10" height="28" rx="2" fill="#e2e8f0" />

                        {showAngles && (
                          <g transform={`translate(${elbowX - 60}, ${elbowY - 5})`}>
                            <rect x="0" y="0" width="55" height="18" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                            <text x="27" y="13" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold" fontFamily="monospace">
                              Elbow 45°
                            </text>
                          </g>
                        )}
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Archetype: WEIGHTLIFTING HINGE / DEADLIFT */}
              {movementArchetype === 'weight_hinge' && (
                <g>
                  {/* Vertical shin bar line */}
                  {showSpineGuide && (
                    <line x1="215" y1="90" x2="215" y2="265" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  )}

                  {(() => {
                    const barY = 175 + motionPhase * 70; // 175 lockout, 245 floor
                    const hipY = 160 + motionPhase * 35;
                    const hipX = 180 - motionPhase * 35;
                    const kneeY = 215 + motionPhase * 10;
                    const kneeX = 205 - motionPhase * 10;

                    return (
                      <>
                        {/* Barbell Plate on Floor */}
                        <line x1="150" y1={barY} x2="270" y2={barY} stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
                        <circle cx="150" cy={barY} r="18" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                        <circle cx="270" cy={barY} r="18" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />

                        {/* Flat spine representation */}
                        <line
                          x1={hipX}
                          y1={hipY}
                          x2={hipX + 35 + motionPhase * 10}
                          y2={hipY - 55 + motionPhase * 30}
                          stroke="#10b981"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />

                        {/* Head packed neutral */}
                        <circle
                          cx={hipX + 45 + motionPhase * 10}
                          cy={hipY - 70 + motionPhase * 30}
                          r="11"
                          fill="#cbd5e1"
                          stroke="#94a3b8"
                          strokeWidth="2"
                        />

                        {/* Hamstrings & Glutes (Hip to Knee) */}
                        <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke="#a855f7" strokeWidth="7" strokeLinecap="round" />
                        {/* Shins (Knee to Ankle) */}
                        <line x1={kneeX} y1={kneeY} x2="205" y2="265" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />

                        {/* Arms straight down to barbell */}
                        <line
                          x1={hipX + 35 + motionPhase * 10}
                          y1={hipY - 45 + motionPhase * 30}
                          x2="215"
                          y2={barY}
                          stroke="#94a3b8"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {showAngles && (
                          <g transform={`translate(${hipX - 70}, ${hipY - 10})`}>
                            <rect x="0" y="0" width="65" height="18" rx="5" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
                            <text x="32" y="13" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="monospace">
                              Hinge: {Math.round(90 + (1 - motionPhase) * 60)}°
                            </text>
                          </g>
                        )}
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Archetype: ARMS, CORE & OTHER MOVEMENTS */}
              {(movementArchetype === 'weight_arm' || movementArchetype === 'core') && (
                <g>
                  {/* Standing / athletic stance mannequin with curling or flexion action */}
                  {(() => {
                    const forearmAngle = motionPhase * Math.PI * 0.75;
                    const handX = 210 - Math.sin(forearmAngle) * 45;
                    const handY = 200 - Math.cos(forearmAngle) * 45;

                    return (
                      <>
                        {/* Torso upright */}
                        <line x1="200" y1="120" x2="200" y2="200" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
                        <circle cx="200" cy="100" r="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                        {/* Legs */}
                        <line x1="200" y1="200" x2="185" y2="265" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                        <line x1="200" y1="200" x2="215" y2="265" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />

                        {/* Upper arm pinned to side */}
                        <line x1="200" y1="130" x2="210" y2="175" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                        {/* Forearm Curling */}
                        <line x1="210" y1="175" x2={handX} y2={handY} stroke="#a855f7" strokeWidth="6" strokeLinecap="round" />
                        {/* Dumbbell */}
                        <circle cx={handX} cy={handY} r="8" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />

                        {/* Muscle peak contraction highlight */}
                        <circle cx="210" cy="155" r={8 + motionPhase * 6} fill="#a855f7" opacity={0.3 + motionPhase * 0.5} />
                      </>
                    );
                  })()}
                </g>
              )}

              {/* SVG Gradients */}
              <defs>
                <radialGradient id="yogaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="stretchGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* Live Movement Phase Telemetry Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm ${phaseInfo.color}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span>{phaseInfo.badge}</span>
              </div>
            </div>

            {/* Rep Cycle Counter & Cadence Timer */}
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
              <span className="text-slate-400">Tempo Cadence:</span>
              <span className="text-white font-bold">{(cycleDurationSeconds).toFixed(1)}s</span>
              <span className="text-slate-500">|</span>
              <span className="text-purple-400 font-bold">Cycle #{repCount}</span>
            </div>
          </div>
        )}

        {/* MODE 2: FORM CHECKLIST (DOS VS DON'TS COMPARISON) */}
        {mode === 'dos_donts' && (
          <div className="relative w-full h-full p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-950/95">
            {/* DO Column (Biomechanically Sound) */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Proper Form (Do This)</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>{exercise.instructions[0] || 'Maintain structural joint alignment and braced abdominal core.'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>{exercise.instructions[1] || 'Full range of motion without relying on inertia or bouncing.'}</span>
                </div>
                {exercise.formTips.slice(0, 2).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DON'T Column (Critical Faults & Red Flags) */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Form Red Flags (Avoid These)</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                {checkpoints.slice(0, 3).map((cp, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✕</span>
                    <span>{cp.warning || `Avoid excessive sway or momentum across ${cp.name.toLowerCase()}.`}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <span>Holding breath (Valsalva) on non-maximal attempts, causing elevated blood pressure.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Scrubber & Playback Controls Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        {/* Progress Timeline Scrubber */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-purple-400" />
              {phaseInfo.title}
            </span>
            <span className="text-slate-400 font-mono text-[10px]">
              {Math.round(animationProgress * 100)}% of Rep
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400"
              style={{ width: `${animationProgress * 100}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>{phaseInfo.sub}</span>
            <span className="text-emerald-400 font-bold">Tempo 3-0-1-0</span>
          </div>
        </div>

        {/* Lower Row Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-sm"
              title={isPlaying ? 'Pause Animation' : 'Play Animation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Speed Toggle (0.5x, 1x, 1.5x) */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[10px] font-mono font-bold">
              {[0.5, 1, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    playbackSpeed === speed ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Toggle Overlay Features */}
            {mode === 'animated' && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setShowAngles(!showAngles)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    showAngles
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                      : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  📐 Angle Calipers
                </button>
                <button
                  onClick={() => setShowSpineGuide(!showSpineGuide)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    showSpineGuide
                      ? 'bg-slate-800 text-emerald-300 border-emerald-500/40'
                      : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  🎯 Guide Lasers
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Primary Focus: <strong className="text-white">{exercise.targetMuscle}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
