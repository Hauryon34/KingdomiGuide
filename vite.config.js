import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/KingdomiGuide/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'crown.svg'],
      manifest: {
        name: 'KingdomiGuide',
        short_name: 'Kingdomino',
        description: 'Compagnon pour le jeu Kingdomino - Tirage, Règles & Calculateur',
        start_url: '/KingdomiGuide/',
        scope: '/KingdomiGuide/',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/KingdomiGuide/icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}']
      }
    })
  ]
});
