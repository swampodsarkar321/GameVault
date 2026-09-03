import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import type { Game } from "../types"
import { useFavorites } from "../context/FavoritesContext"
function arr(v: any): string[] { if (!v) return []; if (Array.isArray(v)) return v; if (typeof v === "string") return [v]; return Object.values(v) as string[] }
export default function GameCard({ game }: { game: Game }){
  const { isFav, toggle } = useFavorites()
  const fav = isFav(game.id)
  const genre = arr((game as any).genre)
  return (
    <div className="group bg-[#0F1424] border border-white/[0.06] hover:border-violet-500/30 hover:bg-[#141B31] rounded-2xl overflow-hidden flex flex-col transition card-shimmer">
      <Link to={`/game/${game.slug}`} className="relative block overflow-hidden">
        {game.trailer ? (
          <>
            <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-[210px] object-cover group-hover:opacity-0 transition duration-300" />
            <video src={game.trailer} muted loop autoPlay playsInline className="absolute inset-0 w-full h-[210px] object-cover opacity-0 group-hover:opacity-100 transition duration-300" />
          </>
        ) : (
          <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-[210px] object-cover group-hover:scale-[1.04] transition duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 flex-wrap opacity-0 group-hover:opacity-100 transition">
          {genre.slice(0,2).map(g=> <span key={g} className="text-[11px] px-2 py-1 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white">{g}</span>)}
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/game/${game.slug}`} className="font-semibold leading-tight line-clamp-1 hover:text-violet-300 transition text-sm text-white">{game.title}</Link>
          <button onClick={()=>toggle(game.id,'game')} aria-label="favorite" className={`w-8 h-8 rounded-full grid place-items-center border shrink-0 transition ${fav?"bg-pink-500/20 border-pink-500/30 text-pink-400":"bg-white/5 border-white/10 text-white/60 hover:text-white"}`}>
            <Heart className={`w-4 h-4 ${fav?"fill-current":""}`} />
          </button>
        </div>
        <div className="text-xs text-white/50 mt-1 line-clamp-1">{genre.join(" • ")}</div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="text-white/40">{game.size}</span>
          <span className="ml-auto text-emerald-300 font-bold">Free</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link to={`/game/${game.slug}`} className="py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-center text-xs font-medium text-white">Details</Link>
          <Link to={`/download/${game.id}`} className="py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-center text-xs font-semibold">Download</Link>
        </div>
      </div>
    </div>
  )
}
