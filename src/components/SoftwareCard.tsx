import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import type { Software } from "../types"
import { useFavorites } from "../context/FavoritesContext"
export default function SoftwareCard({ software }: { software: Software }){
  const { isFav, toggle } = useFavorites()
  const fav = isFav(software.id)
  return (
    <div className="group bg-[#1B2838] border border-[#2A475E] hover:border-[#66C0F4]/30 rounded p-3 flex flex-col transition">
      <Link to={`/software/${software.slug}`} className="flex gap-3">
        <img src={software.logo || software.coverImage} alt={software.title} loading="lazy" className="w-14 h-14 rounded object-cover bg-[#0F1922] border border-[#2A475E] p-1" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm line-clamp-1 text-[#C7D5E0]">{software.title}</div>
          <div className="text-xs text-[#8F98A0] line-clamp-1">{software.category} • {software.license}</div>
          <div className="flex items-center gap-2 mt-1 text-xs"><span className="px-2 py-0.5 rounded bg-[#2A475E] text-[#8F98A0] border border-[#2A475E]">{software.version}</span><span className="text-[#8F98A0]">{software.size}</span></div>
        </div>
        <button onClick={(e)=>{e.preventDefault(); toggle(software.id,'software')}} className={`self-start w-8 h-8 rounded-full grid place-items-center border ${fav?"bg-pink-500/20 border-pink-500/30 text-pink-400":"bg-[#0F1922] border-[#2A475E] text-[#8F98A0] hover:text-white"}`}><Heart className={`w-4 h-4 ${fav?"fill-current":""}`} /></button>
      </Link>
      <p className="text-xs text-[#8F98A0] line-clamp-2 mt-3 flex-1">{software.shortDescription}</p>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Link to={`/software/${software.slug}`} className="py-2 rounded bg-[#2A475E] hover:bg-[#1B2838] border border-[#2A475E] text-center text-xs text-[#C7D5E0]">Details</Link>
        <Link to={`/download/${software.id}`} className="py-2 rounded bg-[#66C0F4] hover:bg-[#1A9FFF] text-[#171A21] text-center text-xs font-bold flex items-center justify-center gap-1">Download</Link>
      </div>
    </div>
  )
}
