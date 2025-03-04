import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // ✅ Yeh ensure karega ki Storybook alias ko samjhe
    },
  },
});
