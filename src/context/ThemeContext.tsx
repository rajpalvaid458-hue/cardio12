import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { auth, db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from '../lib/firebase';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'pulsefit_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // 1. Check local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // 2. Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const isDark = theme === 'dark';
  const lastSyncedUidRef = useRef<string | null>(null);

  // Apply DOM classes and meta tags
  const applyThemeToDOM = useCallback((currentTheme: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (currentTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
    }

    // Update mobile status bar theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', currentTheme === 'dark' ? '#0B1120' : '#0F172A');
  }, []);

  // Sync state changes to DOM and localStorage
  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage:', e);
    }
  }, [theme, applyThemeToDOM]);

  // Load persisted theme from Firestore when authenticated
  useEffect(() => {
    if (!currentUser || (currentUser as any).isLocal || !auth.currentUser) {
      lastSyncedUidRef.current = null;
      return;
    }

    if (lastSyncedUidRef.current === currentUser.uid) {
      return;
    }

    lastSyncedUidRef.current = currentUser.uid;

    const fetchUserTheme = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const cloudTheme: ThemeMode | undefined = data?.theme || data?.userProfile?.theme;
          if (cloudTheme === 'light' || cloudTheme === 'dark') {
            setThemeState(cloudTheme);
            applyThemeToDOM(cloudTheme);
            localStorage.setItem(THEME_STORAGE_KEY, cloudTheme);
          } else {
            // Document exists but no theme stored yet, persist current active theme to cloud
            await setDoc(
              userDocRef,
              {
                theme,
                userProfile: { theme },
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
      }
    };

    fetchUserTheme();
  }, [currentUser, theme, applyThemeToDOM]);

  // Persist theme choice to Firestore if logged in
  const persistThemeToFirestore = useCallback(
    async (newTheme: ThemeMode) => {
      if (!currentUser || (currentUser as any).isLocal || !auth.currentUser) {
        return;
      }
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(
          userDocRef,
          {
            theme: newTheme,
            userProfile: {
              theme: newTheme,
            },
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
      }
    },
    [currentUser]
  );

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      applyThemeToDOM(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (e) {
        console.warn('Failed to save theme in localStorage:', e);
      }
      persistThemeToFirestore(newTheme);
    },
    [applyThemeToDOM, persistThemeToFirestore]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
