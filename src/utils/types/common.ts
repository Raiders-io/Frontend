import z from "zod"

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  first_page: number
  first_page_url: string
  last_page_url: string
  next_page_url: string | null
  previous_page_url: string | null
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
