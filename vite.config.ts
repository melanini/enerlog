import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from '@vite-pwa/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Energy Tracker',
        short_name: 'EnergyTracker',
        description: 'Track your cognitive clarity and physical energy throughout the day',
        theme_color: '#c45e99',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        categories: ['health', 'lifestyle', 'productivity'],
        lang: 'en',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: false // Disabled for development stability
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/contexts': path.resolve(__dirname, './contexts'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/services': path.resolve(__dirname, './services'),
      '@/styles': path.resolve(__dirname, './styles')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-slider', '@radix-ui/react-dialog'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})