import axios from "axios"
import i18next from 'i18next'

interface ApiError {
  message?: string
  errors?: { message: string }[]
}

/* i18next-disable */
export function getErrorMessage(
  error: unknown,
  fallback: string = i18next.t('failedToLoadData', 'Failed to load data'),
): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data
    return data?.errors?.[0]?.message ?? data?.message ?? fallback
  }
  return fallback
}
/* i18next-enable */

export function formatDate(iso?: string | null): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}
