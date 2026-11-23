import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { "/api": "http://localhost:4000" },
  },
  // backend/app.js serves frontend/build.
  build: { outDir: "build" },
});
