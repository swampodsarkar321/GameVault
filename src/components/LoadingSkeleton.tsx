export function CardSkeleton(){
  return <div className="card p-0 overflow-hidden"><div className="h-[210px] skeleton"/><div className="p-3 space-y-2"><div className="h-4 w-3/4 skeleton"/><div className="h-3 w-1/2 skeleton"/><div className="h-6 w-full skeleton"/></div></div>
}
export function GridSkeleton({ count=10 }: { count?: number }){
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{Array.from({length:count}).map((_,i)=><CardSkeleton key={i}/>)}</div>
}
