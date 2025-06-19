import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["client"],
    host: true,
    port: 3001,
    hmr: false,
    proxy: {
      "/socket.io/": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
