import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import { defineConfig } from "vite";

config({
  path: "../.env",
});

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    appOrigin: JSON.stringify(process.env.SHOPIFY_APP_URL.replace(/https:\/\//, "")),
  },
  build: {
    outDir: "../dist/client",
  },
  plugins: [react()],
});
