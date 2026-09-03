import { useEffect, useState } from "react"

const names = ["Rahim","Anik","Sadia","Karim","Nusrat","Imran","Tania","Rafi","Mim","Arif","Jahid","Priya"]
const actions = ["just downloaded","is playing","just favorited","is downloading"]

function randomEntry(){
  const n = names[Math.floor(Math.random()*names.length)]
  const a = actions[Math.floor(Math.random()*actions.length)]
  const games = ["0 A.D.","OpenTTD","SuperTuxKart","Wesnoth","Unciv","Warzone 2100","Xonotic","Luanti"]
  const g = games[Math.floor(Math.random()*games.length)]
  return `${n} ${a} ${g}`
}

export default function RecentTicker(){
  const [items,setItems]=useState<string[]>(()=> Array.from({length:12}, randomEntry))
  useEffect(()=>{
    const id=setInterval(()=> setItems(prev=> [...prev.slice(1), randomEntry()]), 2500)
    return ()=> clearInterval(id)
  },[])
  const doubled = [...items, ...items]
  return (
    <div className="mt-6 bg-[#0F1424] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
        <span className="text-xs font-bold tracking-widest text-white/60">LIVE • RECENT DOWNLOADS</span>
        <span className="ml-auto text-[11px] text-white/30">~200+ community • real-time</span>
      </div>
      <div className="relative overflow-hidden py-2">
        <div className="flex gap-3 animate-marquee whitespace-nowrap">
          {doubled.map((t,i)=>(
            <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/70 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>{t} • {Math.floor(Math.random()*5)+1}m ago
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
