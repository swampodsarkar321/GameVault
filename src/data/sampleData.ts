import type { Game, Software } from "../types"

const dl = (size="2.4 GB", _slug="game") => [
  { name: "Primary — Direct", url: `https://example.com/download/${_slug}/primary`, provider: "GameVault CDN", size, type: "direct" },
  { name: "Mirror 2", url: "https://example.com/download/mirror2", provider: "Archive.org", size, type: "mirror" },
  { name: "Mirror 3", url: "https://example.com/download/mirror3", provider: "SourceForge", size, type: "mirror" },
]

const reqMin = { os: "Windows 10 64-bit", cpu: "Intel Core i5-8400 / AMD Ryzen 5 2600", ram: "8 GB RAM", gpu: "GTX 1060 6GB / RX 580", storage: "30 GB available space" }
const reqRec = { os: "Windows 11 64-bit", cpu: "Intel Core i7-10700 / AMD Ryzen 7 3700X", ram: "16 GB RAM", gpu: "RTX 3060 / RX 6700 XT", storage: "30 GB SSD" }

export const sampleGames: Game[] = [
  {
    id:"g1", title:"Shadow Frontier", slug:"shadow-frontier", shortDescription:"Open-world survival on a fractured alien frontier.",
    description:"Shadow Frontier is a freeware open-world survival adventure set on a shattered exoplanet. Scavenge, craft, and survive against anomalous weather and hostile fauna. Built by an indie collective and released as freeware, it features a 20-hour campaign and endless exploration.",
    coverImage:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=675&fit=crop","https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=675&fit=crop","https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=675&fit=crop"],
    genre:["Action","Adventure","Indie"], developer:"Northlight Collective", publisher:"Northlight Collective", releaseDate:"2024-11-12", version:"1.4.2", size:"18.2 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("18.2 GB","shadow-frontier"), featured:true, popular:true, trailer:"https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id:"g2", title:"Neon Drift", slug:"neon-drift", shortDescription:"Synthwave street racing through neon megacities.",
    description:"Neon Drift is a fast, arcade-perfect racer with synthwave aesthetics, night circuits, and deep tuning. Free demo includes 4 tracks and 6 cars. Full open-source community edition available.",
    coverImage:"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=675&fit=crop","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=675&fit=crop"],
    genre:["Racing","Indie"], developer:"Vector Bloom", publisher:"Vector Bloom", releaseDate:"2024-09-03", version:"2.0.1", size:"8.5 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("8.5 GB","neon-drift"), featured:true, popular:true
  },
  {
    id:"g3", title:"Kingdom Reborn", slug:"kingdom-reborn", shortDescription:"Tactical RPG where every choice reshapes the realm.",
    description:"Lead a fallen kingdom back to glory in this turn-based tactical RPG. Manage cities, forge alliances, and battle in deep grid combat. Community-made freeware release.",
    coverImage:"https://images.unsplash.com/photo-1535666669445-74953888f435?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=675&fit=crop"],
    genre:["RPG","Strategy"], developer:"Iron Quill Games", publisher:"Iron Quill", releaseDate:"2024-07-20", version:"1.2.0", size:"12.0 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("12.0 GB","kingdom-reborn"), featured:false, popular:true
  },
  {
    id:"g4", title:"Pixel Raiders", slug:"pixel-raiders", shortDescription:"Co-op roguelite shooter with voxel chaos.",
    description:"Drop in with friends, loot voxels, and survive waves of glitch-mutants. Highly replayable public-domain prototype expanded into full freeware game.",
    coverImage:"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1486405862167-332aa2e2d979?w=1200&h=675&fit=crop"],
    genre:["Shooter","Action","Rogue"], developer:"Bitforge", publisher:"Bitforge", releaseDate:"2024-10-01", version:"0.9.8", size:"4.1 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("4.1 GB","pixel-raiders"), featured:false, popular:false
  },
  {
    id:"g5", title:"Echoes of the Deep", slug:"echoes-of-the-deep", shortDescription:"Atmospheric horror exploration in abandoned research stations.",
    description:"Dive into haunting underwater stations and uncover what silenced the abyssal project. Horror-adventure freeware with superb sound design.",
    coverImage:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=675&fit=crop"],
    genre:["Horror","Adventure"], developer:"Abyss Studios", publisher:"Abyss Studios", releaseDate:"2024-08-15", version:"1.0.4", size:"9.7 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("9.7 GB","echoes-of-the-deep"), featured:true, popular:false
  },
  {
    id:"g6", title:"Aether Tactics", slug:"aether-tactics", shortDescription:"Competitive card-tactics with living battlefields.",
    description:"Aether Tactics blends card deck building with tactical positioning. Free-to-play with open-source core.",
    coverImage:"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=675&fit=crop"],
    genre:["Strategy","Indie"], developer:"Aetherworks", publisher:"Aetherworks", releaseDate:"2024-06-11", version:"1.3.0", size:"6.2 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("6.2 GB","aether-tactics"), featured:false, popular:false
  },
  {
    id:"g7", title:"Starfield Nomads", slug:"starfield-nomads", shortDescription:"Procedural space trading and exploration.",
    description:"Trade across 120 handcrafted plus infinite procedural systems. Freeware space sim with mod support.",
    coverImage:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1451187580459-43490279c429?w=1200&h=675&fit=crop"],
    genre:["Simulation","Adventure"], developer:"Voidbound", publisher:"Voidbound", releaseDate:"2024-05-02", version:"2.1.0", size:"14.4 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("14.4 GB","starfield-nomads"), featured:false, popular:true
  },
  {
    id:"g8", title:"Chrono Shift", slug:"chrono-shift", shortDescription:"Time-bending puzzle platformer.",
    description:"Rewind, pause, and fork time to solve intricate puzzles. Award-winning freeware jam game expanded.",
    coverImage:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1200&h=675&fit=crop"],
    genre:["Puzzle","Platformer"], developer:"Chrono Labs", publisher:"Chrono Labs", releaseDate:"2024-04-18", version:"1.0.0", size:"2.8 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("2.8 GB","chrono-shift"), featured:false, popular:false
  },
  {
    id:"g9", title:"Warfront Legacy", slug:"warfront-legacy", shortDescription:"Large-scale strategy with persistent campaigns.",
    description:"Command fronts across seasons in this deep strategy freeware title.",
    coverImage:"https://images.unsplash.com/photo-1486405862167-332aa2e2d979?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=675&fit=crop"],
    genre:["Strategy","Simulation"], developer:"Legacy Team", publisher:"Legacy Team", releaseDate:"2024-03-10", version:"1.5.0", size:"10.1 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("10.1 GB","warfront-legacy"), featured:false, popular:false
  },
  {
    id:"g10", title:"Crimson Circuit", slug:"crimson-circuit", shortDescription:"Cyberpunk brawler with co-op up to 4 players.",
    description:"Brutal brawler in a rain-slick cyber city. Freeware beat-'em-up with retro flair.",
    coverImage:"https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=800&fit=crop", screenshots:["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=675&fit=crop"],
    genre:["Action","Indie"], developer:"Neon Fist", publisher:"Neon Fist", releaseDate:"2024-02-22", version:"1.1.3", size:"5.5 GB", platform:["Windows 10","Windows 11"], requirements:{minimum:reqMin,recommended:reqRec}, downloads: dl("5.5 GB","crimson-circuit"), featured:false, popular:false
  },
]

export const sampleSoftware: Software[] = [
  {
    id:"s1", title:"CodeForge Studio", slug:"codeforge-studio", shortDescription:"Lightweight open-source IDE for web & Python.",
    description:"CodeForge Studio is an open-source, lightweight IDE with smart completion, integrated terminal, and extension support. MIT licensed and community maintained.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", coverImage:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop","https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop"],
    category:"Development", developer:"CodeForge", license:"MIT (Open Source)", version:"3.2.1", size:"285 MB", platform:["Windows 10","Windows 11"], features:["Intellisense","Git integration","Extension marketplace","Built-in terminal"], downloads: dl("285 MB","codeforge-studio"), featured:true, popular:true
  },
  {
    id:"s2", title:"PhotoCraft", slug:"photocraft", shortDescription:"Professional photo editor — free & open source.",
    description:"PhotoCraft rivals commercial editors with RAW support, layers, and AI-assisted tools. GPLv3 licensed.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gimp/gimp-original.svg", coverImage:"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=675&fit=crop"],
    category:"Graphics", developer:"PhotoCraft Team", license:"GPLv3 (Open Source)", version:"2.8.4", size:"412 MB", platform:["Windows 10","Windows 11"], features:["RAW editing","Layer effects","AI denoise","Plugin support"], downloads: dl("412 MB","photocraft"), featured:true, popular:true
  },
  {
    id:"s3", title:"MediaFlow", slug:"mediaflow", shortDescription:"All-in-one media converter & player.",
    description:"MediaFlow plays and converts any format, with hardware acceleration and batch processing. Freeware.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", coverImage:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=675&fit=crop"],
    category:"Multimedia", developer:"MediaFlow Labs", license:"Freeware", version:"6.1.0", size:"98 MB", platform:["Windows 10","Windows 11"], features:["4K playback","Format converter","Subtitle support","Hardware accel"], downloads: dl("98 MB","mediaflow"), featured:false, popular:true
  },
  {
    id:"s4", title:"SecureBox", slug:"securebox", shortDescription:"Encrypted vault & password manager.",
    description:"SecureBox keeps your files and passwords in a zero-knowledge encrypted vault. Audited open source.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", coverImage:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop"],
    category:"Security", developer:"SecureBox", license:"Apache 2.0 (Open Source)", version:"4.0.2", size:"76 MB", platform:["Windows 10","Windows 11"], features:["E2E encryption","2FA","Secure sharing","Audit log"], downloads: dl("76 MB","securebox"), featured:false, popular:false
  },
  {
    id:"s5", title:"AudioForge", slug:"audioforge", shortDescription:"DAW for music creation — free edition.",
    description:"AudioForge free edition supports unlimited tracks, VSTs, and export. Ideal for beginners and pros.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", coverImage:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=675&fit=crop"],
    category:"Audio", developer:"AudioForge", license:"Freeware", version:"9.3.0", size:"520 MB", platform:["Windows 10","Windows 11"], features:["Multitrack","MIDI","VST support","Mastering suite"], downloads: dl("520 MB","audioforge"), featured:false, popular:true
  },
  {
    id:"s6", title:"BlitzBrowser", slug:"blitzbrowser", shortDescription:"Privacy-focused Chromium-based browser.",
    description:"BlitzBrowser blocks trackers by default, syncs securely, and is fully open source.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg", coverImage:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop"],
    category:"Browser", developer:"Blitz", license:"MPL 2.0 (Open Source)", version:"122.0", size:"210 MB", platform:["Windows 10","Windows 11"], features:["Ad blocking","Sync","Extensions","Private mode"], downloads: dl("210 MB","blitzbrowser"), featured:true, popular:false
  },
  {
    id:"s7", title:"ClipForge", slug:"clipforge", shortDescription:"Open-source video editor for creators.",
    description:"ClipForge offers timeline editing, effects, and 4K export. Community-driven.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg", coverImage:"https://images.unsplash.com/photo-1574717024653-61fd2cf4d44a?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44a?w=1200&h=675&fit=crop"],
    category:"Video Editing", developer:"ClipForge", license:"GPLv3", version:"24.1.0", size:"340 MB", platform:["Windows 10","Windows 11"], features:["Timeline","Transitions","Color grading","Export presets"], downloads: dl("340 MB","clipforge"), featured:false, popular:false
  },
  {
    id:"s8", title:"ZipNest", slug:"zipnest", shortDescription:"Modern archiver supporting 40+ formats.",
    description:"ZipNest compresses and extracts with speed, encryption, and cloud integration. Freeware.",
    logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", coverImage:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    screenshots:["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=675&fit=crop"],
    category:"Compression", developer:"ZipNest", license:"Freeware", version:"11.5", size:"22 MB", platform:["Windows 10","Windows 11"], features:["40+ formats","AES-256","Cloud","Batch"], downloads: dl("22 MB","zipnest"), featured:false, popular:false
  },
]
