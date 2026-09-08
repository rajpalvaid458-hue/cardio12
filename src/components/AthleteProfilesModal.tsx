import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useLanguage } from '../context/LanguageContext';
import { AthleteProfile, FitnessGoal, FitnessLevel } from '../types';
import {
  X,
  User,
  UserPlus,
  Users,
  CheckCircle2,
  Trash2,
  Edit3,
  Dumbbell,
  Flame,
  Scale,
  Target,
  Sparkles,
  Share2,
  Check,
  ShieldCheck,
  Utensils,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AthleteProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_COLORS = [
  { id: 'emerald', bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-300', light: 'bg-emerald-500/15' },
  { id: 'amber', bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-300', light: 'bg-amber-500/15' },
  { id: 'sky', bg: 'bg-sky-500', border: 'border-sky-400', text: 'text-sky-300', light: 'bg-sky-500/15' },
  { id: 'rose', bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-300', light: 'bg-rose-500/15' },
  { id: 'indigo', bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-300', light: 'bg-indigo-500/15' },
  { id: 'violet', bg: 'bg-violet-500', border: 'border-violet-400', text: 'text-violet-300', light: 'bg-violet-500/15' },
  { id: 'cyan', bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-300', light: 'bg-cyan-500/15' },
];

export const AthleteProfilesModal: React.FC<AthleteProfilesModalProps> = ({ isOpen, onClose }) => {
  const {
    profiles,
    activeProfileId,
    switchProfile,
    addProfile,
    updateProfileItem,
    deleteProfile,
    workoutLogs,
  } = useFitness();
  const { isHindi } = useLanguage();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State for Adding / Editing
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState('25');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('75');
  const [targetWeightKg, setTargetWeightKg] = useState('78');
  const [goal, setGoal] = useState<FitnessGoal>('muscle_gain');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('intermediate');
  const [avatarColor, setAvatarColor] = useState('emerald');

  if (!isOpen) return null;

  const handleOpenAddForm = () => {
    setName('');
    setGender('male');
    setAge('25');
    setHeightCm('175');
    setWeightKg('75');
    setTargetWeightKg('78');
    setGoal('muscle_gain');
    setFitnessLevel('intermediate');
    setAvatarColor(AVATAR_COLORS[profiles.length % AVATAR_COLORS.length].id);
    setEditingProfileId(null);
    setIsAddingNew(true);
  };

  const handleOpenEditForm = (profile: AthleteProfile) => {
    setName(profile.name);
    setGender(profile.gender);
    setAge(profile.age.toString());
    setHeightCm(profile.heightCm.toString());
    setWeightKg(profile.weightKg.toString());
    setTargetWeightKg(profile.targetWeightKg.toString());
    setGoal(profile.goal);
    setFitnessLevel(profile.fitnessLevel);
    setAvatarColor(profile.avatarColor || 'emerald');
    setEditingProfileId(profile.id);
    setIsAddingNew(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    const parsedAge = parseInt(age, 10) || 25;
    const parsedHeight = parseFloat(heightCm) || 175;
    const parsedWeight = parseFloat(weightKg) || 75;
    const parsedTargetWeight = parseFloat(targetWeightKg) || 78;

    // Estimate daily calorie & macro targets based on goal
    let dailyCalories = 2500;
    let dailyProtein = 150;
    let dailyCarbs = 275;
    let dailyFats = 65;

    if (goal === 'muscle_gain') {
      dailyCalories = Math.round(parsedWeight * 33 + 400);
      dailyProtein = Math.round(parsedWeight * 2.0);
      dailyFats = Math.round((dailyCalories * 0.25) / 9);
      dailyCarbs = Math.round((dailyCalories - dailyProtein * 4 - dailyFats * 9) / 4);
    } else if (goal === 'fat_loss') {
      dailyCalories = Math.round(parsedWeight * 28 - 400);
      dailyProtein = Math.round(parsedWeight * 2.2);
      dailyFats = Math.round((dailyCalories * 0.25) / 9);
      dailyCarbs = Math.round((dailyCalories - dailyProtein * 4 - dailyFats * 9) / 4);
    } else if (goal === 'endurance') {
      dailyCalories = Math.round(parsedWeight * 34);
      dailyProtein = Math.round(parsedWeight * 1.6);
      dailyFats = Math.round((dailyCalories * 0.22) / 9);
      dailyCarbs = Math.round((dailyCalories - dailyProtein * 4 - dailyFats * 9) / 4);
    } else {
      dailyCalories = Math.round(parsedWeight * 31);
      dailyProtein = Math.round(parsedWeight * 1.8);
      dailyFats = Math.round((dailyCalories * 0.25) / 9);
      dailyCarbs = Math.round((dailyCalories - dailyProtein * 4 - dailyFats * 9) / 4);
    }

    if (editingProfileId) {
      updateProfileItem(editingProfileId, {
        name: cleanName,
        gender,
        age: parsedAge,
        heightCm: parsedHeight,
        weightKg: parsedWeight,
        targetWeightKg: parsedTargetWeight,
        goal,
        fitnessLevel,
        avatarColor,
        dailyCalorieTarget: dailyCalories,
        dailyProteinTarget: dailyProtein,
        dailyCarbsTarget: dailyCarbs,
        dailyFatsTarget: dailyFats,
        dailyWaterTargetMl: Math.round(parsedWeight * 38),
      });
      setIsAddingNew(false);
      setEditingProfileId(null);
    } else {
      addProfile({
        name: cleanName,
        avatarColor,
        gender,
        age: parsedAge,
        heightCm: parsedHeight,
        weightKg: parsedWeight,
        targetWeightKg: parsedTargetWeight,
        goal,
        fitnessLevel,
        activityLevel: 'moderately_active',
        dailyCalorieTarget: dailyCalories,
        dailyProteinTarget: dailyProtein,
        dailyCarbsTarget: dailyCarbs,
        dailyFatsTarget: dailyFats,
        dailyWaterTargetMl: Math.round(parsedWeight * 38),
        weightUnit: 'kg',
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        notes: `${cleanName}'s Personal Section`,
      });
      confetti({ particleCount: 50, spread: 60 });
      setIsAddingNew(false);
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const getGoalTitle = (g: FitnessGoal) => {
    switch (g) {
      case 'muscle_gain':
        return isHindi ? 'मसल गेन (मांसपेशियां बढ़ाना)' : 'Muscle Gain';
      case 'fat_loss':
        return isHindi ? 'फैट लॉस (वजन कम करना)' : 'Fat Loss';
      case 'strength':
        return isHindi ? 'स्ट्रेंथ (ताकत बढ़ाना)' : 'Strength';
      case 'endurance':
        return isHindi ? 'स्टैमिना व सहनशक्ति' : 'Endurance';
      case 'recomposition':
        return isHindi ? 'बॉडी रिकम्पोज़ीशन' : 'Recomposition';
      case 'general_health':
      default:
        return isHindi ? 'सामान्य फिटनेस व स्वास्थ्य' : 'General Fitness & Health';
    }
  };

  const getColorConfig = (colorId?: string) => {
    return AVATAR_COLORS.find((c) => c.id === colorId) || AVATAR_COLORS[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isHindi ? 'सबका अलग सेक्शन' : 'Athlete Profiles & Sections'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  {profiles.length} {isHindi ? 'सदस्य' : 'People'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'हर व्यक्ति का वर्कआउट, डाइट और प्रोग्रेस डेटा पूरी तरह अलग रहता है'
                  : 'Separate data, workouts, diet & progress for every athlete or friend'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Notice Banner */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">
                {isHindi ? '100% डेटा पृथक्करण (Data Isolation):' : 'Individual Data Protection:'}
              </span>{' '}
              {isHindi
                ? 'जब आप किसी व्यक्ति का सेक्शन चुनते हैं, तो उनका पूरा वर्कआउट प्लान, डाइट लॉग्स, हैबिट्स और लक्ष्य स्वतंत्र रूप से लोड होते हैं।'
                : 'Each person has their own isolated workout plans, daily calories, meal logs, routine, and streak history.'}
            </div>
          </div>

          {/* If Adding or Editing a Profile */}
          {isAddingNew ? (
            <form onSubmit={handleSaveProfile} className="p-5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>
                    {editingProfileId
                      ? isHindi
                        ? 'प्रोफाइल अपडेट करें'
                        : 'Edit Athlete Section'
                      : isHindi
                      ? 'नया व्यक्ति / सदस्य जोड़ें'
                      : 'Add New Athlete / Person'}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isHindi ? 'व्यक्ति का नाम (Full Name)' : 'Person Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isHindi ? 'उदा. रोहित, अमन, पूजा...' : 'e.g. Rohit Sharma, Sarah...'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isHindi ? 'अवतार थीम रंग (Avatar Color)' : 'Avatar Theme Color'}
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAvatarColor(c.id)}
                      className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-all ${
                        avatarColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {avatarColor === c.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'लिंग (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="male">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                    <option value="female">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                    <option value="other">{isHindi ? 'अन्य (Other)' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'आयु (Age)' : 'Age'}
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'कद (cm)' : 'Height (cm)'}
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'वर्तमान वजन (kg)' : 'Current Wt (kg)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={30}
                    max={250}
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'लक्ष्य वजन (kg)' : 'Target Wt (kg)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={30}
                    max={250}
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Goal & Fitness Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'फिटनेस लक्ष्य' : 'Fitness Goal'}
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="muscle_gain">{isHindi ? 'मसल गेन (Muscle Gain)' : 'Muscle Gain'}</option>
                    <option value="fat_loss">{isHindi ? 'फैट लॉस (Fat Loss)' : 'Fat Loss'}</option>
                    <option value="strength">{isHindi ? 'स्ट्रेंथ (Strength)' : 'Strength'}</option>
                    <option value="endurance">{isHindi ? 'स्टैमिना (Endurance)' : 'Endurance'}</option>
                    <option value="recomposition">{isHindi ? 'बॉडी रिकम्पोज़ीशन (Recomposition)' : 'Body Recomposition'}</option>
                    <option value="general_health">{isHindi ? 'सामान्य फिटनेस (General Fitness)' : 'General Health & Fitness'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isHindi ? 'फिटनेस स्तर' : 'Fitness Level'}
                  </label>
                  <select
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="beginner">{isHindi ? 'शुरुआती (Beginner)' : 'Beginner'}</option>
                    <option value="intermediate">{isHindi ? 'मध्यम (Intermediate)' : 'Intermediate'}</option>
                    <option value="advanced">{isHindi ? 'उन्नत (Advanced)' : 'Advanced'}</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {editingProfileId
                      ? isHindi
                        ? 'परिवर्तन सहेजें'
                        : 'Save Changes'
                      : isHindi
                      ? 'सेक्शन बनाएं और शुरू करें'
                      : 'Create & Open Section'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Button to add new profile */
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isHindi ? 'सभी व्यक्तियों के सेक्शन' : 'Available Athlete Sections'}
              </span>
              <button
                onClick={handleOpenAddForm}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isHindi ? '+ नया व्यक्ति जोड़ें' : '+ Add New Person'}</span>
              </button>
            </div>
          )}

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              const colorConf = getColorConfig(profile.avatarColor);
              const initials = profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={profile.id}
                  className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  {/* Top Bar inside card */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl ${colorConf.bg} text-slate-950 font-black text-sm flex items-center justify-center shadow-md`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{profile.name}</h3>
                            {isActive && (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                <CheckCircle2 className="w-3 h-3" />
                                {isHindi ? 'चालू' : 'Active'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {getGoalTitle(profile.goal)} • {profile.age} {isHindi ? 'वर्ष' : 'yrs'}
                          </p>
                        </div>
                      </div>

                      {/* Edit & Delete Options */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditForm(profile)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
                          title={isHindi ? 'सेक्शन संपादित करें' : 'Edit profile'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={() => deleteProfile(profile.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                            title={isHindi ? 'हटाएं' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stats Pill Rows */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 mb-3">
                      <div>
                        <span className="text-slate-500 block text-[10px]">{isHindi ? 'वजन' : 'Weight'}</span>
                        <span className="text-white font-bold">{profile.weightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">{isHindi ? 'लक्ष्य' : 'Target'}</span>
                        <span className="text-emerald-400 font-bold">{profile.targetWeightKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">{isHindi ? 'दैनिक कैलोरी' : 'Daily Cals'}</span>
                        <span className="text-amber-400 font-bold">{profile.dailyCalorieTarget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Switch / Open Button */}
                  <div>
                    {isActive ? (
                      <div className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{isHindi ? 'वर्तमान में यह सेक्शन खुला है' : 'Currently Active Section'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          switchProfile(profile.id);
                          onClose();
                        }}
                        className="w-full py-2 rounded-xl bg-slate-700/60 hover:bg-emerald-500 hover:text-slate-950 border border-slate-600/70 hover:border-emerald-400 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition duration-200 group"
                      >
                        <span>{isHindi ? 'इस सेक्शन में जाएं' : 'Switch to this Section'}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share App Link Box so other persons can open it on their phones */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {isHindi ? 'दूसरे व्यक्ति को ऐप लिंक भेजें' : 'Share App Link with Others'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isHindi
                    ? 'अन्य लोग अपने मोबाइल या लैपटॉप में यह लिंक खोलकर अपना अलग सेक्शन बना सकते हैं'
                    : 'Send this link to friends so they can use PulseFit directly on their devices'}
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyShareLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-xs ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isHindi ? 'लिंक कॉपी हो गया!' : 'Link Copied!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'ऐप लिंक कॉपी करें' : 'Copy App Link'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {isHindi ? 'सक्रिय सेक्शन: ' : 'Active Section: '}
            <span className="font-bold text-white">
              {profiles.find((p) => p.id === activeProfileId)?.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            {isHindi ? 'पूर्ण (Done)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
