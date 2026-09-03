import { Link } from "react-router-dom"
import { useEffect } from "react"
import { setPageMeta } from "../../utils/seo"
export default function FreeOpenSourceGames(){
  useEffect(()=> setPageMeta("Free Open Source Games for PC Download — AnkerPlay","Free open source games for PC download on AnkerPlay — Unciv, Wesnoth, Xonotic & more. 100% legal freeware, verified sources.",{ canonical:"/blog/free-open-source-games", keywords:"free open source games, open source games download, free open source PC games"}),[])
  return (
    <div className="py-6 max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-white/60 hover:text-white">← Home</Link>
      <h1 className="font-display font-bold text-3xl mt-3">Free Open Source Games for PC Download</h1>
      <p className="text-sm text-white/40 mt-1">AnkerPlay • open source • verified</p>
      <div className="prose prose-invert max-w-none mt-6 text-sm leading-relaxed text-white/70">
        <p><b className="text-white">Free open source games</b> are the safest way to get <b className="text-white">free PC games download</b> without piracy. AnkerPlay lists only GPL/MIT titles with official mirrors.</p>
        <h2 className="text-white font-semibold mt-6">Top Open Source Picks</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><Link to="/game/unciv" className="text-violet-300">Unciv</Link> — Civ V remake, 35 MB, MIT, Android/PC</li>
          <li><Link to="/game/battle-for-wesnoth" className="text-violet-300">Battle for Wesnoth</Link> — 17 campaigns, GPL-2.0</li>
          <li><Link to="/game/xonotic" className="text-violet-300">Xonotic</Link> — arena FPS, DarkPlaces engine</li>
          <li><Link to="/game/luanti" className="text-violet-300">Luanti (Minetest)</Link> — voxel sandbox, 1000+ mods</li>
        </ul>
        <p>All are on <Link to="/games" className="text-violet-300">AnkerPlay games</Link> with Trending and Top charts. See also <Link to="/blog/best-free-pc-games-2026" className="text-violet-300">Best Free PC Games 2026</Link>.</p>
      </div>
    </div>
  )
}
