import { Link } from "react-router-dom"
import { Download, Eye, HardDrive, ArrowUp, ArrowDown, Minus } from "lucide-react"
import type { Game } from "../../types"
import { getAnkerStats, formatDownloads } from "../../utils/ankerStats"

type Props = { game: Game; rank?: number; total?: number; showRank?: boolean; variant?: "grid" | "chart" }

export default function AnkerGameCard({ game, rank, total, showRank, variant="grid" }: Props){
  const stats = rank && total ? getAnkerStats(game, rank, total) : null
  const genre = Array.isArray(game.genre) ? game.genre.slice(0,2).join(" • ") : (game.genre as any)
  if(variant==="chart" && rank){
    const change = stats?.change ?? 0
    const changeColor = change>0 ? "text-emerald-400" : change<0 ? "text-red-400" : "text-white/30"
    const changeIcon = change>0 ? <ArrowUp className="w-3 h-3"/> : change<0 ? <ArrowDown className="w-3 h-3"/> : <Minus className="w-3 h-3"/>
    return (
      <div className="group flex items-center gap-3 p-3 rounded-2xl bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 hover:bg-[#141B31] transition">
        <div className="text-center w-10 shrink-0">
          <div className="font-display font-bold text-lg leading-none text-white">{String(rank).padStart(2,"0")}</div>
          {stats && (
            <div className={`flex items-center justify-center gap-0.5 text-[11px] font-bold ${changeColor}`}>
              {changeIcon} <span>{change===0?"—":Math.abs(change)}</span>
            </div>
          )}
        </div>
        <Link to={`/game/${game.slug}`} className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10">
          <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/game/${game.slug}`} className="font-semibold text-sm leading-tight line-clamp-1 hover:text-violet-300 text-white">{game.title}</Link>
          <div className="text-xs text-white/40 line-clamp-1">{genre} • {new Date(game.releaseDate).getFullYear() || "2024"}</div>
          <div className="mt-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" style={{width: `${stats?.heat ?? 40}%`}}/>
          </div>
        </div>
        <div className="text-right shrink-0 hidden sm:block w-[110px]">
          <div className="text-sm font-bold leading-none text-white">{stats ? formatDownloads(stats.weeklyDownloads) : game.size}</div>
          <div className="text-[11px] text-white/40">this week</div>
          <div className="text-[11px] text-white/30 flex items-center justify-end gap-1"><HardDrive className="w-3 h-3"/>{stats?.sizeGB ?? game.size}</div>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link to={`/game/${game.slug}`} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"><Eye className="w-4 h-4"/></Link>
          <Link to={`/download/${game.id}`} className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center gap-1.5"><Download className="w-4 h-4"/>Download</Link>
        </div>
      </div>
    )
  }

  // Grid card - Anker A-Z: cover top, then title, meta, size, two buttons
  return (
    <div className="group bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 hover:bg-[#141B31] rounded-2xl overflow-hidden transition flex flex-col">
      <Link to={`/game/${game.slug}`} className="relative block overflow-hidden">
        {showRank && rank && (
          <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-black/70 backdrop-blur border border-white/15 grid place-items-center text-xs font-bold text-white">
            {String(rank).padStart(2,"0")}
          </div>
        )}
        <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-[190px] object-cover group-hover:scale-[1.03] transition duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"/>
        <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 flex-wrap">
          {Array.isArray(game.genre) && game.genre.slice(0,2).map(g=> <span key={g} className="text-[10px] font-bold tracking-widest px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/80">{g}</span>)}
        </div>
        {stats && (
          <div className="absolute top-2 right-2 text-[10px] font-bold bg-violet-600 text-white px-2 py-1 rounded-full">{formatDownloads(stats.allTimeDownloads)} DL</div>
        )}
      </Link>
      <div className="p-3 flex-1 flex flex-col">
        <Link to={`/game/${game.slug}`} className="font-semibold leading-tight line-clamp-2 hover:text-violet-300 text-sm min-h-[40px] text-white">{game.title}</Link>
        <div className="text-xs text-white/40 mt-1">{genre}</div>
        <div className="flex items-center gap-2 mt-2 text-xs text-white/30">
          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3"/>{stats?.sizeGB ?? game.size}</span>
          <span className="ml-auto text-white/20">{new Date(game.releaseDate).getFullYear() || ""}</span>
        </div>
        {stats && (
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{width: `${stats.heat}%`}}/>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link to={`/game/${game.slug}`} className="py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-center text-sm font-medium text-white">Details</Link>
          <Link to={`/download/${game.id}`} className="py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-center text-sm font-semibold flex items-center justify-center gap-1"><Download className="w-3.5 h-3.5"/>Download</Link>
        </div>
      </div>
    </div>
  )
}
