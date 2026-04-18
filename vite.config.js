import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
    host: '0.0.0.0',  // expose to all network interfaces
    port: 5173        // or whatever port you're using
  },
  plugins: [react()],
})
