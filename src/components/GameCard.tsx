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
    <div className="group bg-[#1B2838] border border-[#2A475E] hover:border-[#66C0F4]/40 rounded overflow-hidden flex flex-col transition">
      <Link to={`/game/${game.slug}`} className="relative block overflow-hidden">
        <img src={game.coverImage} alt={game.title} loading="lazy" className="w-full h-[210px] object-cover group-hover:scale-[1.04] transition duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 flex-wrap opacity-0 group-hover:opacity-100 transition">
          {genre.slice(0,2).map(g=> <span key={g} className="text-[11px] px-2 py-1 rounded bg-[#1B2838]/80 border border-[#2A475E] text-[#C7D5E0]">{g}</span>)}
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col bg-[#1B2838]">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/game/${game.slug}`} className="font-semibold leading-tight line-clamp-1 hover:text-[#66C0F4] transition text-sm text-[#C7D5E0]">{game.title}</Link>
          <button onClick={()=>toggle(game.id,'game')} aria-label="favorite" className={`w-8 h-8 rounded-full grid place-items-center border shrink-0 transition ${fav?"bg-pink-500/20 border-pink-500/30 text-pink-400":"bg-[#0F1922] border-[#2A475E] text-[#8F98A0] hover:text-white"}`}>
            <Heart className={`w-4 h-4 ${fav?"fill-current":""}`} />
          </button>
        </div>
        <div className="text-xs text-[#8F98A0] mt-1 line-clamp-1">{genre.join(" • ")}</div>
        <div className="flex items-center gap-2 mt-2 text-xs text-[#8F98A0]">
          <span>{game.size}</span>
          <span className="ml-auto text-[#66C0F4] font-bold">Free</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link to={`/game/${game.slug}`} className="py-1.5 rounded bg-[#2A475E] hover:bg-[#1B2838] border border-[#2A475E] text-center text-xs text-[#C7D5E0]">Details</Link>
          <Link to={`/download/${game.id}`} className="py-1.5 rounded bg-[#66C0F4] hover:bg-[#1A9FFF] text-[#171A21] text-center text-xs font-bold">Download</Link>
        </div>
      </div>
    </div>
  )
}
