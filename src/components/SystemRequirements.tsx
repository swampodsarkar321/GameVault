import type { Requirements } from "../types"
export default function SystemRequirements({ minimum, recommended }: { minimum: Requirements; recommended: Requirements }){
  const Row = ({ label, value }: { label:string; value:string })=> <div className="flex justify-between gap-4 py-1.5 text-sm border-b border-white/5 last:border-0"><span className="text-white/50">{label}</span><span className="text-white/90 text-right">{value}</span></div>
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-4">
        <h4 className="font-semibold text-sm tracking-widest text-white/60">MINIMUM</h4>
        <div className="mt-3">
          <Row label="OS" value={minimum.os}/><Row label="CPU" value={minimum.cpu}/><Row label="RAM" value={minimum.ram}/><Row label="GPU" value={minimum.gpu}/><Row label="Storage" value={minimum.storage}/>
        </div>
      </div>
      <div className="card p-4 border-violet-500/20">
        <h4 className="font-semibold text-sm tracking-widest text-violet-300">RECOMMENDED</h4>
        <div className="mt-3">
          <Row label="OS" value={recommended.os}/><Row label="CPU" value={recommended.cpu}/><Row label="RAM" value={recommended.ram}/><Row label="GPU" value={recommended.gpu}/><Row label="Storage" value={recommended.storage}/>
        </div>
      </div>
    </div>
  )
}
