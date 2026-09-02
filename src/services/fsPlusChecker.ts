// FS Plus checker — detects if https://fs.plus.net.bd/Games/ is reachable
// Strategy: try backend API first (avoids CORS), fallback to frontend no-cors fetch
export const FS_PLUS_URL = "https://fs.plus.net.bd/Games/"
export const FS_PLUS_BACKEND_URL = import.meta.env.VITE_FS_CHECKER_URL as string | undefined // e.g. https://your-backend.com/api/check-fs-plus

export type FSStatus = "checking" | "online" | "offline"

const CACHE_KEY = "fs_plus_status"
const CACHE_TTL = 5 * 60 * 1000 // 5 min

export function getCachedStatus(): { status: FSStatus; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw)
    if (Date.now() - v.ts > CACHE_TTL) return null
    return v
  } catch { return null }
}
export function setCachedStatus(status: FSStatus) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ status, ts: Date.now() })) } catch {}
}

// Backend checker: expects GET -> { reachable: boolean, latencyMs?: number }
async function checkViaBackend(): Promise<boolean | null> {
  if (!FS_PLUS_BACKEND_URL) return null
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 6000)
    const res = await fetch(FS_PLUS_BACKEND_URL, { signal: ctrl.signal, cache: "no-store" })
    clearTimeout(t)
    if (!res.ok) return null
    const ct = res.headers.get("content-type") || ""
    if (ct.includes("application/json")) {
      const data = await res.json()
      return !!data.reachable
    }
    // Dev proxy returns HTML from fs.plus.net.bd/Games/ — any 200 means reachable
    return res.status >= 200 && res.status < 400
  } catch { return null }
}

// Frontend direct check — uses no-cors opaque response (network reachable = success)
// Note: no-cors HEAD will resolve as opaque even if CORS blocks, reject only on network failure
async function checkViaFrontend(): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    // Try HEAD no-cors first
    await fetch(FS_PLUS_URL, { method: "HEAD", mode: "no-cors", cache: "no-store", signal: controller.signal })
    clearTimeout(timeout)
    return true // opaque success => network reachable
  } catch {
    clearTimeout(timeout)
    // Fallback: try GET no-cors
    try {
      const c2 = new AbortController()
      const t2 = setTimeout(() => c2.abort(), 5000)
      await fetch(FS_PLUS_URL, { method: "GET", mode: "no-cors", cache: "no-store", signal: c2.signal })
      clearTimeout(t2)
      return true
    } catch { return false }
  }
}

export async function checkFSPlus(): Promise<boolean> {
  // 1) Backend if configured
  const backend = await checkViaBackend()
  if (backend !== null) return backend
  // 2) Frontend fallback
  return checkViaFrontend()
}
