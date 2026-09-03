import { Star } from "lucide-react"

const reviews = [
  { name:"Aarav S.", role:"Strategy fan", text:"AnkerPlay e 0 A.D. peye gelam — direct link, no ads trap. Trending chart e ja dekhay tai sotti.", rating:5 },
  { name:"Mim R.", role:"Indie collector", text:"SuperTuxKart hover te trailer auto-play ta joss — Anker er cheye better lagche.", rating:5 },
  { name:"Jahid K.", role:"Low-end PC", text:"OpenTTD 28MB — amar puran laptop e cholche, download manager e progress dekhte parchi.", rating:4 },
  { name:"Sadia T.", role:"Open-source dev", text:"Luanti mods gulo verified source e — safe feel hoy. Recent ticker e live dekhte valo lage.", rating:5 },
]

export default function CommunityReviews(){
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between">
        <h2 className="font-display font-bold text-xl text-white">Community Reviews <span className="text-xs font-normal text-white/30 ml-2">~200+ verified • 4.8/5</span></h2>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-amber-400/15 border border-amber-400/20 text-amber-300 px-2.5 py-1 rounded-full"><Star className="w-3 h-3 fill-amber-400"/> 4.8/5</span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {reviews.map((r,i)=>(
          <div key={i} className="bg-[#0F1424] border border-white/[0.06] rounded-2xl p-4 card-shimmer">
            <div className="flex gap-1 text-amber-400">
              {Array.from({length:r.rating}).map((_,j)=><Star key={j} className="w-3.5 h-3.5 fill-amber-400"/>)}
            </div>
            <p className="text-sm text-white/80 mt-2 leading-relaxed">“{r.text}”</p>
            <div className="text-xs text-white/40 mt-3">{r.name} • {r.role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
