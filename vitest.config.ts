import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/**/*.test.{ts,tsx}', '!tests/**/*.ui.test.{ts,tsx}'],
          setupFiles: ['./tests/setup.node.ts']
        }
      },
      {
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['tests/**/*.ui.test.{ts,tsx}'],
          setupFiles: ['./tests/setup.ui.ts']
        }
      }
    ]
  }
})
