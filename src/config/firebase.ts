import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAaAkqz1v6Oqd1Hssdx4SmK7IYlki78wVM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dropcode-7568e.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dropcode-7568e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dropcode-7568e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '471098634394',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:471098634394:web:885d0c62bae277c9b06f23',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-8NX1NQE82F',
};

let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization with env config fallback:', err);
  app = initializeApp(firebaseConfig, 'dropcode-fallback');
  auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  app,
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
};
