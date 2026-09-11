import React, { useState } from 'react';
import { WorkoutPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useFitness } from '../context/FitnessContext';
import { exportWorkoutPlanToPdf, generateWorkoutPlanShareText } from '../utils/pdfExport';
import {
  X,
  Download,
  Printer,
  Share2,
  Check,
  FileText,
  Sparkles,
  Dumbbell,
  Clock,
  CheckCircle2,
  Settings2,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkoutPlanPdfModalProps {
  plan: WorkoutPlan | null;
  onClose: () => void;
  onStartWorkout?: (plan: WorkoutPlan) => void;
}

export const WorkoutPlanPdfModal: React.FC<WorkoutPlanPdfModalProps> = ({
  plan,
  onClose,
  onStartWorkout,
}) => {
  const { isHindi } = useLanguage();
  const { userProfile } = useFitness();

  const [athleteName, setAthleteName] = useState<string>(userProfile?.name || 'PulseFit Athlete');
  const [includeWarmUp, setIncludeWarmUp] = useState<boolean>(true);
  const [includeRecovery, setIncludeRecovery] = useState<boolean>(true);
  const [includeCoachingTips, setIncludeCoachingTips] = useState<boolean>(true);
  const [coachNotes, setCoachNotes] = useState<string>('');
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!plan) return null;

  const dateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownloadPdf = () => {
    try {
      exportWorkoutPlanToPdf(plan, {
        athleteName: athleteName.trim() || 'PulseFit Athlete',
        includeWarmUp,
        includeRecovery,
        includeCoachingTips,
        notes: coachNotes,
      });

      confetti({
        particleCount: 70,
        spread: 55,
        origin: { y: 0.6 },
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  const handlePrint = () => {
    // Open print window with printable layout
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback if popup blocked: trigger direct PDF download
      handleDownloadPdf();
      return;
    }

    const rowsHtml = plan.exercises
      .map(
        (ex, idx) => `
      <tr>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: center;">${idx + 1}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${ex.name}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0;">${ex.targetMuscle || 'General'}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0;">${ex.equipment || 'Standard'}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${ex.sets?.length || 3} sets × ${ex.sets?.[0]?.reps || 10} reps</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${ex.restSec || 60}s</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #475569;">${ex.formTip || ex.formTips?.[0] || 'Maintain strict form'}</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${plan.title} - PulseFit Summary</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 16px; }
            }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 24px; font-size: 12px; }
            .header { background: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; border-top: 3px solid #10b981; margin-bottom: 18px; }
            .header h1 { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
            .header p { margin: 0; font-size: 11px; color: #a7f3d0; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
            .meta-item { font-size: 12px; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #0f172a; color: #ffffff; padding: 8px; text-align: left; font-size: 11px; }
            .protocols { display: flex; gap: 14px; margin-top: 14px; }
            .box { flex: 1; padding: 12px; border-radius: 6px; font-size: 11px; }
            .box-warmup { background: #f0fdf4; border: 1px solid #bbf7d0; color: #065f46; }
            .box-recovery { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
            .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PULSEFIT ATHLETE PROTOCOL</h1>
            <p>OFFICIAL WORKOUT ROUTINE & TRAINING SPECIFICATION</p>
          </div>
          <div class="meta">
            <div>
              <h2 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold;">${plan.title}</h2>
              <div class="meta-item">${plan.splitType} • ${plan.durationMinutes} Mins • ${plan.level || 'All Levels'}</div>
            </div>
            <div style="text-align: right;">
              <div class="meta-item"><strong>Date:</strong> ${dateFormatted}</div>
              <div class="meta-item"><strong>Athlete:</strong> ${athleteName}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">#</th>
                <th>Exercise</th>
                <th>Muscle</th>
                <th>Equipment</th>
                <th>Target Sets & Reps</th>
                <th style="text-align: center;">Rest</th>
                <th>Form Tip</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="protocols">
            <div class="box box-warmup">
              <strong>5-MIN DYNAMIC WARM-UP:</strong><br/>
              • 60s Light arm circles & shoulder dislocates<br/>
              • 60s Deep bodyweight squats & hip openers<br/>
              • 60s Torso rotations & core stability<br/>
              • 1-2 Warm-up ramp-up sets at 40-50%
            </div>
            <div class="box box-recovery">
              <strong>POST-WORKOUT RECOVERY:</strong><br/>
              • 5-min Static stretching of target muscles<br/>
              • 500-750ml water + electrolytes<br/>
              • 25-35g protein within 90 mins<br/>
              • Minimum 7-8 hours restorative sleep
            </div>
          </div>

          <div class="footer">
            PulseFit Athlete Protocols • Engineered for Hypertrophy & Health • pulsefit.app
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleShare = async () => {
    const shareText = generateWorkoutPlanShareText(plan, athleteName);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${plan.title} - PulseFit Routine`,
          text: shareText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShareText(true);
      setTimeout(() => setCopiedShareText(false), 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {isHindi ? 'वर्कआउट प्लान PDF एक्सपोर्ट' : 'Export Workout Plan (PDF)'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'अपने रूटीन को फॉर्मेटेड PDF में सेव करें या दोस्तों व कोच के साथ शेयर करें'
                  : 'Save your formatted routine as a printable PDF summary or share easily'}
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

        {/* Modal Body: Settings on left (or top), Live Document Preview on right */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-950/50">
          {/* Options & Settings Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Settings2 className="w-4 h-4 text-emerald-500" />
                <span>{isHindi ? 'कस्टमाइज़ेशन विकल्प' : 'Export Options'}</span>
              </div>

              {/* Athlete Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {isHindi ? 'एथलीट का नाम:' : 'Athlete / User Name:'}
                </label>
                <input
                  type="text"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  placeholder="e.g. Alex Carter"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {isHindi ? '5-मिनट वॉर्म-अप प्रोटोकॉल शामिल करें' : 'Include 5-Min Warm-Up Protocol'}
                  </span>
                  <input
                    type="checkbox"
                    checked={includeWarmUp}
                    onChange={(e) => setIncludeWarmUp(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {isHindi ? 'पोस्ट-वर्कआउट रिकवरी गाइड शामिल करें' : 'Include Post-Workout Recovery'}
                  </span>
                  <input
                    type="checkbox"
                    checked={includeRecovery}
                    onChange={(e) => setIncludeRecovery(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {isHindi ? 'कोचिंग व फॉर्म टिप्स जोड़ें' : 'Include Exercise Form Tips'}
                  </span>
                  <input
                    type="checkbox"
                    checked={includeCoachingTips}
                    onChange={(e) => setIncludeCoachingTips(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>

              {/* Coach Custom Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {isHindi ? 'कोच या व्यक्तिगत नोट्स (वैकल्पिक):' : 'Custom Coach Notes (Optional):'}
                </label>
                <textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  placeholder={
                    isHindi
                      ? 'उदा. "पहले 2 हफ़्ते वज़न स्थिर रखें और रेस्ट टाइमर 60 सेकंड पर रखें..."'
                      : 'e.g. "Focus on eccentric control for bench press. Drink at least 3L water today."'
                  }
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Quick Share / Copy Snippet */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {isHindi ? 'व्हाट्सएप / मैसेज पर शेयर करें' : 'Quick Routine Share'}
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                >
                  {copiedShareText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedShareText ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : isHindi ? 'शेयर / कॉपी' : 'Share / Copy'}</span>
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {isHindi
                  ? 'रूटीन का टेक्स्ट सारांश तुरंत कॉपी करके अपने जिम पार्टनर या ट्रेनर को भेजें।'
                  : 'Instantly share a clean text summary of this workout to WhatsApp or social media.'}
              </p>
            </div>
          </div>

          {/* Document Preview (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isHindi ? 'प्रिंट व PDF प्रीव्यू' : 'Printable Sheet Preview'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">A4 • High Resolution</span>
              </div>

              {/* Paper Preview Container */}
              <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-md border border-slate-300 font-sans text-xs space-y-4">
                {/* Header Strip */}
                <div className="bg-slate-950 text-white rounded-xl p-3.5 border-t-2 border-emerald-500 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black tracking-wider text-white">PULSEFIT ATHLETE PROTOCOL</div>
                    <div className="text-[10px] text-emerald-300">WORKOUT ROUTINE SUMMARY SPECIFICATION</div>
                  </div>
                  <div className="text-right text-[10px] text-slate-300">
                    <div>DATE: {dateFormatted.toUpperCase()}</div>
                    <div className="font-bold text-white">ATHLETE: {athleteName.toUpperCase()}</div>
                  </div>
                </div>

                {/* Plan Meta */}
                <div className="border-b border-slate-200 pb-2.5">
                  <div className="text-base font-black text-slate-900 tracking-tight">{plan.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-emerald-700">{plan.splitType}</span>
                    <span>•</span>
                    <span>{plan.durationMinutes} Mins</span>
                    <span>•</span>
                    <span>{plan.exercises.length} Exercises</span>
                    <span>•</span>
                    <span className="uppercase">{plan.level || 'All Levels'}</span>
                  </div>
                </div>

                {/* Exercises Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[10px]">
                        <th className="p-1.5 text-center w-6">#</th>
                        <th className="p-1.5">Exercise</th>
                        <th className="p-1.5">Target</th>
                        <th className="p-1.5">Sets × Reps</th>
                        <th className="p-1.5 text-center">Rest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {plan.exercises.slice(0, 7).map((ex, i) => (
                        <tr key={ex.id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-1.5 text-center font-bold text-slate-500">{i + 1}</td>
                          <td className="p-1.5 font-bold text-slate-800">{ex.name}</td>
                          <td className="p-1.5 text-slate-600">{ex.targetMuscle}</td>
                          <td className="p-1.5 font-semibold text-emerald-700">
                            {ex.sets?.length || 3} sets × {ex.sets?.[0]?.reps || 10} reps
                          </td>
                          <td className="p-1.5 text-center font-mono text-slate-500">{ex.restSec || 60}s</td>
                        </tr>
                      ))}
                      {plan.exercises.length > 7 && (
                        <tr>
                          <td colSpan={5} className="p-1.5 text-center text-[10px] text-slate-400 bg-slate-50 italic">
                            + {plan.exercises.length - 7} more exercises included in full exported PDF
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Warmup & Recovery mini boxes */}
                {(includeWarmUp || includeRecovery) && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    {includeWarmUp && (
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <span className="font-bold block">5-MIN WARM-UP:</span>
                        Arm circles, deep squats, core twists & 1-2 warmup sets.
                      </div>
                    )}
                    {includeRecovery && (
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                        <span className="font-bold block">RECOVERY PROTOCOL:</span>
                        Static stretching, 500ml water + electrolytes, 30g protein.
                      </div>
                    )}
                  </div>
                )}

                {/* Footer preview */}
                <div className="border-t border-slate-200 pt-2 text-[9px] text-slate-400 flex items-center justify-between">
                  <span>PulseFit Athlete Protocol • pulsefit.app</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {downloadSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isHindi ? 'PDF सफलतापूर्वक डाउनलोड हो गया!' : 'PDF Downloaded Successfully!'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHindi ? 'प्रिंट करें' : 'Print / Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isHindi ? 'PDF डाउनलोड करें (.pdf)' : 'Download PDF (.pdf)'}</span>
            </button>

            {onStartWorkout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartWorkout(plan);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{isHindi ? 'वर्कआउट शुरू करें' : 'Start Workout'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
