import { ref, runTransaction, get } from "firebase/database"
import { rtdb, isRealtimeConfigured } from "../firebase/config"

// Anonymous analytics — no IP, no personal data, only counts
// Uses Realtime DB path: analytics/{visits,downloads,ads}
// Falls back to localStorage mock if RTDB not configured

const LS_VISITS = "gv_analytics_visits"
const LS_DOWNLOADS = "gv_analytics_downloads"
const LS_ADS = "gv_analytics_ads"

function todayKey(){ return new Date().toISOString().slice(0,10) } // YYYY-MM-DD

function lsInc(key:string){
  try {
    const v = Number(localStorage.getItem(key) || "0")
    localStorage.setItem(key, String(v+1))
  } catch {}
}

export async function trackVisit(){
  // Debounce per session — count 1 per session
  try {
    if (sessionStorage.getItem("gv_visit_tracked")) return
    sessionStorage.setItem("gv_visit_tracked","1")
  } catch {}
  if (!isRealtimeConfigured) { lsInc(LS_VISITS); return }
  const t = todayKey()
  try {
    await runTransaction(ref(rtdb, `analytics/visits/total`), (c)=> (c||0)+1)
    await runTransaction(ref(rtdb, `analytics/visits/daily/${t}`), (c)=> (c||0)+1)
    await runTransaction(ref(rtdb, `analytics/visits/uniqueSessions`), (c)=> (c||0)+1)
  } catch {}
}

export async function trackDownload(gameId?: string, title?: string){
  lsInc(LS_DOWNLOADS)
  if (!isRealtimeConfigured) return
  const t = todayKey()
  try {
    await runTransaction(ref(rtdb, `analytics/downloads/total`), (c)=> (c||0)+1)
    await runTransaction(ref(rtdb, `analytics/downloads/daily/${t}`), (c)=> (c||0)+1)
    if (gameId) await runTransaction(ref(rtdb, `analytics/downloads/byGame/${gameId}`), (c)=> (c||0)+1)
    // Optional: store last download title for admin preview (anonymous, no IP)
    if (title) {
      const snap = await get(ref(rtdb, `analytics/downloads/recent`))
      const arr = snap.exists() && Array.isArray(snap.val()) ? snap.val() : []
      const next = [{ title, date: new Date().toISOString() }, ...arr].slice(0,20)
      // Use set via transaction? simple set
      const { set } = await import("firebase/database")
      await set(ref(rtdb, `analytics/downloads/recent`), next)
    }
  } catch {}
}

export async function trackAdImpression(zoneId: string = "e6q6hxg91y"){
  lsInc(LS_ADS)
  if (!isRealtimeConfigured) return
  const t = todayKey()
  try {
    await runTransaction(ref(rtdb, `analytics/ads/total`), (c)=> (c||0)+1)
    await runTransaction(ref(rtdb, `analytics/ads/daily/${t}`), (c)=> (c||0)+1)
    await runTransaction(ref(rtdb, `analytics/ads/byZone/${zoneId}`), (c)=> (c||0)+1)
  } catch {}
}

// Local fallback readers for admin when RTDB not configured
export function getLocalCounts(){
  try {
    return {
      visits: Number(localStorage.getItem(LS_VISITS)||"0"),
      downloads: Number(localStorage.getItem(LS_DOWNLOADS)||"0"),
      ads: Number(localStorage.getItem(LS_ADS)||"0"),
    }
  } catch { return { visits:0, downloads:0, ads:0 } }
}
