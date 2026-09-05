import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isHindi } = useLanguage();

  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop standard install
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-sm shadow-emerald-600/30 transition active:scale-95"
        title={isHindi ? 'ऐप फोन में इंस्टॉल करें' : 'Install PulseFit App'}
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="hidden sm:inline">
          {isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}
        </span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition active:scale-95"
          title="Install on iPhone"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isHindi ? 'इंस्टॉल' : 'Install'}
          </span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold">
                    {isHindi ? 'iPhone / iPad पर इंस्टॉल करें' : 'Install on iPhone / iPad'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-white flex items-center gap-1">
                      {isHindi ? 'Safari में शेयर बटन दबाएं' : 'Tap Safari Share'}
                      <Share className="w-3 h-3 text-sky-400 inline" />
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isHindi ? 'ब्राउज़र के नीचे शेयर आइकॉन पर टैप करें।' : 'Tap the Share icon in the bottom Safari toolbar.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-white">
                      {isHindi ? '"Add to Home Screen" चुनें' : 'Select "Add to Home Screen"'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isHindi ? 'नीचे स्क्रॉल करके "Add to Home Screen" पर टैप करें।' : 'Scroll down the share sheet and tap Add to Home Screen.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-white">
                      {isHindi ? 'ऑफ़लाइन एक्सेस तैयार!' : 'Ready for 100% Offline Use!'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isHindi ? 'ऐप बिना इंटरनेट के भी सीधे होम स्क्रीन से खुलेगी।' : 'PulseFit will open in full-screen standalone mode even with zero internet.'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-600/30 transition"
              >
                {isHindi ? 'समझ गया' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
