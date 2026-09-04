// Curated exercise demonstration video clips, form tutorial video query mappings, and biomechanical demo sources

export interface ExerciseClipData {
  videoUrl?: string;
  youtubeSearchQuery: string;
  youtubeVideoId?: string;
  repCadenceSeconds: number; // For rhythmic animation loop (e.g. 3s eccentric + 1s concentric)
  demonstrationCue: string;
}

// Direct verified video demonstration clips & YouTube form tutorial links
const EXERCISE_CLIP_REGISTRY: Record<string, { videoId: string; videoUrl?: string; cue: string; cadence: number }> = {
  // Chest
  'barbell-flat-bench-press': {
    videoId: 'rT7DgCr-3pg', // Jeff Nippard / Scott Herman Bench Press Guide
    cue: 'Pinch shoulder blades, arch mid-back slightly, touch mid-chest, drive up in slight J-curve.',
    cadence: 3,
  },
  'incline-dumbbell-press': {
    videoId: '8iPEnn-ltC8',
    cue: '30-degree incline, elbows tucked at 45 degrees, squeeze upper chest at top.',
    cadence: 3,
  },
  'cable-chest-fly': {
    videoId: 'Iwe6AmxVf7o',
    cue: 'Slight bend in elbows, hug an imaginary tree, contract pectorals hard at midline.',
    cadence: 2.5,
  },
  'parallel-bar-dips': {
    videoId: '2z8JmcrW-As',
    cue: 'Lean torso 30 degrees forward for chest emphasis, lower until elbows hit 90 degrees.',
    cadence: 3,
  },

  // Back
  'conventional-barbell-deadlift': {
    videoId: 'op9kVnSso6Q',
    cue: 'Bar over mid-foot, drag bar against shins, lock hips and glutes at apex without leaning back.',
    cadence: 3.5,
  },
  'lat-pulldown': {
    videoId: 'CAwf7n6Luuc',
    cue: 'Slight lean back, pull bar to upper sternum by driving elbows straight into back pockets.',
    cadence: 3,
  },
  'barbell-bent-over-row': {
    videoId: 'FWJR5Ve8gkQ',
    cue: 'Hinge torso to 45 degrees, pull bar to lower ribcage, squeeze shoulder blades together.',
    cadence: 2.5,
  },
  'pull-ups': {
    videoId: 'eGo4IYlbE5g',
    cue: 'Full dead hang, depress scapulae first, drive chest up toward bar.',
    cadence: 3,
  },

  // Legs & Glutes
  'barbell-back-squat': {
    videoId: 'bEv6CCg2BC8',
    cue: 'Brace core with 360 air, break hips and knees, descend below parallel, drive mid-foot.',
    cadence: 3.5,
  },
  'romanian-deadlift': {
    videoId: 'JCXUYuzwNrM',
    cue: 'Soft knees, push hips backward as far as possible, feel intense stretch in hamstrings.',
    cadence: 3,
  },
  '45-degree-leg-press': {
    videoId: 'IZxyjW7MPJQ',
    cue: 'Feet shoulder-width on platform, lower until 90 degrees knee bend, do NOT lock out knees.',
    cadence: 3,
  },
  'dumbbell-walking-lunges': {
    videoId: 'D7KaRcUTQeE',
    cue: 'Long step forward, rear knee taps floor gently, front knee tracks directly above ankle.',
    cadence: 2.5,
  },
  'barbell-hip-thrust': {
    videoId: 'xDmFkJxPzeM',
    cue: 'Upper back on bench, chin tucked, drive hips upward until thighs and torso form straight line.',
    cadence: 2.5,
  },
  'bulgarian-split-squat': {
    videoId: '2C-uNgKwPLE',
    cue: 'Rear foot on bench laces down, drop straight down, keep front heel glued to floor.',
    cadence: 3,
  },

  // Shoulders
  'seated-dumbbell-shoulder-press': {
    videoId: 'qEwKCR5JCog',
    cue: 'Elbows slightly forward in scapular plane, press straight up without clicking dumbbells.',
    cadence: 3,
  },
  'dumbbell-lateral-raise': {
    videoId: '3VcKaXpzqRo',
    cue: 'Lead with elbows, pour the pitchers slightly at top, raise to shoulder height only.',
    cadence: 2.5,
  },
  'cable-rope-face-pulls': {
    videoId: 'V8dZ3pyiCBo',
    cue: 'Pull rope toward eye level while externally rotating hands back like double biceps.',
    cadence: 2.5,
  },

  // Arms
  'barbell-bicep-curl': {
    videoId: 'kwG2ipFRgfo',
    cue: 'Pin elbows to ribs, curl upward with zero torso swing, 2-second controlled descent.',
    cadence: 2.5,
  },
  'cable-tricep-rope-pushdown': {
    videoId: 'vB5OHsJ3EME',
    cue: 'Keep upper arms fixed at sides, extend downward and spread rope tips apart at bottom.',
    cadence: 2,
  },
  'ez-bar-skull-crushers': {
    videoId: 'd_KZxkY_0cM',
    cue: 'Elbows angled slightly backward, lower bar toward crown of head, extend triceps.',
    cadence: 3,
  },

  // Core
  'hanging-leg-raise': {
    videoId: 'hdng3Nm1x_E',
    cue: 'Curl pelvis upward toward ribcage rather than just swinging legs, zero momentum.',
    cadence: 3,
  },
  'forearm-plank': {
    videoId: 'ASdvN_XEl_c',
    cue: 'Posterior pelvic tilt, squeeze glutes, press elbows into floor to protract shoulders.',
    cadence: 4,
  },

  // Cardio & Plyo
  'burpees': {
    videoId: 'dZgVxmf6jkA',
    cue: 'Drop chest to floor, snap feet to hands, jump vertically with hands overhead.',
    cadence: 2,
  },
  'jump-rope': {
    videoId: 'u3zgHI8QnqE',
    cue: 'Stay on balls of feet, bounce only 1-2 inches off ground, rotate rope from wrists.',
    cadence: 1,
  },

  // Yoga & Stretching
  'downward-facing-dog': {
    videoId: 'j97SSGsnCAQ',
    cue: 'Tailbone lifted high, ground palms, pedal heels, lengthen armpits.',
    cadence: 4,
  },
  'vinyasa-flow-sun-salutation': {
    videoId: '72b0n18b5_0',
    cue: 'Inhale lift, exhale fold, chaturanga, inhale upward dog, exhale downward dog.',
    cadence: 5,
  },
  'warrior-two-pose': {
    videoId: '4PkZXW1hM78',
    cue: 'Front knee 90 degrees over ankle, gaze over front fingers, shoulders down.',
    cadence: 4,
  },
  'childs-pose-restorative': {
    videoId: '2MJGg-dUKh0',
    cue: 'Hips to heels, forehead down, expand ribcage with deep slow diaphragmatic breath.',
    cadence: 5,
  },
  'cat-cow-spinal-flow': {
    videoId: 'w_UK8s0d3P8',
    cue: 'Inhale drop belly lift chest, exhale tuck chin dome spine.',
    cadence: 4,
  },
  'pigeon-pose-mobility': {
    videoId: '0_zcb0_mK-A',
    cue: 'Square hips, surrender forward onto forearms, breathe into deep outer hip.',
    cadence: 5,
  },
  'worlds-greatest-stretch': {
    videoId: 'wX-jO81OaR4',
    cue: 'Deep lunge, drop inside elbow, rotate chest skyward, push back to hamstring stretch.',
    cadence: 4,
  },
  'seated-forward-fold-stretch': {
    videoId: 'L_WfZfO96hY',
    cue: 'Hinge from hip crease with flat spine, reach for feet, lead with chest.',
    cadence: 4,
  },
};

export function getExerciseClipData(exercise: {
  id?: string;
  name?: string;
  category?: string;
}): ExerciseClipData {
  const name = (exercise.name || '').toLowerCase();
  const id = (exercise.id || '').toLowerCase();

  // Check specific keys
  for (const [key, data] of Object.entries(EXERCISE_CLIP_REGISTRY)) {
    const cleanKey = key.replace(/-/g, ' ');
    if (id === key || name.includes(cleanKey) || key.includes(id)) {
      return {
        youtubeVideoId: data.videoId,
        youtubeSearchQuery: `${exercise.name} exercise form tutorial`,
        repCadenceSeconds: data.cadence,
        demonstrationCue: data.cue,
      };
    }
  }

  // Keyword matchers for broad exercises
  if (name.includes('bench') || name.includes('chest press')) {
    return {
      youtubeVideoId: 'rT7DgCr-3pg',
      youtubeSearchQuery: `${exercise.name} exercise form tutorial`,
      repCadenceSeconds: 3,
      demonstrationCue: 'Retract scapulae, touch lower sternum, drive up in controlled motion.',
    };
  }
  if (name.includes('squat')) {
    return {
      youtubeVideoId: 'bEv6CCg2BC8',
      youtubeSearchQuery: `${exercise.name} exercise form guide`,
      repCadenceSeconds: 3.5,
      demonstrationCue: 'Brace core, keep chest high, break at hips and knees simultaneously.',
    };
  }
  if (name.includes('deadlift')) {
    return {
      youtubeVideoId: 'op9kVnSso6Q',
      youtubeSearchQuery: `${exercise.name} technique demonstration`,
      repCadenceSeconds: 3.5,
      demonstrationCue: 'Bar over mid-foot, maintain rigid flat back, push the floor away.',
    };
  }
  if (name.includes('pull-up') || name.includes('pull up') || name.includes('lat pull')) {
    return {
      youtubeVideoId: 'CAwf7n6Luuc',
      youtubeSearchQuery: `${exercise.name} proper form guide`,
      repCadenceSeconds: 3,
      demonstrationCue: 'Engage lats, drive elbows downward, squeeze mid-back at full contraction.',
    };
  }
  if (name.includes('shoulder press') || name.includes('military press')) {
    return {
      youtubeVideoId: 'qEwKCR5JCog',
      youtubeSearchQuery: `${exercise.name} form tutorial`,
      repCadenceSeconds: 3,
      demonstrationCue: 'Forearms vertical, press directly overhead, lock out safely.',
    };
  }
  if (name.includes('curl')) {
    return {
      youtubeVideoId: 'kwG2ipFRgfo',
      youtubeSearchQuery: `${exercise.name} bicep form tutorial`,
      repCadenceSeconds: 2.5,
      demonstrationCue: 'Lock elbows at sides, supinate palms at top, 2s eccentric descent.',
    };
  }
  if (name.includes('tricep') || name.includes('pushdown')) {
    return {
      youtubeVideoId: 'vB5OHsJ3EME',
      youtubeSearchQuery: `${exercise.name} tricep form guide`,
      repCadenceSeconds: 2,
      demonstrationCue: 'Fix elbows in place, extend forearms, peak tricep contraction at bottom.',
    };
  }
  if (name.includes('plank')) {
    return {
      youtubeVideoId: 'ASdvN_XEl_c',
      youtubeSearchQuery: `${exercise.name} core demonstration`,
      repCadenceSeconds: 4,
      demonstrationCue: 'Straight line head to heels, active glute and abdominal brace.',
    };
  }
  if (name.includes('zumba') || name.includes('dance')) {
    return {
      youtubeVideoId: '5IF_nZ0979g',
      youtubeSearchQuery: `${exercise.name} zumba dance fitness routine`,
      repCadenceSeconds: 1.5,
      demonstrationCue: 'Rhythmic footwork, sync arm swings with hip rotation, high energy cadence.',
    };
  }
  if (name.includes('swim')) {
    return {
      youtubeVideoId: '5HLW2hhwR9Y',
      youtubeSearchQuery: `${exercise.name} swimming stroke technique tutorial`,
      repCadenceSeconds: 2,
      demonstrationCue: 'Streamline torso, high elbow catch, steady rhythmic bilateral breathing.',
    };
  }
  if (name.includes('boxing') || name.includes('punch')) {
    return {
      youtubeVideoId: '57sV6Z3iWzU',
      youtubeSearchQuery: `${exercise.name} boxing technique tutorial`,
      repCadenceSeconds: 1.5,
      demonstrationCue: 'Guard chin with rear hand, rotate hips into strike, snap back instantly.',
    };
  }

  // Generic fallback query
  return {
    youtubeSearchQuery: `${exercise.name || 'workout'} proper form tutorial`,
    repCadenceSeconds: 3,
    demonstrationCue: 'Maintain strict posture, controlled breathing, and full range of motion.',
  };
}
