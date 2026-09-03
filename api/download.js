// Vercel Serverless: GET /api/download?url=<encoded>&filename=<name>
// High-speed proxy via GameVault — streams remote file with Range support, no buffering
// Supports http/https + ftp (via basic-ftp). User picks folder via frontend showSaveFilePicker.

import * as ftp from "basic-ftp"

export const config = { api: { responseLimit: false } }

function isAllowedUrl(u) {
  try {
    const url = new URL(u)
    // Allow http/https and ftp
    if (["http:", "https:", "ftp:"].includes(url.protocol)) return true
    return false
  } catch { return false }
}

function parseFtpUrl(ftpUrl) {
  // ftp://user:pass@host:port/path/file.zip  or ftp://host/path
  const url = new URL(ftpUrl)
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 21,
    user: decodeURIComponent(url.username || "anonymous"),
    password: decodeURIComponent(url.password || "anonymous@"),
    path: decodeURIComponent(url.pathname),
    filename: url.pathname.split("/").pop() || "download.bin",
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Range")
  res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, Content-Disposition")
  if (req.method === "OPTIONS") return res.status(204).end()
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" })

  const remoteUrl = req.query.url as string
  const filename = (req.query.filename as string) || undefined
  if (!remoteUrl) return res.status(400).json({ error: "Missing ?url=" })
  if (!isAllowedUrl(remoteUrl)) return res.status(400).json({ error: "Invalid URL protocol" })

  // Security: limit to FTP host environment or allow all? For now allow all http/https, ftp only if FTP_HOST set or anonymous
  // If you want to lock to your FTP, set env ALLOWED_FTP_HOST and check below
  // const allowedFtpHost = process.env.ALLOWED_FTP_HOST
  // if (remoteUrl.startsWith("ftp://") && allowedFtpHost && !remoteUrl.includes(allowedFtpHost)) return 403

  try {
    // FTP handling
    if (remoteUrl.startsWith("ftp://")) {
      const { host, port, user, password, path, filename: ftpFile } = parseFtpUrl(remoteUrl)
      const outName = filename || ftpFile
      const client = new ftp.Client(0)
      client.ftp.verbose = false
      try {
        await client.access({ host, port, user, password, secure: false })
        // Get file size for headers
        let size: number | undefined
        try { size = await client.size(path) } catch {}
        // Support Range
        const range = req.headers.range as string | undefined
        let start = 0, end: number | undefined
        if (range) {
          const m = range.match(/bytes=(\d+)-(\d*)/)
          if (m) { start = parseInt(m[1],10); if (m[2]) end = parseInt(m[2],10) }
        }
        res.setHeader("Content-Type", "application/octet-stream")
        res.setHeader("Content-Disposition", `attachment; filename="${outName.replace(/"/g,"")}"`)
        res.setHeader("Accept-Ranges", "bytes")
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate")
        // CORS for download attribute
        res.setHeader("X-Content-Type-Options", "nosniff")
        if (size !== undefined) {
          if (range) {
            const chunkEnd = end ?? size - 1
            res.status(206)
            res.setHeader("Content-Range", `bytes ${start}-${chunkEnd}/${size}`)
            res.setHeader("Content-Length", String(chunkEnd - start + 1))
            await client.downloadTo(res as any, path, start)
          } else {
            res.setHeader("Content-Length", String(size))
            await client.downloadTo(res as any, path)
          }
        } else {
          // Unknown size — stream
          if (range) res.status(206)
          await client.downloadTo(res as any, path, start)
        }
        client.close()
        return
      } catch (e:any) {
        client.close()
        return res.status(502).json({ error: "FTP fetch failed", details: String(e?.message || e) })
      }
    }

    // HTTP/HTTPS proxy with streaming and Range forwarding
    const headers: Record<string,string> = {}
    if (req.headers.range) headers["Range"] = req.headers.range as string
    // Forward user-agent
    headers["User-Agent"] = req.headers["user-agent"] as string || "GameVault-Downloader/1.0"

    const upstream = await fetch(remoteUrl, { headers, redirect: "follow" })
    if (!upstream.ok && upstream.status !== 206) {
      const text = await upstream.text().catch(()=> "")
      return res.status(upstream.status).json({ error: `Upstream ${upstream.status}`, details: text.slice(0,500) })
    }

    // Copy relevant headers
    const h = upstream.headers
    const contentType = h.get("content-type") || "application/octet-stream"
    const contentLength = h.get("content-length")
    const contentRange = h.get("content-range")
    const acceptRanges = h.get("accept-ranges") || "bytes"
    const disposition = h.get("content-disposition") || `attachment; filename="${(filename || remoteUrl.split("/").pop() || "download.bin").replace(/"/g,"")}"`

    res.setHeader("Content-Type", contentType)
    res.setHeader("Content-Disposition", disposition)
    res.setHeader("Accept-Ranges", acceptRanges)
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate")
    if (contentLength) res.setHeader("Content-Length", contentLength)
    if (contentRange) res.setHeader("Content-Range", contentRange)
    if (upstream.status === 206) res.status(206)

    if (!upstream.body) return res.status(502).json({ error: "No upstream body" })

    // Stream without buffering — high speed
    const reader = upstream.body.getReader()
    // Node res is writable stream
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) {
          // @ts-ignore
          if (!res.write(value)) await new Promise<void>(r=> res.once("drain", r))
        }
      }
      res.end()
    } catch (e) {
      try { res.end() } catch {}
    }
    return
  } catch (e:any) {
    return res.status(500).json({ error: "Proxy error", details: String(e?.message || e) })
  }
}
