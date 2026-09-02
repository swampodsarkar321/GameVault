import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
export default function MainLayout(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
