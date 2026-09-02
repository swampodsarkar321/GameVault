import { Link } from "react-router-dom"
export default function NotFound(){
  return (
    <div className="py-20 text-center">
      <div className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-widest">404</div>
      <h1 className="font-display font-bold text-3xl mt-4">Page not found</h1>
      <p className="text-white/50 mt-2">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn-primary mt-6">Go Home</Link>
    </div>
  )
}
