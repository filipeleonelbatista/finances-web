import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'
import basicSSL from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSSL(),
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true
      },
      includeAssets: ['16.png'],
      manifest: {
        start_url: "/",
        name: 'Minhas Finanças',
        short_name: 'Minhas Finanças',
        description: 'Controle seus gastos pessoais e algance seus objetivos com sucesso',
        theme_color: '#9333ea',
        background_color: '#9333ea',
        orientation: "portrait",
        display: "standalone",
        scope: '/',
        icons: [
          {
            src: '16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '18.png',
            sizes: '18x18',
            type: 'image/png'
          },
          {
            src: '32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '1024.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
