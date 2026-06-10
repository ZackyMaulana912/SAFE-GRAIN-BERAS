import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/detect': 'http://127.0.0.1:5000',
      '/history': 'http://127.0.0.1:5000',
      '/stats': 'http://127.0.0.1:5000',
      '/health': 'http://127.0.0.1:5000',
    }
  }
})
