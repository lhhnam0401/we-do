import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: {
        name: "We Do",
        short_name: "We Do",
        description: "A shared plan tracker for couples",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#f43f5e",
        orientation: "portrait",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: "NetworkFirst",
            options: { cacheName: "api-cache" },
          },
          {
            urlPattern: /^https?:\/\/.*\/uploads\/.*/,
            handler: "NetworkFirst",
            options: { cacheName: "uploads-cache" },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": { target: "ws://localhost:8000", ws: true },
      "/uploads": { target: "http://localhost:8000" },
    },
  },
});
