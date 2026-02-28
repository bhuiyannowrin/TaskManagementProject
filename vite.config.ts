import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon_io/favicon.ico',
        'favicon_io/favicon-16x16.png',
        'favicon_io/favicon-32x32.png',
        'favicon_io/apple-touch-icon.png',
        'favicon_io/android-chrome-192x192.png',
        'favicon_io/android-chrome-512x512.png'
      ],
      manifest: {
        name: 'TaskFlow - Team Task Manager',
        short_name: 'TaskFlow',
        description: 'Team Task & Workflow Management App',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon_io/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon_io/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/favicon_io/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/favicon_io/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/favicon_io/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true, // ✅ enable manifest in dev mode
        type: 'module',
        navigateFallback: '/', // SPA fallback
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});