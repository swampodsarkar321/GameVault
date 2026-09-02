import { useFSPlus } from "../context/FSPlusContext"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export default function FSPlusBadge() {
  const { status, refresh, isChecking } = useFSPlus()
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status === "online" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : status === "offline" ? "bg-amber-500/15 border-amber-500/30 text-amber-300" : "bg-white/5 border-white/10 text-white/60"}`}>
        {status === "online" ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
        {status === "online" ? "FS Plus: Online" : status === "offline" ? "FS Plus: Offline" : "FS Plus: Checking..."}
      </span>
      <button onClick={refresh} disabled={isChecking} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 grid place-items-center hover:bg-white/10 disabled:opacity-40">
        <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
      </button>
    </div>
  )
}
