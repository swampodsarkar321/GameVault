import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import GameCard from "../components/GameCard"
import SoftwareCard from "../components/SoftwareCard"
import EmptyState from "../components/EmptyState"
import { fetchGames, fetchSoftware } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"

export default function CategoryPage(){
  const { slug } = useParams()
  const [games,setGames]=useState<any[]>([])
  const [software,setSoftware]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    if(!slug) return
    setPageMeta(slug); setLoading(true)
    Promise.all([fetchGames({ search: slug }), fetchSoftware({ search: slug })]).then(([g,s])=>{
      // also try exact category/genre filter fallback
      Promise.all([fetchGames({ genre: capitalize(slug) } as any), fetchSoftware({ category: capitalize(slug) } as any)]).then(([gf,sf])=>{
        const gm = new Map([...g, ...gf].map(x=>[x.id,x])); const sm = new Map([...s,...sf].map(x=>[x.id,x]))
        setGames([...gm.values()]); setSoftware([...sm.values()]); setLoading(false)
      })
    })
  },[slug])
  function capitalize(s:string){ return s.charAt(0).toUpperCase()+s.slice(1) }
  if(loading) return <div className="py-10 text-white/50 text-sm">Loading...</div>
  const total = games.length + software.length
  return (
    <div className="py-6">
      <h1 className="font-display font-bold text-2xl capitalize">{slug?.replace('-',' ')}</h1>
      <p className="text-sm text-white/50 mt-1">{total} items found</p>
      {total===0? <div className="mt-6"><EmptyState title="No items in this category" description="Try browsing all games or software."/></div> :
      <>
        {games.length>0 && <><h2 className="font-semibold mt-6 mb-3">Games</h2><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{games.map((g:any)=><GameCard key={g.id} game={g}/>)}</div></>}
        {software.length>0 && <><h2 className="font-semibold mt-6 mb-3">Software</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{software.map((s:any)=><SoftwareCard key={s.id} software={s}/>)}</div></>}
      </>}
    </div>
  )
}
