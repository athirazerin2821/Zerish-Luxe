/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Production configuration for Zerish Luxe
const DEFAULT_CONFIG = {
  projectId: "zerish-luxe-1",
  appId: "1:156974464623:web:9b3b4fca7aaac80340579a",
  apiKey: "AIzaSyCoidm9jp0qW0NbCdeNVwbEUFQwyA_PSNk",
  authDomain: "zerish-luxe-1.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "zerish-luxe-1.firebasestorage.app",
  messagingSenderId: "156974464623"
};

// Support VITE_ environment variables or fallback to verified production config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_CONFIG.appId,
};

// Initialize Firebase safely without duplicate app crashes
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let storageInstance: ReturnType<typeof getStorage>;
try {
  storageInstance = getStorage(app);
} catch (err) {
  console.warn('Firebase Storage initialization fallback:', err);
  storageInstance = {} as ReturnType<typeof getStorage>;
}
export const storage = storageInstance;

export default app;

