import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import type { Software } from "../types"
import { useFavorites } from "../context/FavoritesContext"
export default function SoftwareCard({ software }: { software: Software }){
  const { isFav, toggle } = useFavorites()
  const fav = isFav(software.id)
  return (
    <div className="group card hover:bg-nexus-cardHover transition p-3 flex flex-col">
      <Link to={`/software/${software.slug}`} className="flex gap-3">
        <img src={software.logo || software.coverImage} alt={software.title} loading="lazy" className="w-14 h-14 rounded-xl object-cover bg-white/5 border border-white/10 p-1.5" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm line-clamp-1">{software.title}</div>
          <div className="text-xs text-white/50 line-clamp-1">{software.category} • {software.license}</div>
          <div className="flex items-center gap-2 mt-1 text-xs"><span className="badge">{software.version}</span><span className="text-white/40">{software.size}</span></div>
        </div>
        <button onClick={(e)=>{e.preventDefault(); toggle(software.id,'software')}} className={`self-start w-8 h-8 rounded-full grid place-items-center border ${fav?"bg-pink-500/20 border-pink-500/30 text-pink-400":"bg-white/5 border-white/10 text-white/60"}`}><Heart className={`w-4 h-4 ${fav?"fill-current":""}`} /></button>
      </Link>
      <p className="text-xs text-white/55 line-clamp-2 mt-3 flex-1">{software.shortDescription}</p>
      <Link to={`/software/${software.slug}`} className="text-xs font-medium text-violet-300 hover:text-white mt-2">View details →</Link>
    </div>
  )
}
