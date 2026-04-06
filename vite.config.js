import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3210,
  },
  build: {
    outDir: "build",
  },
  esbuild: {
    loader: "jsx",
  },
});
