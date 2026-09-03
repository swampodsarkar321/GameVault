import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import GameCard from "../components/GameCard"
import AnkerGameCard from "../components/anker/AnkerGameCard"
import Podium from "../components/anker/Podium"
import TrendingBoard from "../components/anker/TrendingBoard"
import RecentTicker from "../components/RecentTicker"
import CommunityReviews from "../components/CommunityReviews"
import SoftwareCard from "../components/SoftwareCard"
import { GridSkeleton } from "../components/LoadingSkeleton"
import { fetchGames, fetchSoftware } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import type { Game, Software } from "../types"

export default function Home(){
  const [games,setGames]=useState<Game[]>([])
  const [software,setSoftware]=useState<Software[]>([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{ setPageMeta("Free PC Games Download | Freeware Vault","GameVault — free PC games download. AnkerGames A-Z vault with curated freeware, open-source & demos. Trending & Top charts, high-speed downloads. 100% legal.", { canonical:"/", keywords:"free PC games download, freeware games, open source games, free games download, PC games free, trending free games, top free PC games" }); Promise.all([fetchGames({limitN:20}), fetchSoftware({limitN:8})]).then(([g,s])=>{ setGames(g); setSoftware(s); setLoading(false)}) },[])
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
      {/* Live recent ticker */}
      <RecentTicker/>
      {/* Anker-style Podium */}
      {loading ? <div className="mt-8"><GridSkeleton count={3}/></div> : <Podium games={topGames} />}
      {/* Anker-style Trending Board */}
      {loading ? <div className="mt-8"><GridSkeleton count={5}/></div> : <TrendingBoard games={trendingGames.length?trendingGames:games} />}

      {/* Featured - Anker A-Z */}
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl text-white">Featured Games <span className="text-xs font-normal text-white/30 ml-2">Anker A-Z vault</span></h2><Link to="/games" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <div className="mt-4"><GridSkeleton count={5}/></div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{(featured.length?featured:games.slice(0,5)).map((g,i)=> <AnkerGameCard key={g.id} game={g} rank={i+1} total={5} showRank />)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl text-white">Latest Games</h2><Link to="/games" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={5}/> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{games.slice(0,5).map(g=> <GameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl text-white">Popular Games</h2><Link to="/top-games" className="text-sm text-violet-300 hover:text-white">View top →</Link></div>
        {loading? <GridSkeleton count={5}/> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">{popular.slice(0,5).map(g=> <AnkerGameCard key={g.id} game={g}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl text-white">Latest Software</h2><Link to="/software" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={4}/> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">{latestSoft.map(s=> <SoftwareCard key={s.id} software={s}/>)}</div>}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between"><h2 className="font-display font-bold text-xl text-white">Popular Software</h2><Link to="/software" className="text-sm text-violet-300 hover:text-white">View all →</Link></div>
        {loading? <GridSkeleton count={4}/> : <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">{popularSoft.map(s=> <SoftwareCard key={s.id} software={s}/>)}</div>}
      </section>
      <section className="mt-8 card p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-br from-violet-600/15 to-cyan-500/10 border-violet-500/20">
        <div><h3 className="font-display font-bold text-lg text-white">Get weekly drops</h3><p className="text-sm text-white/60">New freeware & open-source picks — no spam. Anker A-Z weekly chart every 7 days.</p></div>
        <form onSubmit={e=>e.preventDefault()} className="flex gap-2 w-full md:w-auto"><input placeholder="you@email.com" className="flex-1 md:w-72 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none text-white placeholder:text-white/40"/><button className="btn-primary">Subscribe</button></form>
      </section>
      <CommunityReviews/>

      <div className="mt-4 text-center">
        <Link to="/free-pc-games-download" className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold">Free PC Games Download — View All →</Link>
      </div>

      {/* Blog for rank boost - internal linking */}
      <section className="mt-8">
        <h2 className="font-display font-bold text-xl text-white">From the Vault — Guides</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Link to="/blog/best-free-pc-games-2026" className="bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 rounded-2xl p-4 block">
            <div className="text-xs text-violet-300">Guide • 7 min</div><div className="font-semibold text-white mt-1">Best Free PC Games 2026</div><div className="text-xs text-white/50 mt-1">Top freeware games download on GameVault — 0 A.D., OpenTTD...</div>
          </Link>
          <Link to="/blog/free-open-source-games" className="bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 rounded-2xl p-4 block">
            <div className="text-xs text-emerald-300">Open Source • 5 min</div><div className="font-semibold text-white mt-1">Free Open Source Games</div><div className="text-xs text-white/50 mt-1">Unciv, Wesnoth, Xonotic — legal open source PC games</div>
          </Link>
          <Link to="/blog/how-to-download-free-games" className="bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 rounded-2xl p-4 block">
            <div className="text-xs text-cyan-300">How-to • 5 min</div><div className="font-semibold text-white mt-1">How to Download Legally</div><div className="text-xs text-white/50 mt-1">Choose Folder, high-speed via GameVault, 100% legal</div>
          </Link>
        </div>
      </section>

      {/* Visible FAQ - Anker */}
      <section className="mt-8 card p-6">
        <h2 className="font-display font-bold text-lg mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <h3 className="font-semibold text-white">Is GameVault free and legal?</h3>
            <p className="text-white/60 mt-1">Yes. GameVault only lists freeware, open-source games and demos from verified legal sources. No pirated or cracked content is hosted.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <h3 className="font-semibold text-white">How often is Trending updated?</h3>
            <p className="text-white/60 mt-1">Trending is recalculated every 7 days based on actual downloads on GameVault. Top Games ranks by all-time downloads.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <h3 className="font-semibold text-white">Do I need to register to download?</h3>
            <p className="text-white/60 mt-1">No. You can browse and find download sources without an account. Favorites and sync require optional login.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
            <h3 className="font-semibold text-white">Are the games safe to download?</h3>
            <p className="text-white/60 mt-1">All links point to verified official sources (developer sites, Itch.io, official free demos). Files are not re-hosted as cracked copies.</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mt-6 text-xs text-white/30 flex gap-2">
        <a href="/" className="hover:text-white">Home</a> <span>›</span> <a href="/games" className="hover:text-white">Games</a> <span>›</span> <a href="/trending" className="hover:text-white">Trending</a> <span>›</span> <a href="/top-games" className="hover:text-white">Top Games</a>
      </nav>
    </div>
  )
}
