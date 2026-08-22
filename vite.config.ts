import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"
import { default_config_image_opti } from "./vite-plugin-image-optimizer.config"
import removeConsole from "vite-plugin-remove-console"
import { removeConsoleConfig } from "./removeConsole.config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer(default_config_image_opti),
    removeConsole(removeConsoleConfig),
  ],
  build: {
    sourcemap: false, // True if you want source maps for debugging
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name(id) {
                if (!id.includes("node_modules")) return
                if (id.includes("react-router")) return "router"
                if (id.includes("react-hook-form") || id.includes("zod"))
                  return "forms"
                if (id.includes("lucide-react")) return "icons"
                if (id.includes("@radix-ui")) return "radix"
                return "vendor"
              },
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
