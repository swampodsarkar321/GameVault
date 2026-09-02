// Firestore removed — this file now wraps Realtime DB only (kept for import compatibility)
import { isRealtimeConfigured } from "./config"
import type { Game, Software } from "../types"
import { sampleGames, sampleSoftware } from "../data/sampleData"
import * as RT from "./realtimeDb"

export async function fetchGames(filters?: { genre?: string; platform?: string; sort?: string; search?: string; featured?: boolean; popular?: boolean; limitN?: number }): Promise<Game[]> {
  if (isRealtimeConfigured) {
    try { const list = await RT.fetchGamesRT(filters); if (list.length) return list } catch {}
  }
  return filterLocal(sampleGames, filters)
}
export async function fetchSoftware(filters?: { category?: string; sort?: string; search?: string; featured?: boolean; popular?: boolean; limitN?: number }): Promise<Software[]> {
  if (isRealtimeConfigured) {
    try { const list = await RT.fetchSoftwareRT(filters); if (list.length) return list } catch {}
  }
  return filterLocalSoft(sampleSoftware, filters)
}
export async function fetchGameBySlug(slug: string): Promise<Game | null> {
  if (isRealtimeConfigured) {
    try { const g = await RT.fetchGameBySlugRT(slug); if (g) return g } catch {}
  }
  return sampleGames.find(g => g.slug === slug) ?? null
}
export async function fetchSoftwareBySlug(slug: string): Promise<Software | null> {
  if (isRealtimeConfigured) {
    try { const s = await RT.fetchSoftwareBySlugRT(slug); if (s) return s } catch {}
  }
  return sampleSoftware.find(s => s.slug === slug) ?? null
}
export async function fetchGameById(id: string) {
  if (isRealtimeConfigured) {
    try { const g = await RT.fetchGameByIdRT(id); if (g) return g } catch {}
  }
  return sampleGames.find(g => g.id === id) ?? null
}
export async function fetchSoftwareById(id: string) {
  if (isRealtimeConfigured) {
    try { const s = await RT.fetchSoftwareByIdRT(id); if (s) return s } catch {}
  }
  return sampleSoftware.find(s => s.id === id) ?? null
}
// admin CRUD — Realtime DB only
export async function createGame(data: Omit<Game, "id">) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return RT.createGameRT(data as any)
}
export async function updateGame(id: string, data: Partial<Game>) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return RT.updateGameRT(id, data)
}
export async function deleteGame(id: string) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return RT.deleteGameRT(id)
}
export async function createSoftware(data: Omit<Software, "id">) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return RT.createSoftwareRT(data as any)
}
export async function updateSoftware(id: string, data: Partial<Software>) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return RT.updateSoftwareRT(id, data)
}
export async function deleteSoftware(id: string) {
  if (!isRealtimeConfigured) throw new Error("Realtime DB not configured")
  return RT.deleteSoftwareRT(id)
}

function filterLocal(list: Game[], f?: any): Game[] {
  let out = [...list]
  if (f?.genre) out = out.filter(g => g.genre.includes(f.genre))
  if (f?.platform) out = out.filter(g => g.platform.includes(f.platform))
  if (f?.featured) out = out.filter(g => g.featured)
  if (f?.popular) out = out.filter(g => g.popular)
  if (f?.search) { const q = f.search.toLowerCase(); out = out.filter(g => g.title.toLowerCase().includes(q) || g.genre.join(" ").toLowerCase().includes(q) || g.developer.toLowerCase().includes(q)) }
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

export async function searchAll(qStr: string) {
  const ql = qStr.toLowerCase()
  const games = sampleGames.filter(g=> g.title.toLowerCase().includes(ql) || g.genre.join(" ").toLowerCase().includes(ql) || g.developer.toLowerCase().includes(ql))
  const software = sampleSoftware.filter(s=> s.title.toLowerCase().includes(ql) || s.category.toLowerCase().includes(ql))
  if (isRealtimeConfigured) {
    try {
      const [ga, sa] = await Promise.all([fetchGames({ search: qStr }), fetchSoftware({ search: qStr })])
      const gm = new Map(ga.map(g=>[g.slug,g])); games.forEach(g=>{ if(!gm.has(g.slug)) gm.set(g.slug,g)});
      const sm = new Map(sa.map(s=>[s.slug,s])); software.forEach(s=>{ if(!sm.has(s.slug)) sm.set(s.slug,s)})
      return { games: [...gm.values()], software: [...sm.values()] }
    } catch {}
  }
  return { games, software }
}

export { isRealtimeConfigured }
