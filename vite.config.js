import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Todo lo que empiece con /api se reenvia al servidor de Express.
    // Asi el navegador cree que todo viene del mismo sitio y no hay lios de CORS.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
