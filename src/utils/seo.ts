const SITE_URL = "https://ankerplay.vercel.app"

type SeoOpts = {
  canonical?: string
  keywords?: string
  image?: string
  type?: string
  noIndex?: boolean
}

export function setPageMeta(title: string, description?: string, opts: SeoOpts = {}){
  const fullTitle = title.includes("AnkerPlay") ? title : `${title} — AnkerPlay`
  document.title = fullTitle

  if(description){
    let m = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if(m) m.setAttribute("content", description)
    let og = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null
    if(og) og.setAttribute("content", description)
    let tw = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null
    if(tw) tw.setAttribute("content", description)
  }
  // OG title
  let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
  if(ogTitle) ogTitle.setAttribute("content", fullTitle)
  let twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null
  if(twTitle) twTitle.setAttribute("content", fullTitle)

  // canonical
  const canonHref = opts.canonical ? `${SITE_URL}${opts.canonical}` : `${SITE_URL}${window.location.pathname}`
  let linkCanon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if(!linkCanon){
    linkCanon = document.createElement("link")
    linkCanon.setAttribute("rel","canonical")
    document.head.appendChild(linkCanon)
  }
  linkCanon.setAttribute("href", canonHref)
  let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null
  if(ogUrl) ogUrl.setAttribute("content", canonHref)
  let twUrl = document.querySelector('meta[name="twitter:url"]') as HTMLMetaElement | null
  if(twUrl) twUrl.setAttribute("content", canonHref)

  // keywords
  if(opts.keywords){
    let kw = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    if(!kw){
      kw = document.createElement("meta")
      kw.setAttribute("name","keywords")
      document.head.appendChild(kw)
    }
    kw.setAttribute("content", opts.keywords)
  }
  // og image
  if(opts.image){
    let ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null
    if(ogImg) ogImg.setAttribute("content", opts.image)
    let twImg = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null
    if(twImg) twImg.setAttribute("content", opts.image)
  }
  // robots noindex
  let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
  if(robots){
    robots.setAttribute("content", opts.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large")
  }
  // scroll top
  window.scrollTo({top:0, behavior:"instant" as ScrollBehavior})
}

// Helper for VideoGame JSON-LD injection (for GameDetails)
export function setGameJsonLd(game: { title:string; slug:string; coverImage:string; description:string; genre:string[]; developer?:string; publisher?:string; releaseDate?:string }){
  const id = "game-jsonld"
  let el = document.getElementById(id) as HTMLScriptElement | null
  if(!el){
    el = document.createElement("script")
    el.id = id
    el.type = "application/ld+json"
    document.head.appendChild(el)
  }
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "url": `${SITE_URL}/game/${game.slug}`,
    "image": game.coverImage,
    "description": game.description?.slice(0,300),
    "genre": game.genre,
    "author": game.developer ? {"@type":"Organization","name":game.developer} : undefined,
    "publisher": game.publisher ? {"@type":"Organization","name":game.publisher} : undefined,
    "datePublished": game.releaseDate,
    "operatingSystem": "Windows",
    "applicationCategory": "Game",
    "offers": {"@type":"Offer","price":"0","priceCurrency":"USD","availability":"https://schema.org/InStock"},
    "aggregateRating": {"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"240","bestRating":"5","worstRating":"1"}
  }
  el.textContent = JSON.stringify(data)
}

export function clearGameJsonLd(){
  const el = document.getElementById("game-jsonld")
  if(el) el.remove()
}
