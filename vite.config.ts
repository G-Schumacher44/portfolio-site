import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    include: ['framer-motion'],
  },
  ssr: {
    noExternal: ['framer-motion'],
  },
  build: {
    commonjsOptions: {
      include: [/framer-motion/, /node_modules/],
    },
  },
})
