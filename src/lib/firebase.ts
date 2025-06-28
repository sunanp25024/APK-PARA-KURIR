import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Enhanced Firebase configuration with better error handling
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingEnvVars);
  console.error('📝 Please check your .env.local file and ensure all Firebase config variables are set');
  throw new Error(`Missing Firebase environment variables: ${missingEnvVars.join(', ')}`);
}

// Log configuration status (without sensitive data)
console.log('🔥 Firebase Config Status:');
console.log('✅ API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing');
console.log('✅ Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Missing');
console.log('✅ Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing');

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('🚀 Firebase initialized successfully');
  } catch (error) {
    console.error("❌ Firebase initialization error", error);
    throw new Error("Failed to initialize Firebase. Please check your configuration in .env.local");
  }
} else {
  app = getApp();
  console.log('🔄 Using existing Firebase app');
}

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('✅ Firebase services initialized successfully');
} catch (error) {
  console.error("❌ Error getting Firebase services", error);
  throw new Error("Failed to get Firebase services. Ensure Firebase was initialized correctly.");
}

export { app, auth, db, storage };