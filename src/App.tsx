import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/utils/router'
import TopNavBar from '@/components/TopNavBar'
import { ThemeProvider } from "@/components/theme-provider"
import { FooterComponent } from '@/components/FooterComponent'
import i18n from '@/lib/i18n'
import { I18nextProvider } from 'react-i18next'

export default function App() {
	return (
		<I18nextProvider i18n={i18n}>
			<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
				<Suspense fallback={null}>
					<TopNavBar />
					<RouterProvider router={router} />
					<FooterComponent />
				</Suspense>
			</ThemeProvider>
		</I18nextProvider>
	)
}
