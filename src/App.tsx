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
import { RestTimerBanner } from './components/RestTimerBanner';
import { AuthModal } from './components/AuthModal';
import { Exercise } from './types';

function FitnessAppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('training');

  // Modals state
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState(false);
  const [isPlanCreatorOpen, setIsPlanCreatorOpen] = useState(false);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);

  const handleOpenAiGenerator = () => {
    setActiveTab('coach');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenActiveWorkoutModal={() => setIsActiveWorkoutOpen(true)}
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

      {/* Persistent Floating Rest Timer HUD */}
      <RestTimerBanner />

      {/* Modals */}
      <AuthModal />

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
