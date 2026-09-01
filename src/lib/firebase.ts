import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';

// Helper to read environment variables safely regardless of module resolution target
const getEnv = (key: string): string | undefined => {
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch {
    // fallback if import.meta is restricted
  }
  return undefined;
};

// Default configuration with fallbacks for development/testing
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || 'AIzaSyDemoKeyForConferenceAlertsHub2026',
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || 'conference-alerts-2026.firebaseapp.com',
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || 'conference-alerts-2026',
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || 'conference-alerts-2026.appspot.com',
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || '1029384756',
  appId: getEnv('VITE_FIREBASE_APP_ID') || '1:1029384756:web:abcdef123456789',
};

// Initialize Firebase App singleton
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Check if current config is using real keys
export const isFirebaseConfigured = (): boolean => {
  const key = getEnv('VITE_FIREBASE_API_KEY');
  return !!key && key !== 'AIzaSyDemoKeyForConferenceAlertsHub2026' && key.startsWith('AIzaSy');
};

// --- Firebase Authentication Helpers ---

/**
 * 1-Click Sign-In with Google Popup
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  if (isFirebaseConfigured()) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      console.error('Firebase Google Auth Error:', error);
      if (error?.code === 'auth/unauthorized-domain') {
        throw new Error(
          `Unauthorized Domain: Please add your domain (${window.location.hostname}) in Firebase Console -> Authentication -> Settings -> Authorized Domains.`
        );
      } else if (error?.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Google Sign-in not enabled: Please enable Google provider in Firebase Console -> Authentication -> Sign-in method.'
        );
      } else if (error?.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-in popup was closed before completing.');
      }
      throw error;
    }
  }

  // Demo fallback only when VITE_FIREBASE_API_KEY is not configured
  return {
    uid: 'demo-google-user-777',
    displayName: 'Dr. Alex Rivera (Google Auth)',
    email: 'alex.rivera@stanford.edu',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    emailVerified: true,
  } as unknown as FirebaseUser;
};

/**
 * Sign In with Email & Password
 */
export const loginWithEmail = async (email: string, pass: string): Promise<FirebaseUser> => {
  if (isFirebaseConfigured()) {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  }

  return {
    uid: 'demo-email-user-888',
    displayName: email.split('@')[0].replace('.', ' ').toUpperCase(),
    email: email,
    photoURL: '',
    emailVerified: true,
  } as unknown as FirebaseUser;
};

/**
 * Register with Email & Password
 */
export const registerWithEmail = async (name: string, email: string, pass: string): Promise<FirebaseUser> => {
  if (isFirebaseConfigured()) {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await firebaseUpdateProfile(result.user, { displayName: name });
    }
    return result.user;
  }

  return {
    uid: 'demo-registered-user-999',
    displayName: name,
    email: email,
    photoURL: '',
    emailVerified: true,
  } as unknown as FirebaseUser;
};

/**
 * Sign Out from Firebase
 */
export const logoutFromFirebase = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase sign out warning:', err);
  }
};

/**
 * Update Profile Info
 */
export const updateFirebaseProfileData = async (data: { displayName?: string; photoURL?: string }): Promise<void> => {
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, data);
  }
};

export { onAuthStateChanged };
