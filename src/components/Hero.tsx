import { Link } from "react-router-dom"
import { Sparkles, ArrowRight } from "lucide-react"
export default function Hero(){
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-gradient-to-br from-[#0F1424] via-[#101636] to-[#0F1424] p-6 md:p-10 mt-6">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-400/10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-violet-600/20 blur-[90px] rounded-full pointer-events-none" />
      <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1"><Sparkles className="w-3.5 h-3.5"/> PC GAMES • VERIFIED SOURCES • DISCOVER</div>
          <h1 className="font-display font-bold text-[32px] md:text-[48px] leading-[0.95] mt-4">GameVault<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">Discover. Explore. Download.</span></h1>
          <p className="text-white/60 mt-4 max-w-xl leading-relaxed">A simple hub for discovering PC games and finding available download sources in one place.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/games" className="btn-primary px-7">Browse Games <ArrowRight className="w-4 h-4"/></Link>
            <Link to="/software" className="btn-ghost">Explore Software</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=500&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=500&fit=crop",
          ].map((src,i)=> (
            <div key={i} className={`rounded-2xl overflow-hidden border border-white/10 ${i%2===1?'translate-y-4':''}`}>
              <img src={src} alt="" loading="lazy" className="w-full h-[160px] md:h-[180px] object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
