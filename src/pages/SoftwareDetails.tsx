import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Heart, Shield, ArrowLeft, HardDrive } from "lucide-react"
import { fetchSoftwareBySlug, fetchSoftware } from "../firebase/firestore"
import ScreenshotGallery from "../components/ScreenshotGallery"
import DownloadMirror from "../components/DownloadMirror"
import SoftwareCard from "../components/SoftwareCard"
import { useFavorites } from "../context/FavoritesContext"
import { setPageMeta } from "../utils/seo"
import type { Software } from "../types"

export default function SoftwareDetails(){
  const { slug } = useParams()
  const [soft,setSoft]=useState<Software|null>(null)
  const [related,setRelated]=useState<Software[]>([])
  const [loading,setLoading]=useState(true)
  const { isFav, toggle } = useFavorites()
  useEffect(()=>{
    if(!slug) return
    fetchSoftwareBySlug(slug).then(s=>{
      setSoft(s); if(s) setPageMeta(s.title,s.shortDescription); setLoading(false)
      if(s) fetchSoftware().then(all=> setRelated(all.filter(x=> x.slug!==s.slug && x.category===s.category).slice(0,4)))
    })
  },[slug])
  if(loading) return <div className="py-10"><div className="h-[280px] skeleton rounded-2xl"/></div>
  if(!soft) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold text-xl">Software not found</h2><Link to="/software" className="btn-primary mt-4">Browse Software</Link></div>
  const fav=isFav(soft.id)
  return (
    <div className="py-6">
      <Link to="/software" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="w-4 h-4"/> Back to Software</Link>
      <div className="card p-6 mt-4 flex gap-4 items-start">
        <img src={soft.logo || soft.coverImage} alt={soft.title} className="w-20 h-20 rounded-2xl object-cover bg-white/5 border border-white/10 p-2" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display font-bold text-2xl">{soft.title}</h1>
          <p className="text-sm text-white/60 mt-1">{soft.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="badge">{soft.category}</span><span className="badge">{soft.license}</span><span className="badge">{soft.version}</span><span className="badge"><HardDrive className="w-3 h-3 mr-1"/>{soft.size}</span><span className="text-white/40">by {soft.developer}</span>
          </div>
        </div>
        <button onClick={()=>toggle(soft.id,'software')} className={`btn-ghost shrink-0 ${fav?"bg-pink-500/15 border-pink-500/30 text-pink-300":""}`}><Heart className={`w-4 h-4 ${fav?"fill-current":""}`}/>{fav?"Favorited":"Favorite"}</button>
      </div>
      <div className="grid lg:grid-cols-[1.35fr_0.75fr] gap-6 mt-6">
        <div>
          <div className="card p-5">
            <h3 className="font-semibold">About</h3>
            <p className="text-sm text-white/70 leading-relaxed mt-2">{soft.description}</p>
            {soft.features?.length>0 && <><h4 className="font-semibold mt-4">Features</h4><ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm text-white/70">{soft.features.map((f,i)=><li key={i} className="flex gap-2"><Shield className="w-4 h-4 text-violet-400 shrink-0 mt-0.5"/>{f}</li>)}</ul></>}
            <div className="mt-4 text-xs text-white/50">Supported: {soft.platform.join(", ")} • v{soft.version} • {soft.size}</div>
          </div>
          <div className="mt-6"><h3 className="font-semibold mb-3">Screenshots</h3><ScreenshotGallery images={soft.screenshots}/></div>
        </div>
        <div className="space-y-4">
          <DownloadMirror mirrors={soft.downloads} id={soft.id} title={soft.title} version={soft.version} size={soft.size}/>
          {related.length>0 && <div className="card p-4"><h3 className="font-semibold">Related Software</h3><div className="grid gap-3 mt-3">{related.slice(0,3).map(s=> <SoftwareCard key={s.id} software={s}/>)}</div></div>}
        </div>
      </div>
    </div>
  )
}
