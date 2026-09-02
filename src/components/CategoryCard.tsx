import { Link } from "react-router-dom"
import { Gamepad2, AppWindow, Shield, Image as Img, Music, Code2, Box, FileText, HardDrive } from "lucide-react"
const iconMap: Record<string, any> = { Action:Gamepad2, Adventure:Gamepad2, RPG:Gamepad2, Strategy:Gamepad2, Development:Code2, Graphics:Img, Audio:Music, Security:Shield, Utility:HardDrive, Office:FileText, Browser:AppWindow, Compression:Box, Multimedia:AppWindow, "Video Editing":Img }
export default function CategoryCard({ name, slug, count }: { name:string; slug:string; count?:number }){
  const Icon = iconMap[name] || Gamepad2
  return (
    <Link to={`/category/${slug}`} className="group card p-4 flex items-center gap-3 hover:bg-white/[0.06] transition">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/30 to-cyan-400/20 border border-white/10 grid place-items-center group-hover:from-violet-600/40 transition"><Icon className="w-5 h-5 text-white/80"/></div>
      <div className="min-w-0"><div className="font-semibold text-sm">{name}</div><div className="text-xs text-white/50">{count ?? Math.floor(Math.random()*40+5)} items</div></div>
      <span className="ml-auto text-white/30 group-hover:text-white">→</span>
    </Link>
  )
}
