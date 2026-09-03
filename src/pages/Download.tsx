import { useParams, useSearchParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ShieldCheck, Download, ArrowLeft, FolderOpen, Zap, ExternalLink, Loader2 } from "lucide-react"
import { fetchGameById, fetchSoftwareById } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import { trackDownload } from "../utils/analytics"

export default function DownloadPage(){
  const { id } = useParams()
  const [sp]=useSearchParams()
  const mirrorIndex = parseInt(sp.get("mirror")||"0",10)
  const [item,setItem]=useState<any>(null)
  const [loading,setLoading]=useState(true)
  const [downloading,setDownloading]=useState(false)
  const [progress,setProgress]=useState(0)
  const [error,setError]=useState<string | null>(null)
  useEffect(()=>{
    if(!id) return
    Promise.all([fetchGameById(id), fetchSoftwareById(id)]).then(([g,s])=>{
      const found = g ?? s
      setItem(found); if(found) setPageMeta(`Download ${found.title} — High-Speed via AnkerPlay`, `${found.title} free download via AnkerPlay — high-speed direct. Choose folder before download. Version ${found.version}, ${found.size}.`); setLoading(false)
    })
  },[id])
  if(loading) return <div className="py-10"><div className="h-64 skeleton rounded-2xl"/></div>
  if(!item) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold">File not found</h2><Link to="/" className="btn-primary mt-4">Home</Link></div>
  const mirror = item.downloads?.[mirrorIndex] || item.downloads?.[0]
  const displayProvider = (()=>{ const p=(mirror?.provider||"").toString(); return p.toLowerCase().includes("fs") ? "Direct" : p })()
  const displayName = (()=>{ const n=(mirror?.name||"").toString(); return n.toLowerCase().includes("fs plus") ? "Primary — Direct" : n })()
  // Auto AnkerPlay tag for all download file names
  const getExt = (url:string)=>{
    try { const p = new URL(url).pathname; const m = p.match(/\.([a-z0-9]+)$/i); if(m) return m[1].toLowerCase(); } catch {}
    const m2 = (url||"").match(/\.([a-z0-9]+)(\?|$)/i); return m2? m2[1].toLowerCase() : "zip"
  }
  const ext = getExt(mirror?.url || "")
  const safeExt = ["zip","rar","7z","exe","tar","gz"].includes(ext) ? ext : "zip"
  const baseName = `AnkerPlay_${item.title.replace(/[^a-z0-9]+/gi,"_").replace(/^_+|_+$/g,"")}_v${(item.version || "1.0").replace(/[^a-z0-9.-]/gi,"_")}`
  const filename = `${baseName}.${safeExt}`
  const proxyUrl = `/api/download?url=${encodeURIComponent(mirror?.url || "")}&filename=${encodeURIComponent(filename)}`

  const handleFastDownload = async () => {
    setError(null)
    if (!mirror?.url) { setError("No download URL configured. Add real freeware mirror in Firebase (see realFreewareSeed.ts)."); return }
    trackDownload(item.id || id, item.title)
    setDownloading(true)
    setProgress(0)
    let isLarge = false
    try {
      const head = await fetch(mirror.url, { method: "HEAD" }).catch(()=> null)
      const len = head?.headers.get("content-length")
      if (len && Number(len) > 50*1024*1024) isLarge = true
      if (mirror.url.startsWith("ftp://") && (item.size || "").includes("GB")) isLarge = true
    } catch {}
    try {
      const hasPicker = typeof (window as any).showSaveFilePicker === "function"
      if (hasPicker && !isLarge) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{ description: "Game Archive", accept: { "application/octet-stream": [".zip",".rar",".7z",".exe"] } }],
          })
          const writable = await handle.createWritable()
          let res = await fetch(proxyUrl)
          if (!res.ok) {
            console.warn("proxy failed", res.status, "try direct")
            res = await fetch(mirror.url)
            if (!res.ok) throw new Error(`Direct ${res.status}`)
          }
          const total = Number(res.headers.get("content-length") || 0)
          const reader = res.body?.getReader()
          if (!reader) throw new Error("No stream")
          let received = 0
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (value) {
              await writable.write(value)
              received += value.length
              const pct = total ? Math.round(received/total*100) : 0
              if (total) setProgress(pct)
            }
          }
          await writable.close()
          setProgress(100)
          setTimeout(()=> setDownloading(false), 800)
          return
        } catch (e:any) {
          if (e?.name === "AbortError") { setDownloading(false); return }
          console.warn("picker failed, fallback", e)
        }
      }
      const useDirect = isLarge && mirror.url.startsWith("http")
      const href = useDirect ? mirror.url : proxyUrl
      const a = document.createElement("a")
      a.href = href
      a.download = filename
      a.rel = "noopener"
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setProgress(50)
      setTimeout(()=>{ setProgress(100); setDownloading(false) }, 1200)
    } catch (e:any) {
      setError(e?.message || "Download failed — trying direct...")
      try { window.open(mirror.url, "_blank") } catch {}
      setDownloading(false)
    }
  }

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <Link to={item.genre? `/game/${item.slug}`: `/software/${item.slug}`} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="w-4 h-4"/> Back to details</Link>
      <div className="card p-6 mt-4">
        <h1 className="font-display font-bold text-xl flex items-center gap-2"><Zap className="w-6 h-6 text-violet-400"/> High-Speed Download via AnkerPlay</h1>
        <p className="text-xs text-white/40 mt-1">Real download — only from AnkerPlay download page. Choose folder before download.</p>
        <div className="mt-4 bg-white/[0.04] border border-white/10 rounded-xl p-4">
          <div className="text-sm font-semibold">{item.title}</div>
          <div className="text-xs text-white/50 mt-1">Version {item.version} • {item.size} • {displayProvider} • <span className="text-emerald-300 font-bold">High-Speed</span></div>
          <div className="text-xs text-white/50">Mirror: {displayName} • {mirror?.type} • File: {filename}</div>
        </div>

        <button onClick={handleFastDownload} disabled={downloading} className="btn-primary w-full justify-center mt-4 py-3 text-base disabled:opacity-60">
          {downloading ? <><Loader2 className="w-5 h-5 animate-spin"/> Downloading {progress>0? `${progress}%`: ""}</> : <><FolderOpen className="w-5 h-5"/> Download Now — Choose Folder</>}
        </button>
        {downloading && progress>0 && (
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-violet-500 transition-all" style={{width: `${progress}%`}}/></div>
        )}
        {error && <div className="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-2">{error}</div>}

        <div className="grid grid-cols-2 gap-2 mt-3">
          <a href={proxyUrl} className="btn-ghost justify-center text-sm"><Download className="w-4 h-4"/> Direct (proxy)</a>
          <a href={mirror?.url} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center text-sm">External mirror <ExternalLink className="w-3 h-3"/></a>
        </div>
        <p className="text-[11px] text-center text-white/30 mt-2">Via AnkerPlay proxy — you will be asked to <b className="text-white/50">Choose folder</b> before download. Speed depends on your FTP/CDN bandwidth.</p>

        <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mt-4 text-xs text-emerald-200">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5"/><span><b>Safety note:</b> Only download from verified mirrors. Scan downloads with antivirus.</span>
        </div>
        <div className="text-xs text-white/40 mt-3">Legal: AnkerPlay only indexes legally distributable content. FTP files stream via AnkerPlay for high-speed.</div>
      </div>
    </div>
  )
}
