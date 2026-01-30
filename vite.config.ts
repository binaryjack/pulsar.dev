import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'jsx-runtime': resolve(__dirname, 'src/jsx-runtime.ts'),
        'jsx-dev-runtime': resolve(__dirname, 'src/jsx-dev-runtime.ts'),
        bootstrap: resolve(__dirname, 'src/bootstrap/index.ts'),
        hooks: resolve(__dirname, 'src/hooks/index.ts'),
        reactivity: resolve(__dirname, 'src/reactivity/index.ts'),
        router: resolve(__dirname, 'src/router/index.ts'),
        events: resolve(__dirname, 'src/events/index.ts'),
        lifecycle: resolve(__dirname, 'src/lifecycle/index.ts'),
        context: resolve(__dirname, 'src/context/index.ts'),
        di: resolve(__dirname, 'src/di/index.ts'),
        'control-flow': resolve(__dirname, 'src/control-flow/index.ts'),
        'error-boundary': resolve(__dirname, 'src/error-boundary/index.ts'),
        portal: resolve(__dirname, 'src/portal/index.ts'),
        resource: resolve(__dirname, 'src/resource/index.ts'),
        state: resolve(__dirname, 'src/state/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return 'index.js';
        }
        return `${entryName}/index.js`;
      },
    },
    rollupOptions: {
      external: ['fs', 'fs/promises', 'path', 'node:fs', 'node:fs/promises', 'node:path'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: ({ name }) => {
          if (name === 'index') return 'index.js';
          return `${name}.js`;
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    dts({
      outDir: 'dist',
      insertTypesEntry: true,
      include: ['src/**/*', 'index.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
