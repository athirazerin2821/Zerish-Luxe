/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../firebase-applet-config.json';

// Support VITE_ environment variables or fallback to local config json
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId,
};

const isConfigured = !!firebaseConfig.apiKey;

if (!isConfigured) {
  console.warn(
    "⚠️ Firebase configuration is currently empty. Please configure your Firebase credentials in /firebase-applet-config.json or in your environment variables."
  );
}

// Initialize Firebase with a safe placeholder config if missing to prevent boot crashes
const app = initializeApp(
  isConfigured 
    ? firebaseConfig 
    : {
        apiKey: "placeholder-api-key-for-local-development",
        authDomain: "placeholder-id.firebaseapp.com",
        projectId: "placeholder-id",
        storageBucket: "placeholder-id.firebasestorage.app",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef0123456789"
      }
);

export const auth = getAuth(app);
export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId) 
  : getFirestore(app);
export const storage = getStorage(app);

export default app;
