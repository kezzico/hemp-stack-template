// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  target: 'node23', // or whatever Node version you're using
  format: ['cjs'], // CommonJS for Node.js
  sourcemap: true,
  clean: true,
  loader: {
    '.json': 'dataurl',
  },

})
