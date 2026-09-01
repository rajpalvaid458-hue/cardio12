import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FitnessProvider } from './context/FitnessContext';
import { Header, TabType } from './components/Header';
import { TrainingView } from './components/TrainingView';
import { TimersView } from './components/TimersView';
import { DietView } from './components/DietView';
import { DailyRoutineView } from './components/DailyRoutineView';
import { AiCoachView } from './components/AiCoachView';
import { AnalyticsView } from './components/AnalyticsView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { PlanCreatorModal } from './components/PlanCreatorModal';
import { ExercisePickerModal } from './components/ExercisePickerModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { MedicalComplianceModal } from './components/MedicalComplianceModal';
import { RestTimerBanner } from './components/RestTimerBanner';
import { AuthModal } from './components/AuthModal';
import { Exercise } from './types';
import { ShieldAlert, Stethoscope, Award, Lock, FileText, CheckCircle2 } from 'lucide-react';

function FitnessAppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('training');

  // Modals state
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState(false);
  const [isPlanCreatorOpen, setIsPlanCreatorOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [complianceSection, setComplianceSection] = useState<'medical' | 'trainer' | 'privacy' | 'terms'>('medical');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);

  const handleOpenAiGenerator = () => {
    setActiveTab('coach');
  };

  const openCompliance = (section: 'medical' | 'trainer' | 'privacy' | 'terms') => {
    setComplianceSection(section);
    setIsComplianceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenActiveWorkoutModal={() => setIsActiveWorkoutOpen(true)}
        onOpenComplianceModal={() => openCompliance('medical')}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'training' && (
          <TrainingView
            onOpenPlanCreator={() => setIsPlanCreatorOpen(true)}
            onOpenAiGenerator={handleOpenAiGenerator}
            onSelectExerciseDetails={(ex) => setSelectedExerciseForDetail(ex)}
            onOpenActiveWorkout={() => setIsActiveWorkoutOpen(true)}
          />
        )}

        {activeTab === 'timers' && <TimersView />}

        {activeTab === 'diet' && <DietView />}

        {activeTab === 'routine' && <DailyRoutineView />}

        {activeTab === 'coach' && <AiCoachView />}

        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* App Compliance & Medical Disclaimer Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-slate-500 text-xs">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-slate-800">
              PULSE<span className="text-emerald-600">FIT</span> PRO
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evidence-Based Training & Nutrition Engine</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
            <button
              onClick={() => openCompliance('medical')}
              className="text-slate-600 hover:text-emerald-600 transition flex items-center gap-1"
            >
              <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
              <span>Medical Disclaimer</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => openCompliance('trainer')}
              className="text-slate-600 hover:text-emerald-600 transition flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Trainer Standards</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => openCompliance('privacy')}
              className="text-slate-600 hover:text-emerald-600 transition flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Privacy Policy</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => openCompliance('terms')}
              className="text-slate-600 hover:text-emerald-600 transition flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Terms of Use</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Persistent Floating Rest Timer HUD */}
      <RestTimerBanner />

      {/* Modals */}
      <AuthModal />

      <MedicalComplianceModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        defaultSection={complianceSection}
      />

      <ActiveWorkoutModal
        isOpen={isActiveWorkoutOpen}
        onClose={() => setIsActiveWorkoutOpen(false)}
        onOpenExercisePicker={() => setIsExercisePickerOpen(true)}
      />

      <PlanCreatorModal
        isOpen={isPlanCreatorOpen}
        onClose={() => setIsPlanCreatorOpen(false)}
      />

      <ExercisePickerModal
        isOpen={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
      />

      <ExerciseDetailModal
        exercise={selectedExerciseForDetail}
        onClose={() => setSelectedExerciseForDetail(null)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FitnessProvider>
        <FitnessAppContent />
      </FitnessProvider>
    </AuthProvider>
  );
}
