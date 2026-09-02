import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import GameCard from "../components/GameCard"
import SoftwareCard from "../components/SoftwareCard"
import { GridSkeleton } from "../components/LoadingSkeleton"
import { fetchGames, fetchSoftware } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import type { Game, Software } from "../types"

export default function Home(){
  const [games,setGames]=useState<Game[]>([])
  const [software,setSoftware]=useState<Software[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{ setPageMeta("Home","Browse freeware games & open-source software — GameVault"); Promise.all([fetchGames({limitN:10}), fetchSoftware({limitN:8})]).then(([g,s])=>{ setGames(g); setSoftware(s); setLoading(false)}) },[])
  const featured = games.filter(g=>g.featured)
  const popular = games.filter(g=>g.popular)
  const latestSoft = software.slice(0,4)
  const popularSoft = software.filter(s=>s.popular).slice(0,4)
  return (
    <div className="pb-6">
      <Hero/>
      {/* Featured */}
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl">Featured Games</h2><Link to="/games" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <div className="mt-4"><GridSkeleton count={5}/></div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{(featured.length?featured:games.slice(0,5)).map(g=> <GameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl">Latest Games</h2><Link to="/games" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={5}/> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{games.slice(0,5).map(g=> <GameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl">Popular Games</h2><Link to="/games" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={5}/> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{popular.slice(0,5).map(g=> <GameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl">Latest Software</h2><Link to="/software" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={4}/> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">{latestSoft.map(s=> <SoftwareCard key={s.id} software={s}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl">Popular Software</h2><Link to="/software" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={4}/> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">{popularSoft.map(s=> <SoftwareCard key={s.id} software={s}/>)}</div>}
      </section>
      <section className="mt-8 card p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-br from-violet-600/15 to-cyan-500/10 border-violet-500/20">
        <div><h3 className="font-display font-bold text-lg">Get weekly drops</h3><p className="text-sm text-white/60">New freeware & open-source picks — no spam.</p></div>
        <form onSubmit={e=>e.preventDefault()} className="flex gap-2 w-full md:w-auto"><input placeholder="you@email.com" className="flex-1 md:w-72 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none"/><button className="btn-primary">Subscribe</button></form>
      </section>
    </div>
  )
}
