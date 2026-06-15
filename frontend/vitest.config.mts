import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      },
      exclude: [
        'node_modules/**',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'next.config.ts',
        '.next/**',
        'tests/**',
        'vitest.*',
        'src/components/ui/**', // UI components are generated, don't strictly need coverage
        'src/app/layout.tsx' // Exclude top level layouts if needed
      ]
    }
  }
})
