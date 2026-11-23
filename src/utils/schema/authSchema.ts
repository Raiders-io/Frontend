import { z } from "zod"

/**
 * Validation rules shared by every auth-related form (signup, change email,
 * change password). Each form still builds its own object schema, because the
 * cross-field rules differ (confirmation, "different from current", ...).
 */

export const PASSWORD_MIN_LENGTH = 8

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .email("This email address looks invalid (e.g. name@example.com).")

/** A password being chosen (not one being typed to sign in: no length rule there). */
export const newPasswordSchema = z
  .string()
  .min(1, "Choose a password.")
  .min(
    PASSWORD_MIN_LENGTH,
    `Your password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
  )
