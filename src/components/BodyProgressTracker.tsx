import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFitness } from '../context/FitnessContext';
import { BodyProgressEntry, BodyProgressPose } from '../types';
import {
  Camera,
  CameraOff,
  Video,
  Upload,
  Calendar,
  Scale,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Sliders,
  Eye,
  Trash2,
  Plus,
  Check,
  X,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Layers,
  Maximize2,
  Share2,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'pulsefit_body_progress_v1';

// Curated demo progress photos (well-lit, athletic progress entries)
const INITIAL_DEMO_ENTRIES: BodyProgressEntry[] = [
  {
    id: 'prog-1',
    date: '2026-07-01',
    time: '08:30 AM',
    weightKg: 83.5,
    weightUnit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    pose: 'front',
    notes: 'Starting 12-week body recomposition & hypertrophy program. Baseline morning fasted weigh-in.',
    bodyFatPercent: 19.5,
    waistCm: 89,
    chestCm: 102,
    armsCm: 36,
    createdAt: 1782894600000,
  },
  {
    id: 'prog-2',
    date: '2026-07-28',
    time: '08:15 AM',
    weightKg: 81.2,
    weightUnit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    pose: 'front',
    notes: 'Week 4 check-in. Energy levels solid, waist down noticeably, compound strength maintaining.',
    bodyFatPercent: 17.8,
    waistCm: 86,
    chestCm: 103,
    armsCm: 36.5,
    createdAt: 1785227700000,
  },
  {
    id: 'prog-3',
    date: '2026-08-25',
    time: '08:00 AM',
    weightKg: 78.8,
    weightUnit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    pose: 'front',
    notes: 'Week 8 milestone. Visible abdominal definition and deltoid vascularity. PRs set on bench and deadlift.',
    bodyFatPercent: 15.2,
    waistCm: 82.5,
    chestCm: 104,
    armsCm: 37.2,
    createdAt: 1787647200000,
  },
  {
    id: 'prog-4',
    date: '2026-08-25',
    time: '08:05 AM',
    weightKg: 78.8,
    weightUnit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
    pose: 'side',
    notes: 'Side profile posture check. Core braced, posterior chain activation improved.',
    bodyFatPercent: 15.2,
    waistCm: 82.5,
    createdAt: 1787647500000,
  },
];

type ViewMode = 'comparison' | 'gallery' | 'trends';
type ComparisonStyle = 'slider' | 'side_by_side';

export const BodyProgressTracker: React.FC = () => {
  const { userProfile, updateUserProfile } = useFitness();

  const [entries, setEntries] = useState<BodyProgressEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_ENTRIES;
  });

  // Persist entries
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save body progress entries to localStorage', e);
    }
  }, [entries]);

  // Main UI States
  const [viewMode, setViewMode] = useState<ViewMode>('comparison');
  const [comparisonStyle, setComparisonStyle] = useState<ComparisonStyle>('slider');
  const [selectedPoseFilter, setSelectedPoseFilter] = useState<BodyProgressPose | 'all'>('all');

  // Comparison Selection
  const [beforeId, setBeforeId] = useState<string>('');
  const [afterId, setAfterId] = useState<string>('');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Fullscreen Photo Modal
  const [inspectionEntry, setInspectionEntry] = useState<BodyProgressEntry | null>(null);

  // Camera & Entry Logging State
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showSilhouette, setShowSilhouette] = useState<boolean>(true);

  // Form Fields
  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [formWeight, setFormWeight] = useState<string>(() => userProfile.weightKg?.toString() || '78.5');
  const [formPose, setFormPose] = useState<BodyProgressPose>('front');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formBodyFat, setFormBodyFat] = useState<string>('');
  const [formWaist, setFormWaist] = useState<string>('');
  const [formChest, setFormChest] = useState<string>('');
  const [formArms, setFormArms] = useState<string>('');
  const [showMeasurements, setShowMeasurements] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered entries by pose
  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (selectedPoseFilter === 'all') return sorted;
    return sorted.filter((e) => e.pose === selectedPoseFilter);
  }, [entries, selectedPoseFilter]);

  // Synchronize Before & After default selections
  useEffect(() => {
    if (filteredEntries.length >= 2) {
      // If current selections are not in filtered list, set to first and last
      const hasBefore = filteredEntries.some((e) => e.id === beforeId);
      const hasAfter = filteredEntries.some((e) => e.id === afterId);

      if (!hasBefore || !beforeId) {
        setBeforeId(filteredEntries[0].id);
      }
      if (!hasAfter || !afterId || (filteredEntries.length > 1 && beforeId === afterId)) {
        setAfterId(filteredEntries[filteredEntries.length - 1].id);
      }
    } else if (filteredEntries.length === 1) {
      setBeforeId(filteredEntries[0].id);
      setAfterId(filteredEntries[0].id);
    }
  }, [filteredEntries, beforeId, afterId]);

  const beforeEntry = useMemo(
    () => entries.find((e) => e.id === beforeId) || filteredEntries[0] || null,
    [entries, beforeId, filteredEntries]
  );
  const afterEntry = useMemo(
    () => entries.find((e) => e.id === afterId) || filteredEntries[filteredEntries.length - 1] || null,
    [entries, afterId, filteredEntries]
  );

  // Metrics comparison calculations
  const comparisonStats = useMemo(() => {
    if (!beforeEntry || !afterEntry || beforeEntry.id === afterEntry.id) {
      return null;
    }

    const dateBefore = new Date(beforeEntry.date);
    const dateAfter = new Date(afterEntry.date);
    const diffTime = Math.abs(dateAfter.getTime() - dateBefore.getTime());
    const daysApart = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const weightDelta = afterEntry.weightKg - beforeEntry.weightKg;
    const weightPctDelta = (weightDelta / beforeEntry.weightKg) * 100;

    let bodyFatDelta: number | null = null;
    if (afterEntry.bodyFatPercent && beforeEntry.bodyFatPercent) {
      bodyFatDelta = afterEntry.bodyFatPercent - beforeEntry.bodyFatPercent;
    }

    let waistDelta: number | null = null;
    if (afterEntry.waistCm && beforeEntry.waistCm) {
      waistDelta = afterEntry.waistCm - beforeEntry.waistCm;
    }

    return {
      daysApart,
      weightDelta,
      weightPctDelta,
      bodyFatDelta,
      waistDelta,
    };
  }, [beforeEntry, afterEntry]);

  // Handle Dragging Split Slider
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  // Camera Management
  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this device/browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please allow camera permissions in your browser or upload a photo from your gallery.'
          : 'Unable to start camera. You can still upload a photo directly from your files.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Switch between front & back camera
  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // Trigger countdown then snap photo
  const triggerShutter = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          captureFrame();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front-facing camera, mirror photo horizontally so it matches preview
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedPhotoUrl(dataUrl);
    stopCamera();
  };

  // Handle file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedPhotoUrl(reader.result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCapturedPhotoUrl(reader.result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new entry
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedPhotoUrl) {
      alert('Please take a camera photo or upload an image first.');
      return;
    }

    const weightVal = parseFloat(formWeight);
    if (isNaN(weightVal) || weightVal <= 0) {
      alert('Please enter a valid body weight measurement.');
      return;
    }

    const newEntry: BodyProgressEntry = {
      id: `prog-${Date.now()}`,
      date: formDate,
      time: formTime,
      weightKg: weightVal,
      weightUnit: userProfile.weightUnit,
      photoUrl: capturedPhotoUrl,
      pose: formPose,
      notes: formNotes.trim() || undefined,
      bodyFatPercent: formBodyFat ? parseFloat(formBodyFat) : undefined,
      waistCm: formWaist ? parseFloat(formWaist) : undefined,
      chestCm: formChest ? parseFloat(formChest) : undefined,
      armsCm: formArms ? parseFloat(formArms) : undefined,
      createdAt: Date.now(),
    };

    setEntries((prev) => [...prev, newEntry]);

    // Keep user's profile weight updated if logging today or recent
    updateUserProfile({ weightKg: weightVal });

    // Set as the 'after' photo for immediate visual gratification
    setAfterId(newEntry.id);

    // Reset and close
    setCapturedPhotoUrl(null);
    setFormNotes('');
    setFormBodyFat('');
    setFormWaist('');
    setFormChest('');
    setFormArms('');
    setIsLogModalOpen(false);
    stopCamera();
  };

  // Delete an entry
  const handleDeleteEntry = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Delete this body progress record and photo?')) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
      if (inspectionEntry?.id === id) {
        setInspectionEntry(null);
      }
    }
  };

  // Load clean demo records if list becomes empty
  const handleResetDemoData = () => {
    setEntries(INITIAL_DEMO_ENTRIES);
    setBeforeId(INITIAL_DEMO_ENTRIES[0].id);
    setAfterId(INITIAL_DEMO_ENTRIES[2].id);
  };

  // Chart data for trends
  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((entry) => ({
        date: entry.date.slice(5), // MM-DD
        fullDate: entry.date,
        weight: entry.weightKg,
        bodyFat: entry.bodyFatPercent,
        pose: entry.pose,
        notes: entry.notes,
        hasPhoto: !!entry.photoUrl,
      }));
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner & Actions */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>Visual Physique Tracking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Body Progress & Visual Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Capture standardized camera progress photos alongside date-stamped weight measurements. 
              Perform interactive split-screen before/after comparisons to track physical transformations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setIsLogModalOpen(true);
                startCamera('user');
              }}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo & Log Weight</span>
            </button>
            <button
              onClick={() => {
                setIsLogModalOpen(true);
                setIsCameraActive(false);
                fileInputRef.current?.click();
              }}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                viewMode === 'comparison'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Before & After Compare</span>
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                viewMode === 'gallery'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Photo Timeline ({entries.length})</span>
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                viewMode === 'trends'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Weight Trajectory</span>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div>
              Total Photos:{' '}
              <span className="text-emerald-400 font-bold">{entries.length}</span>
            </div>
            <div>
              Latest Weight:{' '}
              <span className="text-white font-bold">
                {entries[entries.length - 1]?.weightKg || userProfile.weightKg}{' '}
                {userProfile.weightUnit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: INTERACTIVE BEFORE & AFTER COMPARISON */}
      {/* ========================================================================= */}
      {viewMode === 'comparison' && (
        <div className="space-y-6">
          {/* Comparison Controls Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Pose Filter Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Pose:
              </span>
              {(['all', 'front', 'side', 'back', 'flexed'] as const).map((pose) => (
                <button
                  key={pose}
                  onClick={() => setSelectedPoseFilter(pose)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                    selectedPoseFilter === pose
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pose === 'all' ? 'All Poses' : pose}
                </button>
              ))}
            </div>

            {/* Date Pickers for Before & After */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Before:</label>
                <select
                  value={beforeId}
                  onChange={(e) => setBeforeId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {filteredEntries.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.date} ({e.weightKg} {e.weightUnit || 'kg'} • {e.pose})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">After:</label>
                <select
                  value={afterId}
                  onChange={(e) => setAfterId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {filteredEntries.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.date} ({e.weightKg} {e.weightUnit || 'kg'} • {e.pose})
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Comparison Format */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setComparisonStyle('slider')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    comparisonStyle === 'slider'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Interactive Split Screen Drag Slider"
                >
                  Split Slider
                </button>
                <button
                  onClick={() => setComparisonStyle('side_by_side')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    comparisonStyle === 'side_by_side'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Side-by-Side Dual View"
                >
                  Side-by-Side
                </button>
              </div>
            </div>
          </div>

          {/* Transformation Delta Summary Banner */}
          {comparisonStats && beforeEntry && afterEntry && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Time Elapsed</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
                  {comparisonStats.daysApart} Days
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {beforeEntry.date} → {afterEntry.date}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Weight Change</span>
                </div>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono mt-1 flex items-center gap-1 ${
                    comparisonStats.weightDelta < 0
                      ? 'text-emerald-600'
                      : comparisonStats.weightDelta > 0
                      ? 'text-blue-600'
                      : 'text-slate-700'
                  }`}
                >
                  {comparisonStats.weightDelta > 0 ? '+' : ''}
                  {comparisonStats.weightDelta.toFixed(1)} {beforeEntry.weightUnit || 'kg'}
                  {comparisonStats.weightDelta < 0 ? (
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  {beforeEntry.weightKg}kg → {afterEntry.weightKg}kg ({comparisonStats.weightPctDelta.toFixed(1)}%)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Body Fat Delta</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
                  {comparisonStats.bodyFatDelta !== null ? (
                    <span
                      className={
                        comparisonStats.bodyFatDelta < 0 ? 'text-emerald-600' : 'text-slate-900'
                      }
                    >
                      {comparisonStats.bodyFatDelta > 0 ? '+' : ''}
                      {comparisonStats.bodyFatDelta.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm font-normal">Not recorded</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Estimated adipose shift</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>Waist Circumference</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
                  {comparisonStats.waistDelta !== null ? (
                    <span
                      className={
                        comparisonStats.waistDelta < 0 ? 'text-emerald-600' : 'text-slate-900'
                      }
                    >
                      {comparisonStats.waistDelta > 0 ? '+' : ''}
                      {comparisonStats.waistDelta.toFixed(1)} cm
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm font-normal">Not recorded</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Trunk measurement</div>
              </div>
            </div>
          )}

          {/* MAIN VISUAL COMPARISON STAGE */}
          {beforeEntry && afterEntry ? (
            <div className="rounded-3xl bg-slate-950 p-4 sm:p-6 border border-slate-800 text-white shadow-xl overflow-hidden">
              {/* Style A: Interactive Drag Split-Curtain Slider */}
              {comparisonStyle === 'slider' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="flex items-center gap-1.5 font-bold text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      BEFORE: {beforeEntry.date} ({beforeEntry.weightKg} {beforeEntry.weightUnit || 'kg'})
                    </span>
                    <span className="hidden sm:inline text-[11px] text-slate-500">
                      ← Drag slider horizontally to reveal transformation →
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      AFTER: {afterEntry.date} ({afterEntry.weightKg} {afterEntry.weightUnit || 'kg'})
                    </span>
                  </div>

                  {/* Interactive Slider Frame */}
                  <div
                    ref={sliderContainerRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={() => setIsDraggingSlider(true)}
                    onMouseUp={() => setIsDraggingSlider(false)}
                    onMouseLeave={() => setIsDraggingSlider(false)}
                    onTouchMove={handleTouchMove}
                    className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden cursor-ew-resize select-none bg-slate-900 border border-slate-800"
                  >
                    {/* AFTER Image (Full Layer at bottom) */}
                    <img
                      src={afterEntry.photoUrl}
                      alt={`After ${afterEntry.date}`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* BEFORE Image (Clipped Layer on top based on sliderPosition) */}
                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      {/* Inner image container must maintain full parent dimensions to align perfectly */}
                      <div
                        className="relative h-full"
                        style={{
                          width: sliderContainerRef.current
                            ? `${sliderContainerRef.current.clientWidth}px`
                            : '100vw',
                        }}
                      >
                        <img
                          src={beforeEntry.photoUrl}
                          alt={`Before ${beforeEntry.date}`}
                          className="w-full h-full object-cover pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Draggable Vertical Divider Bar */}
                    <div
                      className="absolute inset-y-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      {/* Glowing Circular Handle */}
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center border-2 border-emerald-500 pointer-events-auto cursor-grab active:cursor-grabbing">
                        <Sliders className="w-4 h-4 text-slate-800" />
                      </div>
                    </div>

                    {/* Floating HUD Badges */}
                    <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono z-10">
                      <div className="text-[10px] text-blue-400 font-bold uppercase">Before Baseline</div>
                      <div className="font-bold text-white">
                        {beforeEntry.date} • {beforeEntry.weightKg} {beforeEntry.weightUnit || 'kg'}
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono z-10 text-right">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">After Progress</div>
                      <div className="font-bold text-white">
                        {afterEntry.date} • {afterEntry.weightKg} {afterEntry.weightUnit || 'kg'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Style B: Side-by-Side Dual Frame */}
              {comparisonStyle === 'side_by_side' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Frame */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-bold text-blue-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Before: {beforeEntry.date}
                      </span>
                      <span className="font-mono text-slate-300 font-bold">
                        {beforeEntry.weightKg} {beforeEntry.weightUnit || 'kg'}
                      </span>
                    </div>
                    <div className="relative aspect-4/3 sm:aspect-1/1 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
                      <img
                        src={beforeEntry.photoUrl}
                        alt="Before"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-bold text-white">{beforeEntry.pose} Pose</span>
                          {beforeEntry.bodyFatPercent && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              BF: {beforeEntry.bodyFatPercent}%
                            </span>
                          )}
                        </div>
                        {beforeEntry.notes && (
                          <p className="text-[11px] text-slate-300 line-clamp-2">{beforeEntry.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setInspectionEntry(beforeEntry)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* After Frame */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> After: {afterEntry.date}
                      </span>
                      <span className="font-mono text-slate-300 font-bold">
                        {afterEntry.weightKg} {afterEntry.weightUnit || 'kg'}
                      </span>
                    </div>
                    <div className="relative aspect-4/3 sm:aspect-1/1 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
                      <img
                        src={afterEntry.photoUrl}
                        alt="After"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-bold text-white">{afterEntry.pose} Pose</span>
                          {afterEntry.bodyFatPercent && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              BF: {afterEntry.bodyFatPercent}%
                            </span>
                          )}
                        </div>
                        {afterEntry.notes && (
                          <p className="text-[11px] text-slate-300 line-clamp-2">{afterEntry.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setInspectionEntry(afterEntry)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <Camera className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No photos to compare yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Log at least two body progress entries to see side-by-side comparisons and interactive split sliders.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Take First Photo
                </button>
                <button
                  onClick={handleResetDemoData}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Load Demo Data
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: PHOTO TIMELINE & GALLERY GRID */}
      {/* ========================================================================= */}
      {viewMode === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Physique Check-In Timeline</h3>
              <p className="text-xs text-slate-500">
                All visual entries recorded in reverse chronological order
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsLogModalOpen(true);
                  startCamera('user');
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Check-In</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...entries]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry, idx) => {
                const isSelectedBefore = beforeId === entry.id;
                const isSelectedAfter = afterId === entry.id;

                return (
                  <div
                    key={entry.id}
                    onClick={() => setInspectionEntry(entry)}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                      <img
                        src={entry.photoUrl}
                        alt={`Progress ${entry.date}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-slate-700">
                          {entry.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-600/90 text-[10px] font-bold text-white uppercase tracking-wider">
                          {entry.pose}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDeleteEntry(entry.id, e)}
                          className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white shadow-xs"
                          title="Delete photo entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Before / After Badges */}
                      {(isSelectedBefore || isSelectedAfter) && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                          {isSelectedBefore && (
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold uppercase">
                              Active Before
                            </span>
                          )}
                          {isSelectedAfter && (
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase">
                              Active After
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Entry Details */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-slate-900 font-mono">
                            {entry.weightKg}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              {entry.weightUnit || 'kg'}
                            </span>
                          </span>
                          {entry.bodyFatPercent && (
                            <span className="text-xs font-mono font-bold text-slate-600">
                              {entry.bodyFatPercent}% BF
                            </span>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {entry.notes}
                          </p>
                        )}
                      </div>

                      {/* Quick Compare Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBeforeId(entry.id);
                            setViewMode('comparison');
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 py-1"
                        >
                          Set as Before
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAfterId(entry.id);
                            setViewMode('comparison');
                          }}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 py-1"
                        >
                          Set as After
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: WEIGHT TRAJECTORY & METRIC TRENDS */}
      {/* ========================================================================= */}
      {viewMode === 'trends' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Bodyweight & Physique Milestones</h3>
                <p className="text-xs text-slate-500">
                  Weight trendline with visual camera markers indicating photo check-ins
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Weight ({userProfile.weightUnit})
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 font-medium ml-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500" /> Target ({userProfile.targetWeightKg})
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    domain={['dataMin - 2', 'dataMax + 2']}
                    stroke="#94a3b8"
                    fontSize={11}
                    unit={userProfile.weightUnit}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 text-xs space-y-1 font-mono">
                            <div className="font-bold text-slate-300">{data.fullDate}</div>
                            <div className="text-emerald-400 font-bold text-sm">
                              Weight: {data.weight} {userProfile.weightUnit}
                            </div>
                            {data.bodyFat && (
                              <div className="text-slate-300">Body Fat: {data.bodyFat}%</div>
                            )}
                            {data.notes && (
                              <div className="text-slate-400 text-[10px] pt-1 font-sans">{data.notes}</div>
                            )}
                            <div className="text-cyan-400 text-[10px] pt-0.5">
                              📷 Photo attached ({data.pose} pose)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={userProfile.targetWeightKg}
                    stroke="#3b82f6"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target: ${userProfile.targetWeightKg}kg`,
                      position: 'top',
                      fill: '#3b82f6',
                      fontSize: 10,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TAKE PHOTO (LIVE CAMERA STREAM) OR UPLOAD & LOG ENTRY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Take Progress Photo & Log Weight
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Standardized visual record with date and weight stamp
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsLogModalOpen(false);
                    stopCamera();
                  }}
                  className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveEntry} className="p-5 sm:p-6 overflow-y-auto space-y-5">
                {/* 1. Camera Viewport & Capture Controls */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>1. Visual Progress Capture (Camera / File)</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {capturedPhotoUrl ? '✓ Photo Ready' : isCameraActive ? 'Live Camera Active' : 'Select Source'}
                    </span>
                  </label>

                  {/* Viewport Frame */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center border-2 ${
                      isDragOver ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800'
                    }`}
                  >
                    {/* A. If Photo is Captured: Preview */}
                    {capturedPhotoUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={capturedPhotoUrl}
                          alt="Captured preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCapturedPhotoUrl(null);
                              startCamera(facingMode);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow-md"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retake Photo</span>
                          </button>
                        </div>
                      </div>
                    ) : isCameraActive ? (
                      /* B. Active Live Camera Stream */
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${
                            facingMode === 'user' ? '-scale-x-100' : ''
                          }`}
                        />

                        {/* Silhouette Body Alignment Guide Overlay */}
                        {showSilhouette && (
                          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-40">
                            {/* Subtle vector silhouette outline */}
                            <svg
                              className="w-48 sm:w-64 h-full"
                              viewBox="0 0 200 300"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                            >
                              {/* Head Oval */}
                              <ellipse cx="100" cy="45" rx="20" ry="26" />
                              {/* Neck & Shoulders */}
                              <path d="M 85 70 L 40 90 L 35 150 M 115 70 L 160 90 L 165 150" />
                              {/* Torso & Hip */}
                              <path d="M 55 95 L 60 180 L 100 190 L 140 180 L 145 95" />
                              {/* Legs */}
                              <path d="M 70 190 L 65 285 M 130 190 L 135 285" />
                              {/* Center plumb line */}
                              <line x1="100" y1="20" x2="100" y2="290" stroke="#06b6d4" strokeWidth="1" />
                            </svg>
                            <span className="absolute bottom-16 text-[10px] text-emerald-400 font-mono font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                              Align posture with centerline
                            </span>
                          </div>
                        )}

                        {/* Countdown Overlay */}
                        {countdown !== null && (
                          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-30">
                            <span className="text-7xl font-black text-white font-mono animate-ping">
                              {countdown}
                            </span>
                          </div>
                        )}

                        {/* Camera Top Controls */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                          <button
                            type="button"
                            onClick={() => setShowSilhouette(!showSilhouette)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                              showSilhouette
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900/70 text-slate-400 border-slate-700'
                            }`}
                          >
                            Guide Overlay: {showSilhouette ? 'ON' : 'OFF'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={toggleCameraFacing}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 text-xs"
                              title="Flip front/back camera"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 text-xs"
                              title="Turn off camera"
                            >
                              <CameraOff className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Camera Shutter Bar */}
                        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-20">
                          <button
                            type="button"
                            onClick={triggerShutter}
                            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700"
                          >
                            3s Timer
                          </button>
                          <button
                            type="button"
                            onClick={captureFrame}
                            className="w-14 h-14 rounded-full bg-white text-slate-950 p-1 ring-4 ring-emerald-500/50 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center"
                          >
                            <div className="w-11 h-11 rounded-full bg-emerald-500 border-2 border-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* C. Inactive Camera / Upload Fallback Placeholder */
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
                          <Camera className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            Start Camera or Upload Photo
                          </div>
                          <p className="text-xs text-slate-400 max-w-xs mt-1">
                            Use your webcam / mobile camera for instant capture, or drag and drop an existing photo file.
                          </p>
                        </div>
                        {cameraError && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] text-left">
                            <div className="flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{cameraError}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => startCamera('user')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Start Camera</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Browse Files</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* 2. Date-Stamped Weight & Measurements Form */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700">
                    2. Date & Bodyweight Measurements
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Date */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Measurement Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Body Weight ({userProfile.weightUnit})
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="e.g. 78.5"
                          value={formWeight}
                          onChange={(e) => setFormWeight(e.target.value)}
                          className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          {userProfile.weightUnit}
                        </span>
                      </div>
                    </div>

                    {/* Pose */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Pose Stance
                      </label>
                      <select
                        value={formPose}
                        onChange={(e) => setFormPose(e.target.value as BodyProgressPose)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 capitalize"
                      >
                        <option value="front">Front Relaxed (🧍‍♂️)</option>
                        <option value="side">Side Profile (🚶‍♂️)</option>
                        <option value="back">Back Relaxed (🧘‍♂️)</option>
                        <option value="flexed">Flexed / Double Bicep (💪)</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Body Circumferences Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowMeasurements(!showMeasurements)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>{showMeasurements ? 'Hide' : '+ Add'} Body Circumferences & Body Fat %</span>
                    </button>

                    {showMeasurements && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Body Fat %</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 15.5"
                            value={formBodyFat}
                            onChange={(e) => setFormBodyFat(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Waist (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 82.0"
                            value={formWaist}
                            onChange={(e) => setFormWaist(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Chest (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 104.0"
                            value={formChest}
                            onChange={(e) => setFormChest(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Arms (cm)</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 37.5"
                            value={formArms}
                            onChange={(e) => setFormArms(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes Field */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Check-In Notes & Observations
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Fasted morning check-in. Vascularity looking sharp on shoulders, feeling energetic."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
                    />
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogModalOpen(false);
                      stopCamera();
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!capturedPhotoUrl}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                      capturedPhotoUrl
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Body Progress Check-In</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* FULLSCREEN INSPECTION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {inspectionEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">
                    {inspectionEntry.date} • {inspectionEntry.weightKg} {inspectionEntry.weightUnit || 'kg'}
                  </h4>
                  <span className="text-xs text-emerald-400 capitalize">{inspectionEntry.pose} Pose</span>
                </div>
                <button
                  onClick={() => setInspectionEntry(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-4/3 sm:aspect-16/10 bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={inspectionEntry.photoUrl}
                  alt={inspectionEntry.date}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 space-y-2 text-xs bg-slate-900 border-t border-slate-800">
                {inspectionEntry.notes && (
                  <p className="text-slate-300 leading-relaxed">{inspectionEntry.notes}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                  {inspectionEntry.bodyFatPercent && (
                    <span>Body Fat: {inspectionEntry.bodyFatPercent}%</span>
                  )}
                  {inspectionEntry.waistCm && <span>Waist: {inspectionEntry.waistCm}cm</span>}
                  {inspectionEntry.chestCm && <span>Chest: {inspectionEntry.chestCm}cm</span>}
                  {inspectionEntry.armsCm && <span>Arms: {inspectionEntry.armsCm}cm</span>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
