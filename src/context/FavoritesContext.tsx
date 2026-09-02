import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"
type Fav = { itemId: string; itemType: 'game'|'software' }
const Ctx = createContext<{ favorites: Fav[]; toggle:(id:string,type:'game'|'software')=>void; isFav:(id:string)=>boolean; count:number }>(null as any)
export const useFavorites = ()=> useContext(Ctx)
export function FavoritesProvider({ children }: { children: ReactNode }){
  const { user } = useAuth()
  const { push } = useToast()
  const [favorites, setFavorites] = useState<Fav[]>([])
  const storageKey = user ? `fav_${user.uid}` : "fav_guest"
  useEffect(()=>{
    const raw = localStorage.getItem(storageKey)
    if(raw) try{ setFavorites(JSON.parse(raw)) }catch{ setFavorites([]) } else setFavorites([])
  },[storageKey])
  useEffect(()=>{ localStorage.setItem(storageKey, JSON.stringify(favorites)) },[favorites, storageKey])
  const toggle = (itemId:string, itemType:'game'|'software')=>{
    if(!user){ push("Please login to use favorites","info"); return }
    setFavorites(prev=>{
      const exists = prev.find(f=>f.itemId===itemId)
      if(exists){ push("Removed from favorites","info"); return prev.filter(f=>f.itemId!==itemId) }
      push("Added to favorites","success"); return [...prev,{itemId,itemType}]
    })
  }
  const isFav = (id:string)=> favorites.some(f=>f.itemId===id)
  return <Ctx.Provider value={{favorites,toggle,isFav,count:favorites.length}}>{children}</Ctx.Provider>
}
