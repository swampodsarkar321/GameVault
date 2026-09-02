export default function Pagination({ page, totalPages, onChange }: { page:number; totalPages:number; onChange:(p:number)=>void }){
  if(totalPages<=1) return null
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button disabled={page<=1} onClick={()=>onChange(page-1)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-40">Prev</button>
      {Array.from({length: totalPages}).slice(0,7).map((_,i)=>{
        const p=i+1
        return <button key={p} onClick={()=>onChange(p)} className={`w-9 h-9 rounded-xl border text-sm font-medium ${p===page?"bg-violet-600 border-violet-500 text-white":"bg-white/5 border-white/10 hover:bg-white/10"}`}>{p}</button>
      })}
      <button disabled={page>=totalPages} onClick={()=>onChange(page+1)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-40">Next</button>
    </div>
  )
}
