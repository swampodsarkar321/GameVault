import { SearchX, Gamepad2, Package } from "lucide-react"
export default function EmptyState({ title, description, icon="search" }: { title:string; description?:string; icon?: "search"|"game"|"package" }){
  const Icon = icon==="game"?Gamepad2: icon==="package"?Package:SearchX
  return (
    <div className="card p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 grid place-items-center mx-auto"><Icon className="w-7 h-7 text-white/40"/></div>
      <h3 className="font-display font-semibold mt-4">{title}</h3>
      {description && <p className="text-sm text-white/50 mt-1 max-w-md mx-auto">{description}</p>}
    </div>
  )
}
