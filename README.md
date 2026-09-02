# GameVault — PC Game & Software Download Portal

Modern, dark, Steam/Epic-inspired portal for **freeware, open-source & demo** PC games & software. Built with React + Vite + TypeScript + Tailwind + Firebase (Realtime DB).

![Brand](https://img.shields.io/badge/brand-GameVault-violet) ![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Firebase-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features
- Hero + Featured / Latest / Popular / Categories / Newsletter
- Games & Software grids with search, genre/category filter, platform filter, sort (newest/popular/name), pagination
- Detail pages: cover, description, screenshots, trailer, system requirements, verified download mirrors, related items, favorites
- `/download/:id?mirror=0` interstitial with safety/legal notice
- Global search (`/search?q=`) with instant dropdown, category pages (`/category/:slug`)
- Favorites (Firebase + local fallback, deduped, requires login)
- Auth: email/password register/login/logout (Firebase Auth), admin guard
- Admin `/admin`: Overview, Games, Software, Users, Settings — full CRUD (Realtime DB live sync), confirmation modals
- Premium dark UI: glass/blur, rounded cards, hover scale, skeleton loaders, toasts, modals, responsive (5/4/3/2 cols), semantic HTML + SEO meta
- Performance: lazy images, route code-splitting (Admin), query limits, pagination, reusable components

## 🧱 Tech
React 19, Vite 6, TypeScript, Tailwind CSS 3, Firebase (Auth + Realtime Database), React Router 6, Lucide Icons

## 📁 Structure
```
src/
  components/ Navbar, Footer, Hero, GameCard, SoftwareCard, CategoryCard, SearchBar, FilterBar, DownloadMirror, ScreenshotGallery, SystemRequirements, LoadingSkeleton, EmptyState, Modal, Pagination
  pages/ Home, Games, Software, GameDetails, SoftwareDetails, Search, Favorites, Login, Download, Category, NotFound, admin/Admin
  firebase/ config, auth, realtimeDb, firestore (compat wrapper)
  context/ AuthContext, FavoritesContext, ToastContext, FSPlusContext
  data/ sampleData (10 games + 8 software — fictional, no copyrighted assets)
  types/ Game, Software, DownloadMirror, etc.
  layouts/ MainLayout
  hooks/ useDebounce
  utils/ seo
```

## 🚀 Quick Start
```bash
npm install
cp .env.example .env   # fill Firebase keys
npm run dev            # http://localhost:5173
npm run build
npm run preview
```

## 🔑 Firebase Setup (Realtime DB)
1. Create project at https://console.firebase.google.com
2. Enable **Authentication → Email/Password**
3. Create **Realtime Database** in `asia-southeast1` (start in test mode, then apply `database.rules.json`)
4. Project Settings → General → Your apps → Web app → copy config into `.env` (`VITE_FIREBASE_DATABASE_URL` required)
5. Admin: login with `mdswampodsarkar007@gmail.com` (allowlisted in `src/context/AuthContext.tsx:21`) — or set `users/{uid}.isAdmin=true` in Realtime DB
6. Deploy rules: `firebase deploy --only database` or paste `database.rules.json` in console

See `.env.example` for keys. No secrets are hardcoded; `src/firebase/config.ts` reads `import.meta.env.VITE_*`.

## 🔒 Security
- `database.rules.json` included: public read for games/software, user-scoped users/favorites, admin-only writes
- Never put Admin SDK creds in frontend
- Only legally distributable content (freeware/open-source/demos)

## 🎨 Branding
**GameVault** — original identity (violet #6C5CFF + cyan #00E5CC on #070A12), Space Grotesk + Inter, glass borders, not a Steam/Epic clone.

## 📦 Deploy (Vercel)
- Push to GitHub → Import in Vercel → add env vars → deploy
- `vercel.json` rewrites SPA routes to `index.html`

## 🧪 Sample Data
Fictional titles: Shadow Frontier, Neon Drift, Kingdom Reborn, Pixel Raiders, CodeForge Studio, PhotoCraft, etc. Images from Unsplash / CDN, no copyrighted game assets.

## 📄 License
MIT — use freely. Replace sample data with your own licensed content.
