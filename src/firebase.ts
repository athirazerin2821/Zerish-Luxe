/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import config from '../firebase-applet-config.json';

// Default project configuration fallback (Zerish Luxe)
const DEFAULT_CONFIG = {
  projectId: "zerish-luxe-1",
  appId: "1:156974464623:web:9b3b4fca7aaac80340579a",
  apiKey: "AIzaSyCoidm9jp0qW0NbCdeNVwbEUFQwyA_PSNk",
  authDomain: "zerish-luxe-1.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "zerish-luxe-1.firebasestorage.app",
  messagingSenderId: "156974464623"
};

// Support VITE_ environment variables or fallback to local config or default
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (config && config.apiKey) || DEFAULT_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (config && config.authDomain) || DEFAULT_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (config && config.projectId) || DEFAULT_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (config && config.storageBucket) || DEFAULT_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (config && config.messagingSenderId) || DEFAULT_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || (config && config.appId) || DEFAULT_CONFIG.appId,
};

// Initialize Firebase safely without duplicate app crashes
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

