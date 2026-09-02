import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import GameCard from "../components/GameCard"
import SoftwareCard from "../components/SoftwareCard"
import EmptyState from "../components/EmptyState"
import SearchBar from "../components/SearchBar"
import { searchAll } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"

export default function SearchPage(){
  const [params]=useSearchParams()
  const q = params.get("q") || ""
  const [res,setRes]=useState<{games:any[],software:any[]}>({games:[],software:[]})
  const [loading,setLoading]=useState(false)
  useEffect(()=>{ setPageMeta(`Search: ${q}`); if(!q.trim()) return; setLoading(true); searchAll(q).then(r=>{ setRes(r); setLoading(false)}) },[q])
  return (
    <div className="py-6">
      <h1 className="font-display font-bold text-xl">Search</h1>
      <div className="mt-3 max-w-xl"><SearchBar/></div>
      {q && <p className="text-sm text-white/50 mt-3">Results for <span className="text-white font-medium">“{q}”</span> — {res.games.length + res.software.length} found</p>}
      {loading? <div className="mt-6 text-white/50 text-sm">Searching...</div> :
        (!q? <div className="mt-6"><EmptyState title="Search anything" description="Try game titles, software names, genres or developers."/></div> :
          (res.games.length===0 && res.software.length===0 ? <div className="mt-6"><EmptyState title="No results" description="Try a different keyword."/></div> :
          <>
            {res.games.length>0 && <><h2 className="font-semibold mt-6 mb-3">Games ({res.games.length})</h2><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{res.games.map((g:any)=><GameCard key={g.id} game={g}/>)}</div></>}
            {res.software.length>0 && <><h2 className="font-semibold mt-6 mb-3">Software ({res.software.length})</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{res.software.map((s:any)=><SoftwareCard key={s.id} software={s}/>)}</div></>}
          </>
        ))
      }
    </div>
  )
}
