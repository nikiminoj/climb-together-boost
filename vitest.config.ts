import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['supabase/migrations/__tests__/**/*.test.ts'],
    globals: true,
    setupFiles: ['supabase/migrations/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['supabase/migrations/**/*.sql'],
      exclude: ['supabase/migrations/__tests__/**']
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})