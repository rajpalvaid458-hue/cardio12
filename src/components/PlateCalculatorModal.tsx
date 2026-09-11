import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Dumbbell, Sparkles, Check, RotateCcw, Plus, Minus, ArrowRight } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

interface PlateCalculatorModalProps {
  initialWeight?: number;
  weightUnit?: 'kg' | 'lbs';
  onClose: () => void;
  onApplyWeight?: (weight: number) => void;
}

interface PlateDef {
  weight: number;
  color: string;
  textColor: string;
  heightClass: string;
  name: string;
}

const KG_PLATES: PlateDef[] = [
  { weight: 25, color: 'bg-red-600 border-red-700 shadow-red-500/20', textColor: 'text-white', heightClass: 'h-24 w-6', name: '25kg' },
  { weight: 20, color: 'bg-blue-600 border-blue-700 shadow-blue-500/20', textColor: 'text-white', heightClass: 'h-22 w-5.5', name: '20kg' },
  { weight: 15, color: 'bg-yellow-500 border-yellow-600 shadow-yellow-500/20', textColor: 'text-slate-950', heightClass: 'h-20 w-5', name: '15kg' },
  { weight: 10, color: 'bg-emerald-600 border-emerald-700 shadow-emerald-500/20', textColor: 'text-white', heightClass: 'h-18 w-4.5', name: '10kg' },
  { weight: 5, color: 'bg-slate-200 border-slate-400 shadow-slate-300/20', textColor: 'text-slate-900', heightClass: 'h-14 w-4', name: '5kg' },
  { weight: 2.5, color: 'bg-slate-900 border-slate-950 shadow-slate-900/20', textColor: 'text-white', heightClass: 'h-12 w-3.5', name: '2.5kg' },
  { weight: 1.25, color: 'bg-slate-400 border-slate-500 shadow-slate-400/20', textColor: 'text-slate-950', heightClass: 'h-10 w-3', name: '1.25kg' },
];

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  initialWeight = 60,
  weightUnit = 'kg',
  onClose,
  onApplyWeight,
}) => {
  const { isHindi } = useLanguage();
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight > 0 ? initialWeight : 60);
  const [barWeight, setBarWeight] = useState<number>(20); // standard Olympic Bar

  // Calculate plates per side
  const calculatePlatesPerSide = (total: number, bar: number) => {
    let remainder = Math.max(0, (total - bar) / 2);
    const result: { plate: PlateDef; count: number }[] = [];

    KG_PLATES.forEach((plate) => {
      if (remainder >= plate.weight) {
        const count = Math.floor(remainder / plate.weight);
        result.push({ plate, count });
        remainder = Math.round((remainder - count * plate.weight) * 100) / 100;
      }
    });

    return {
      plates: result,
      unaccounted: remainder * 2,
    };
  };

  const { plates, unaccounted } = calculatePlatesPerSide(targetWeight, barWeight);

  const adjustWeight = (delta: number) => {
    playClickFeedback();
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 10) / 10));
  };

  const handleApply = () => {
    playClickFeedback();
    onApplyWeight?.(targetWeight);
    onClose();
  };

  // Flatten plates for graphic sleeve visualization
  const flattenedPlates: PlateDef[] = [];
  plates.forEach(({ plate, count }) => {
    for (let i = 0; i < count; i++) {
      flattenedPlates.push(plate);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isHindi ? 'ओलंपिक बार्बेल प्लेट कैलकुलेटर' : 'Olympic Barbell Plate Calculator'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hevy Gold Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHindi ? 'दोनों तरफ कौनसी प्लेट्स लगानी हैं, सटीक हिसाब' : 'Instant visual plate breakdown per side'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Target Weight Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {isHindi ? 'कुल वज़न (Total Load):' : 'Total Barbell Load:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="2.5"
                  min={barWeight}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Math.max(barWeight, parseFloat(e.target.value) || barWeight))}
                  className="w-28 text-2xl sm:text-3xl font-black font-mono px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-center"
                />
                <span className="text-lg font-bold text-slate-500 dark:text-slate-400">{weightUnit}</span>
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isHindi ? 'त्वरित वज़न बदलें:' : 'Quick Adjust:'}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[-10, -5, -2.5, +2.5, +5, +10].map((delta) => (
                  <button
                    key={delta}
                    onClick={() => adjustWeight(delta)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 font-mono font-bold text-xs border border-slate-200 dark:border-white/10 transition-colors shadow-2xs cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Barbell Selector */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isHindi ? 'बार्बेल का प्रकार:' : 'Barbell Type:'}
            </span>
            <div className="flex items-center gap-2">
              {[
                { weight: 20, label: 'Olympic 20kg' },
                { weight: 15, label: 'Women 15kg' },
                { weight: 10, label: 'EZ Bar 10kg' },
              ].map((b) => (
                <button
                  key={b.weight}
                  onClick={() => {
                    playClickFeedback();
                    setBarWeight(b.weight);
                    if (targetWeight < b.weight) setTargetWeight(b.weight);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    barWeight === b.weight
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Visual Barbell Sleeve */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-white overflow-hidden shadow-inner space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">BAR SLEEVE VISUALIZER (ONE SIDE)</span>
              <span className="font-mono text-emerald-400 font-bold">
                {Math.max(0, (targetWeight - barWeight) / 2)} {weightUnit} / Side
              </span>
            </div>

            {/* Graphic Barbell */}
            <div className="relative h-32 flex items-center justify-center bg-slate-950/80 rounded-xl px-4 border border-white/5 overflow-x-auto">
              {/* Shaft on left */}
              <div className="w-16 h-3.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-l shadow-xs shrink-0" />
              {/* Barbell Collar (thick stopper) */}
              <div className="w-4 h-16 bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 rounded-xs border-r border-slate-600 shadow-md shrink-0" />
              {/* Sleeve shaft running through */}
              <div className="relative flex items-center min-w-[200px] h-4 bg-gradient-to-b from-slate-400 to-slate-500 rounded-r shrink-0">
                {/* Plates stacked against collar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 pl-1">
                  {flattenedPlates.length === 0 ? (
                    <span className="text-[10px] text-slate-500 font-mono italic pl-2">
                      Empty Bar (No plates needed)
                    </span>
                  ) : (
                    flattenedPlates.map((p, idx) => (
                      <div
                        key={idx}
                        className={`${p.color} ${p.heightClass} ${p.textColor} border rounded-xs shadow-md flex items-center justify-center font-mono font-black text-[9px] select-none shrink-0 transition-transform hover:scale-105`}
                        title={`${p.name}`}
                      >
                        <span className="-rotate-90">{p.weight}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown List per Side */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{isHindi ? 'प्रत्येक साइड पर लगने वाली प्लेट्स:' : 'Plates Needed Each Side:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                {plates.reduce((acc, p) => acc + p.count, 0)} plates / side
              </span>
            </div>

            {plates.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-2 text-center">
                {isHindi ? 'सिर्फ खाली बार्बेल का उपयोग करें' : 'Just use the empty barbell.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {plates.map(({ plate, count }) => (
                  <div
                    key={plate.weight}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-6 rounded-xs ${plate.color} border shrink-0`} />
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {plate.weight} {weightUnit}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      × {count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {unaccounted > 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-1">
                * Note: {unaccounted} {weightUnit} cannot be divided with standard plates (nearest round load).
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>

          {onApplyWeight && (
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isHindi ? `सेट में ${targetWeight} kg लागू करें` : `Apply ${targetWeight} kg to Set`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
