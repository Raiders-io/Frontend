import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/utils/style/index.css'
import App from './App.tsx'
import axios from 'axios'

//TODO REMOVE THIS ITS A TEST IDK
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,

      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response && error.response.status < 500) return false
        return failureCount < 2
      },
    },
  },
})
 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
  </StrictMode>,
)