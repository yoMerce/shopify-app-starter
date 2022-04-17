import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    appOrigin: JSON.stringify(process.env.SHOPIFY_APP_URL.replace(/https:\/\//, "")),
  },
  plugins: [
    react(),
    typescript({
      tsconfig: "./tsconfig-server.json",
    }),
  ],
});
