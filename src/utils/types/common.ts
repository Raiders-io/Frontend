import z from "zod"

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface Paginated<T> {
  meta: PaginationMeta
  data: T[]
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export const USERNAME_MAX_LENGTH = 20
 
export const usernameSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(USERNAME_MAX_LENGTH, `Maximum ${USERNAME_MAX_LENGTH} characters.`)
  .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscore only.")
 
export type Username = z.infer<typeof usernameSchema>
 
export type UsernameUnavailableReason = "reserved" | "invalid" | "taken"
 
export type UsernameCheckResult =
  | { available: true }
  | { available: false; reason: UsernameUnavailableReason }
 
export const USERNAME_REASON_MESSAGES: Record<UsernameUnavailableReason, string> = {
  reserved: "This username is reserved.",
  invalid: "Letters, numbers, and underscore only.",
  taken: "This username is already taken.",
}
