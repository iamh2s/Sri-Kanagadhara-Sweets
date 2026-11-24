import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { storefrontSeo } from './scripts/storefrontSeo'

export default defineConfig({
  plugins: [react(), storefrontSeo()],
  server: { proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: false } } },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
