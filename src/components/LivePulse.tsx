import { useEffect, useState } from "react"
import { Activity } from "lucide-react"

export function useLiveCount(base=12){
  const [count,setCount]=useState(base)
  const [pulse,setPulse]=useState(false)
  useEffect(()=>{
    const id=setInterval(()=>{
      setCount(c=> Math.max(3, c + Math.floor(Math.random()*5)-2))
      setPulse(true)
      setTimeout(()=>setPulse(false), 800)
    }, 3000)
    return ()=> clearInterval(id)
  },[])
  return { count, pulse }
}

export function LiveBadge({ count,pulse }:{count:number,pulse:boolean}){
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${pulse?"bg-emerald-500 text-white border-emerald-400 scale-105":"bg-emerald-500/15 text-emerald-300 border-emerald-500/20"} transition`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${pulse?"":"hidden"}`}></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
      {count} downloading now
    </span>
  )
}

export function TrendingPulse(){
  const [tick,setTick]=useState(0)
  useEffect(()=>{
    const id=setInterval(()=> setTick(t=>t+1), 30000)
    return ()=> clearInterval(id)
  },[])
  return (
    <span key={tick} className="inline-flex items-center gap-1 text-[11px] text-white/40">
      <Activity className={`w-3 h-3 ${tick%2===0?"text-emerald-400 animate-pulse":"text-white/20"}`}/> auto-refresh • pulse {tick}
    </span>
  )
}
