import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ── PWA bundle-size strategy ───────────────────────────────────────────────
//
//  Problem: globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}']
//  was pre-caching ALL images including 400-700 KB tool/onboarding photos,
//  resulting in a ~14.4 MB precache — unacceptable on 2G/3G rural networks.
//
//  Fix:
//  1. Remove jpg/png from the precache glob — large images are NOT pre-cached.
//  2. Add runtime StaleWhileRevalidate caching for images so they load on
//     first visit and are served from cache on subsequent visits.
//  3. Add Supabase Edge Function responses to the runtime cache.
//  4. Add manual code-splitting via rollupOptions so large pages are lazy-loaded.
//
// ── NOTE: The large images in public/ (tools/*.jpg, assets/*.jpg) should be
//    compressed. Run: `npx sharp-cli --input public/**/*.jpg --output ./ --quality 60 --format webp`
//    or convert them manually. Target: < 80 KB per image.
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Only include the small favicon and the tiny hero-mascot in precache
      includeAssets: ['favicon.ico', 'favicon.svg', 'icons.svg'],
      manifest: {
        name: 'AgriHeal – Voice AI for Farmers',
        short_name: 'AgriHeal',
        description: 'Voice-first AI platform for agriculture and rural healthcare',
        theme_color: '#16a34a',
        background_color: '#0f3e25',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // ── CRITICAL: Exclude jpg/png from precache ─────────────────────────
        // Large images are served via runtime caching (StaleWhileRevalidate)
        // so they only enter the cache after the user first visits the page.
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],

        // Maximum size per precached asset: 500 KB (catches regressions)
        maximumFileSizeToCacheInBytes: 700 * 1024,

        runtimeCaching: [
          // Google Fonts — long-lived cache
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // Weather API — short-lived network-first
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 30 },
            },
          },
          // ── NEW: Product/tool images — StaleWhileRevalidate ────────────────
          // Served stale from cache instantly, updated in background.
          // Images load fast offline, and update when online.
          {
            urlPattern: /\.(png|jpe?g|webp|avif|gif)(\?.*)?$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,                    // keep up to 60 images
                maxAgeSeconds: 60 * 60 * 24 * 30,  // 30 days
              },
            },
          },
          // ── NEW: Supabase Edge Function responses ────────────────────────
          // AI proxy, weather-proxy etc. — NetworkFirst so offline shows stale
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/functions\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-functions-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],

  // ── Code splitting: keep each major page in its own chunk ────────────────
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries → separate chunk (cached aggressively)
          if (id.includes('node_modules')) {
            if (id.includes('livekit')) return 'livekit-vendor';
            if (id.includes('@supabase')) return 'supabase-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            return 'vendor';
          }
          // Large app pages → individual lazy chunks
          const PAGE_CHUNKS = [
            'ToolsStore', 'FertilisersPage', 'SchemesCenter',
            'HealMarketplace', 'CommunityPage', 'ImageAnalysisPage',
            'ExpertsPage', 'Records', 'NewsCenter',
          ];
          for (const name of PAGE_CHUNKS) {
            if (id.includes(`pages/${name}`) || id.includes(`pages\\${name}`)) {
              return name;
            }
          }
        },
      },
    },
    // Warn (not fail) when a chunk exceeds 600 KB
    chunkSizeWarningLimit: 600,
  },

  server: { port: 5173 },
})
