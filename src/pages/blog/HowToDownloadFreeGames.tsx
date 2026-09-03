import { Link } from "react-router-dom"
import { useEffect } from "react"
import { setPageMeta } from "../../utils/seo"
export default function HowToDownloadFreeGames(){
  useEffect(()=> setPageMeta("How to Download Free PC Games Legally — GameVault Guide","How to download free PC games legally on GameVault — freeware, open-source & demos. Choose folder, high-speed via GameVault, 100% legal.",{ canonical:"/blog/how-to-download-free-games", keywords:"how to download free PC games, download free games legally, free PC games download guide"}),[])
  return (
    <div className="py-6 max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-white/60 hover:text-white">← Home</Link>
      <h1 className="font-display font-bold text-3xl mt-3">How to Download Free PC Games Legally</h1>
      <p className="text-sm text-white/40 mt-1">GameVault guide • 5 min • verified sources</p>
      <div className="prose prose-invert max-w-none mt-6 text-sm leading-relaxed text-white/70">
        <p>Many sites re-host cracked games. <b className="text-white">GameVault</b> only links to official sources — freeware, open-source, demos. Here’s how to <b className="text-white">download free PC games legally</b> with high speed and Choose Folder.</p>
        <h2 className="text-white font-semibold mt-6">Steps</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Go to <Link to="/games" className="text-violet-300">GameVault games</Link> or <Link to="/trending" className="text-violet-300">Trending</Link></li>
          <li>Open game → click <b className="text-white">Download Now — Choose Folder</b> (via GameVault proxy, auto GameVault_ tag)</li>
          <li>Pick folder (showSaveFilePicker) → progress in Download Manager → completed</li>
        </ol>
        <p>Large files (&gt;50MB) auto redirect to direct for speed. See <Link to="/privacy" className="text-violet-300">Privacy & DMCA</Link> — 24-48h takedown.</p>
        <p>More: <Link to="/blog/best-free-pc-games-2026" className="text-violet-300">Best Free PC Games 2026</Link></p>
      </div>
    </div>
  )
}
