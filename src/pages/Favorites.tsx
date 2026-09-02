import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GameCard from "../components/GameCard"
import SoftwareCard from "../components/SoftwareCard"
import EmptyState from "../components/EmptyState"
import { useFavorites } from "../context/FavoritesContext"
import { useAuth } from "../context/AuthContext"
import { sampleGames, sampleSoftware } from "../data/sampleData"
import { setPageMeta } from "../utils/seo"

export default function Favorites(){
  const { favorites } = useFavorites()
  const { user } = useAuth()
  const [tab,setTab]=useState<'all'|'game'|'software'>('all')
  useEffect(()=> setPageMeta("Favorites"),[])
  if(!user) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold text-xl">Login to view favorites</h2><p className="text-white/50 mt-2 text-sm">Save games and software you love.</p><Link to="/login" className="btn-primary mt-4">Login</Link></div>
  const favGames = favorites.filter(f=>f.itemType==='game').map(f=> sampleGames.find(g=>g.id===f.itemId)).filter(Boolean) as any[]
  const favSoft = favorites.filter(f=>f.itemType==='software').map(f=> sampleSoftware.find(s=>s.id===f.itemId)).filter(Boolean) as any[]
  const isEmpty = favGames.length===0 && favSoft.length===0
  return (
    <div className="py-6">
      <h1 className="font-display font-bold text-2xl">Favorites</h1>
      <p className="text-sm text-white/50 mt-1">{favorites.length} saved items</p>
      <div className="flex gap-2 mt-4">
        {[['all','All'],['game','Games'],['software','Software']].map(([v,l])=> <button key={v} onClick={()=>setTab(v as any)} className={`px-4 py-2 rounded-xl text-sm border ${tab===v?"bg-violet-600 border-violet-500 text-white":"bg-white/5 border-white/10 text-white/70"}`}>{l}</button>)}
      </div>
      {isEmpty? <div className="mt-6"><EmptyState title="No favorites yet" description="Browse games and software and tap the heart to save."/></div> :
      <>
        {(tab==='all'||tab==='game') && favGames.length>0 && <><h2 className="font-semibold mt-6 mb-3">Games</h2><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{favGames.map((g:any)=><GameCard key={g.id} game={g}/>)}</div></>}
        {(tab==='all'||tab==='software') && favSoft.length>0 && <><h2 className="font-semibold mt-6 mb-3">Software</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{favSoft.map((s:any)=><SoftwareCard key={s.id} software={s}/>)}</div></>}
      </>}
    </div>
  )
}
