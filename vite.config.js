import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'sentinel-ai' with the EXACT name of your GitHub repository
export default defineConfig({
  plugins: [react()],
  base: '/sentinel-ai/', 
})
