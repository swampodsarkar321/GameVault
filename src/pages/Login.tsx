import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login, register } from "../firebase/auth"
import { useToast } from "../context/ToastContext"
import { setPageMeta } from "../utils/seo"
import { useEffect } from "react"

export default function Login(){
  const [mode,setMode]=useState<'login'|'register'>('login')
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [name,setName]=useState("")
  const [loading,setLoading]=useState(false)
  const nav=useNavigate()
  const { push }=useToast()
  useEffect(()=> setPageMeta(mode==="login"?"Login":"Register"),[mode])
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true)
    try{
      if(mode==="login"){ await login(email,password); push("Welcome back!","success") }
      else { await register(email,password,name || email.split('@')[0]); push("Account created!","success") }
      nav("/")
    } catch(err:any){ push(err.message || "Auth failed","error") }
    finally{ setLoading(false) }
  }
  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="font-display font-bold text-2xl">{mode==="login"?"Welcome back":"Create account"}</h1>
        <p className="text-sm text-white/50 mt-1">{mode==="login"?"Login to manage favorites and downloads.":"Join GameVault — free & fast."}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>setMode('login')} className={`flex-1 py-2 rounded-xl text-sm font-medium border ${mode==='login'?"bg-violet-600 border-violet-500 text-white":"bg-white/5 border-white/10"}`}>Login</button>
          <button onClick={()=>setMode('register')} className={`flex-1 py-2 rounded-xl text-sm font-medium border ${mode==='register'?"bg-violet-600 border-violet-500 text-white":"bg-white/5 border-white/10"}`}>Register</button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode==="register" && <div><label className="text-xs text-white/60">Display name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500/50"/></div>}
          <div><label className="text-xs text-white/60">Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500/50"/></div>
          <div><label className="text-xs text-white/60">Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-500/50"/></div>
          <button disabled={loading} className="btn-primary w-full justify-center mt-2">{loading?"Please wait...": mode==="login"?"Login":"Create account"}</button>
        </form>
        <p className="text-xs text-white/40 mt-4 text-center"><Link to="/" className="text-violet-300 hover:text-white">← Back to home</Link></p>
      </div>
    </div>
  )
}
