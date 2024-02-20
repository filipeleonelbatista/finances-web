import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: true
      },
      includeAssets: ['icon.png'],
      manifest: {
        name: 'Minhas Finanças',
        short_name: 'Minhas Finanças',
        description: 'Controle seus gastos pessoais e algance seus objetivos com sucesso',
        theme_color: '#9333ea',
        icons: [
          {
            src: 'icon.png',
            sizes: '89x89',
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
