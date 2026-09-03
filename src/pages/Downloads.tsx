import { Link } from "react-router-dom"
import { Download, Trash2, FolderOpen, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react"
import { useDownloads } from "../context/DownloadManagerContext"
import { setPageMeta } from "../utils/seo"
import { useEffect } from "react"

export default function Downloads(){
  const { downloads, remove, clearCompleted } = useDownloads()
  useEffect(()=> setPageMeta("Download Manager — Your Downloads", "View and manage your GameVault downloads — name, progress, status. High-speed via GameVault." ,{ canonical:"/downloads", keywords:"download manager, game downloads, free games download manager"}),[])
  return (
    <div className="py-6 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="w-4 h-4"/> Back</Link>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-10 h-10 rounded-xl bg-violet-600 grid place-items-center"><Download className="w-5 h-5 text-white"/></div>
        <div>
          <h1 className="font-display font-bold text-2xl leading-none">Download Manager</h1>
          <p className="text-sm text-white/50">User theke download dekhte parbe — name, progress, status — Home/Trending/Top/Games/Software sob jaygay theke</p>
        </div>
        {downloads.length>0 && <button onClick={clearCompleted} className="ml-auto btn-ghost text-xs">Clear completed</button>}
      </div>

      {downloads.length===0 ? (
        <div className="card p-10 text-center mt-6">
          <FolderOpen className="w-10 h-10 mx-auto text-white/20"/>
          <h3 className="font-semibold mt-3">No downloads yet</h3>
          <p className="text-sm text-white/50 mt-1">Home, Trending, Top Games, Games, Software — jekhane download click korbe, ekhane dekhte parbe.</p>
          <Link to="/games" className="btn-primary mt-4">Browse Games</Link>
        </div>
      ) : (
        <div className="grid gap-3 mt-6">
          {downloads.map(d=>(
            <div key={d.id} className="card p-4 flex gap-4 items-center">
              {d.cover ? <img src={d.cover} alt={d.title} className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"/> : <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0"><Download className="w-6 h-6 text-violet-400"/></div>}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight line-clamp-1">{d.title}</div>
                <div className="text-xs text-white/40 truncate">{d.filename} • {d.size}</div>
                <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${d.status==="failed"?"bg-red-500": d.status==="completed"?"bg-emerald-500":"bg-violet-500"}`} style={{width:`${d.progress}%`}}/>
                </div>
                <div className="text-[11px] mt-1 flex items-center gap-1.5">
                  {d.status==="downloading" && <><Clock className="w-3 h-3 text-violet-400"/> <span className="text-violet-300">{d.progress}% downloading</span></>}
                  {d.status==="queued" && <><Clock className="w-3 h-3 text-white/40"/> <span className="text-white/40">Queued</span></>}
                  {d.status==="completed" && <><CheckCircle className="w-3 h-3 text-emerald-400"/> <span className="text-emerald-300">Completed</span></>}
                  {d.status==="failed" && <><XCircle className="w-3 h-3 text-red-400"/> <span className="text-red-300">Failed</span></>}
                  <span className="ml-auto text-white/20">{new Date(d.date).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={()=>remove(d.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <Link to="/" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">Home</Link>
        <Link to="/trending" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">Trending</Link>
        <Link to="/top-games" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">Top Games</Link>
        <Link to="/games" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">Games</Link>
        <Link to="/software" className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">Software</Link>
      </div>
    </div>
  )
}
