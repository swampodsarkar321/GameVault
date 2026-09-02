import { useEffect, useState, useRef } from "react"
import { useFSPlus } from "../context/FSPlusContext"
import { Loader2, WifiOff, RefreshCw, ShieldAlert, Zap, Shield, Globe, Wifi, Router } from "lucide-react"

export default function FSPlusGate({ children }: { children: React.ReactNode }) {
  const { status, isChecking, refresh } = useFSPlus()
  const [bypass, setBypass] = useState(() => {
    try { return localStorage.getItem("fs_bypass") === "1" } catch { return false }
  })
  const didCheck = useRef(false)

  useEffect(() => {
    if (didCheck.current) return
    didCheck.current = true
    refresh()
  }, [refresh])

  if (bypass) return <>{children}</>

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#070A12] grid place-items-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.08] via-transparent to-cyan-400/[0.06]" />
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-violet-600/15 blur-[90px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-cyan-400/10 blur-[90px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        {/* Loading Screen */}
        <div className="w-full max-w-md card p-8 text-center relative backdrop-blur-xl border-white/10 shadow-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-cyan-400/5 animate-pulse pointer-events-none" />
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 animate-pulse blur-[1px]" />
            <div className="absolute inset-[2px] rounded-2xl bg-[#0F1424] grid place-items-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="font-display font-bold text-lg mt-5 tracking-tight">Verifying Connection</h2>
          <p className="text-sm text-white/60 mt-1">Checking high-speed network for optimal downloads</p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-medium text-violet-300">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            <span className="ml-1">Loading — Please wait</span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
              <div className="h-full w-3/5 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full animate-pulse" />
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-white/50"><Shield className="w-3 h-3 text-emerald-400" /> Secure</span>
              <span className="flex items-center gap-1.5 text-white/50"><Zap className="w-3 h-3 text-amber-400" /> Fast</span>
              <span className="flex items-center gap-1.5 text-white/50"><Globe className="w-3 h-3 text-cyan-400" /> Verified</span>
            </div>
          </div>
          <p className="text-xs text-white/30 mt-4">This will only take a moment • 5s timeout</p>
        </div>
      </div>
    )
  }

  if (status === "offline") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#070A12] grid place-items-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/[0.08] via-transparent to-amber-500/[0.06]" />
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-red-600/15 blur-[90px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-amber-500/10 blur-[90px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="w-full max-w-md card p-8 text-center border-red-500/20 relative backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-amber-500/5 animate-pulse pointer-events-none" />
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 animate-pulse blur-[1px]" />
            <div className="absolute inset-[2px] rounded-2xl bg-[#1A0F0F] grid place-items-center">
              <WifiOff className="w-8 h-8 text-red-300 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
          </div>
          <h2 className="font-display font-bold text-xl mt-5 tracking-tight">Connection Check Failed</h2>
          <p className="text-sm text-white/60 mt-1">Sorry — You are not available for this site</p>
          {/* Beautiful animation — wifi/provider hint */}
          <div className="mt-4 bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-xl p-4 text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
            <div className="flex gap-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 grid place-items-center shrink-0 animate-pulse">
                <Router className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-amber-200 flex items-center gap-1.5">
                  <Wifi className="w-4 h-4" /> WiFi / Provider Change Required
                </div>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Your current network does not support BDIX high-speed. Please <b className="text-white">switch to a BDIX-enabled WiFi/Provider</b> or contact your ISP to enable BDIX for full-speed access.
                </p>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  <span className="text-xs text-amber-300/70 ml-1">Try different network</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-3 text-xs text-red-200 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
            <span>Check failed — site will not open until verified.</span>
          </div>
          <p className="text-xs text-white/30 mt-3">Tip: Enable BDIX or change provider for best experience</p>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <button onClick={() => refresh()} className="btn-primary justify-center group">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition duration-500" /> Retry Check
            </button>
            <button
              onClick={() => {
                try { localStorage.setItem("fs_bypass", "1") } catch {}
                setBypass(true)
              }}
              className="btn-ghost justify-center"
            >
              Continue (fallback)
            </button>
          </div>
          <button
            onClick={() => {
              try { localStorage.removeItem("fs_bypass") } catch {}
              window.location.reload()
            }}
            className="text-xs text-white/40 hover:text-white mt-3"
          >
            Clear bypass & reload
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
