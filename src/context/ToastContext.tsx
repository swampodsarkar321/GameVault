import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
type Toast = { id: string; message: string; type: "success"|"error"|"info" }
const Ctx = createContext<{ toasts: Toast[]; push: (m:string,t?:Toast["type"])=>void; remove:(id:string)=>void }>(null as any)
export const useToast = () => useContext(Ctx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((message:string, type:Toast["type"]="info")=>{
    const id = Math.random().toString(36).slice(2)
    setToasts(t=> [...t, {id,message,type}])
    setTimeout(()=> setToasts(t=> t.filter(x=>x.id!==id)), 3000)
  },[])
  const remove = useCallback((id:string)=> setToasts(t=> t.filter(x=>x.id!==id)),[])
  return <Ctx.Provider value={{toasts,push,remove}}>{children}<div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">{toasts.map(t=><div key={t.id} className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur ${t.type==="success"?"bg-emerald-500/90 border-emerald-400 text-white": t.type==="error"?"bg-red-500/90 border-red-400 text-white":"bg-nexus-card border-nexus-border text-white"}`}>{t.message}</div>)}</div></Ctx.Provider>
}
