import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      emptyOutDir: true,
      rollupOptions: {
        input: 'src/main/index.ts',
        output: {
          format: 'cjs',
          entryFileNames: 'index.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      emptyOutDir: true,
      rollupOptions: {
        input: 'src/preload/index.ts',
        output: {
          format: 'cjs',
          entryFileNames: 'index.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    build: {
      outDir: 'dist/renderer',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve('src/renderer/index.html')
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    },
    define: {
      'process.env': {}
    },
    server: {
      port: 3000,
      strictPort: true,
      open: false
    },
    plugins: [react()]
  }
})
