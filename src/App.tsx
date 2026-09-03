import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Games from "./pages/Games"
import Software from "./pages/Software"
import GameDetails from "./pages/GameDetails"
import SoftwareDetails from "./pages/SoftwareDetails"
import SearchPage from "./pages/Search"
import Favorites from "./pages/Favorites"
import Login from "./pages/Login"
import DownloadPage from "./pages/Download"
import CategoryPage from "./pages/Category"
import Privacy from "./pages/Privacy"
import NotFound from "./pages/NotFound"
import Trending from "./pages/Trending"
import TopGames from "./pages/TopGames"
import BestFreePCGames from "./pages/blog/BestFreePCGames"
import FreeOpenSourceGames from "./pages/blog/FreeOpenSourceGames"
import HowToDownloadFreeGames from "./pages/blog/HowToDownloadFreeGames"
import FreePCGamesDownload from "./pages/FreePCGamesDownload"
import { FSPlusProvider } from "./context/FSPlusContext"
import FSPlusGate from "./components/FSPlusGate"
import { useEffect } from "react"
import { trackVisit, trackAdImpression } from "./utils/analytics"
const LazyAdmin = lazy(()=> import("./pages/admin/Admin"))

function AnalyticsTracker(){
  useEffect(()=>{
    trackVisit()
    // Count AdCash show — after aclib loads
    const t = setTimeout(()=> trackAdImpression("e6q6hxg91y"), 1500)
    return ()=> clearTimeout(t)
  },[])
  return null
}

function App(){
  return (
    <FSPlusProvider>
      <BrowserRouter>
        <AnalyticsTracker/>
        <FSPlusGate>
          <Routes>
            <Route element={<MainLayout/>}>
              <Route path="/" element={<Home/>} />
              <Route path="/games" element={<Games/>} />
              <Route path="/software" element={<Software/>} />
              <Route path="/game/:slug" element={<GameDetails/>} />
              <Route path="/software/:slug" element={<SoftwareDetails/>} />
            <Route path="/trending" element={<Trending/>} />
            <Route path="/top-games" element={<TopGames/>} />
            <Route path="/blog/best-free-pc-games-2026" element={<BestFreePCGames/>} />
            <Route path="/blog/free-open-source-games" element={<FreeOpenSourceGames/>} />
            <Route path="/blog/how-to-download-free-games" element={<HowToDownloadFreeGames/>} />
            <Route path="/free-pc-games-download" element={<FreePCGamesDownload/>} />
            <Route path="/search" element={<SearchPage/>} />
            <Route path="/favorites" element={<Favorites/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/download/:id" element={<DownloadPage/>} />
            <Route path="/category/:slug" element={<CategoryPage/>} />
            <Route path="/privacy" element={<Privacy/>} />
            <Route path="/dmca" element={<Privacy/>} />
            <Route path="/admin" element={<Suspense fallback={<div className="py-10 text-white/50">Loading admin...</div>}><LazyAdmin/></Suspense>} />
            <Route path="*" element={<NotFound/>} />
            </Route>
          </Routes>
        </FSPlusGate>
      </BrowserRouter>
    </FSPlusProvider>
  )
}
export default App
