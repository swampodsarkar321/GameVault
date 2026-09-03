import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { sampleGames, sampleSoftware } from "../../data/sampleData"
import { createGame, updateGame, deleteGame, createSoftware, updateSoftware, deleteSoftware } from "../../firebase/firestore"
import { isRealtimeConfigured } from "../../firebase/config"
import { subscribeGamesRT, subscribeSoftwareRT } from "../../firebase/realtimeDb"
import { ref, remove, onValue } from "firebase/database"
import { rtdb } from "../../firebase/config"
import Modal from "../../components/Modal"
import { setPageMeta } from "../../utils/seo"
import { Link } from "react-router-dom"
import { Eye, Download, Megaphone } from "lucide-react"
import { getLocalCounts } from "../../utils/analytics"

type Tab = "overview"|"games"|"software"|"users"|"analytics"|"settings"
export default function Admin(){
  const { isAdmin, user, loading } = useAuth()
  const { push } = useToast()
  const [tab,setTab]=useState<Tab>("overview")
  const [games,setGames]=useState<any[]>(sampleGames)
  const [software,setSoftware]=useState<any[]>(sampleSoftware)
  const [editingGame,setEditingGame]=useState<any>(null)
  const [editingSoft,setEditingSoft]=useState<any>(null)
  const [showGameModal,setShowGameModal]=useState(false)
  const [showSoftModal,setShowSoftModal]=useState(false)
  const [confirmDelete,setConfirmDelete]=useState<{type:'game'|'software', id:string}|null>(null)
  const [rtLive,setRtLive]=useState(false)
  const [analytics,setAnalytics]=useState<{visits:number, downloads:number, ads:number, dailyVisits:number, dailyDownloads:number, dailyAds:number, recent:any[]}>({visits:0, downloads:0, ads:0, dailyVisits:0, dailyDownloads:0, dailyAds:0, recent:[]})
  useEffect(()=> setPageMeta("Admin"),[])
  // Live sync via Realtime DB — admin stays connected
  useEffect(()=>{
    if(!isRealtimeConfigured) return
    const unsubG = subscribeGamesRT((list)=> { if(list.length) { setGames(list); setRtLive(true) } })
    const unsubS = subscribeSoftwareRT((list)=> { if(list.length) setSoftware(list) })
    return ()=> { unsubG(); unsubS() }
  },[])
  // Analytics live sync — anonymous counts
  useEffect(()=>{
    if(!isRealtimeConfigured){
      const local = getLocalCounts()
      setAnalytics({ visits: local.visits, downloads: local.downloads, ads: local.ads, dailyVisits: 0, dailyDownloads: 0, dailyAds: 0, recent: [] })
      return
    }
    const today = new Date().toISOString().slice(0,10)
    const unsubs: (()=>void)[] = []
    const refs = [
      { path: "analytics/visits/total", key: "visits" },
      { path: `analytics/visits/daily/${today}`, key: "dailyVisits" },
      { path: "analytics/downloads/total", key: "downloads" },
      { path: `analytics/downloads/daily/${today}`, key: "dailyDownloads" },
      { path: "analytics/ads/total", key: "ads" },
      { path: `analytics/ads/daily/${today}`, key: "dailyAds" },
    ]
    refs.forEach(({path, key})=>{
      const r = ref(rtdb, path)
      const off = onValue(r, snap=> {
        const v = snap.exists() ? Number(snap.val()) : 0
        setAnalytics(prev=> ({...prev, [key]: v}))
      })
      unsubs.push(()=> off())
    })
    const recentRef = ref(rtdb, "analytics/downloads/recent")
    const offRecent = onValue(recentRef, snap=>{
      const v = snap.exists() ? snap.val() : []
      setAnalytics(prev=> ({...prev, recent: Array.isArray(v)? v.slice(0,10): []}))
    })
    unsubs.push(()=> offRecent())
    return ()=> unsubs.forEach(fn=>fn())
  },[])
  if(loading) return <div className="py-10 text-white/50">Loading...</div>
  if(!user) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold">Login required</h2><p className="text-white/50 text-sm mt-2">Admin area requires authentication.</p><Link to="/login" className="btn-primary mt-4">Login</Link></div>
  if(!isAdmin) return <div className="py-16 text-center card p-10"><h2 className="font-display font-bold">Unauthorized</h2><p className="text-white/50 text-sm mt-2">Your account does not have admin privileges.</p><Link to="/" className="btn-primary mt-4">Home</Link></div>

  const handleSaveGame = async (data:any)=>{
    try{
      // Fill defaults for removed fields
      const defaults = {
        shortDescription: data.shortDescription || `${data.title} — freeware game`,
        description: data.description || `${data.title} is a freeware game available on GameVault.`,
        platform: data.platform || ["Windows 10","Windows 11"],
        releaseDate: data.releaseDate || new Date().toISOString().slice(0,10),
        version: data.version || "1.0.0",
        developer: data.developer || "GameVault",
        publisher: data.publisher || "GameVault",
        screenshots: data.screenshots || (data.coverImage ? [data.coverImage] : []),
      }
      const payload = { ...defaults, ...data }
      // Normalize array fields
      payload.screenshots = typeof payload.screenshots === 'string' ? payload.screenshots.split(',').map((s:string)=>s.trim()).filter(Boolean) : payload.screenshots
      payload.genre = typeof payload.genre==='string'? payload.genre.split(',').map((s:string)=>s.trim()): payload.genre
      payload.platform = typeof payload.platform==='string'? payload.platform.split(',').map((s:string)=>s.trim()): payload.platform
      // Download Links from admin — card এ তাই দেখাবে
      if (payload.downloadLinks !== undefined) {
        const raw = payload.downloadLinks
        const urls: string[] = typeof raw === 'string' ? raw.split(',').map((s:string)=>s.trim()).filter(Boolean) : Array.isArray(raw) ? raw : []
        if (urls.length) {
          payload.downloads = urls.map((url:string, i:number) => ({
            name: i===0 ? "Primary — Direct" : `Mirror ${i+1}`,
            url,
            provider: i===0 ? "GameVault CDN" : "Archive.org",
            size: payload.size,
            type: i===0 ? "direct" : "mirror",
          }))
        }
        delete payload.downloadLinks
      }

      if(editingGame){
        if(isRealtimeConfigured) await updateGame(editingGame.id, payload)
        setGames(g=> g.map(x=> x.id===editingGame.id? {...x, ...payload}:x))
        push("Game updated","success")
      } else {
        if(isRealtimeConfigured) await createGame(payload)
        const newItem = { id: `g${Date.now()}`, ...payload, downloads: payload.downloads || [{name:"Primary — Direct",url:"https://example.com/download/game.zip",provider:"GameVault CDN",size:payload.size}], requirements: payload.requirements || { minimum:{os:"Windows 10 64-bit",cpu:"Intel Core i5-8400",ram:"8 GB RAM",gpu:"GTX 1060 6GB",storage:"30 GB"}, recommended:{os:"Windows 11 64-bit",cpu:"Intel Core i7-10700",ram:"16 GB RAM",gpu:"RTX 3060",storage:"30 GB SSD"} }, createdAt: Date.now() }
        setGames(g=> [newItem, ...g]); push("Game created","success")
      }
      setShowGameModal(false); setEditingGame(null)
    } catch(e:any){ push(e.message,"error") }
  }
  const handleSaveSoft = async (data:any)=>{
    try{
      if(editingSoft){
        if(isRealtimeConfigured) await updateSoftware(editingSoft.id, data)
        setSoftware(s=> s.map(x=> x.id===editingSoft.id? {...x, ...data}:x)); push("Software updated","success")
      } else {
        if(isRealtimeConfigured) await createSoftware(data)
        const newItem = { id: `s${Date.now()}`, ...data, screenshots: data.screenshots?.split(',').map((s:string)=>s.trim()).filter(Boolean) || [], features: typeof data.features==='string'? data.features.split(',').map((s:string)=>s.trim()): data.features, platform: typeof data.platform==='string'? data.platform.split(',').map((s:string)=>s.trim()): data.platform, downloads:[{name:"Primary Mirror",url:"https://example.com",provider:"GameVault",size:data.size}] }
        setSoftware(s=> [newItem, ...s]); push("Software created","success")
      }
      setShowSoftModal(false); setEditingSoft(null)
    } catch(e:any){ push(e.message,"error") }
  }
  const handleDelete = async ()=>{
    if(!confirmDelete) return
    try{
      if(confirmDelete.type==='game'){ if(isRealtimeConfigured) await deleteGame(confirmDelete.id); setGames(g=> g.filter(x=>x.id!==confirmDelete.id)) }
      else { if(isRealtimeConfigured) await deleteSoftware(confirmDelete.id); setSoftware(s=> s.filter(x=>x.id!==confirmDelete.id)) }
      push("Deleted","success")
    } catch(e:any){ push(e.message,"error") }
    setConfirmDelete(null)
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>
        <span className={`text-xs px-2 py-1 rounded-full border ${isRealtimeConfigured?"bg-emerald-500/15 border-emerald-500/30 text-emerald-300":"bg-amber-500/15 border-amber-500/30 text-amber-300"}`}>{isRealtimeConfigured? (rtLive?"Realtime DB Live":"Realtime DB Connected") : "Local Demo Mode"}</span>
      </div>
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {(["overview","games","software","users","analytics","settings"] as Tab[]).map(t=> <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm capitalize border whitespace-nowrap ${tab===t?"bg-violet-600 border-violet-500 text-white":"bg-white/5 border-white/10 text-white/70"}`}>{t}</button>)}
      </div>

      {tab==="overview" && (
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="card p-5"><div className="text-xs text-white/50">Total Games</div><div className="text-2xl font-bold mt-1">{games.length}</div></div>
          <div className="card p-5"><div className="text-xs text-white/50">Total Software</div><div className="text-2xl font-bold mt-1">{software.length}</div></div>
          <div className="card p-5"><div className="text-xs text-white/50">Featured</div><div className="text-2xl font-bold mt-1">{games.filter(g=>g.featured).length + software.filter(s=>s.featured).length}</div></div>
          <div className="card p-5"><div className="text-xs text-white/50">Users (demo)</div><div className="text-2xl font-bold mt-1">1.2k</div></div>
          <div className="card p-5 md:col-span-4">
            <h3 className="font-semibold">Quick actions</h3>
            <div className="flex gap-2 mt-3"><button onClick={()=>{setEditingGame(null); setShowGameModal(true)}} className="btn-primary text-sm">Add Game</button><button onClick={()=>{setEditingSoft(null); setShowSoftModal(true)}} className="btn-ghost text-sm">Add Software</button><button onClick={async()=>{ if(!confirm("Remove ALL games & software from Realtime DB? This clears dummy collections.")) return; await remove(ref(rtdb,"games")); await remove(ref(rtdb,"software")); setGames([]); setSoftware([]); push("Cleared — dummy collections removed","success")}} className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-2 text-sm hover:bg-red-500/20">Clear Dummy (RTDB)</button></div>
            {!isRealtimeConfigured && <p className="text-xs text-amber-300/80 mt-3">No Firebase — changes are local only. Add env vars (see .env.example) — Realtime DB at fram-and-go will enable live admin sync.</p>}
            {isRealtimeConfigured && <p className="text-xs text-emerald-300/80 mt-3">Realtime DB: fram-and-go (asia-southeast1) — admin changes sync live to all clients. Rules: database.rules.json</p>}
          </div>
        </div>
      )}

      {tab==="games" && (
        <div className="card p-4 mt-6">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Games ({games.length})</h3><button onClick={()=>{setEditingGame(null); setShowGameModal(true)}} className="btn-primary text-sm">Add Game</button></div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs"><tr><th className="text-left py-2">Title</th><th className="text-left">Genre</th><th className="text-left">Version</th><th className="text-left">Featured</th><th className="text-right">Actions</th></tr></thead>
              <tbody>{games.map(g=> <tr key={g.id} className="border-t border-white/5"><td className="py-2.5 font-medium">{g.title}</td><td className="text-white/60">{g.genre?.join(', ')}</td><td>{g.version}</td><td>{g.featured? "✓":"—"} / {g.popular? "★":"—"}</td><td className="text-right"><button onClick={()=>{setEditingGame(g); setShowGameModal(true)}} className="text-violet-300 hover:text-white mr-3">Edit</button><button onClick={()=>setConfirmDelete({type:'game',id:g.id})} className="text-red-400 hover:text-red-300">Delete</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="software" && (
        <div className="card p-4 mt-6">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Software ({software.length})</h3><button onClick={()=>{setEditingSoft(null); setShowSoftModal(true)}} className="btn-primary text-sm">Add Software</button></div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs"><tr><th className="text-left py-2">Title</th><th className="text-left">Category</th><th className="text-left">Version</th><th className="text-right">Actions</th></tr></thead>
              <tbody>{software.map(s=> <tr key={s.id} className="border-t border-white/5"><td className="py-2.5 font-medium">{s.title}</td><td className="text-white/60">{s.category}</td><td>{s.version}</td><td className="text-right"><button onClick={()=>{setEditingSoft(s); setShowSoftModal(true)}} className="text-violet-300 hover:text-white mr-3">Edit</button><button onClick={()=>setConfirmDelete({type:'software',id:s.id})} className="text-red-400 hover:text-red-300">Delete</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="users" && (
        <div className="card p-6 mt-6">
          <h3 className="font-semibold">Users</h3>
          <p className="text-sm text-white/50 mt-1">Managed via Firebase Auth. Never expose passwords.</p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs"><tr><th className="text-left py-2">Email</th><th className="text-left">UID</th><th className="text-left">Admin</th><th className="text-left">Created</th></tr></thead>
              <tbody>
                <tr className="border-t border-white/5"><td className="py-2.5">{user.email}</td><td className="text-white/50 text-xs">{user.uid.slice(0,12)}…</td><td>{isAdmin? "Yes":"No"}</td><td className="text-white/50">—</td></tr>
                <tr className="border-t border-white/5"><td className="py-2.5">demo@GameVault.local</td><td className="text-white/50 text-xs">demo-uid…</td><td>No</td><td>2024-12-01</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="analytics" && (
        <AdminAnalytics analytics={analytics} setAnalytics={setAnalytics} />
      )}

      {tab==="settings" && (
        <div className="card p-6 mt-6">
          <h3 className="font-semibold">Site Settings</h3>
          <div className="grid gap-3 mt-4 max-w-lg">
            <label className="text-sm"><span className="text-white/60 text-xs">Site name</span><input defaultValue="GameVault" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 outline-none"/></label>
            <label className="text-sm"><span className="text-white/60 text-xs">Support email</span><input defaultValue="support@GameVault.local" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 outline-none"/></label>
            <button onClick={()=>push("Settings saved (demo)","success")} className="btn-primary w-fit">Save settings</button>
          </div>
        </div>
      )}

      {/* Game Modal */}
      <Modal open={showGameModal} onClose={()=>{setShowGameModal(false); setEditingGame(null)}} title={editingGame? "Edit Game":"Add Game"}>
        <GameForm initial={editingGame} onSave={handleSaveGame} onCancel={()=>{setShowGameModal(false); setEditingGame(null)}}/>
      </Modal>
      <Modal open={showSoftModal} onClose={()=>{setShowSoftModal(false); setEditingSoft(null)}} title={editingSoft? "Edit Software":"Add Software"}>
        <SoftwareForm initial={editingSoft} onSave={handleSaveSoft} onCancel={()=>{setShowSoftModal(false); setEditingSoft(null)}}/>
      </Modal>
      <Modal open={!!confirmDelete} onClose={()=>setConfirmDelete(null)} title="Confirm deletion">
        <p className="text-sm text-white/70">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex gap-2 justify-end mt-4"><button onClick={()=>setConfirmDelete(null)} className="btn-ghost text-sm">Cancel</button><button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-sm font-medium">Delete</button></div>
      </Modal>
    </div>
  )
}

function AdminAnalytics({ analytics, setAnalytics }: any){
  const totalVisits = analytics.visits || 0
  const totalDownloads = analytics.downloads || 0
  const totalAds = analytics.ads || 0
  const dailyVisits = analytics.dailyVisits || 0
  const dailyDownloads = analytics.dailyDownloads || 0
  const dailyAds = analytics.dailyAds || 0
  const recent = analytics.recent || []
  const clearAnalytics = async ()=>{
    if(!confirm("Clear all analytics counts? (anonymous, no IP stored)")) return
    try {
      const { set } = await import("firebase/database")
      await set(ref(rtdb, "analytics"), null)
      setAnalytics({ visits:0, downloads:0, ads:0, dailyVisits:0, dailyDownloads:0, dailyAds:0, recent:[] })
      localStorage.removeItem("gv_analytics_visits"); localStorage.removeItem("gv_analytics_downloads"); localStorage.removeItem("gv_analytics_ads")
    } catch {}
  }
  return (
    <div className="mt-6 space-y-4">
      <div className="card p-5">
        <h3 className="font-semibold flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-400"/> Anonymous Analytics <span className="text-xs font-normal px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 ml-2">No IP • No personal data</span></h3>
        <p className="text-xs text-white/50 mt-1">User amar site dukhe dekha jabe (anonymous visits), kotjon download kortese, ar kotgulo AdCash ad show hocche — proper count, 100% anonymous.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/50"><Eye className="w-4 h-4 text-cyan-400"/> Site Visits</div>
            <div className="text-2xl font-bold mt-1">{totalVisits.toLocaleString()}</div>
            <div className="text-xs text-white/40">Today: <b className="text-white">{dailyVisits}</b> • Sessions (anonymous)</div>
            <div className="text-[11px] text-white/30 mt-1">Counts 1 per session (sessionStorage) — no IP stored.</div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/50"><Download className="w-4 h-4 text-violet-400"/> Downloads</div>
            <div className="text-2xl font-bold mt-1">{totalDownloads.toLocaleString()}</div>
            <div className="text-xs text-white/40">Today: <b className="text-white">{dailyDownloads}</b> • Total via Download Manager</div>
            <div className="text-[11px] text-white/30 mt-1">Every “Download Now — Choose Folder” click increments.</div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/50"><Megaphone className="w-4 h-4 text-amber-400"/> AdCash Shows</div>
            <div className="text-2xl font-bold mt-1">{totalAds.toLocaleString()}</div>
            <div className="text-xs text-white/40">Today: <b className="text-white">{dailyAds}</b> • Zone e6q6hxg91y</div>
            <div className="text-[11px] text-white/30 mt-1">Each page view where aclib runs = 1 impression.</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={clearAnalytics} className="btn-ghost text-xs">Clear counts (admin only)</button>
          <span className="text-xs text-white/30 py-2">Anonymous — no user email/IP stored, only counts.</span>
        </div>
      </div>

      <div className="card p-5">
        <h4 className="font-semibold text-sm">Recent Downloads (last 10 — anonymous)</h4>
        {recent.length===0 ? <p className="text-xs text-white/40 mt-2">No recent downloads yet — download via Download page to see here.</p> : (
          <ul className="mt-3 space-y-1.5 text-xs">
            {recent.map((r:any,i:number)=> <li key={i} className="flex gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2"><span className="text-white/80 truncate flex-1">{r.title}</span><span className="text-white/30 text-[11px]">{new Date(r.date).toLocaleString()}</span></li>)}
          </ul>
        )}
      </div>

      <div className="card p-5 bg-amber-500/5 border-amber-500/20">
        <h4 className="font-semibold text-sm flex items-center gap-2"><Megaphone className="w-4 h-4 text-amber-400"/> AdCash count kivabe hoy?</h4>
        <p className="text-xs text-white/60 mt-1">Proti page view e <code className="bg-white/10 px-1 rounded">aclib.runAutoTag({`{zoneId:'e6q6hxg91y'}`})</code> run hoy — tokhon <code>trackAdImpression()</code> call hoye `analytics/ads` barbe. Ad blocker thakle count kom dekhabe — seta normal.</p>
      </div>
    </div>
  )
}

function Field({ label, ...props }: any){
  return <label className="text-sm block"><span className="text-xs text-white/60">{label}</span><input {...props} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500/50" /></label>
}
function GameForm({ initial, onSave, onCancel }: any){
  const initDownloads = (()=>{ const d=(initial as any)?.downloads; if(!d) return ""; if(Array.isArray(d)) return d.map((x:any)=>x.url).join(", "); if(typeof d==="object") return Object.values(d as any).map((x:any)=>x.url).join(", "); return String(d) })()
  const [f,setF]=useState<any>(initial ? { title: initial.title||"", slug: initial.slug||"", coverImage: initial.coverImage||"", genre: Array.isArray(initial.genre)? initial.genre.join(", "): initial.genre||"Action", size: initial.size||"5 GB", downloadLinks: initDownloads, featured: !!initial.featured, popular: !!initial.popular } : { title:"", slug:"", coverImage:"", genre:"Action", size:"5 GB", downloadLinks:"", featured:false, popular:false })
  return (
    <form onSubmit={e=>{e.preventDefault(); onSave(f)}} className="space-y-3 max-h-[65vh] overflow-auto pr-1">
      <Field label="Title" value={f.title} onChange={(e:any)=>setF({...f,title:e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})} required />
      <Field label="Slug" value={f.slug} onChange={(e:any)=>setF({...f,slug:e.target.value})} required />
      <Field label="Cover Image URL" value={f.coverImage} onChange={(e:any)=>setF({...f,coverImage:e.target.value})} placeholder="https://..." required />
      <Field label="Genre (comma separated)" value={f.genre} onChange={(e:any)=>setF({...f,genre:e.target.value})} />
      <Field label="Size" value={f.size} onChange={(e:any)=>setF({...f,size:e.target.value})} placeholder="e.g. 5 GB" />
      <Field label="Download Links (comma separated URLs) — Primary + mirrors" value={f.downloadLinks} onChange={(e:any)=>setF({...f,downloadLinks:e.target.value})} placeholder="https://example.com/download/game.zip, https://example.com/mirror2" />
      <p className="text-xs text-white/40 -mt-2">Admin এখানে যা দেবেন, user download card-এ তাই দেখাবে। Card design নিচে দেখুন।</p>
      <div className="flex gap-4 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.popular} onChange={e=>setF({...f,popular:e.target.checked})}/> Popular</label></div>
      {/* Preview of user download card as admin sees */}
      {f.downloadLinks && <div className="card p-3 bg-white/[0.03] border-dashed"><div className="text-xs font-semibold text-white/60 mb-2">User Download Card Preview</div><div className="grid gap-1.5">{f.downloadLinks.split(",").map((u:string,i:number)=> u.trim() && <div key={i} className={`rounded-xl border px-3 py-2 text-xs flex items-center gap-2 ${i===0?"bg-violet-600 border-violet-500 text-white":"bg-white/[0.04] border-white/10 text-white/70"}`}>{u.trim().slice(0,48)} {i===0&&<span className="ml-auto text-[10px] bg-white/20 rounded-full px-2 py-0.5">Primary</span>}</div>)}</div></div>}
      <div className="flex gap-2 justify-end pt-2"><button type="button" onClick={onCancel} className="btn-ghost text-sm">Cancel</button><button type="submit" className="btn-primary text-sm">Save</button></div>
    </form>
  )
}
function SoftwareForm({ initial, onSave, onCancel }: any){
  const [f,setF]=useState<any>(initial || { title:"", slug:"", shortDescription:"", description:"", logo:"", coverImage:"", category:"Utility", developer:"", license:"Freeware", version:"1.0.0", size:"50 MB", platform:"Windows 10, Windows 11", features:"", featured:false, popular:false })
  return (
    <form onSubmit={e=>{e.preventDefault(); onSave(f)}} className="space-y-3 max-h-[65vh] overflow-auto pr-1">
      <Field label="Title" value={f.title} onChange={(e:any)=>setF({...f,title:e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})} required />
      <Field label="Slug" value={f.slug} onChange={(e:any)=>setF({...f,slug:e.target.value})} required />
      <Field label="Short Description" value={f.shortDescription} onChange={(e:any)=>setF({...f,shortDescription:e.target.value})} />
      <label className="text-sm block"><span className="text-xs text-white/60">Description</span><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} rows={3} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"/></label>
      <Field label="Logo URL" value={f.logo} onChange={(e:any)=>setF({...f,logo:e.target.value})} />
      <Field label="Cover Image URL" value={f.coverImage} onChange={(e:any)=>setF({...f,coverImage:e.target.value})} />
      <div className="grid grid-cols-2 gap-3"><Field label="Category" value={f.category} onChange={(e:any)=>setF({...f,category:e.target.value})} /><Field label="License" value={f.license} onChange={(e:any)=>setF({...f,license:e.target.value})} /></div>
      <div className="grid grid-cols-2 gap-3"><Field label="Developer" value={f.developer} onChange={(e:any)=>setF({...f,developer:e.target.value})} /><Field label="Version" value={f.version} onChange={(e:any)=>setF({...f,version:e.target.value})} /></div>
      <Field label="Size" value={f.size} onChange={(e:any)=>setF({...f,size:e.target.value})} />
      <Field label="Platform (comma separated)" value={f.platform} onChange={(e:any)=>setF({...f,platform:e.target.value})} />
      <Field label="Features (comma separated)" value={f.features} onChange={(e:any)=>setF({...f,features:e.target.value})} />
      <div className="flex gap-4 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.featured} onChange={e=>setF({...f,featured:e.target.checked})}/> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={!!f.popular} onChange={e=>setF({...f,popular:e.target.checked})}/> Popular</label></div>
      <div className="flex gap-2 justify-end pt-2"><button type="button" onClick={onCancel} className="btn-ghost text-sm">Cancel</button><button type="submit" className="btn-primary text-sm">Save</button></div>
    </form>
  )
}
