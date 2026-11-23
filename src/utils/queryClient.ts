import { getErrorMessage } from "@/pages/user/utils"
import { QueryCache, QueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

const MAX_RETRIES = 2

function shouldRetry(failureCount: number, error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    // Pas de retry sur les erreurs client (404, 403, 401, 422...)
    // sauf 408 (timeout) et 429 (rate limit), qui peuvent passer au 2e essai
    if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
      return false
    }
  }
  return failureCount < MAX_RETRIES
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // ex: expiration de session -> déconnexion / redirection login
        // useAuthStore.getState().logout()
      }
	  if (axios.isAxiosError(error) && error.response?.status === 404) return
      if (query.meta?.silent) return
      toast.error(getErrorMessage(error, "Something went wrong"))

    },
  }),
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,                  // ne jamais rejouer une mutation automatiquement
    },
  },
})
