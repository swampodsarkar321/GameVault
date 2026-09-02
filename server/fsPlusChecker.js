// Node/Express backend checker for FS Plus
// Endpoint: GET /api/check-fs-plus  -> { reachable: boolean, latencyMs, status, url }
// Deploy anywhere (Express, Vercel Serverless, Firebase Functions)

import express from "express"
import cors from "cors"

const app = express()
app.use(cors()) // allow frontend to call

const FS_URL = "https://fs.plus.net.bd/Games/"
const TIMEOUT_MS = 5000

async function isReachable(url) {
  const start = Date.now()
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    // HEAD is lightest; fallback to GET if HEAD blocked
    let res = await fetch(url, { method: "HEAD", signal: ctrl.signal, redirect: "manual" })
    clearTimeout(t)
    const latency = Date.now() - start
    // 2xx/3xx = reachable, even 403 means server responded
    if (res.status >= 200 && res.status < 500) return { reachable: true, status: res.status, latencyMs: latency }
    return { reachable: true, status: res.status, latencyMs: latency }
  } catch (e) {
    clearTimeout(t)
    // Network error / timeout / abort
    return { reachable: false, status: 0, latencyMs: Date.now() - start, error: String(e) }
  }
}

app.get("/api/check-fs-plus", async (_req, res) => {
  const r = await isReachable(FS_URL)
  // Cache 60s on CDN
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60")
  res.json({ reachable: r.reachable, latencyMs: r.latencyMs, status: r.status, url: FS_URL })
})

app.get("/health", (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`FS Plus checker listening on :${PORT} -> GET /api/check-fs-plus`))

// For Vercel: export default app  (see api/check-fs-plus.js)
export default app
