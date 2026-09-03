import { Link } from "react-router-dom"
import { Globe, MessageCircle, Mail } from "lucide-react"
export default function Footer(){
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0E1E] mt-12">
      <div className="max-w-[1280px] mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg"><img src="/favicon.svg" alt="AnkerPlay" width="32" height="32" className="w-8 h-8 rounded-lg" />AnkerPlay</div>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">Curated freeware, open-source games & software. Only legally distributable content. Fast, safe, and beautifully organized.</p>
          <div className="flex gap-2 mt-4">
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 grid place-items-center hover:bg-white/10"><Globe className="w-4 h-4"/></a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 grid place-items-center hover:bg-white/10"><MessageCircle className="w-4 h-4"/></a>
            <a href="#" className="w-9 h-9 rounded-xl bg-white/5 grid place-items-center hover:bg-white/10"><Mail className="w-4 h-4"/></a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Browse</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/trending" className="hover:text-white">Trending</Link></li>
            <li><Link to="/top-games" className="hover:text-white">Top Games</Link></li>
            <li><Link to="/games" className="hover:text-white">Games</Link></li>
            <li><Link to="/software" className="hover:text-white">Software</Link></li>
            <li><Link to="/search" className="hover:text-white">Search</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/dmca" className="hover:text-white">DMCA</Link></li>
            <li><a href="mailto:mdswampodsarkar007@gmail.com" className="hover:text-white">Contact</a></li>
            <li><span className="text-white/40 text-xs">3rd-party owner? We remove on request (24–48h)</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Stay updated</h4>
          <p className="text-sm text-white/60 mb-3">Get new releases weekly. No spam.</p>
          <form onSubmit={e=>e.preventDefault()} className="flex gap-2">
            <input placeholder="Your email" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500/50" />
            <button className="btn-primary text-sm">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-white/40">© {new Date().getFullYear()} AnkerPlay — Only freeware & open-source. No pirated content.</div>
    </footer>
  )
}
