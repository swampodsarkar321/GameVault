import { useState } from "react"
export default function ScreenshotGallery({ images }: { images: string[] }){
  const [active,setActive]=useState(0)
  if(!images?.length) return null
  return (
    <div>
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
        <img src={images[active]} alt="" className="w-full aspect-[16/9] object-cover" loading="lazy" />
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {images.map((s,i)=> (
          <button key={i} onClick={()=>setActive(i)} className={`shrink-0 rounded-xl overflow-hidden border-2 ${i===active?"border-violet-500":"border-transparent opacity-70 hover:opacity-100"}`}>
            <img src={s} alt="" className="w-[140px] h-[80px] object-cover" loading="lazy"/>
          </button>
        ))}
      </div>
    </div>
  )
}
