// vite.config.ts
import { defineConfig } from "file:///C:/Users/M/.gemini/antigravity/Apps/btcmining/node_modules/vite/dist/node/index.js";
import preact from "file:///C:/Users/M/.gemini/antigravity/Apps/btcmining/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import { resolve } from "path";
import compression from "file:///C:/Users/M/.gemini/antigravity/Apps/btcmining/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///C:/Users/M/.gemini/antigravity/Apps/btcmining/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "C:\\Users\\M\\.gemini\\antigravity\\Apps\\btcmining";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    preact(),
    // Brotli compression for production
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024
    }),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024
    }),
    // Bundle analyzer in analyze mode
    mode === "analyze" && visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@server": resolve(__vite_injected_original_dirname, "./src/server"),
      "@components": resolve(__vite_injected_original_dirname, "./src/components")
    }
  },
  build: {
    target: "esnext",
    modulePreload: {
      polyfill: false
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.warn", "console.error"],
        passes: 3,
        unsafe: true
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/
          // Mangle private properties starting with _
        }
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Inline small chunks for fewer HTTP requests
        inlineDynamicImports: true,
        // Minimize chunk names
        entryFileNames: "a.js",
        chunkFileNames: "c.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "s.css";
          return "r.[ext]";
        },
        manualChunks: void 0
      }
    },
    // Aggressive CSS code splitting
    cssCodeSplit: false,
    // Inline assets under 10KB
    assetsInlineLimit: 10240,
    // Report compressed sizes
    reportCompressedSize: true
  },
  // Security headers for dev server
  server: {
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxNXFxcXC5nZW1pbmlcXFxcYW50aWdyYXZpdHlcXFxcQXBwc1xcXFxidGNtaW5pbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXE1cXFxcLmdlbWluaVxcXFxhbnRpZ3Jhdml0eVxcXFxBcHBzXFxcXGJ0Y21pbmluZ1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvTS8uZ2VtaW5pL2FudGlncmF2aXR5L0FwcHMvYnRjbWluaW5nL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHByZWFjdCBmcm9tICdAcHJlYWN0L3ByZXNldC12aXRlJ1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBwcmVhY3QoKSxcclxuICAgICAgICAvLyBCcm90bGkgY29tcHJlc3Npb24gZm9yIHByb2R1Y3Rpb25cclxuICAgICAgICBjb21wcmVzc2lvbih7XHJcbiAgICAgICAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcclxuICAgICAgICAgICAgZXh0OiAnLmJyJyxcclxuICAgICAgICAgICAgdGhyZXNob2xkOiAxMDI0LFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGNvbXByZXNzaW9uKHtcclxuICAgICAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXHJcbiAgICAgICAgICAgIGV4dDogJy5neicsXHJcbiAgICAgICAgICAgIHRocmVzaG9sZDogMTAyNCxcclxuICAgICAgICB9KSxcclxuICAgICAgICAvLyBCdW5kbGUgYW5hbHl6ZXIgaW4gYW5hbHl6ZSBtb2RlXHJcbiAgICAgICAgbW9kZSA9PT0gJ2FuYWx5emUnICYmIHZpc3VhbGl6ZXIoe1xyXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICAgICAgICBmaWxlbmFtZTogJ2Rpc3Qvc3RhdHMuaHRtbCcsXHJcbiAgICAgICAgICAgIGd6aXBTaXplOiB0cnVlLFxyXG4gICAgICAgICAgICBicm90bGlTaXplOiB0cnVlLFxyXG4gICAgICAgIH0pLFxyXG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICAgICAgICAgICdAc2VydmVyJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zZXJ2ZXInKSxcclxuICAgICAgICAgICAgJ0Bjb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJyksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgICAgICAgbW9kdWxlUHJlbG9hZDoge1xyXG4gICAgICAgICAgICBwb2x5ZmlsbDogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJywgJ2NvbnNvbGUud2FybicsICdjb25zb2xlLmVycm9yJ10sXHJcbiAgICAgICAgICAgICAgICBwYXNzZXM6IDMsXHJcbiAgICAgICAgICAgICAgICB1bnNhZmU6IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1hbmdsZToge1xyXG4gICAgICAgICAgICAgICAgc2FmYXJpMTA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnZXg6IC9eXy8gLy8gTWFuZ2xlIHByaXZhdGUgcHJvcGVydGllcyBzdGFydGluZyB3aXRoIF9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgICAgICAgICBjb21tZW50czogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgLy8gSW5saW5lIHNtYWxsIGNodW5rcyBmb3IgZmV3ZXIgSFRUUCByZXF1ZXN0c1xyXG4gICAgICAgICAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvLyBNaW5pbWl6ZSBjaHVuayBuYW1lc1xyXG4gICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhLmpzJyxcclxuICAgICAgICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYy5qcycsXHJcbiAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZT8uZW5kc1dpdGgoJy5jc3MnKSkgcmV0dXJuICdzLmNzcydcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3IuW2V4dF0nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBBZ2dyZXNzaXZlIENTUyBjb2RlIHNwbGl0dGluZ1xyXG4gICAgICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXHJcbiAgICAgICAgLy8gSW5saW5lIGFzc2V0cyB1bmRlciAxMEtCXHJcbiAgICAgICAgYXNzZXRzSW5saW5lTGltaXQ6IDEwMjQwLFxyXG4gICAgICAgIC8vIFJlcG9ydCBjb21wcmVzc2VkIHNpemVzXHJcbiAgICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgLy8gU2VjdXJpdHkgaGVhZGVycyBmb3IgZGV2IHNlcnZlclxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcclxuICAgICAgICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJyxcclxuICAgICAgICAgICAgJ1gtWFNTLVByb3RlY3Rpb24nOiAnMTsgbW9kZT1ibG9jaycsXHJcbiAgICAgICAgICAgICdSZWZlcnJlci1Qb2xpY3knOiAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0pKVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVVLFNBQVMsb0JBQW9CO0FBQ3BXLE9BQU8sWUFBWTtBQUNuQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxrQkFBa0I7QUFKM0IsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN2QyxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUE7QUFBQSxJQUVQLFlBQVk7QUFBQSxNQUNSLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUNmLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQSxNQUNSLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUNmLENBQUM7QUFBQTtBQUFBLElBRUQsU0FBUyxhQUFhLFdBQVc7QUFBQSxNQUM3QixNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDaEIsQ0FBQztBQUFBLEVBQ0wsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQy9CLFdBQVcsUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDNUMsZUFBZSxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLElBQ3hEO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ1gsVUFBVTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNYLFVBQVU7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixpQkFBaUIsZ0JBQWdCLGVBQWU7QUFBQSxRQUM1RixRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsTUFDWjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ0osVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFVBQ1IsT0FBTztBQUFBO0FBQUEsUUFDWDtBQUFBLE1BQ0o7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNKLFVBQVU7QUFBQSxNQUNkO0FBQUEsSUFDSjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ1gsUUFBUTtBQUFBO0FBQUEsUUFFSixzQkFBc0I7QUFBQTtBQUFBLFFBRXRCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQixDQUFDLGNBQWM7QUFDM0IsY0FBSSxVQUFVLE1BQU0sU0FBUyxNQUFNLEVBQUcsUUFBTztBQUM3QyxpQkFBTztBQUFBLFFBQ1g7QUFBQSxRQUNBLGNBQWM7QUFBQSxNQUNsQjtBQUFBLElBQ0o7QUFBQTtBQUFBLElBRUEsY0FBYztBQUFBO0FBQUEsSUFFZCxtQkFBbUI7QUFBQTtBQUFBLElBRW5CLHNCQUFzQjtBQUFBLEVBQzFCO0FBQUE7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNKLFNBQVM7QUFBQSxNQUNMLDBCQUEwQjtBQUFBLE1BQzFCLG1CQUFtQjtBQUFBLE1BQ25CLG9CQUFvQjtBQUFBLE1BQ3BCLG1CQUFtQjtBQUFBLElBQ3ZCO0FBQUEsRUFDSjtBQUNKLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
