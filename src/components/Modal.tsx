import type { ReactNode } from "react"
import { X } from "lucide-react"
export default function Modal({ open, onClose, children, title }: { open:boolean; onClose:()=>void; children:ReactNode; title?:string }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-lg card p-6 max-h-[85vh] overflow-auto">
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 grid place-items-center hover:bg-white/10"><X className="w-4 h-4"/></button>
        {title && <h3 className="font-display font-semibold pr-8">{title}</h3>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
