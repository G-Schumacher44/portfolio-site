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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/mermaid')) return 'mermaid'
          if (id.includes('node_modules/katex')) return 'katex'
          if (id.includes('node_modules/cytoscape')) return 'cytoscape'
          return undefined
        },
      },
    },
  },
})
