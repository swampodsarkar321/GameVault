import { useEffect, useState, useRef } from "react"
import { useFSPlus } from "../context/FSPlusContext"
import { Loader2, WifiOff, RefreshCw, ShieldAlert } from "lucide-react"

export default function FSPlusGate({ children }: { children: React.ReactNode }) {
  const { status, isChecking, refresh } = useFSPlus()
  const [bypass, setBypass] = useState(() => {
    try { return localStorage.getItem("fs_bypass") === "1" } catch { return false }
  })
  const didCheck = useRef(false)

  // Single fresh check — guard StrictMode double-mount
  useEffect(() => {
    if (didCheck.current) return
    didCheck.current = true
    refresh()
  }, [refresh])

  if (bypass) return <>{children}</>

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#070A12] grid place-items-center p-6">
        <div className="w-full max-w-md card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 grid place-items-center mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="font-display font-bold text-lg mt-4">Checking…</h2>
          <p className="text-sm text-violet-300 mt-1 font-medium">Connect top high speed downloading site check চলছে…</p>
          <p className="text-xs text-white/40 mt-2">Site open হবে না যতক্ষণ না check শেষ হয় • 5s timeout</p>
          <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-violet-600 rounded-full animate-[shimmer_1s_infinite]" style={{ animation: "shimmer 1s infinite" }} />
          </div>
        </div>
      </div>
    )
  }

  if (status === "offline") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#070A12] grid place-items-center p-6">
        <div className="w-full max-w-md card p-8 text-center border-red-500/20">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 grid place-items-center mx-auto">
            <WifiOff className="w-8 h-8 text-red-300" />
          </div>
          <h2 className="font-display font-bold text-xl mt-4">Sorry — You are not available for this site</h2>
          <p className="text-sm text-white/60 mt-2">Connect top high speed downloading site check failed</p>
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4 text-xs text-red-200 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>BDIX-র বাইরে আছেন বা server unreachable। Check pass না হলে site open হবে না।</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={() => refresh()} className="btn-primary justify-center">
              <RefreshCw className="w-4 h-4" /> Retry Check
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
