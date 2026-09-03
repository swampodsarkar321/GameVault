import type { Game } from "../../types"
import AnkerGameCard from "./AnkerGameCard"
import { Link } from "react-router-dom"
import { TrendingUp, ArrowUpDown } from "lucide-react"

type Props = { games: Game[]; title?: string; limit?: number }

export default function TrendingBoard({ games, title="Trending Games", limit=8 }: Props){
  const slice = games.slice(0, limit)
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 grid place-items-center"><TrendingUp className="w-5 h-5 text-white"/></div>
        <div>
          <h2 className="font-display font-bold text-xl leading-none flex items-center gap-2">{title} <span className="text-xs font-normal px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">Last 7 days</span></h2>
          <p className="text-xs text-white/40">Ranked by how many times it was <b className="text-white/60">actually downloaded here in the last 7 days</b> • counted on a rolling basis</p>
        </div>
        <Link to="/trending" className="ml-auto hidden sm:inline-flex text-sm text-violet-300 hover:text-white">See trending →</Link>
      </div>

      {/* Filter pills like Anker */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="px-3 py-1.5 rounded-full bg-violet-600 text-white font-semibold">All</span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">New entries</span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">Climbing</span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">Action</span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">Open World</span>
        <span className="ml-auto flex items-center gap-1 text-white/30"><ArrowUpDown className="w-3 h-3"/> Sort: Downloads</span>
      </div>

      <div className="grid gap-3">
        {slice.map((g,i)=> (
          <AnkerGameCard key={g.id} game={g} rank={i+1} total={slice.length} variant="chart"/>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/40 leading-relaxed">
        <b className="text-white/70">How this board works:</b> Every game below is ranked by how many times it was actually downloaded here in the last 7 days. Change shows where it stood a week ago. <Link to="/top-games" className="text-violet-300 hover:text-white">Top Games</Link> ranks by all-time — Trending only cares about last 7 days.
      </div>
    </section>
  )
}
