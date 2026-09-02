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
const LazyAdmin = lazy(()=> import("./pages/admin/Admin"))

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/games" element={<Games/>} />
          <Route path="/software" element={<Software/>} />
          <Route path="/game/:slug" element={<GameDetails/>} />
          <Route path="/software/:slug" element={<SoftwareDetails/>} />
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
    </BrowserRouter>
  )
}
export default App
