import { Link } from "react-router-dom"
import { useEffect } from "react"
import { setPageMeta } from "../utils/seo"
export default function FreePCGamesDownload(){
  useEffect(()=> setPageMeta("Free PC Games Download — 100% Legal Freeware | AnkerPlay","Download free PC games — 100% legal freeware & open-source. 0 A.D., OpenTTD, SuperTuxKart & more on AnkerPlay. No pirated content, verified sources.",{ canonical:"/free-pc-games-download", keywords:"free PC games download, download free PC games, free games download, freeware games download"}),[])
  return (
    <div className="py-6 max-w-4xl mx-auto">
      <h1 className="font-display font-bold text-3xl">Free PC Games Download — 100% Legal</h1>
      <p className="text-sm text-white/50 mt-2">Curated freeware, open-source & demos on AnkerPlay — Anker A-Z vault. No pirated re-host.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {[
          { slug:"0-ad", title:"0 A.D.", desc:"Historical RTS — 2.1 GB, GPL" },
          { slug:"openttd", title:"OpenTTD", desc:"Transport tycoon — 28 MB" },
          { slug:"supertuxkart", title:"SuperTuxKart", desc:"Kart racer — 850 MB" },
          { slug:"battle-for-wesnoth", title:"Battle for Wesnoth", desc:"Turn-based — 600 MB" },
          { slug:"unciv", title:"Unciv", desc:"Civ V remake — 35 MB" },
          { slug:"luanti", title:"Luanti", desc:"Voxel sandbox — 70 MB" },
        ].map(g=>(
          <Link key={g.slug} to={`/game/${g.slug}`} className="bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 rounded-2xl p-4 block">
            <div className="font-semibold text-white">{g.title}</div>
            <div className="text-xs text-white/50 mt-1">{g.desc}</div>
            <div className="text-xs text-violet-300 mt-2">Free download →</div>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex gap-2"><Link to="/games" className="btn-primary text-sm">Browse all games</Link><Link to="/blog/best-free-pc-games-2026" className="btn-ghost text-sm">Best 2026 guide</Link></div>
    </div>
  )
}
