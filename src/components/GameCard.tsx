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
    <div className="group card hover:bg-nexus-cardHover transition overflow-hidden flex flex-col">
      <Link to={`/game/${game.slug}`} className="relative block overflow-hidden">
        <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-[210px] object-cover group-hover:scale-[1.04] transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 flex-wrap opacity-0 group-hover:opacity-100 transition">
          {genre.slice(0,2).map(g=> <span key={g} className="badge backdrop-blur bg-black/40 text-white text-[11px]">{g}</span>)}
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/game/${game.slug}`} className="font-semibold leading-tight line-clamp-1 hover:text-violet-300 transition text-sm">{game.title}</Link>
          <button onClick={()=>toggle(game.id,'game')} aria-label="favorite" className={`w-8 h-8 rounded-full grid place-items-center border shrink-0 transition ${fav?"bg-pink-500/20 border-pink-500/30 text-pink-400":"bg-white/5 border-white/10 text-white/60 hover:text-white"}`}>
            <Heart className={`w-4 h-4 ${fav?"fill-current":""}`} />
          </button>
        </div>
        <div className="text-xs text-white/50 mt-1 line-clamp-1">{genre.join(" • ")}</div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="badge">{game.version}</span>
          <span className="text-white/40">{game.size}</span>
          <Link to={`/game/${game.slug}`} className="ml-auto text-violet-300 hover:text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition">View details →</Link>
        </div>
      </div>
    </div>
  )
}
