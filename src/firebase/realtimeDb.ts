import { ref, get, set, push, update, remove, onValue, off } from "firebase/database"
import { rtdb, isRealtimeConfigured } from "./config"
import type { Game, Software } from "../types"

// Helpers to convert RTDB object -> array
function toArray<T>(obj: any): T[] {
  if (!obj) return []
  if (Array.isArray(obj)) return obj
  return Object.entries(obj).map(([id, v]: any) => ({ id, ...v } as T))
}

function ensureArray(v: any): any[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  if (typeof v === "string") return v.split(",").map((s: string) => s.trim()).filter(Boolean)
  if (typeof v === "object") return Object.values(v)
  return [v]
}

const defaultReq = { os: "Windows 10 64-bit", cpu: "Intel Core i5-8400", ram: "8 GB RAM", gpu: "GTX 1060 6GB", storage: "30 GB" }
function fmtSize(v:any){
  if(v==null || v==="") return "—"
  const s=String(v).trim()
  return /GB|MB|KB/i.test(s) ? s : `${s} GB`
}
function normalizeGame(g: any): Game {
  return {
    ...g,
    size: fmtSize(g.size),
    genre: ensureArray(g.genre),
    platform: ensureArray(g.platform),
    screenshots: ensureArray(g.screenshots),
    downloads: ensureArray(g.downloads).map((d:any)=> ({ ...d, size: fmtSize(d.size || g.size) })),
    requirements: g.requirements && typeof g.requirements === "object"
      ? {
          minimum: g.requirements.minimum || defaultReq,
          recommended: g.requirements.recommended || defaultReq,
        }
      : { minimum: defaultReq, recommended: defaultReq },
  } as Game
}
function normalizeSoftware(s: any): Software {
  return {
    ...s,
    size: fmtSize(s.size),
    platform: ensureArray(s.platform),
    screenshots: ensureArray(s.screenshots),
    features: ensureArray(s.features),
    downloads: ensureArray(s.downloads).map((d:any)=> ({ ...d, size: fmtSize(d.size || s.size) })),
  } as Software
}

// Generic fetch with RTDB
async function fetchRT<T>(path: string): Promise<T[]> {
  if (!isRealtimeConfigured) return []
  const snap = await get(ref(rtdb, path))
  if (!snap.exists()) return []
  return toArray<T>(snap.val())
}

// Games
export async function fetchGamesRT(filters?: any): Promise<Game[]> {
  const list = (await fetchRT<Game>("games")).map(normalizeGame)
  return filterLocal(list, filters)
}
export async function fetchGameBySlugRT(slug: string): Promise<Game | null> {
  const list = (await fetchRT<Game>("games")).map(normalizeGame)
  return list.find(g => g.slug === slug) ?? null
}
export async function fetchGameByIdRT(id: string): Promise<Game | null> {
  const snap = await get(ref(rtdb, `games/${id}`))
  return snap.exists() ? normalizeGame({ id: snap.key!, ...snap.val() } as Game) : null
}
export async function createGameRT(data: Omit<Game, "id">) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  const newRef = push(ref(rtdb, "games"))
  await set(newRef, { ...data, id: newRef.key!, createdAt: Date.now() })
  return newRef
}
export async function updateGameRT(id: string, data: Partial<Game>) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return update(ref(rtdb, `games/${id}`), data as any)
}
export async function deleteGameRT(id: string) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return remove(ref(rtdb, `games/${id}`))
}

// Software
export async function fetchSoftwareRT(filters?: any): Promise<Software[]> {
  const list = (await fetchRT<Software>("software")).map(normalizeSoftware)
  return filterLocalSoft(list, filters)
}
export async function fetchSoftwareBySlugRT(slug: string): Promise<Software | null> {
  const list = (await fetchRT<Software>("software")).map(normalizeSoftware)
  return list.find(s => s.slug === slug) ?? null
}
export async function fetchSoftwareByIdRT(id: string): Promise<Software | null> {
  const snap = await get(ref(rtdb, `software/${id}`))
  return snap.exists() ? normalizeSoftware({ id: snap.key!, ...snap.val() } as Software) : null
}
export async function createSoftwareRT(data: Omit<Software, "id">) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  const newRef = push(ref(rtdb, "software"))
  await set(newRef, { ...data, id: newRef.key!, createdAt: Date.now() })
  return newRef
}
export async function updateSoftwareRT(id: string, data: Partial<Software>) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return update(ref(rtdb, `software/${id}`), data as any)
}
export async function deleteSoftwareRT(id: string) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return remove(ref(rtdb, `software/${id}`))
}

// Realtime listeners for admin live updates
export function subscribeGamesRT(cb: (games: Game[]) => void) {
  if (!isRealtimeConfigured) return () => {}
  const r = ref(rtdb, "games")
  const handler = (snap: any) => cb(toArray<Game>(snap.val()).map(normalizeGame))
  onValue(r, handler)
  return () => off(r, "value", handler)
}
export function subscribeSoftwareRT(cb: (list: Software[]) => void) {
  if (!isRealtimeConfigured) return () => {}
  const r = ref(rtdb, "software")
  const handler = (snap: any) => cb(toArray<Software>(snap.val()).map(normalizeSoftware))
  onValue(r, handler)
  return () => off(r, "value", handler)
}

// Filters (same as Firestore fallback)
function filterLocal(list: Game[], f?: any): Game[] {
  let out = [...list]
  if (f?.genre) out = out.filter(g => ensureArray(g.genre).includes(f.genre))
  if (f?.platform) out = out.filter(g => ensureArray(g.platform).includes(f.platform))
  if (f?.featured) out = out.filter(g => g.featured)
  if (f?.popular) out = out.filter(g => g.popular)
  if (f?.search) { const q = f.search.toLowerCase(); out = out.filter(g => g.title.toLowerCase().includes(q) || ensureArray(g.genre).join(" ").toLowerCase().includes(q) || g.developer.toLowerCase().includes(q)) }
  if (f?.sort === "name") out.sort((a,b)=>a.title.localeCompare(b.title))
  else if (f?.sort === "popular") out.sort((a,b)=> Number(b.popular)-Number(a.popular))
  return f?.limitN ? out.slice(0,f.limitN): out
}
function filterLocalSoft(list: Software[], f?: any): Software[] {
  let out = [...list]
  if (f?.category) out = out.filter(s => s.category===f.category)
  if (f?.featured) out = out.filter(s=>s.featured)
  if (f?.popular) out = out.filter(s=>s.popular)
  if (f?.search) { const q=f.search.toLowerCase(); out=out.filter(s=> s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.developer.toLowerCase().includes(q))}
  if (f?.sort==="name") out.sort((a,b)=>a.title.localeCompare(b.title))
  return f?.limitN ? out.slice(0,f.limitN): out
}

// Seed helper — push sample data once if empty (call from admin)
export async function seedRealtimeIfEmpty(games: Game[], software: Software[]) {
  if (!isRealtimeConfigured) return
  const [gSnap, sSnap] = await Promise.all([get(ref(rtdb, "games")), get(ref(rtdb, "software"))])
  if (!gSnap.exists()) {
    for (const g of games) {
      const { id, ...rest } = g as any
      await set(ref(rtdb, `games/${g.id}`), { ...rest, id: g.id, createdAt: Date.now() })
    }
  }
  if (!sSnap.exists()) {
    for (const s of software) {
      const { id, ...rest } = s as any
      await set(ref(rtdb, `software/${s.id}`), { ...rest, id: s.id, createdAt: Date.now() })
    }
  }
}
