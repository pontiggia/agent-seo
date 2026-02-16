import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/middleware.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node20',
  splitting: false,
  external: ['next', 'react', 'react-dom'],
});
