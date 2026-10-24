import { create } from 'zustand';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from '../config/firebase';
import type { UserProfile, UserPlan } from '../types';
import { useToastStore } from './useToastStore';

// Session duration: 30 minutes
export const SESSION_DURATION_MS = 30 * 60 * 1000;

export const AUTH_STORAGE_KEYS = {
  USER: 'dropcode-auth-user',
  TOKEN: 'dropcode-auth-token',
  EXPIRES_AT: 'dropcode-auth-expires-at',
  PLAN: 'dropcode-plan',
} as const;

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  plan: UserPlan;
  sessionExpiresAt: number | null;
  setPlan: (plan: UserPlan) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: (isExpired?: boolean) => Promise<void>;
  initAuthListener: () => () => void;
}

let autoLogoutTimer: any = null;

const getStoredPlan = (): UserPlan => {
  if (typeof window === 'undefined') return 'free';
  const p = localStorage.getItem(AUTH_STORAGE_KEYS.PLAN);
  if (p === 'pro_49' || p === 'ultimate_79') return p;
  return 'free';
};

const getStoredSession = (): { user: UserProfile | null; token: string | null; expiresAt: number | null } => {
  if (typeof window === 'undefined') return { user: null, token: null, expiresAt: null };
  try {
    const expiresStr = localStorage.getItem(AUTH_STORAGE_KEYS.EXPIRES_AT);
    if (!expiresStr) return { user: null, token: null, expiresAt: null };
    const expiresAt = Number(expiresStr);
    if (isNaN(expiresAt) || Date.now() >= expiresAt) {
      clearStoredSession();
      return { user: null, token: null, expiresAt: null };
    }
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    if (userStr) {
      const user = JSON.parse(userStr) as UserProfile;
      return { user, token, expiresAt };
    }
  } catch {
    clearStoredSession();
  }
  return { user: null, token: null, expiresAt: null };
};

const saveSession = (user: UserProfile, token: string, expiresAt: number) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
  }
};

const clearStoredSession = () => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.EXPIRES_AT);
  } catch {}
};

const scheduleAutoLogout = (expiresAt: number, onExpire: () => void) => {
  if (autoLogoutTimer) {
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;
  }
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) {
    onExpire();
    return;
  }
  autoLogoutTimer = setTimeout(() => {
    onExpire();
  }, remaining);
};

// Initial session recovery
const initialSession = getStoredSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialSession.user,
  isLoading: initialSession.user ? false : true,
  plan: getStoredPlan(),
  sessionExpiresAt: initialSession.expiresAt,

  setPlan: (plan: UserPlan) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.PLAN, plan);
    set((state) => ({
      plan,
      user: state.user ? { ...state.user, plan } : null,
    }));
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const plan = get().plan;
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'user@dropcode.local',
        displayName: firebaseUser.displayName || 'DropCode User',
        photoURL: firebaseUser.photoURL || undefined,
        plan,
      };

      const token = await firebaseUser.getIdToken().catch(() => `demo_token_${firebaseUser.uid}`);
      const expiresAt = Date.now() + SESSION_DURATION_MS;

      saveSession(userProfile, token, expiresAt);
      scheduleAutoLogout(expiresAt, () => {
        get().signOut(true);
      });

      set({ user: userProfile, sessionExpiresAt: expiresAt, isLoading: false });
    } catch (err: any) {
      // If Firebase fails due to placeholder keys, provide a clean demo user session
      if (
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/operation-not-allowed' ||
        err.code === 'auth/unauthorized-domain'
      ) {
        const demoUser: UserProfile = {
          uid: 'demo_user_google_123',
          email: 'apple.user@icloud.com',
          displayName: 'Alex Rivers',
          plan: get().plan,
        };
        const token = `dev_token_demo_user_google_123:${btoa('apple.user@icloud.com')}:${btoa('Alex Rivers')}`;
        const expiresAt = Date.now() + SESSION_DURATION_MS;

        saveSession(demoUser, token, expiresAt);
        scheduleAutoLogout(expiresAt, () => {
          get().signOut(true);
        });

        set({ user: demoUser, sessionExpiresAt: expiresAt, isLoading: false });
        return;
      }
      throw err;
    }
  },

  signInWithEmail: async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = result.user;
      const plan = get().plan;
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || email.split('@')[0],
        plan,
      };

      const token = await firebaseUser.getIdToken().catch(() => `demo_token_${firebaseUser.uid}`);
      const expiresAt = Date.now() + SESSION_DURATION_MS;

      saveSession(userProfile, token, expiresAt);
      scheduleAutoLogout(expiresAt, () => {
        get().signOut(true);
      });

      set({ user: userProfile, sessionExpiresAt: expiresAt, isLoading: false });
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/operation-not-allowed'
      ) {
        const uid = `uid_${Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`;
        const name = email.split('@')[0];
        const demoUser: UserProfile = {
          uid,
          email,
          displayName: name,
          plan: get().plan,
        };
        const token = `dev_token_${uid}:${btoa(email)}:${btoa(name)}`;
        const expiresAt = Date.now() + SESSION_DURATION_MS;

        saveSession(demoUser, token, expiresAt);
        scheduleAutoLogout(expiresAt, () => {
          get().signOut(true);
        });

        set({ user: demoUser, sessionExpiresAt: expiresAt, isLoading: false });
        return;
      }
      throw err;
    }
  },

  signUpWithEmail: async (email: string, pass: string, name?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = result.user;
      const plan = get().plan;
      const displayName = name || email.split('@')[0];
      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName,
        plan,
      };

      const token = await firebaseUser.getIdToken().catch(() => `demo_token_${firebaseUser.uid}`);
      const expiresAt = Date.now() + SESSION_DURATION_MS;

      saveSession(userProfile, token, expiresAt);
      scheduleAutoLogout(expiresAt, () => {
        get().signOut(true);
      });

      set({ user: userProfile, sessionExpiresAt: expiresAt, isLoading: false });
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-api-key' ||
        err.code === 'auth/api-key-not-valid' ||
        err.code === 'auth/operation-not-allowed'
      ) {
        const uid = `uid_${Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`;
        const displayName = name || email.split('@')[0];
        const demoUser: UserProfile = {
          uid,
          email,
          displayName,
          plan: get().plan,
        };
        const token = `dev_token_${uid}:${btoa(email)}:${btoa(displayName)}`;
        const expiresAt = Date.now() + SESSION_DURATION_MS;

        saveSession(demoUser, token, expiresAt);
        scheduleAutoLogout(expiresAt, () => {
          get().signOut(true);
        });

        set({ user: demoUser, sessionExpiresAt: expiresAt, isLoading: false });
        return;
      }
      throw err;
    }
  },

  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        return; // Simulated success
      }
      throw err;
    }
  },

  signOut: async (isExpired = false) => {
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
      autoLogoutTimer = null;
    }
    clearStoredSession();
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    set({ user: null, sessionExpiresAt: null, isLoading: false });
    if (isExpired) {
      useToastStore.getState().showToast('Your 30-minute login session has expired. Please sign in again.', 'info');
    }
  },

  initAuthListener: () => {
    // Schedule timeout for existing stored session if valid
    const current = getStoredSession();
    if (current.user && current.expiresAt) {
      scheduleAutoLogout(current.expiresAt, () => {
        get().signOut(true);
      });
      set({ user: current.user, sessionExpiresAt: current.expiresAt, isLoading: false });
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const session = getStoredSession();
        if (session.user && session.expiresAt && Date.now() < session.expiresAt) {
          try {
            const token = await firebaseUser.getIdToken();
            localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
          } catch {}
          set({ isLoading: false });
          return;
        }

        // Fresh login: start 30-minute session
        const plan = get().plan;
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'user@dropcode.local',
          displayName: firebaseUser.displayName || 'DropCode User',
          photoURL: firebaseUser.photoURL || undefined,
          plan,
        };

        try {
          const token = await firebaseUser.getIdToken();
          const expiresAt = Date.now() + SESSION_DURATION_MS;
          saveSession(userProfile, token, expiresAt);
          scheduleAutoLogout(expiresAt, () => {
            get().signOut(true);
          });
          set({ user: userProfile, sessionExpiresAt: expiresAt, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      } else {
        // Firebase returned null user. Check if valid unexpired session in localStorage
        const session = getStoredSession();
        if (session.user && session.expiresAt && Date.now() < session.expiresAt) {
          set({ user: session.user, sessionExpiresAt: session.expiresAt, isLoading: false });
        } else {
          set({ user: null, sessionExpiresAt: null, isLoading: false });
        }
      }
    });

    return unsubscribe;
  },
}));
