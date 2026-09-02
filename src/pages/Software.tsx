import { useEffect, useState, useMemo } from "react"
import SoftwareCard from "../components/SoftwareCard"
import SearchBar from "../components/SearchBar"
import EmptyState from "../components/EmptyState"
import { GridSkeleton } from "../components/LoadingSkeleton"
import Pagination from "../components/Pagination"
import { fetchSoftware } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import { SOFTWARE_CATEGORIES } from "../types"

export default function Software(){
  const [list,setList]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [cat,setCat]=useState("")
  const [sort,setSort]=useState("newest")
  const [page,setPage]=useState(1)
  const pageSize=12
  useEffect(()=>{ setPageMeta("Software","Browse freeware software"); fetchSoftware().then(s=>{ setList(s); setLoading(false)}) },[])
  const filtered = useMemo(()=>{
    let out=[...list]
    if(cat) out=out.filter(s=>s.category===cat)
    if(sort==="name") out.sort((a,b)=>a.title.localeCompare(b.title))
    return out
  },[list,cat,sort])
  const totalPages=Math.max(1, Math.ceil(filtered.length/pageSize))
  const paged=filtered.slice((page-1)*pageSize, page*pageSize)
  useEffect(()=> setPage(1),[cat,sort])
  return (
    <div className="py-6">
      <h1 className="font-display font-bold text-2xl">Software</h1>
      <p className="text-sm text-white/50 mt-1">Freeware & open-source tools for Windows.</p>
      <div className="mt-4 max-w-xl"><SearchBar/></div>
      <div className="flex flex-wrap gap-2 mt-4">
        <select value={cat} onChange={e=>setCat(e.target.value)} className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="" className="bg-[#0F1424]">All Categories</option>
          {SOFTWARE_CATEGORIES.map(c=> <option key={c} value={c} className="bg-[#0F1424]">{c}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none ml-auto">
          <option value="newest" className="bg-[#0F1424]">Newest</option>
          <option value="name" className="bg-[#0F1424]">Name A-Z</option>
        </select>
      </div>
      {loading? <div className="mt-6"><GridSkeleton count={8}/></div> : paged.length===0? <div className="mt-6"><EmptyState title="No software found" description="Try a different category." icon="package"/></div> :
      <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">{paged.map((s:any)=><SoftwareCard key={s.id} software={s}/>)}</div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
      </>}
    </div>
  )
}
