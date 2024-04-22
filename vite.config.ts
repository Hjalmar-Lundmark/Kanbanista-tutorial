import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import UnoCSS from "unocss/vite"

export default defineConfig({
  plugins: [Vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
