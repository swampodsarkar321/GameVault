import { useParams, useSearchParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ShieldCheck, Download, ArrowLeft } from "lucide-react"
import { fetchGameById, fetchSoftwareById } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"

export default function DownloadPage(){
  const { id } = useParams()
  const [sp]=useSearchParams()
  const mirrorIndex = parseInt(sp.get("mirror")||"0",10)
  const [item,setItem]=useState<any>(null)
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    if(!id) return
    Promise.all([fetchGameById(id), fetchSoftwareById(id)]).then(([g,s])=>{
      const found = g ?? s
      setItem(found); if(found) setPageMeta(`Download ${found.title}`); setLoading(false)
    })
  },[id])
  if(loading) return <div className="py-10"><div className="h-64 skeleton rounded-2xl"/></div>
  if(!item) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold">File not found</h2><Link to="/" className="btn-primary mt-4">Home</Link></div>
  const mirror = item.downloads?.[mirrorIndex] || item.downloads?.[0]
  const displayProvider = (()=>{ const p=(mirror?.provider||"").toString(); return p.toLowerCase().includes("fs") ? "Direct" : p })()
  const displayName = (()=>{ const n=(mirror?.name||"").toString(); return n.toLowerCase().includes("fs plus") ? "Primary — Direct" : n })()
  return (
    <div className="py-6 max-w-2xl mx-auto">
      <Link to={item.genre? `/game/${item.slug}`: `/software/${item.slug}`} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="w-4 h-4"/> Back to details</Link>
      <div className="card p-6 mt-4">
        <h1 className="font-display font-bold text-xl flex items-center gap-2"><Download className="w-6 h-6 text-violet-400"/> Download</h1>
        <div className="mt-4 bg-white/[0.04] border border-white/10 rounded-xl p-4">
          <div className="text-sm font-semibold">{item.title}</div>
          <div className="text-xs text-white/50 mt-1">Version {item.version} • {item.size} • {displayProvider}</div>
          <div className="text-xs text-white/50">Mirror: {displayName} • {mirror?.type}</div>
        </div>
        <a href={mirror?.url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-4 py-3 text-base">Download Now</a>
        <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mt-4 text-xs text-emerald-200">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5"/><span><b>Safety note:</b> Only download from verified mirrors. Scan downloads with antivirus.</span>
        </div>
        <div className="text-xs text-white/40 mt-3">Legal: GameVault only indexes legally distributable content.</div>
      </div>
    </div>
  )
}
