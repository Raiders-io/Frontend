import axios from "axios"

interface ApiError {
  message?: string
  errors?: { message: string }[]
}

/** Extrait le message d'une erreur API (VineJS: errors[0].message, ou message simple). */
export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue"): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data
    return data?.errors?.[0]?.message ?? data?.message ?? fallback
  }
  return fallback
}

interface NameLike {
  firstname: string | null
  lastname: string | null
  username: string
}

export function getDisplayName(user: NameLike): string {
  const full = [user.firstname, user.lastname].filter(Boolean).join(" ")
  return full || user.username
}

export function getInitials(user: NameLike): string {
  const initials = [user.firstname, user.lastname]
    .filter(Boolean)
    .map((part) => part![0])
    .join("")
  return (initials || user.username.slice(0, 2)).toUpperCase()
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}
