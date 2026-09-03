import { Link, useNavigate } from "react-router-dom"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const featured = [
  { title:"0 A.D. — Free RTS", img:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=616&h=353&fit=crop", tags:["Freeware","Strategy","Open Source"], desc:"Historical RTS by Wildfire Games — build cities, train armies, 300–500 BC. No microtransactions, verified via play0ad.com." },
  { title:"OpenTTD", img:"https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=616&h=353&fit=crop", tags:["Freeware","Simulation"], desc:"Open-source Transport Tycoon — rail, road, air & sea networks, 1000+ mods, GPL-2.0." },
  { title:"SuperTuxKart", img:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=616&h=353&fit=crop", tags:["Racing","Freeware"], desc:"Kart racer with 30+ tracks, online 8-player, GPL-3.0 — no ads." },
]

export default function Hero(){
  const [q,setQ]=useState("")
  const [idx,setIdx]=useState(0)
  const nav=useNavigate()
  const onSearch=(e:React.FormEvent)=>{e.preventDefault(); if(q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`)}
  const cur = featured[idx]
  return (
    <section className="mt-6">
      {/* Steam-like category tabs */}
      <div className="flex gap-2 text-sm overflow-x-auto pb-2">
        <span className="px-4 py-1.5 rounded bg-[#66C0F4] text-[#171A21] font-bold">Featured & Recommended</span>
        <Link to="/trending" className="px-4 py-1.5 rounded bg-[#2A475E] text-[#C7D5E0] hover:bg-[#1B2838] border border-[#2A475E]">Trending</Link>
        <Link to="/top-games" className="px-4 py-1.5 rounded bg-[#2A475E] text-[#C7D5E0] hover:bg-[#1B2838] border border-[#2A475E]">Top Sellers</Link>
        <Link to="/games" className="px-4 py-1.5 rounded bg-[#2A475E] text-[#C7D5E0] hover:bg-[#1B2838] border border-[#2A475E]">New & Trending</Link>
      </div>

      {/* Steam capsule — main image + info */}
      <div className="mt-3 bg-[#1B2838] border border-[#2A475E] rounded overflow-hidden">
        <div className="grid lg:grid-cols-[616px_1fr] gap-0">
          <div className="relative bg-black">
            <img src={cur.img} alt={cur.title} className="w-full h-[353px] object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"/>
            <button onClick={()=>setIdx((idx-1+featured.length)%featured.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/80 border border-white/10 grid place-items-center text-white"><ChevronLeft className="w-5 h-5"/></button>
            <button onClick={()=>setIdx((idx+1)%featured.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/80 border border-white/10 grid place-items-center text-white"><ChevronRight className="w-5 h-5"/></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {featured.map((_,i)=> <span key={i} className={`w-6 h-1.5 rounded-full ${i===idx?"bg-white":"bg-white/30"}`}/>)}
            </div>
          </div>
          <div className="p-4 bg-[#1B2838] flex flex-col">
            <h1 className="font-bold text-xl text-white leading-tight">{cur.title}</h1>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=162&h=69&fit=crop",
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=162&h=69&fit=crop",
                "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=162&h=69&fit=crop",
                "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=162&h=69&fit=crop",
              ].map((s,i)=><img key={i} src={s} alt="" className="w-full h-[69px] object-cover rounded border border-[#2A475E]"/>)}
            </div>
            <p className="text-sm text-[#8F98A0] mt-3 leading-relaxed line-clamp-3">{cur.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {cur.tags.map(t=> <span key={t} className="text-xs px-2 py-1 rounded bg-[#2A475E] text-[#C7D5E0] border border-[#2A475E]">{t}</span>)}
              <span className="text-xs px-2 py-1 rounded bg-[#66C0F4]/20 text-[#66C0F4] border border-[#66C0F4]/30">100% Legal</span>
            </div>
            <div className="mt-auto flex items-center gap-3 pt-4">
              <span className="px-3 py-1.5 rounded bg-[#4C6B22] text-white font-bold text-sm">Free to Play</span>
              <Link to="/games" className="ml-auto px-4 py-1.5 rounded bg-[#66C0F4] hover:bg-[#1A9FFF] text-[#171A21] font-bold text-sm">Browse</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Steam search bar below capsule */}
      <form onSubmit={onSearch} className="mt-3 flex items-center gap-2 bg-[#1B2838] border border-[#2A475E] rounded p-1.5 max-w-xl">
        <Search className="w-4 h-4 text-[#8F98A0] ml-2"/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search GTA V, Valorant, 0 A.D..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#8F98A0] py-1.5 text-[#C7D5E0]"/>
        <button className="px-4 py-1.5 rounded bg-[#66C0F4] hover:bg-[#1A9FFF] text-[#171A21] font-bold text-sm">Search</button>
      </form>
    </section>
  )
}
