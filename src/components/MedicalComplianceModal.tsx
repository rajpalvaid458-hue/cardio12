import React, { useState } from 'react';
import {
  ShieldAlert,
  Stethoscope,
  Award,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Scale,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MedicalComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: 'medical' | 'trainer' | 'privacy' | 'terms';
}

export const MedicalComplianceModal: React.FC<MedicalComplianceModalProps> = ({
  isOpen,
  onClose,
  defaultSection = 'medical',
}) => {
  const [activeTab, setActiveTab] = useState<'medical' | 'trainer' | 'privacy' | 'terms'>(defaultSection);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] flex flex-col justify-between"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Medical Disclaimer, Safety & Privacy Policy
              </h2>
              <p className="text-xs text-slate-500">
                Google Play Store & Apple Health App Compliance & Scientific Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 overflow-x-auto">
          {[
            { id: 'medical', label: 'Medical Disclaimer', icon: Stethoscope },
            { id: 'trainer', label: 'Trainer Standards', icon: Award },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms of Use', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body (Scrollable) */}
        <div className="overflow-y-auto pr-1 space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed flex-1">
          {/* TAB 1: MEDICAL DISCLAIMER */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block text-sm">Mandatory Physician Consultation Notice</span>
                  <p>
                    PulseFit provides athletic fitness tracking, workout logs, and general nutritional calculation tools. 
                    The application does <strong>NOT</strong> provide medical diagnoses, treatment prescriptions, or clinical medical advice.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  1. Scope of Application & Health Advisory
                </h4>
                <p className="text-slate-600">
                  Before starting any new exercise routine, weightlifting protocol, extreme calorie deficit, or high-intensity interval program presented in PulseFit, you must consult with a licensed doctor or qualified healthcare professional, particularly if you have:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Cardiovascular conditions, high blood pressure, or chest pain during exertion.</li>
                  <li>History of joint, bone, spinal, or muscular injuries.</li>
                  <li>Metabolic conditions (e.g., Diabetes, Thyroid disorders) or kidney complications.</li>
                  <li>Pregnancy or post-partum recovery phases.</li>
                  <li>Any prescription medication that affects heart rate or blood circulation.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  2. Immediate Stoppage Warning
                </h4>
                <p className="text-slate-600">
                  If at any point during a workout session you experience dizziness, lightheadedness, sharp joint pain, shortness of breath, or nausea, stop exercising immediately and seek emergency medical assistance.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                <strong>Legal Protection Standard:</strong> Adheres to Google Play Health & Fitness Developer Policy & FDA Mobile Medical Applications Guidance (MMA).
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFIED TRAINER & SCIENTIFIC STANDARDS */}
          {activeTab === 'trainer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block text-sm">Evidence-Based Sports Science Methodology</span>
                  <p>
                    All default training splits (Push Pull Legs, Upper Lower, Full Body) and nutritional equations (Mifflin-St Jeor BMR, Macronutrient Distribution Ranges) in PulseFit are structured according to accredited exercise science frameworks.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Accredited Guidelines Benchmark:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ACSM & NSCA Principles
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Progressive overload pacing, warm-up sets, and 48-72 hour muscle recovery intervals.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ISSN Sports Nutrition
                    </div>
                    <p className="text-[11px] text-slate-500">
                      1.6g – 2.2g/kg protein targets for muscle hypertrophy, lean mass preservation, and electrolyte hydration.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Indian ICMR-NIN Data
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Accurate calorie & macro values for authentic Desi foods (Paneer, Sattu, Dals, Roti, Chana, Soya).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Form & Joint Safety Cues
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Detailed step-by-step biomechanical cues for compound lifts (Squat, Deadlift, Bench Press).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block text-sm">Data Privacy & Zero Health-Data Sale Guarantee</span>
                  <p className="text-slate-300">
                    PulseFit respects your digital sovereignty. Your workout logs, body metrics, and meal data are never sold, rented, or monetized to third-party ad networks.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">1. Data Collected</h4>
                <p className="text-slate-600">
                  We collect only the information necessary to provide workout tracking and nutritional analytics:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Profile Metrics:</strong> Weight, target weight, height, and fitness goals.</li>
                  <li><strong>Training Data:</strong> Logged sets, reps, weights, and workout duration.</li>
                  <li><strong>Account Identifiers:</strong> Email address for Firebase cloud sync authentication.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">2. Cloud Storage & Encryption</h4>
                <p className="text-slate-600">
                  Cloud synchronization uses Google Cloud Firestore with enterprise AES-256 encryption at rest and TLS 1.3 in transit. You retain full right to delete your data at any time from the app settings.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                Compliant with Google Play Data Safety Section, GDPR, and Indian DPDP (Digital Personal Data Protection) Act 2023.
              </div>
            </div>
          )}

          {/* TAB 4: TERMS OF USE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">1. Assumption of Risk & User Responsibility</h4>
                <p className="text-slate-600">
                  By using PulseFit, you acknowledge that physical training, weightlifting, and dietary modifications carry inherent risks of bodily injury. You voluntarily assume full responsibility for your health, safety, and exercise execution.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">2. Intellectual Property & Code Ownership</h4>
                <p className="text-slate-600">
                  PulseFit and its custom user interface, workout templates, and software algorithms are proprietary. You are granted a personal, non-exclusive, non-transferable license to use the app for fitness training.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">3. Updates & Policy Changes</h4>
                <p className="text-slate-600">
                  PulseFit may periodically update exercises, algorithms, and safety recommendations to match evolving sports science research.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Certified Compliance v2.4 • Ready for App Store</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
};
