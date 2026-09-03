import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type DLItem = {
  id: string
  title: string
  filename: string
  size: string
  url: string
  status: "downloading" | "completed" | "failed" | "queued"
  progress: number
  date: string
  cover?: string
}

type CtxType = {
  downloads: DLItem[]
  addDownload: (item: Omit<DLItem,"id"|"date"|"progress"|"status">) => string
  updateProgress: (id:string, progress:number, status?: DLItem["status"]) => void
  remove: (id:string)=>void
  clearCompleted: ()=>void
  count: number
  activeCount: number
}

const Ctx = createContext<CtxType>(null as any)
export const useDownloads = ()=> useContext(Ctx)

const KEY = "gv_downloads_v1"

export function DownloadManagerProvider({ children }: { children: ReactNode }){
  const [downloads, setDownloads] = useState<DLItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  useEffect(()=>{
    try {
      const raw = localStorage.getItem(KEY)
      if(raw) setDownloads(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  },[])
  useEffect(()=>{
    if(!hydrated) return
    try { localStorage.setItem(KEY, JSON.stringify(downloads.slice(0,50))) } catch {}
  },[downloads, hydrated])

  const addDownload = (item: Omit<DLItem,"id"|"date"|"progress"|"status">)=>{
    const id = Date.now().toString(36)+Math.random().toString(36).slice(2,6)
    const entry: DLItem = { id, date: new Date().toISOString(), progress:0, status:"queued", ...item }
    setDownloads(prev=>[entry, ...prev].slice(0,50))
    return id
  }
  const updateProgress = (id:string, progress:number, status?: DLItem["status"])=>{
    setDownloads(prev=> prev.map(d=> d.id===id ? {...d, progress: Math.min(100,progress), status: status || (progress>=100?"completed": d.status)} : d))
  }
  const remove = (id:string)=> setDownloads(prev=> prev.filter(d=> d.id!==id))
  const clearCompleted = ()=> setDownloads(prev=> prev.filter(d=> d.status!=="completed" && d.status!=="failed"))

  return <Ctx.Provider value={{downloads, addDownload, updateProgress, remove, clearCompleted, count: downloads.length, activeCount: downloads.filter(d=>d.status==="downloading"||d.status==="queued").length}}>{children}</Ctx.Provider>
}
