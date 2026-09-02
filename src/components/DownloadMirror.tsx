import { Download, ExternalLink, ShieldCheck } from "lucide-react"
import type { DownloadMirror as Mirror } from "../types"
import { Link } from "react-router-dom"

export default function DownloadMirror({ mirrors, id, title, version, size }: { mirrors: Mirror[]; id:string; title:string; version:string; size:string }){
  if(!mirrors?.length) return <div className="text-sm text-white/50">No download mirrors available.</div>
  const displaySize = (()=>{ const s=String(size||"").trim(); return /GB|MB|KB/i.test(s)? s : s? `${s} GB` : "—" })()
  const fmt = (v:any)=>{ if(!v) return displaySize; const s=String(v).trim(); return /GB|MB|KB/i.test(s)? s : `${s} GB` }
  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold flex items-center gap-2"><Download className="w-5 h-5 text-violet-400"/> Download <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">{displaySize}</span></h3>
      <p className="text-xs text-white/50 mt-1 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/> Verified mirrors • Only legitimate sources • <span className="text-emerald-300 font-medium">{displaySize}</span></p>
      <div className="grid gap-2 mt-4">
        {mirrors.map((m,i)=> {
          const provider = (m.provider || "").toLowerCase().includes("fs") ? "Direct" : m.provider
          const name = (m.name || "").toLowerCase().includes("fs plus") ? (i===0 ? "Primary — Direct" : `Mirror ${i+1}`) : m.name
          const mSize = fmt(m.size || size)
          return (
          <Link key={i} to={`/download/${id}?mirror=${i}`} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${i===0?"bg-violet-600 border-violet-500 text-white hover:bg-violet-700":"bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white"}`}>
            <Download className="w-5 h-5 shrink-0"/>
            <div className="min-w-0 text-left">
              <div className="text-sm font-semibold leading-none">{name} {i===0 && <span className="ml-1 text-xs bg-white/20 rounded-full px-2 py-0.5">Primary</span>}</div>
              <div className="text-xs opacity-70">{provider} • <span className="font-bold text-emerald-300">{mSize}</span></div>
            </div>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-white/10 border border-white/20">{mSize}</span>
            <ExternalLink className="w-4 h-4 opacity-60"/>
          </Link>
        )})}
      </div>
      <p className="text-xs text-white/40 mt-3">Files are hosted by original developers/publishers.</p>
      <div className="text-xs text-white/50 mt-2 flex items-center gap-2"><span>{title}</span><span className="w-1 h-1 bg-white/20 rounded-full"></span><span>v{version}</span><span className="w-1 h-1 bg-white/20 rounded-full"></span><span className="font-bold text-emerald-300">{displaySize}</span></div>
    </div>
  )
}
