import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { HardDrive, Tag, Calendar, ArrowLeft } from "lucide-react"
import { fetchGameBySlug } from "../firebase/firestore"
import DownloadMirror from "../components/DownloadMirror"
import { setPageMeta } from "../utils/seo"
import type { Game } from "../types"

function arr(v:any):string[]{ if(!v) return []; if(Array.isArray(v)) return v; if(typeof v==="string") return [v]; return Object.values(v) as string[] }
function fmtDate(v:any){
  if(!v) return "—"
  try {
    const d = typeof v === "number" ? new Date(v) : new Date(v)
    if (isNaN(d.getTime())) return String(v)
    return d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
  } catch { return String(v) }
}
export default function GameDetails(){
  const { slug } = useParams()
  const [game,setGame]=useState<Game|null>(null)
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    if(!slug) return
    setLoading(true)
    fetchGameBySlug(slug).then(g=>{
      setGame(g)
      if(g) setPageMeta(g.title, g.shortDescription)
      setLoading(false)
    })
  },[slug])
  if(loading) return <div className="py-10"><div className="h-[360px] skeleton rounded-2xl"/><div className="h-20 skeleton mt-4 rounded-xl"/></div>
  if(!game) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold text-xl">Game not found</h2><p className="text-white/50 mt-2">The game you’re looking for doesn’t exist.</p><Link to="/games" className="btn-primary mt-4">Browse Games</Link></div>
  const genre = arr((game as any).genre)
  const downloads = (()=>{ const v=(game as any).downloads; if(!v) return []; if(Array.isArray(v)) return v; if(typeof v==="object") return Object.values(v); return [] })() as any
  const size = (game as any).size || "—"
  const added = fmtDate((game as any).createdAt || (game as any).releaseDate)
  return (
    <div className="py-6">
      <Link to="/games" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="w-4 h-4"/> Back to Games</Link>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 mt-4">
        <div className="card overflow-hidden">
          <img src={game.coverImage} alt={game.title} className="w-full h-[380px] object-cover" />
          <div className="p-5">
            <h1 className="font-display font-bold text-2xl">{game.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {genre.map(g=> <span key={g} className="badge bg-violet-600/20 border-violet-500/30 text-violet-200"><Tag className="w-3 h-3 mr-1"/>{g}</span>)}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                <HardDrive className="w-5 h-5 mx-auto text-violet-400"/><div className="text-xs text-white/50 mt-1">Size</div><div className="text-sm font-semibold mt-0.5">{size}</div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto text-cyan-400"/><div className="text-xs text-white/50 mt-1">Added</div><div className="text-sm font-semibold mt-0.5">{added}</div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                <Tag className="w-5 h-5 mx-auto text-emerald-400"/><div className="text-xs text-white/50 mt-1">Genre</div><div className="text-sm font-semibold mt-0.5 truncate">{genre[0] || "—"}</div>
              </div>
            </div>
            <p className="text-xs text-white/40 mt-3 text-center">Genre: {genre.join(" • ") || "—"} • Added: {added} • Size: {size}</p>
          </div>
        </div>
        <div>
          <DownloadMirror mirrors={downloads} id={game.id} title={game.title} version={(game as any).version || "1.0.0"} size={size}/>
        </div>
      </div>
    </div>
  )
}
