import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, HardDriveDownload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { isHindi } = useLanguage();

  if (isOnline) return null;

  return (
    <aside aria-label="Offline status" className="fixed bottom-5 left-4 sm:left-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/95 border border-amber-500/40 px-3.5 py-2.5 text-xs font-semibold text-white shadow-2xl shadow-black/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
      <div className="relative flex items-center justify-center">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
          <span>{isHindi ? 'ऑफ़लाइन मोड सक्रिय' : 'Offline Mode Active'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {isHindi ? 'लोकल कैश' : 'Cached'}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-normal">
          {isHindi
            ? 'वर्कआउट प्लान, टाइमर व डेटा सुरक्षित हैं।'
            : 'Workout plans, timers & logs saved locally.'}
        </p>
      </div>
    </aside>
  );
};
