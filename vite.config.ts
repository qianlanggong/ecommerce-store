import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
    minify: 'esbuild',
    target: 'es2020',
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-http-backend', 'i18next-browser-languagedetector'],
          query: ['@tanstack/react-query'],
          state: ['zustand'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          shopify: ['@shopify/hydrogen-react', '@shopify/storefront-api-client'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    tailwindcss(),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root',
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      'lucide-react',
      'i18next',
      'react-i18next',
    ],
    exclude: ['@shopify/hydrogen-react'],
  },
})
