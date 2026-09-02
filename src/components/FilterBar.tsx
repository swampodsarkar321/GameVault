export default function FilterBar({ genre, setGenre, platform, setPlatform, sort, setSort, genres, platforms }: { genre:string; setGenre:(v:string)=>void; platform:string; setPlatform:(v:string)=>void; sort:string; setSort:(v:string)=>void; genres:string[]; platforms:string[] }){
  return (
    <div className="flex flex-wrap gap-2">
      <select value={genre} onChange={e=>setGenre(e.target.value)} className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none">
        <option value="" className="bg-[#0F1424]">All Genres</option>
        {genres.map(g=> <option key={g} value={g} className="bg-[#0F1424]">{g}</option>)}
      </select>
      {platforms.length>0 && (
        <select value={platform} onChange={e=>setPlatform(e.target.value)} className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none">
          <option value="" className="bg-[#0F1424]">All Platforms</option>
          {platforms.map(p=> <option key={p} value={p} className="bg-[#0F1424]">{p}</option>)}
        </select>
      )}
      <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-sm outline-none ml-auto">
        <option value="newest" className="bg-[#0F1424]">Newest</option>
        <option value="popular" className="bg-[#0F1424]">Popular</option>
        <option value="name" className="bg-[#0F1424]">Name A-Z</option>
      </select>
    </div>
  )
}
