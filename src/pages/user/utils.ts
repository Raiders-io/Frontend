import axios from "axios"

interface ApiError {
  message?: string
  errors?: { message: string }[]
}

export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue"): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data
    return data?.errors?.[0]?.message ?? data?.message ?? fallback
  }
  return fallback
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}
