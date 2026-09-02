import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { searchAll } from "../firebase/firestore"
import { useDebounce } from "../hooks/useDebounce"
export default function SearchBar(){
  const [q,setQ]=useState("")
  const deb = useDebounce(q,300)
  const [res,setRes]=useState<{games:any[],software:any[]}|null>(null)
  const nav = useNavigate()
  useEffect(()=>{ if(!deb.trim()){ setRes(null); return } searchAll(deb).then(setRes) },[deb])
  const go = (path:string)=>{ setQ(""); setRes(null); nav(path)}
  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5">
        <Search className="w-4 h-4 text-white/50"/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=> e.key==="Enter" && q.trim() && (()=>{ setRes(null); nav(`/search?q=${encodeURIComponent(q)}`)})()} placeholder="Search games, software, genres..." className="bg-transparent outline-none flex-1 text-sm" />
      </div>
      {res && (
        <div className="absolute top-full mt-2 w-full bg-[#0F1424] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-40 max-h-[420px] overflow-y-auto">
          {res.games.length===0 && res.software.length===0 ? <div className="p-4 text-sm text-white/50">No results for “{deb}”</div> :
          <>
            {res.games.length>0 && <><div className="px-3 py-2 text-xs font-semibold tracking-widest text-white/40">GAMES</div>{res.games.slice(0,4).map((g:any)=><button key={g.id} onClick={()=>go(`/game/${g.slug}`)} className="w-full text-left px-3 py-2.5 hover:bg-white/5 flex items-center gap-3"><img src={g.coverImage} className="w-10 h-10 rounded-lg object-cover"/><span className="text-sm">{g.title}</span><span className="ml-auto text-xs text-white/40">{g.genre?.[0]}</span></button>)}</>}
            {res.software.length>0 && <><div className="px-3 py-2 text-xs font-semibold tracking-widest text-white/40">SOFTWARE</div>{res.software.slice(0,4).map((s:any)=><button key={s.id} onClick={()=>go(`/software/${s.slug}`)} className="w-full text-left px-3 py-2.5 hover:bg-white/5 flex items-center gap-3"><img src={s.logo||s.coverImage} className="w-10 h-10 rounded-lg object-cover bg-white/5"/><span className="text-sm">{s.title}</span><span className="ml-auto text-xs text-white/40">{s.category}</span></button>)}</>}
            <button onClick={()=>{ setRes(null); nav(`/search?q=${encodeURIComponent(deb)}`)}} className="w-full py-2.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white">View all results</button>
          </>}
        </div>
      )}
    </div>
  )
}
