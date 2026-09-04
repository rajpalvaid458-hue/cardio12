import React, { useState, useMemo, useEffect } from 'react';
import {
  Scale,
  Calculator,
  Activity,
  Heart,
  Target,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { useLanguage } from '../../context/LanguageContext';

export interface BmiCategoryInfo {
  label: string;
  hindiLabel: string;
  min: number;
  max: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  healthRisk: string;
  hindiHealthRisk: string;
}

const BMI_CATEGORIES: BmiCategoryInfo[] = [
  {
    label: 'Underweight',
    hindiLabel: 'कम वजन (अंडरवेट)',
    min: 0,
    max: 18.5,
    colorClass: 'bg-amber-400',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    healthRisk: 'Malnutrition risk, lower immunity',
    hindiHealthRisk: 'पोषक तत्वों की कमी, कम रोग प्रतिरोधक क्षमता',
  },
  {
    label: 'Normal (Healthy)',
    hindiLabel: 'सामान्य व स्वस्थ (नॉर्मल)',
    min: 18.5,
    max: 24.9,
    colorClass: 'bg-emerald-500',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-800',
    healthRisk: 'Lowest cardiovascular & metabolic risk',
    hindiHealthRisk: 'हृदय और मेटाबॉलिक स्वास्थ्य के लिए सबसे आदर्श',
  },
  {
    label: 'Overweight',
    hindiLabel: 'अधिक वजन (ओवरवेट)',
    min: 25.0,
    max: 29.9,
    colorClass: 'bg-amber-500',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    healthRisk: 'Moderate strain on joints and heart',
    hindiHealthRisk: 'जोड़ों व कार्डियोवैस्कुलर सिस्टम पर मध्यम दबाव',
  },
  {
    label: 'Obesity (Class I)',
    hindiLabel: 'मोटापा (श्रेणी I)',
    min: 30.0,
    max: 34.9,
    colorClass: 'bg-orange-500',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    textClass: 'text-orange-800',
    healthRisk: 'Elevated blood pressure & insulin resistance',
    hindiHealthRisk: 'रक्तचाप और इंसुलिन प्रतिरोध का बढ़ा जोखिम',
  },
  {
    label: 'Severe Obesity (Class II+)',
    hindiLabel: 'गंभीर मोटापा (श्रेणी II+)',
    min: 35.0,
    max: 100,
    colorClass: 'bg-rose-500',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    healthRisk: 'High cardiometabolic risk',
    hindiHealthRisk: 'उच्च कार्डियोमेटाबोलिक व संवहनी जोखिम',
  },
];

export const BmiCalculatorTool: React.FC = () => {
  const { userProfile, updateUserProfile } = useFitness();
  const { isHindi } = useLanguage();

  // Unit settings
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Interactive input states (initialized with user profile data)
  const [weightInput, setWeightInput] = useState<number>(userProfile.weightKg || 72);
  const [heightInputCm, setHeightInputCm] = useState<number>(userProfile.heightCm || 175);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [ageInput, setAgeInput] = useState<number>(userProfile.age || 26);
  const [genderInput, setGenderInput] = useState<'male' | 'female' | 'other'>(
    userProfile.gender || 'male'
  );

  // Success alert feedback when saved to profile
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync inputs when user profile changes
  useEffect(() => {
    if (userProfile.weightKg) {
      setWeightInput(userProfile.weightKg);
    }
    if (userProfile.heightCm) {
      setHeightInputCm(userProfile.heightCm);
      const totalInches = userProfile.heightCm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
    }
    if (userProfile.age) setAgeInput(userProfile.age);
    if (userProfile.gender) setGenderInput(userProfile.gender);
  }, [userProfile.weightKg, userProfile.heightCm, userProfile.age, userProfile.gender]);

  // Convert imperial height to cm
  const activeHeightCm = useMemo(() => {
    if (unitSystem === 'metric') return heightInputCm;
    const totalInches = heightFeet * 12 + heightInches;
    return Math.round(totalInches * 2.54);
  }, [unitSystem, heightInputCm, heightFeet, heightInches]);

  // Convert display weight to kg for standard formulas
  const activeWeightKg = useMemo(() => {
    if (unitSystem === 'metric') return weightInput;
    return Math.round((weightInput * 0.453592) * 10) / 10;
  }, [unitSystem, weightInput]);

  // Handle unit change
  const handleUnitToggle = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === unitSystem) return;
    if (newUnit === 'imperial') {
      // Metric -> Imperial
      setWeightInput(Math.round(activeWeightKg * 2.20462 * 10) / 10);
      const totalInches = activeHeightCm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
    } else {
      // Imperial -> Metric
      setWeightInput(activeWeightKg);
      setHeightInputCm(activeHeightCm);
    }
    setUnitSystem(newUnit);
  };

  // BMI Calculation: weight (kg) / [height (m)]^2
  const bmiValue = useMemo(() => {
    if (activeHeightCm <= 0 || activeWeightKg <= 0) return 0;
    const heightInMeters = activeHeightCm / 100;
    const rawBmi = activeWeightKg / (heightInMeters * heightInMeters);
    return Math.round(rawBmi * 10) / 10;
  }, [activeHeightCm, activeWeightKg]);

  // Current category based on BMI
  const currentCategory = useMemo(() => {
    if (bmiValue <= 0) return BMI_CATEGORIES[1];
    const found = BMI_CATEGORIES.find((cat) => bmiValue >= cat.min && bmiValue < cat.max);
    return found || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
  }, [bmiValue]);

  // Healthy Weight Range for this height (BMI 18.5 - 24.9)
  const healthyRangeKg = useMemo(() => {
    if (activeHeightCm <= 0) return { min: 50, max: 70 };
    const hM = activeHeightCm / 100;
    const minKg = Math.round(18.5 * hM * hM * 10) / 10;
    const maxKg = Math.round(24.9 * hM * hM * 10) / 10;
    return { min: minKg, max: maxKg };
  }, [activeHeightCm]);

  // Target weight BMI
  const targetWeightBmi = useMemo(() => {
    if (!userProfile.targetWeightKg || activeHeightCm <= 0) return null;
    const hM = activeHeightCm / 100;
    const rawBmi = userProfile.targetWeightKg / (hM * hM);
    return Math.round(rawBmi * 10) / 10;
  }, [userProfile.targetWeightKg, activeHeightCm]);

  // BMR (Basal Metabolic Rate via Mifflin-St Jeor)
  const bmrValue = useMemo(() => {
    if (activeWeightKg <= 0 || activeHeightCm <= 0 || ageInput <= 0) return 0;
    if (genderInput === 'female') {
      return Math.round(10 * activeWeightKg + 6.25 * activeHeightCm - 5 * ageInput - 161);
    }
    // Male or other
    return Math.round(10 * activeWeightKg + 6.25 * activeHeightCm - 5 * ageInput + 5);
  }, [activeWeightKg, activeHeightCm, ageInput, genderInput]);

  // Prime BMI (ratio to 25.0)
  const bmiPrime = useMemo(() => {
    if (bmiValue <= 0) return 1.0;
    return Math.round((bmiValue / 25.0) * 100) / 100;
  }, [bmiValue]);

  // Ponderal Index (kg/m^3 - useful for tall or short individuals)
  const ponderalIndex = useMemo(() => {
    if (activeHeightCm <= 0 || activeWeightKg <= 0) return 0;
    const hM = activeHeightCm / 100;
    return Math.round((activeWeightKg / (hM * hM * hM)) * 10) / 10;
  }, [activeHeightCm, activeWeightKg]);

  // Weight difference to normal range
  const weightDeltaToNormal = useMemo(() => {
    if (activeWeightKg < healthyRangeKg.min) {
      const diff = Math.round((healthyRangeKg.min - activeWeightKg) * 10) / 10;
      return { type: 'under', deltaKg: diff };
    }
    if (activeWeightKg > healthyRangeKg.max) {
      const diff = Math.round((activeWeightKg - healthyRangeKg.max) * 10) / 10;
      return { type: 'over', deltaKg: diff };
    }
    return { type: 'normal', deltaKg: 0 };
  }, [activeWeightKg, healthyRangeKg]);

  // Reset inputs back to profile
  const handleResetToProfile = () => {
    setUnitSystem('metric');
    setWeightInput(userProfile.weightKg || 72);
    setHeightInputCm(userProfile.heightCm || 175);
    setAgeInput(userProfile.age || 26);
    setGenderInput(userProfile.gender || 'male');
  };

  // Set inputs to target weight
  const handleSetToTargetWeight = () => {
    if (!userProfile.targetWeightKg) return;
    if (unitSystem === 'metric') {
      setWeightInput(userProfile.targetWeightKg);
    } else {
      setWeightInput(Math.round(userProfile.targetWeightKg * 2.20462 * 10) / 10);
    }
  };

  // Save current weight & height back to user profile
  const handleSaveToProfile = () => {
    updateUserProfile({
      weightKg: activeWeightKg,
      heightCm: activeHeightCm,
      age: ageInput,
      gender: genderInput,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Visual Gauge needle position percentage (clamped between 14 and 40 BMI)
  const gaugePercent = useMemo(() => {
    const minBmi = 14;
    const maxBmi = 38;
    const clamped = Math.max(minBmi, Math.min(maxBmi, bmiValue));
    return ((clamped - minBmi) / (maxBmi - minBmi)) * 100;
  }, [bmiValue]);

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header with Title & Quick Profile Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'त्वरित स्वास्थ्य मेट्रिक टूल' : 'Clinical Health & Body Metric'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{isHindi ? 'बीएमआई एवं स्वास्थ्य कैलकुलेटर' : 'BMI & Body Composition Calculator'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {isHindi
              ? 'आपकी प्रोफ़ाइल में सहेजे गए वज़न और कद के आधार पर तुरंत बॉडी मास इंडेक्स (BMI), स्वस्थ भार सीमा और बुनियादी कैलोरी मेटाबॉलिज्म (BMR) की गणना करें।'
              : 'Directly utilizes your profile weight & height to compute Body Mass Index (BMI), ideal clinical weight zones, and baseline metabolic rate.'}
          </p>
        </div>

        {/* Profile Sync Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => handleUnitToggle('metric')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                unitSystem === 'metric'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metric (kg / cm)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Imperial (lbs / ft)
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToProfile}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title={isHindi ? 'प्रोफ़ाइल डेटा रीसेट करें' : 'Reset to saved profile stats'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left interactive controls, Right live BMI score & visual gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'शरीर के पैरामीटर' : 'Body Parameters'}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {userProfile.weightKg}kg • {userProfile.heightCm}cm
            </span>
          </div>

          {/* Weight Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">
                {isHindi ? 'वजन (Weight)' : 'Body Weight'}
              </label>
              <span className="font-mono font-bold text-slate-900">
                {weightInput} {unitSystem === 'metric' ? 'kg' : 'lbs'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={unitSystem === 'metric' ? 35 : 77}
                max={unitSystem === 'metric' ? 160 : 350}
                step={unitSystem === 'metric' ? 0.5 : 1}
                value={weightInput}
                onChange={(e) => setWeightInput(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)}
                className="w-20 bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Quick Button: Set to Target Weight */}
            {userProfile.targetWeightKg && userProfile.targetWeightKg !== activeWeightKg && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSetToTargetWeight}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
                >
                  <Target className="w-3 h-3 text-blue-600" />
                  <span>
                    {isHindi
                      ? `लक्ष्य वजन पर टेस्ट करें (${userProfile.targetWeightKg} kg)`
                      : `Test Target Weight (${userProfile.targetWeightKg} kg)`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Height Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">
                {isHindi ? 'कद (Height)' : 'Height'}
              </label>
              <span className="font-mono font-bold text-slate-900">
                {unitSystem === 'metric'
                  ? `${heightInputCm} cm`
                  : `${heightFeet}ft ${heightInches}in (${activeHeightCm} cm)`}
              </span>
            </div>

            {unitSystem === 'metric' ? (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={120}
                  max={220}
                  step={1}
                  value={heightInputCm}
                  onChange={(e) => setHeightInputCm(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  value={heightInputCm}
                  onChange={(e) => setHeightInputCm(parseInt(e.target.value, 10) || 120)}
                  className="w-20 bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:border-emerald-600"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <select
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    {[4, 5, 6, 7].map((ft) => (
                      <option key={ft} value={ft}>
                        {ft} Feet
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <select
                    value={heightInches}
                    onChange={(e) => setHeightInches(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} Inches
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Age & Gender controls for BMR calculations */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">
                {isHindi ? 'उम्र (Age)' : 'Age'}
              </label>
              <input
                type="number"
                min={12}
                max={99}
                value={ageInput}
                onChange={(e) => setAgeInput(parseInt(e.target.value, 10) || 25)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">
                {isHindi ? 'लिंग (Gender)' : 'Gender'}
              </label>
              <select
                value={genderInput}
                onChange={(e) => setGenderInput(e.target.value as 'male' | 'female' | 'other')}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="male">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="female">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                <option value="other">{isHindi ? 'अन्य (Other)' : 'Other'}</option>
              </select>
            </div>
          </div>

          {/* Action buttons: Save back to profile */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleSaveToProfile}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isHindi ? 'प्रोफ़ाइल में अपडेट करें' : 'Save to Profile'}</span>
            </button>

            {saveSuccess && (
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {isHindi ? 'सहेजा गया!' : 'Updated!'}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Live BMI Meter, Spectrum & Health Insights (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Score Banner */}
          <div className={`p-5 rounded-2xl border ${currentCategory.borderClass} ${currentCategory.bgClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all`}>
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{isHindi ? 'आपका वर्तमान बीएमआई' : 'Calculated Body Mass Index'}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900">
                  {bmiValue}
                </span>
                <span className="text-xs font-semibold text-slate-500 font-mono">kg/m²</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${currentCategory.colorClass} text-slate-950 shadow-2xs`}>
                  {isHindi ? currentCategory.hindiLabel : currentCategory.label}
                </span>
              </div>
              <div className="text-xs text-slate-700 font-medium pt-0.5">
                {isHindi ? currentCategory.hindiHealthRisk : currentCategory.healthRisk}
              </div>
            </div>

            {/* Quick Target BMI Comparison */}
            {targetWeightBmi !== null && (
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200/80 shrink-0 text-right font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-end gap-1">
                  <Target className="w-3 h-3 text-blue-600" />
                  <span>{isHindi ? 'लक्ष्य बीएमआई' : 'Target Goal BMI'}</span>
                </div>
                <div className="text-xl font-black text-blue-700 mt-0.5">
                  {targetWeightBmi}
                </div>
                <div className="text-[10px] text-slate-500">
                  at {userProfile.targetWeightKg} kg
                </div>
              </div>
            )}
          </div>

          {/* Visual Spectrum Gauge Bar */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold text-[11px] uppercase tracking-wider">
                {isHindi ? 'डब्ल्यूएचओ बीएमआई स्पेक्ट्रम' : 'WHO Standard Range Spectrum'}
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                18.5 – 24.9 {isHindi ? 'आदर्श स्वस्थ' : 'Optimal'}
              </span>
            </div>

            {/* Pointer Gauge Needle */}
            <div className="relative pt-3 pb-1">
              <div
                className="absolute top-0 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${Math.min(98, Math.max(2, gaugePercent))}%` }}
              >
                <span className="text-[10px] font-black font-mono bg-slate-900 text-white px-1.5 py-0.2 rounded shadow-sm">
                  {bmiValue}
                </span>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900 mt-0.5" />
              </div>

              {/* Gradient Spectrum Track */}
              <div className="h-3 w-full rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: '18.75%' }} className="bg-amber-400" title="Underweight (<18.5)" />
                <div style={{ width: '26.66%' }} className="bg-emerald-500" title="Normal (18.5 - 24.9)" />
                <div style={{ width: '20.83%' }} className="bg-amber-500" title="Overweight (25 - 29.9)" />
                <div style={{ width: '20.83%' }} className="bg-orange-500" title="Obese Class I (30 - 34.9)" />
                <div style={{ width: '12.93%' }} className="bg-rose-500" title="Obese Class II+ (≥35)" />
              </div>

              {/* Markers along the track */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                <span>14</span>
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>35.0</span>
                <span>38+</span>
              </div>
            </div>
          </div>

          {/* Quick Body & Metabolism Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Healthy Weight Range */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{isHindi ? 'स्वस्थ वजन सीमा' : 'Healthy Weight Range'}</span>
              </div>
              <div className="text-base font-black text-slate-900 font-mono mt-1">
                {unitSystem === 'metric'
                  ? `${healthyRangeKg.min} – ${healthyRangeKg.max} kg`
                  : `${Math.round(healthyRangeKg.min * 2.20462)} – ${Math.round(healthyRangeKg.max * 2.20462)} lbs`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                for {activeHeightCm} cm height
              </div>
            </div>

            {/* BMR Basal Metabolism */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-600" />
                <span>{isHindi ? 'बीएमआर कैलोरी' : 'Basal BMR'}</span>
              </div>
              <div className="text-base font-black text-rose-700 font-mono mt-1">
                {bmrValue.toLocaleString()} <span className="text-xs font-semibold text-slate-500">kcal/day</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isHindi ? 'आराम के समय की ऊर्जा' : 'Resting metabolic rate'}
              </div>
            </div>

            {/* Weight Adjustment Delta */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                {weightDeltaToNormal.type === 'normal' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : weightDeltaToNormal.type === 'under' ? (
                  <TrendingUp className="w-3 h-3 text-amber-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-amber-600" />
                )}
                <span>{isHindi ? 'लक्ष्य समायोजन' : 'Optimal Target Delta'}</span>
              </div>
              <div className="text-base font-black font-mono mt-1">
                {weightDeltaToNormal.type === 'normal' ? (
                  <span className="text-emerald-700">{isHindi ? 'आदर्श सीमा में' : 'In Ideal Zone'}</span>
                ) : weightDeltaToNormal.type === 'under' ? (
                  <span className="text-amber-700">+{weightDeltaToNormal.deltaKg} kg</span>
                ) : (
                  <span className="text-amber-700">-{weightDeltaToNormal.deltaKg} kg</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {weightDeltaToNormal.type === 'normal'
                  ? isHindi ? 'स्वस्थ बीएमआई बनाए रखें' : 'Maintain healthy bodyweight'
                  : isHindi ? 'स्वस्थ सीमा में आने के लिए' : 'To enter 18.5 - 24.9 zone'}
              </div>
            </div>
          </div>

          {/* Athletes & Bodybuilding Scientific Note */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed text-[11px] text-slate-600">
              <strong className="text-slate-900 font-semibold">
                {isHindi ? 'एथलीटों और बॉडीबिल्डर्स के लिए विशेष नोट:' : 'Strength & Athletic Context:'}
              </strong>{' '}
              {isHindi
                ? 'बीएमआई केवल कद और कुल वजन का अनुपात है। यदि आप भारी वजन उठाते हैं या उच्च मांसपेशी द्रव्यमान (High Muscle Mass) रखते हैं, तो आपका बीएमआई अधिक हो सकता है जबकि शरीर की चर्बी कम हो। शरीर संरचना के सटीक आकलन के लिए हमारे बॉडी प्रोग्रेस व फोटो ट्रैकर का उपयोग करें।'
                : 'BMI does not differentiate between lean muscular mass and adipose tissue. Dedicated strength athletes and bodybuilders with high lean muscle mass may register as "Overweight" on standard BMI charts while maintaining single-digit body fat percentages.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
