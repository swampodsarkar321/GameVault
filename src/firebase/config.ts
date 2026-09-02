import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

// Realtime DB only — Firestore removed
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAeoScw5UK53ElBnNdhtJVAETb3_isOEKs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fram-and-go.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://fram-and-go-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fram-and-go",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fram-and-go.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "781295119002",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:781295119002:web:4be2d54934395b491c0d23",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TKPPF986Z0",
}

const hasConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId

let app: ReturnType<typeof initializeApp> | null = null
if (hasConfig && getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else if (getApps().length > 0) {
  app = getApps()[0]!
}

export const isFirebaseConfigured = hasConfig
export const isRealtimeConfigured = hasConfig && !!firebaseConfig.databaseURL
export const auth = app ? getAuth(app) : (null as any)
export const rtdb = app ? getDatabase(app) : (null as any)
export { firebaseConfig }
// Firestore removed — use Realtime Database only
export const db = null as any
