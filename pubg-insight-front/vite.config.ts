import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/healthcheck": {
        target: "https://api.pubginfohub.com",
        changeOrigin: true,
        secure: true
      }
    }
  }
})
