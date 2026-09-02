import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    proxy: {
      // Backend checker proxy — set VITE_FS_CHECKER_URL to your own backend if you have one
      // This dev proxy forwards /api/check-fs-plus to fs.plus.net.bd for local testing without CORS
      "/api/check-fs-plus": {
        target: "https://fs.plus.net.bd",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/check-fs-plus/, "/Games/"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("User-Agent", "GameVault-Checker/1.0")
          })
        },
      },
    },
  },
})
