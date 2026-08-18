import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import '@/utils/style/index.css'
import App from './App.tsx'
import { queryClient } from './utils/queryClient.ts'
import "@/lib/i18n.ts"; // import i18n config

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
  </StrictMode>,
)