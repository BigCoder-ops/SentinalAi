import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/


// Replace 'repo-name' with the exact name of your GitHub repository
export default defineConfig({
  plugins: [react()],
  base: '/repo-name/', 
})