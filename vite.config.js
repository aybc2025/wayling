import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages project site: https://<user>.github.io/wayling/
const BASE = '/wayling/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/favicon-32.png', 'icons/apple-touch-icon.png'],
      workbox: { cacheId: 'wayling', cleanupOutdatedCaches: true, globPatterns: ['**/*.{js,css,html,png,woff2,svg}'] },
      manifest: {
        id: `${BASE}app`,
        name: 'Wayling',
        short_name: 'Wayling',
        description: 'Guide the wanderers home.',
        lang: 'he',
        dir: 'rtl',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'any',
        theme_color: '#17120f',
        background_color: '#17120f',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
});
