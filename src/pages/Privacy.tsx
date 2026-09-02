import { Link } from "react-router-dom"
import { Shield, Mail, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { setPageMeta } from "../utils/seo"
import { useEffect } from "react"

export default function Privacy(){
  useEffect(()=> setPageMeta("Privacy Policy — GameVault", "GameVault Privacy Policy, DMCA and third-party content policy"),[])
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="card p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 grid place-items-center"><Shield className="w-5 h-5 text-white"/></div>
          <div>
            <h1 className="font-display font-bold text-2xl">Privacy Policy & DMCA</h1>
            <p className="text-sm text-white/50">Last updated: {new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" })} • GameVault</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mt-6 text-sm leading-relaxed text-white/70">
          <p>GameVault (“we”, “us”, “our”) operates as a curated index of <b className="text-white">freeware, open-source, demo and legally distributable</b> PC games and software. We do not host pirated or unlicensed commercial content. This policy explains what we collect, how we use it, and how third-party owners can request removal.</p>

          <h2 className="font-display font-semibold text-white mt-6 flex items-center gap-2"><FileText className="w-4 h-4 text-violet-400"/> 1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><b className="text-white">Account data:</b> email, display name and UID when you register/login via Firebase Authentication.</li>
            <li><b className="text-white">Usage data:</b> pages visited, search queries, favorites — stored in Firebase Realtime Database to provide favorites and personalization.</li>
            <li><b className="text-white">Technical data:</b> browser, device, IP (via hosting/CDN logs) for security and performance.</li>
          </ul>

          <h2 className="font-display font-semibold text-white mt-6">2. How We Use Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide authentication, favorites, and download mirrors.</li>
            <li>To improve search, recommendations and site performance.</li>
            <li>To communicate important updates. We never sell your data.</li>
          </ul>

          <h2 className="font-display font-semibold text-white mt-6">3. Cookies & Local Storage</h2>
          <p>We use essential cookies/localStorage for auth session, favorites fallback, and FS Plus status cache (5 min). No advertising cookies.</p>

          <h2 className="font-display font-semibold text-white mt-6 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400"/> 4. Third-Party Content & DMCA — Owner Request Removal</h2>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-2 text-amber-100">
            <p className="font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Professional Commitment</p>
            <p className="mt-1 text-amber-200/80">GameVault only indexes content that is freeware, open-source, demo, or shared with distribution permission. If you are the <b>game/software owner or rights holder</b> and believe your content is listed without permission or you wish it removed for any reason, <b>contact us and we will remove it promptly — typically within 24–48 hours</b> — no dispute.</p>
          </div>
          <p className="mt-3">To request removal, email us with:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Your full name and proof of ownership (official site, store page, or copyright registration).</li>
            <li>Exact GameVault URL(s) to remove (e.g. <code className="bg-white/10 px-1 rounded">/game/your-game</code>).</li>
            <li>Statement: “I am the rights holder and request removal.”</li>
          </ol>
          <p>We will acknowledge within 24 hours and remove or disable access to the content. We also honor counter-notices where applicable. This is our good-faith DMCA-style procedure even where local law does not strictly require it.</p>

          <h2 className="font-display font-semibold text-white mt-6">5. Third-Party Links & Mirrors</h2>
          <p>Download mirrors point to original developers, publishers or trusted archives (e.g. official site, GitHub, SourceForge). We do not re-host files to claim ownership. Availability of external mirrors is not controlled by us.</p>

          <h2 className="font-display font-semibold text-white mt-6">6. Data Sharing</h2>
          <p>We share data only with service providers necessary to run the site (Firebase Auth/Realtime DB, hosting/CDN). No sale to third parties.</p>

          <h2 className="font-display font-semibold text-white mt-6">7. Data Retention & Deletion</h2>
          <p>Account and favorites data is retained while your account is active. You may request deletion at any time via the contact email below — we delete RTDB user/favorites within 7 days.</p>

          <h2 className="font-display font-semibold text-white mt-6">8. Children’s Privacy</h2>
          <p>GameVault is not directed to children under 13. We do not knowingly collect data from children.</p>

          <h2 className="font-display font-semibold text-white mt-6">9. Changes</h2>
          <p>We may update this policy. Material changes will be noted here with a new “Last updated” date.</p>

          <h2 className="font-display font-semibold text-white mt-6 flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400"/> 10. Contact</h2>
          <p>For privacy questions or takedown requests:</p>
          <ul className="list-disc pl-5">
            <li>Email: <a href="mailto:mdswampodsarkar007@gmail.com" className="text-violet-300 hover:text-white">mdswampodsarkar007@gmail.com</a></li>
            <li>Subject line: <code className="bg-white/10 px-1 rounded">GameVault Takedown — [Game Title]</code></li>
          </ul>
          <p className="mt-4 text-xs text-white/40">This policy does not constitute legal advice. For legal matters, consult counsel.</p>
        </div>

        <div className="mt-8 flex gap-2">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <a href="mailto:mdswampodsarkar007@gmail.com?subject=GameVault%20Takedown%20Request" className="btn-ghost">Request Removal</a>
        </div>
      </div>
    </div>
  )
}
