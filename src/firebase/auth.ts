import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, onAuthStateChanged, type User } from "firebase/auth"
import { ref, set as rtdbSet, get as rtdbGet } from "firebase/database"
import { auth, rtdb, isFirebaseConfigured, isRealtimeConfigured } from "./config"

export async function register(email: string, password: string, displayName: string) {
  if (!isFirebaseConfigured) throw new Error("Firebase not configured. Set env vars.")
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  const profile = { uid: cred.user.uid, email, displayName, isAdmin: false, createdAt: Date.now() }
  if (isRealtimeConfigured) { try { await rtdbSet(ref(rtdb, `users/${cred.user.uid}`), profile) } catch {} }
  return cred.user
}
export async function login(email: string, password: string) {
  if (!isFirebaseConfigured) throw new Error("Firebase not configured")
  const c = await signInWithEmailAndPassword(auth, email, password)
  return c.user
}
export const logout = () => isFirebaseConfigured ? signOut(auth) : Promise.resolve()
export const resetPassword = (email: string) => {
  if (!isFirebaseConfigured) throw new Error("Firebase not configured")
  return sendPasswordResetEmail(auth, email)
}
export const subscribeAuth = (cb: (u: User | null) => void) => {
  if (!isFirebaseConfigured) { cb(null); return () => {} }
  return onAuthStateChanged(auth, cb)
}
export async function getUserProfile(uid: string) {
  if (!isRealtimeConfigured) return null
  try { const snap = await rtdbGet(ref(rtdb, `users/${uid}`)); if (snap.exists()) return snap.val() } catch {}
  return null
}
