import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { checkFSPlus, setCachedStatus, FS_PLUS_URL, type FSStatus } from "../services/fsPlusChecker"

type Ctx = { status: FSStatus; url: string; refresh: () => Promise<void>; isOnline: boolean; isChecking: boolean }
const C = createContext<Ctx>({ status: "checking", url: FS_PLUS_URL, refresh: async () => {}, isOnline: false, isChecking: true })

export const useFSPlus = () => useContext(C)

export function FSPlusProvider({ children }: { children: ReactNode }) {
  // Always start as checking for gate mode — don't use stale cache on first load
  const [status, setStatus] = useState<FSStatus>("checking")

  const refresh = useCallback(async () => {
    setStatus("checking")
    try {
      const ok = await checkFSPlus()
      const s: FSStatus = ok ? "online" : "offline"
      setStatus(s)
      setCachedStatus(s)
    } catch {
      setStatus("offline")
      setCachedStatus("offline")
    }
  }, [])

  useEffect(() => {
    // poll every 5 min after first check
    const id = setInterval(refresh, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [refresh])

  return (
    <C.Provider value={{ status, url: FS_PLUS_URL, refresh, isOnline: status === "online", isChecking: status === "checking" }}>
      {children}
    </C.Provider>
  )
}
