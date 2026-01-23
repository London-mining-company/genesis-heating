import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        preact(),
        // Brotli compression for production
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
        }),
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 1024,
        }),
        // Bundle analyzer in analyze mode
        mode === 'analyze' && visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
        }),
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@server': resolve(__dirname, './src/server'),
            '@components': resolve(__dirname, './src/components'),
        },
    },
    build: {
        target: 'esnext',
        modulePreload: {
            polyfill: false,
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
                passes: 3,
                unsafe: true,
            },
            mangle: {
                safari10: true,
                properties: {
                    regex: /^_/ // Mangle private properties starting with _
                }
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            output: {
                // Restore hashing for cache-busting and sync across domains
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]',
            },
        },
        // Aggressive CSS code splitting
        cssCodeSplit: false,
        // Inline assets under 10KB
        assetsInlineLimit: 10240,
        // Report compressed sizes
        reportCompressedSize: true,
    },
    // Security headers for dev server
    server: {
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
    },
}))
