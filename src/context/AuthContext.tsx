import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { subscribeAuth, getUserProfile } from "../firebase/auth"

type AuthCtx = { user: User | null; profile: any; loading: boolean; isAdmin: boolean }
const Ctx = createContext<AuthCtx>({ user: null, profile: null, loading: true, isAdmin: false })
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    return subscribeAuth(async (u) => {
      setUser(u)
      if (u) {
        try { const p = await getUserProfile(u.uid); setProfile(p); } catch { setProfile(null) }
      } else setProfile(null)
      setLoading(false)
    })
  }, [])
  const allowedAdmins = ["mdswampodsarkar007@gmail.com"]
  const isAdmin = profile?.isAdmin === true || (user?.email ? allowedAdmins.includes(user.email.toLowerCase().trim()) : false)
  return <Ctx.Provider value={{ user, profile, loading, isAdmin }}>{children}</Ctx.Provider>
}
