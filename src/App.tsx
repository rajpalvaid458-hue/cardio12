import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FitnessProvider } from './context/FitnessContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
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
import { AthleteProfilesModal } from './components/AthleteProfilesModal';
import { MedicalComplianceModal } from './components/MedicalComplianceModal';
import { RemindersModal } from './components/reminders/RemindersModal';
import { AthleteTopBar } from './components/AthleteTopBar';
import { RestTimerBanner } from './components/RestTimerBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AuthModal } from './components/AuthModal';
import { Exercise } from './types';
import { ShieldAlert, Stethoscope, Award, Lock, FileText, CheckCircle2, Dumbbell, Loader2 } from 'lucide-react';

function FitnessAppContent() {
  const { currentUser, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('training');

  // Modals state
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState(false);
  const [isPlanCreatorOpen, setIsPlanCreatorOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAthleteProfilesModalOpen, setIsAthleteProfilesModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
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
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased transition-colors duration-300">
      {/* Ultra-Luxury Ambient Lighting Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-center emerald aura */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl opacity-70 dark:opacity-40" />
        {/* Top-right subtle amber champagne glow */}
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl opacity-50 dark:opacity-30" />
        {/* Bottom-left deep indigo/teal reflection */}
        <div className="absolute bottom-10 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-transparent blur-3xl opacity-40 dark:opacity-20" />
      </div>

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenActiveWorkoutModal={() => setIsActiveWorkoutOpen(true)}
        onOpenComplianceModal={() => openCompliance('medical')}
        onOpenRemindersModal={() => setIsRemindersModalOpen(true)}
        onOpenAthleteProfilesModal={() => setIsAthleteProfilesModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Executive Athlete Command Header */}
        <AthleteTopBar
          onOpenAiGenerator={handleOpenAiGenerator}
          onOpenPlanCreator={() => setIsPlanCreatorOpen(true)}
          onOpenActiveWorkout={() => setIsActiveWorkoutOpen(true)}
          onOpenAthleteProfiles={() => setIsAthleteProfilesModalOpen(true)}
        />
        {activeTab === 'training' && (
          <TrainingView
            onOpenPlanCreator={() => setIsPlanCreatorOpen(true)}
            onOpenAiGenerator={handleOpenAiGenerator}
            onSelectExerciseDetails={(ex) => setSelectedExerciseForDetail(ex)}
            onOpenActiveWorkout={() => setIsActiveWorkoutOpen(true)}
          />
        )}

        {activeTab === 'timers' && <TimersView />}

        {activeTab === 'diet' && (
          <DietView onOpenRemindersModal={() => setIsRemindersModalOpen(true)} />
        )}

        {activeTab === 'routine' && (
          <DailyRoutineView onOpenRemindersModal={() => setIsRemindersModalOpen(true)} />
        )}

        {activeTab === 'coach' && <AiCoachView />}

        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* App Compliance & Medical Disclaimer Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070B14]/80 backdrop-blur-xl py-6 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-tight text-slate-800 dark:text-slate-100">
              PULSE<span className="text-emerald-500">FIT</span> PRO
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('evidence_based_engine')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold">
            <button
              onClick={() => openCompliance('medical')}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('medical_disclaimer')}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => openCompliance('trainer')}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('trainer_standards')}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => openCompliance('privacy')}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('privacy_policy')}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => openCompliance('terms')}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('terms_of_use')}</span>
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
        onSelectExerciseDetails={(ex) => setSelectedExerciseForDetail(ex)}
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
        onOpenAthleteProfiles={() => setIsAthleteProfilesModalOpen(true)}
      />

      <AthleteProfilesModal
        isOpen={isAthleteProfilesModalOpen}
        onClose={() => setIsAthleteProfilesModalOpen(false)}
      />

      <RemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Connectivity & Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <FitnessProvider>
            <FitnessAppContent />
          </FitnessProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
