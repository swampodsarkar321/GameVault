import { Link } from "react-router-dom"
import type { Game } from "../../types"
import { getAnkerStats, formatDownloads } from "../../utils/ankerStats"
import { Crown, Download } from "lucide-react"

export default function Podium({ games }: { games: Game[] }){
  const top3 = games.slice(0,3)
  if(top3.length===0) return null
  // Anker style: #1 large center, #2 left, #3 right? We'll do 3 columns with #1 highlighted
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 grid place-items-center"><Crown className="w-5 h-5 text-white"/></div>
        <div>
          <h2 className="font-display font-bold text-xl leading-none">The Podium</h2>
          <p className="text-xs text-white/40">Top 3 all-time — bars scaled to #1</p>
        </div>
        <Link to="/top-games" className="ml-auto text-sm text-violet-300 hover:text-white">View top →</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {top3.map((g,i)=>{
          const rank=i+1
          const stats=getAnkerStats(g, rank, top3.length)
          const isFirst=rank===1
          return (
            <Link key={g.id} to={`/game/${g.slug}`} className={`group relative overflow-hidden rounded-[20px] border ${isFirst?"border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-[#0F1424] to-[#0F1424]":"border-white/[0.06] bg-[#0F1424]"} p-4 hover:border-violet-500/30 transition`}>
              {isFirst && <div className="absolute top-3 right-3 text-[10px] font-black tracking-widest bg-amber-400 text-black px-2.5 py-1 rounded-full">REIGNING CHAMPION</div>}
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-white/5">
                  <img src={g.coverImage} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold tracking-widest text-white/30">0{rank} • {g.genre?.[0] || "Action"} • {new Date(g.releaseDate).getFullYear() || 2023}</div>
                  <div className="font-bold leading-tight line-clamp-2 group-hover:text-violet-300">{g.title}</div>
                  <div className="text-xs text-white/40 mt-1">{formatDownloads(stats.allTimeDownloads)} all-time • <span className="text-white/60">{stats.weeklyDownloads.toLocaleString()} this week</span></div>
                  <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{width: `${stats.heat}%`}}/>
                  </div>
                  <div className="text-[11px] text-white/30 mt-1">{stats.sizeGB} • {formatDownloads(stats.allTimeDownloads)} / 55.5M = {(stats.allTimeDownloads/55500000*100).toFixed(1)}%</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="flex-1 py-2 rounded-xl bg-violet-600 group-hover:bg-violet-500 text-white text-sm font-semibold text-center flex items-center justify-center gap-1.5"><Download className="w-4 h-4"/>Download</span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">Details</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
