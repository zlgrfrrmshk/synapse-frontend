import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 7020, 
    proxy: {
      "/api": "http://localhost:7021",
      "/storage": "http://localhost:7021",
    }
  }
})
