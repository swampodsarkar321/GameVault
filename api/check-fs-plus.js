// Vercel Serverless Function: GET /api/check-fs-plus
// Returns { reachable, latencyMs, status, url }
// Requires no deps — uses native fetch (Node 18+)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  if (req.method === "OPTIONS") return res.status(204).end()

  const FS_URL = "https://fs.plus.net.bd/Games/"
  const timeoutMs = 5000
  const start = Date.now()
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const r = await fetch(FS_URL, { method: "HEAD", signal: ctrl.signal, redirect: "manual" })
    clearTimeout(t)
    const latencyMs = Date.now() - start
    const reachable = r.status >= 200 && r.status < 500 // any response = reachable
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60")
    return res.status(200).json({ reachable, latencyMs, status: r.status, url: FS_URL })
  } catch (e) {
    clearTimeout(t)
    const latencyMs = Date.now() - start
    return res.status(200).json({ reachable: false, latencyMs, status: 0, url: FS_URL, error: String(e) })
  }
}
