import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'card';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const { isHindi } = useLanguage();

  if (variant === 'segmented') {
    return (
      <div
        className={`flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700/80 ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
            !isDark
              ? 'bg-white text-amber-600 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title={isHindi ? 'लाइट मोड (दिन के समय के लिए उत्तम)' : 'Light Mode (Best for bright environments)'}
        >
          <Sun className={`w-4 h-4 ${!isDark ? 'text-amber-500 fill-amber-400/30' : ''}`} />
          <span>{isHindi ? 'लाइट मोड' : 'Light Mode'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
            isDark
              ? 'bg-slate-900 text-sky-400 shadow-sm border border-slate-700/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title={isHindi ? 'डार्क मोड (आंखों के लिए आरामदायक)' : 'Dark Mode (Comfortable for eyes & low light)'}
        >
          <Moon className={`w-4 h-4 ${isDark ? 'text-sky-400 fill-sky-400/30' : ''}`} />
          <span>{isHindi ? 'डार्क मोड' : 'Dark Mode'}</span>
        </button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
            }`}>
              {isDark ? <Moon className="w-5 h-5 fill-sky-400/20" /> : <Sun className="w-5 h-5 fill-amber-500/20" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {isHindi ? 'ग्लोबल थीम (दिखावट)' : 'Global Theme Appearance'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isDark
                  ? (isHindi ? 'डार्क मोड सक्रिय (क्लाउड सेटिंग्स में सहेजा गया)' : 'Dark mode active (saved in cloud settings)')
                  : (isHindi ? 'लाइट मोड सक्रिय (क्लाउड सेटिंग्स में सहेजा गया)' : 'Light mode active (saved in cloud settings)')}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition-all shadow-xs"
          >
            {isHindi ? 'बदलें' : 'Toggle'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
              !isDark
                ? 'bg-white border-amber-500/60 text-amber-700 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <Sun className={`w-4 h-4 ${!isDark ? 'text-amber-500' : ''}`} />
            <span>{isHindi ? 'लाइट (उजाला)' : 'Light'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
              isDark
                ? 'bg-slate-900 border-sky-500/60 text-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                : 'bg-white/80 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className={`w-4 h-4 ${isDark ? 'text-sky-400' : ''}`} />
            <span>{isHindi ? 'डार्क (रात/आँखों के लिए)' : 'Dark'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Compact variant (default for Header toolbar)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 shadow-xs group ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 hover:border-sky-500/40'
          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/40'
      } ${className}`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={
        isDark
          ? (isHindi ? 'लाइट मोड चालू करें (दिन)' : 'Switch to Light Mode')
          : (isHindi ? 'डार्क मोड चालू करें (रात)' : 'Switch to Dark Mode')
      }
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-sky-400 fill-sky-400/20 group-hover:scale-110 transition-transform duration-200" />
      ) : (
        <Sun className="w-4 h-4 text-amber-300 fill-amber-300/20 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-200" />
      )}
    </button>
  );
};
