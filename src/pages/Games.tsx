import { useEffect, useState, useMemo } from "react"
import GameCard from "../components/GameCard"
import FilterBar from "../components/FilterBar"
import SearchBar from "../components/SearchBar"
import EmptyState from "../components/EmptyState"
import { GridSkeleton } from "../components/LoadingSkeleton"
import Pagination from "../components/Pagination"
import { fetchGames } from "../firebase/firestore"
import { setPageMeta } from "../utils/seo"
import { GAME_GENRES, PLATFORMS } from "../types"

export default function Games(){
  const [games,setGames]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [genre,setGenre]=useState("")
  const [platform,setPlatform]=useState("")
  const [sort,setSort]=useState("newest")
  const [page,setPage]=useState(1)
  const pageSize=10
  useEffect(()=>{ setPageMeta("Games","Browse freeware PC games"); fetchGames().then(g=>{ setGames(g); setLoading(false)}) },[])
  const filtered = useMemo(()=>{
    let out=[...games]
    if(genre) out=out.filter(g=>g.genre.includes(genre))
    if(platform) out=out.filter(g=>g.platform.includes(platform))
    if(sort==="name") out.sort((a,b)=>a.title.localeCompare(b.title))
    else if(sort==="popular") out.sort((a,b)=> Number(b.popular)-Number(a.popular))
    return out
  },[games,genre,platform,sort])
  const totalPages = Math.max(1, Math.ceil(filtered.length/pageSize))
  const paged = filtered.slice((page-1)*pageSize, page*pageSize)
  useEffect(()=> setPage(1),[genre,platform,sort])
  return (
    <div className="py-6">
      <h1 className="font-display font-bold text-2xl">Games</h1>
      <p className="text-sm text-white/50 mt-1">Freeware, open-source & demos — legally distributable.</p>
      <div className="mt-4 max-w-xl"><SearchBar/></div>
      <div className="mt-4"><FilterBar genre={genre} setGenre={setGenre} platform={platform} setPlatform={setPlatform} sort={sort} setSort={setSort} genres={[...GAME_GENRES]} platforms={[...PLATFORMS]} /></div>
      {loading? <div className="mt-6"><GridSkeleton/></div> : paged.length===0 ? <div className="mt-6"><EmptyState title="No games found" description="Try adjusting filters or search." icon="game"/></div> :
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">{paged.map((g:any)=><GameCard key={g.id} game={g}/>)}</div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage}/>
        </>
      }
    </div>
  )
}
