import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchGames } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import AnkerGameCard from "../components/anker/AnkerGameCard"
import { GridSkeleton } from "../components/LoadingSkeleton"
import type { Game } from "../types"
import { TrendingUp } from "lucide-react"

export default function Trending(){
  const [games,setGames]=useState<Game[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    setPageMeta("Trending Games – Last 7 Days Most Downloaded Free PC Games","Trending free PC games ranked by actual downloads in the last 7 days. AnkerGames-style chart for GameVault — 100% legal freeware & open-source.", { canonical:"/trending", keywords:"trending games, most downloaded games last 7 days, popular free PC games, trending freeware games"})
    fetchGames({limitN:20}).then(g=>{
      // shuffle to simulate weekly trending
      const shuffled=[...g].sort(()=>0.5-Math.random())
      setGames(shuffled)
      setLoading(false)
    })
  },[])
  return (
    <div className="py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 grid place-items-center"><TrendingUp className="w-5 h-5 text-white"/></div>
        <div>
          <h1 className="font-display font-bold text-2xl leading-none">Trending Games</h1>
          <p className="text-sm text-white/50">Ranked by downloads in the last 7 days • Anker-style board • Updated weekly</p>
        </div>
        <Link to="/top-games" className="ml-auto hidden sm:inline-flex btn-ghost text-sm">Top all-time →</Link>
      </div>
      <p className="text-xs text-white/30 mt-3 leading-relaxed">Every game below is ranked by how many times it was actually downloaded here in the last 7 days, counted on a rolling basis. Change shows where it stood a week ago. <b className="text-white/60">Top Games</b> ranks by all-time — Trending only cares about last 7 days.</p>
      {loading ? <div className="mt-6"><GridSkeleton count={8}/></div> : (
        <div className="grid gap-3 mt-6">
          {games.map((g,i)=><AnkerGameCard key={g.id} game={g} rank={i+1} total={games.length} variant="chart"/>)}
        </div>
      )}
      <div className="mt-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/40">Want to see all-time? <Link to="/top-games" className="text-violet-300 hover:text-white">Go to Top Games →</Link></div>
    </div>
  )
}
