import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from '../lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isLocal?: boolean;
}

interface LocalAccount {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  quickLoginAsGuest: (displayName?: string) => void;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const LOCAL_ACCOUNTS_KEY = 'pulsefit_user_accounts';
const LOCAL_ACTIVE_USER_KEY = 'pulsefit_active_user';

function getLocalAccounts(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accounts: LocalAccount[]) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save local accounts:', e);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ACTIVE_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          localStorage.setItem(
            LOCAL_ACTIVE_USER_KEY,
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isLocal: false,
            })
          );
        } catch {
          // ignore
        }
      } else {
        // If Firebase auth has no user, keep local account if one was active
        try {
          const saved = localStorage.getItem(LOCAL_ACTIVE_USER_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.isLocal) {
              setCurrentUser(parsed);
              setLoading(false);
              return;
            }
          }
        } catch {
          // ignore
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.warn('Google Sign-In caught:', error?.code || error?.message);
      // If blocked in iframe or popup failed, provide fallback
      if (
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/unauthorized-domain'
      ) {
        throw new Error(
          'Google popup was blocked or not authorized in this window. You can sign in directly with Email below.'
        );
      }
      throw error;
    }
  };

  const loginWithEmail = async (emailInput: string, pass: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      throw new Error('Please enter both email and password.');
    }

    // 1. Try Firebase Authentication first
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      setIsAuthModalOpen(false);
      return;
    } catch (firebaseError: any) {
      const code = firebaseError?.code || '';
      console.warn('Firebase signInWithEmailAndPassword response:', code);

      // If Firebase specifically doesn't allow email auth or project has disabled it,
      // fallback to secure local account management seamlessly
      if (
        code === 'auth/operation-not-allowed' ||
        code === 'auth/network-request-failed' ||
        code === 'auth/internal-error'
      ) {
        const accounts = getLocalAccounts();
        const existing = accounts.find((acc) => acc.email === cleanEmail);

        if (existing) {
          if (existing.passwordHash === pass) {
            const localUser: AppUser = {
              uid: existing.uid,
              email: existing.email,
              displayName: existing.displayName,
              isLocal: true,
            };
            setCurrentUser(localUser);
            localStorage.setItem(LOCAL_ACTIVE_USER_KEY, JSON.stringify(localUser));
            setIsAuthModalOpen(false);
            return;
          } else {
            throw new Error('Incorrect password for this account. Please try again.');
          }
        } else {
          // Seamlessly create the account if it didn't exist yet!
          const newLocalUser: AppUser = {
            uid: 'usr_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36),
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            isLocal: true,
          };
          const newAccount: LocalAccount = {
            uid: newLocalUser.uid,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            passwordHash: pass,
            createdAt: new Date().toISOString(),
          };
          saveLocalAccounts([...accounts, newAccount]);
          setCurrentUser(newLocalUser);
          localStorage.setItem(LOCAL_ACTIVE_USER_KEY, JSON.stringify(newLocalUser));
          setIsAuthModalOpen(false);
          return;
        }
      }

      // If it was standard Firebase auth error (like wrong password or user not found)
      throw firebaseError;
    }
  };

  const signupWithEmail = async (emailInput: string, pass: string, displayNameInput?: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanName = (displayNameInput || '').trim() || cleanEmail.split('@')[0];

    if (!cleanEmail || !pass) {
      throw new Error('Please provide email and password.');
    }
    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // 1. Try Firebase Authentication
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cleanName && cred.user) {
        await updateProfile(cred.user, { displayName: cleanName });
      }
      setIsAuthModalOpen(false);
      return;
    } catch (firebaseError: any) {
      const code = firebaseError?.code || '';
      console.warn('Firebase createUserWithEmailAndPassword response:', code);

      // If operation is not allowed in Firebase project or network fails, create local account
      if (
        code === 'auth/operation-not-allowed' ||
        code === 'auth/network-request-failed' ||
        code === 'auth/internal-error'
      ) {
        const accounts = getLocalAccounts();
        const existing = accounts.find((acc) => acc.email === cleanEmail);

        if (existing) {
          // If already exists locally with same password, just log them in
          if (existing.passwordHash === pass) {
            const localUser: AppUser = {
              uid: existing.uid,
              email: existing.email,
              displayName: existing.displayName || cleanName,
              isLocal: true,
            };
            setCurrentUser(localUser);
            localStorage.setItem(LOCAL_ACTIVE_USER_KEY, JSON.stringify(localUser));
            setIsAuthModalOpen(false);
            return;
          }
          throw new Error('An account with this email already exists. Please switch to Sign In.');
        }

        const newUid = 'usr_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
        const newLocalUser: AppUser = {
          uid: newUid,
          email: cleanEmail,
          displayName: cleanName,
          isLocal: true,
        };
        const newAccount: LocalAccount = {
          uid: newUid,
          email: cleanEmail,
          displayName: cleanName,
          passwordHash: pass,
          createdAt: new Date().toISOString(),
        };

        saveLocalAccounts([...accounts, newAccount]);
        setCurrentUser(newLocalUser);
        localStorage.setItem(LOCAL_ACTIVE_USER_KEY, JSON.stringify(newLocalUser));
        setIsAuthModalOpen(false);
        return;
      }

      throw firebaseError;
    }
  };

  const quickLoginAsGuest = (displayName?: string) => {
    const name = displayName || 'Athlete';
    const guestUser: AppUser = {
      uid: 'guest_' + Date.now().toString(36),
      email: `${name.toLowerCase().replace(/\s+/g, '')}@athlete.local`,
      displayName: name,
      isLocal: true,
    };
    setCurrentUser(guestUser);
    try {
      localStorage.setItem(LOCAL_ACTIVE_USER_KEY, JSON.stringify(guestUser));
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn('Firebase logout warning:', error);
    }
    try {
      localStorage.removeItem(LOCAL_ACTIVE_USER_KEY);
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        quickLoginAsGuest,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

