import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/utils/router'
import TopNavBar from '@/components/TopNavBar'
import { ThemeProvider } from "@/components/theme-provider"
import { FooterComponent } from '@/components/FooterComponent'

export default function App() {
	return(
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<Suspense fallback={null}>
				<TopNavBar />
				<RouterProvider router={router} />
        	    <FooterComponent />
			</Suspense>
		</ThemeProvider>
)}
