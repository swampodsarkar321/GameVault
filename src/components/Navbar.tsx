import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Heart, Menu, X, Gamepad2, LogOut, LayoutDashboard, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useFavorites } from "../context/FavoritesContext"
import { logout } from "../firebase/auth"

export default function Navbar(){
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState("")
  const nav = useNavigate()
  const { user, isAdmin } = useAuth()
  const { count } = useFavorites()
  const onSearch = (e:React.FormEvent)=>{ e.preventDefault(); if(q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`)}
  return (
    <header className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto px-4 h-[64px] flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/favicon.svg" alt="GameVault" width="36" height="36" className="w-9 h-9 rounded-xl shadow" />
          <span className="font-display font-bold text-lg hidden sm:block">GameVault</span>
          <span className="hidden lg:inline text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 ml-1">BETA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10">Home</Link>
          <Link to="/games" className="px-3 py-2 rounded-lg hover:bg-white/10">Games</Link>
          <Link to="/software" className="px-3 py-2 rounded-lg hover:bg-white/10">Software</Link>
        </nav>
        <form onSubmit={onSearch} className="flex-1 max-w-[420px] hidden sm:flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-violet-500/50 focus-within:bg-white/[0.08] transition">
          <Search className="w-4 h-4 text-white/50" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search games, software..." className="bg-transparent outline-none flex-1 text-sm placeholder:text-white/40" />
        </form>
        <div className="flex items-center gap-2 ml-auto">
          <Link to="/favorites" className="relative p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.10] hidden sm:inline-flex">
            <Heart className="w-4 h-4" /> {count>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full grid place-items-center font-bold">{count}</span>}
          </Link>
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && <Link to="/admin" className="btn-ghost text-sm"><LayoutDashboard className="w-4 h-4"/>Admin</Link>}
              <span className="text-sm text-white/70 hidden lg:inline-flex items-center gap-1"><User className="w-4 h-4"/>{user.email}</span>
              <button onClick={()=>logout()} className="btn-ghost text-sm"><LogOut className="w-4 h-4"/>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden md:inline-flex text-sm">Login</Link>
          )}
          <button onClick={()=>setOpen(v=>!v)} className="md:hidden p-2 rounded-xl bg-white/10">{open?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0F1424] p-4 space-y-3">
          <form onSubmit={onSearch} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-white/50"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="bg-transparent outline-none flex-1 text-sm"/>
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-white/5 flex items-center gap-2"><Gamepad2 className="w-4 h-4"/>Home</Link>
            <Link to="/games" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-white/5">Games</Link>
            <Link to="/software" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-white/5">Software</Link>
            <Link to="/favorites" onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-white/5 flex items-center gap-2"><Heart className="w-4 h-4"/>Favorites ({count})</Link>
          </div>
          {!user ? <Link to="/login" onClick={()=>setOpen(false)} className="btn-primary w-full justify-center">Login / Register</Link> : <button onClick={()=>{logout(); setOpen(false)}} className="btn-ghost w-full justify-center">Logout</button>}
        </div>
      )}
    </header>
  )
}
