import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages'te site /eto/ alt yolunda yayınlanır; BASE_PATH ile değiştirilebilir.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
