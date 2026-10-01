/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@assets': fileURLToPath(new URL('./public/assets', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@auth': fileURLToPath(new URL('./src/auth', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    env: {
      VITE_API_URL: 'http://api.test',
    },
  },
})
