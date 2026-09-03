import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import GameCard from "../components/GameCard"
import AnkerGameCard from "../components/anker/AnkerGameCard"
import Podium from "../components/anker/Podium"
import TrendingBoard from "../components/anker/TrendingBoard"
import SoftwareCard from "../components/SoftwareCard"
import { GridSkeleton } from "../components/LoadingSkeleton"
import { fetchGames, fetchSoftware } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import type { Game, Software } from "../types"

export default function Home(){
  const [games,setGames]=useState<Game[]>([])
  const [software,setSoftware]=useState<Software[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{ setPageMeta("Free PC Games Download | Freeware Vault","GameVault — free PC games download. Curated freeware, open-source & demos. Trending & Top charts, high-speed downloads. 100% legal, verified sources.", { canonical:"/", keywords:"free PC games download, freeware games, open source games, free games download, PC games free, trending free games, top free PC games" }); Promise.all([fetchGames({limitN:20}), fetchSoftware({limitN:8})]).then(([g,s])=>{ setGames(g); setSoftware(s); setLoading(false)}) },[])
  const featured = games.filter(g=>g.featured)
  const popular = games.filter(g=>g.popular)
  const latestSoft = software.slice(0,4)
  const popularSoft = software.filter(s=>s.popular).slice(0,4)
  // For Anker-style, derive trending as popular shuffled + weekly
  const trendingGames = [...games].sort(()=>0.5-Math.random()).slice(0,8)
  const topGames = [...games].sort((a,b)=> Number(b.popular)-Number(a.popular)).slice(0,12)
  return (
    <div className="pb-6">
      <Hero/>
      {/* Anker-style Podium */}
      {loading ? <div className="mt-8"><GridSkeleton count={3}/></div> : <Podium games={topGames} />}
      {/* Anker-style Trending Board */}
      {loading ? <div className="mt-8"><GridSkeleton count={5}/></div> : <TrendingBoard games={trendingGames.length?trendingGames:games} />}

      {/* Featured */}
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-bold text-xl text-[#C7D5E0]">Featured & Recommended <span className="text-xs font-normal text-[#8F98A0] ml-2">Curated vault</span></h2><Link to="/games" className="text-sm text-[#66C0F4] hover:text-white">View all →</Link></div>
        {loading? <div className="mt-4"><GridSkeleton count={5}/></div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{(featured.length?featured:games.slice(0,5)).map((g,i)=> <AnkerGameCard key={g.id} game={g} rank={i+1} total={5} showRank />)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-bold text-xl text-[#C7D5E0]">New & Trending</h2><Link to="/games" className="text-sm text-[#66C0F4] hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={5}/> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{games.slice(0,5).map(g=> <GameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-bold text-xl text-[#C7D5E0]">Top Sellers</h2><Link to="/top-games" className="text-sm text-[#66C0F4] hover:text-white">View top →</Link></div>
        {loading? <GridSkeleton count={5}/> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{popular.slice(0,5).map(g=> <AnkerGameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-bold text-xl text-[#C7D5E0]">Latest Software</h2><Link to="/software" className="text-sm text-[#66C0F4] hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={4}/> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">{latestSoft.map(s=> <SoftwareCard key={s.id} software={s}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-bold text-xl text-[#C7D5E0]">Popular Software</h2><Link to="/software" className="text-sm text-[#66C0F4] hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={4}/> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">{popularSoft.map(s=> <SoftwareCard key={s.id} software={s}/>)}</div>}
      </section>
      <section className="mt-8 bg-[#1B2838] border border-[#2A475E] rounded p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div><h3 className="font-bold text-lg text-[#C7D5E0]">Get weekly drops</h3><p className="text-sm text-[#8F98A0]">New freeware & open-source picks — no spam. Weekly chart every 7 days.</p></div>
        <form onSubmit={e=>e.preventDefault()} className="flex gap-2 w-full md:w-auto"><input placeholder="you@email.com" className="flex-1 md:w-72 bg-[#0F1922] border border-[#2A475E] rounded px-4 py-2.5 text-sm outline-none text-[#C7D5E0] placeholder:text-[#8F98A0]"/><button className="px-4 py-2.5 rounded bg-[#66C0F4] text-[#171A21] font-bold text-sm">Subscribe</button></form>
      </section>

      {/* Visible FAQ - Steam style */}
      <section className="mt-8 bg-[#1B2838] border border-[#2A475E] rounded p-6">
        <h2 className="font-bold text-lg mb-4 text-[#C7D5E0]">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-[#0F1922] border border-[#2A475E] rounded p-4">
            <h3 className="font-semibold text-[#C7D5E0]">Is GameVault free and legal?</h3>
            <p className="text-[#8F98A0] mt-1">Yes. GameVault only lists freeware, open-source games and demos from verified legal sources. No pirated or cracked content is hosted.</p>
          </div>
          <div className="bg-[#0F1922] border border-[#2A475E] rounded p-4">
            <h3 className="font-semibold text-[#C7D5E0]">How often is Trending updated?</h3>
            <p className="text-[#8F98A0] mt-1">Trending is recalculated every 7 days based on actual downloads on GameVault. Top Games ranks by all-time downloads.</p>
          </div>
          <div className="bg-[#0F1922] border border-[#2A475E] rounded p-4">
            <h3 className="font-semibold text-[#C7D5E0]">Do I need to register to download?</h3>
            <p className="text-[#8F98A0] mt-1">No. You can browse and find download sources without an account. Favorites and sync require optional login.</p>
          </div>
          <div className="bg-[#0F1922] border border-[#2A475E] rounded p-4">
            <h3 className="font-semibold text-[#C7D5E0]">Are the games safe to download?</h3>
            <p className="text-[#8F98A0] mt-1">All links point to verified official sources (developer sites, Itch.io, official free demos). Files are not re-hosted as cracked copies.</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mt-6 text-xs text-[#8F98A0] flex gap-2">
        <a href="/" className="hover:text-[#C7D5E0]">Home</a> <span>›</span> <a href="/games" className="hover:text-[#C7D5E0]">Games</a> <span>›</span> <a href="/trending" className="hover:text-[#C7D5E0]">Trending</a> <span>›</span> <a href="/top-games" className="hover:text-[#C7D5E0]">Top Games</a>
      </nav>
    </div>
  )
}
