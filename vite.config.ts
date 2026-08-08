import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  	plugins: [
		react(),
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) return

					if (id.includes('react-router')) return 'router'
					if (id.includes('react-hook-form') || id.includes('zod')) return 'forms'
					if (id.includes('lucide-react')) return 'icons'
					if (id.includes('@radix-ui')) return 'radix'

					return 'vendor'
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
