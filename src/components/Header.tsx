import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Flame,
  Dumbbell,
  Timer,
  UtensilsCrossed,
  CalendarCheck,
  Sparkles,
  BarChart3,
  Play,
  Settings,
  LogIn,
  ShieldCheck,
  UserCheck,
  Cloud,
  Loader2,
  Bell,
  Languages,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type TabType = 'training' | 'timers' | 'diet' | 'routine' | 'coach' | 'analytics';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenProfile: () => void;
  onOpenActiveWorkoutModal: () => void;
  onOpenComplianceModal: () => void;
  onOpenRemindersModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenActiveWorkoutModal,
  onOpenComplianceModal,
  onOpenRemindersModal,
}) => {
  const { activeWorkout, userProfile, isCloudSyncing, activeInAppAlerts } = useFitness();
  const { currentUser, openAuthModal } = useAuth();
  const { language, toggleLanguage, t, isHindi } = useLanguage();

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'training', label: t('nav_workouts'), icon: Dumbbell },
    { id: 'timers', label: t('nav_timers'), icon: Timer },
    { id: 'diet', label: t('nav_diet'), icon: UtensilsCrossed },
    { id: 'routine', label: t('nav_routine'), icon: CalendarCheck },
    { id: 'coach', label: t('nav_coach'), icon: Sparkles },
    { id: 'analytics', label: t('nav_progress'), icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white shadow-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('training')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  PULSE<span className="text-emerald-400">FIT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t('app_subtitle')}
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Workout Resume Badge */}
            {activeWorkout && (
              <button
                onClick={onOpenActiveWorkoutModal}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 transition-all animate-pulse shadow-sm"
                title="Active Workout in progress"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold font-mono">{formatElapsed(activeWorkout.elapsedSeconds)}</span>
                <span className="text-xs font-semibold hidden md:inline">Resume</span>
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </button>
            )}

            {/* Streak */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold"
              title={`${userProfile.streakDays} ${t('days')} ${t('nav_workouts')} Streak`}
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold font-mono">{userProfile.streakDays}{t('streak_suffix')}</span>
            </div>

            {/* Cloud Sync Status Indicator */}
            {currentUser && (
              <div
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs"
                title={isCloudSyncing ? t('syncing') : t('synced')}
              >
                {isCloudSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="text-[11px] font-medium hidden md:inline">
                  {isCloudSyncing ? t('syncing') : t('synced')}
                </span>
              </div>
            )}

            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {/* Language Switcher Button (English / हिंदी) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition-all shadow-xs group"
              title={isHindi ? "Switch to English" : "Switch to Hindi"}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <div className="flex items-center text-[11px] font-mono tracking-tight">
                <span className={!isHindi ? 'text-emerald-400 font-black' : 'text-slate-400'}>EN</span>
                <span className="text-slate-600 mx-0.5">/</span>
                <span className={isHindi ? 'text-emerald-400 font-black' : 'text-slate-400'}>हिं</span>
              </div>
            </button>

            {/* Auth Button */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition"
                title={`Signed in as ${currentUser.email}`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="max-w-[90px] truncate hidden sm:inline">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            )}

            {/* Medical & Trainer Compliance Badge */}
            <button
              onClick={onOpenComplianceModal}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-emerald-400 text-xs font-semibold transition"
              title="Doctor & Certified Trainer Verified Standards • Medical Disclaimer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] text-slate-200">{t('verified_health')}</span>
            </button>

            {/* Reminders & Notifications Bell */}
            <button
              onClick={onOpenRemindersModal}
              className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-sm"
              title={t('reminders_title')}
            >
              <Bell className="w-4 h-4" />
              {activeInAppAlerts.filter((a) => a.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                  {activeInAppAlerts.filter((a) => a.unread).length}
                </span>
              )}
            </button>

            {/* Profile / Settings */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-sm"
              title={t('profile_settings')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-800 bg-[#0F172A] overflow-x-auto no-scrollbar px-3 py-2 flex items-center gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={toggleLanguage}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700/80 transition-all shrink-0"
          title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
        >
          <Languages className="w-3 h-3" />
          <span>{isHindi ? 'English' : 'हिंदी'}</span>
        </button>
      </div>
    </header>
  );
};
