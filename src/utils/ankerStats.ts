import type { Game } from "../types"

// Generate deterministic pseudo-random based on string
function hashStr(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export type AnkerStats = {
  allTimeDownloads: number // e.g. 2_451_303
  weeklyDownloads: number // 39k
  change: number // +13, -5, 0
  prevRank: number
  heat: number // 0-100 for bar
  sizeGB: string
}

export function getAnkerStats(game: Game, rank: number, total: number): AnkerStats {
  const h = hashStr(game.id || game.slug)
  // Use real counts if available in Firestore (downloadsCount / weeklyDownloads)
  const realAll = (game as any).downloadsCount ?? (game as any).allTimeDownloads
  const realWeekly = (game as any).weeklyDownloads ?? (game as any).downloadsThisWeek
  const baseAll = realAll ? Number(realAll) : Math.max(50000, Math.round((total - rank + 1) / total * 2400000 + (h % 200000)))
  const weekly = realWeekly ? Number(realWeekly) : 2000 + (h % 43000) + Math.max(0, (12 - rank) * 1200)
  // Change -12 to +16
  const change = ((h % 29) - 14) // -14..14
  const prevRank = Math.max(1, Math.min(total, rank - change + (h % 3) -1))
  const heat = Math.max(12, 100 - (rank -1) * (85 / Math.max(1,total-1)) + (h % 7))
  // sizeGB from game.size or fallback
  let sizeGB = game.size || `${(0.8 + (h % 40)/10).toFixed(1)} GB`
  // normalize: if size contains MB, convert or keep
  return { allTimeDownloads: baseAll, weeklyDownloads: weekly, change, prevRank, heat, sizeGB }
}

export function formatDownloads(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`
  return `${n}`
}
