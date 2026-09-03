import { Link, useNavigate } from "react-router-dom"
import { Sparkles, ArrowRight, Search, TrendingUp, Flame } from "lucide-react"
import { useState, useEffect } from "react"
import { useLiveCount, LiveBadge } from "./LivePulse"
export default function Hero(){
  const [q,setQ]=useState("")
  const nav=useNavigate()
  const { count, pulse } = useLiveCount(12)
  const [parallax,setParallax]=useState(0)
  useEffect(()=>{
    const onScroll=()=> setParallax(window.scrollY*0.08)
    window.addEventListener("scroll", onScroll)
    return ()=> window.removeEventListener("scroll", onScroll)
  },[])
  const onSearch=(e:React.FormEvent)=>{e.preventDefault(); if(q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`)}
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-gradient-to-br from-[#0F1424] via-[#101636] to-[#0F1424] p-6 md:p-10 mt-6">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-400/10 pointer-events-none" style={{transform:`translateY(${parallax*0.5}px)`}}/>
      <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-violet-600/20 blur-[90px] rounded-full pointer-events-none" style={{transform:`translateY(${parallax}px)`}}/>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-t from-violet-600/10 to-transparent pointer-events-none" />
      <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1"><Sparkles className="w-3.5 h-3.5"/> ANKER VAULT • VERIFIED • FREEWARE ONLY</div>
          <h1 className="font-display font-bold text-[30px] md:text-[46px] leading-[0.95] mt-4 text-white">AnkerPlay<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">Discover. Explore. Download.</span></h1>
          <p className="text-white/60 mt-3 max-w-xl leading-relaxed text-sm md:text-[15px]">AnkerGames A-Z vault — curated freeware & open-source, fast verified sources. No pirated content. Trending 7-day chart + Top all-time.</p>
          <form onSubmit={onSearch} className="mt-6 flex items-center gap-2 bg-white/[0.07] border border-white/10 rounded-2xl p-2 max-w-xl focus-within:border-violet-500/50 focus-within:bg-white/[0.09] transition">
            <div className="pl-3"><Search className="w-5 h-5 text-white/40"/></div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search GTA V, Valorant, 0 A.D..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/35 py-2 text-white" />
            <button className="btn-primary rounded-xl px-5 py-2.5 text-sm shrink-0">Search</button>
          </form>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="text-white/35">Trending:</span>
            {["GTA V","Elden Ring","Minecraft","Valorant"].map(k=>(
              <Link key={k} to={`/search?q=${k}`} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-white/60 transition">{k}</Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/trending" className="btn-primary px-6"><TrendingUp className="w-4 h-4"/> Trending</Link>
            <Link to="/top-games" className="btn-ghost"><Flame className="w-4 h-4"/> Top Games</Link>
            <Link to="/games" className="btn-ghost">Browse <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="flex flex-wrap gap-6 mt-6 text-xs items-center">
            <div><div className="font-bold text-white text-lg leading-none">55K+</div><div className="text-white/40">verified downloads</div></div>
            <div className="w-px bg-white/10 hidden sm:block"/><div><div className="font-bold text-white text-lg leading-none">1.2K+</div><div className="text-white/40">freeware titles</div></div>
            <div className="w-px bg-white/10 hidden sm:block"/><div><div className="font-bold text-white text-lg leading-none">100%</div><div className="text-white/40">legal & safe</div></div>
            <div className="w-px bg-white/10 hidden sm:block"/><LiveBadge count={count} pulse={pulse}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=500&fit=crop",
          ].map((src,i)=> (
            <div key={i} className={`relative rounded-2xl overflow-hidden border border-white/10 ${i%2===1?'translate-y-4':''} group`}>
              <img src={src} alt="" loading="lazy" className="w-full h-[160px] md:h-[180px] object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"/>
              <div className="absolute bottom-2 left-2 text-[10px] font-bold tracking-widest bg-black/50 backdrop-blur px-2 py-1 rounded-full border border-white/10 text-white/80">VERIFIED</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
