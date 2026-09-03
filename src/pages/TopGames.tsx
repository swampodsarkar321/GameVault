import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchGames } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import AnkerGameCard from "../components/anker/AnkerGameCard"
import Podium from "../components/anker/Podium"
import { GridSkeleton } from "../components/LoadingSkeleton"
import type { Game } from "../types"
import { Crown } from "lucide-react"

export default function TopGames(){
  const [games,setGames]=useState<Game[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    setPageMeta("Top Games – Most Downloaded Free PC Games All-Time","Top free PC games ranked by all-time downloads. Discover the most popular freeware & open-source PC games on AnkerPlay — Anker-style podium & chart.", { canonical:"/top-games", keywords:"top games, most downloaded games, best free PC games, popular freeware games, top free PC games download"})
    fetchGames({limitN:30}).then(g=>{
      const sorted=[...g].sort((a,b)=> Number(b.popular)-Number(a.popular) || a.title.localeCompare(b.title))
      setGames(sorted)
      setLoading(false)
    })
  },[])
  return (
    <div className="py-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 grid place-items-center"><Crown className="w-5 h-5 text-white"/></div>
        <div>
          <h1 className="font-display font-bold text-2xl leading-none">Top Games</h1>
          <p className="text-sm text-white/50">All-time most downloaded • Bars scaled to #1 • Legendary 500K+ club</p>
        </div>
        <Link to="/trending" className="ml-auto hidden sm:inline-flex btn-ghost text-sm">Trending 7 days →</Link>
      </div>
      {loading ? <div className="mt-6"><GridSkeleton count={6}/></div> : (
        <>
          <Podium games={games.slice(0,3)} />
          <div className="mt-8">
            <h2 className="font-display font-bold text-xl mb-3">The Chart <span className="text-xs font-normal text-white/30">Ranks 4+ • bars scaled to #1</span></h2>
            <div className="grid gap-3">
              {games.slice(3).map((g,i)=><AnkerGameCard key={g.id} game={g} rank={i+4} total={games.length} variant="chart"/>)}
            </div>
          </div>
        </>
      )}
      <div className="mt-6 text-xs text-white/30">Top Games ranks by all-time downloads — Trending ranks by last 7 days. New entries are games that just added to the vault.</div>
    </div>
  )
}
