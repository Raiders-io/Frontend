import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/utils/router'
import TopNavBar from './components/TopNavBar'
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
	return(
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Suspense fallback={null}>
				<TopNavBar />
				<RouterProvider router={router} />
			</Suspense>
		</ThemeProvider>
)}
