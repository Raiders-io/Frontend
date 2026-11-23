import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isAxiosError } from "axios"
import { AlertCircle, KeyRound, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { FormMessage } from "@/components/auth/FormMessage"
import { authService } from "@/services/auth_service"

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

const PASSWORD_MIN_LENGTH = 8

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    password: z
      .string()
      .min(1, "Choose a new password.")
      .min(
        PASSWORD_MIN_LENGTH,
        `Your password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
      ),
    passwordConfirmation: z.string().min(1, "Confirm your new password."),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: "Passwords don't match.",
    path: ["passwordConfirmation"],
  })
  .refine((d) => d.password !== d.currentPassword, {
    message: "The new password must be different from the current one.",
    path: ["password"],
  })

type PasswordForm = z.infer<typeof schema>
type FieldName = keyof PasswordForm

/* -------------------------------------------------------------------------- */
/*  Server error handling                                                     */
/* -------------------------------------------------------------------------- */

interface ApiErrorBody {
  errors?: { field?: string; message?: string }[]
}

interface Failure {
  /** When set, the message is attached to this field instead of the banner. */
  field?: FieldName
  message: string
}

const WRONG_CURRENT = "Incorrect current password."

function parseError(error: unknown): Failure {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return {
      message: "Something unexpected happened. Please try again in a moment.",
    }
  }

  const { response } = error
  if (!response) {
    return {
      message:
        error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
          ? "The server is taking too long to respond. Please try again in a moment."
          : "Can't reach the server. Check your internet connection and try again.",
    }
  }

  const { status, data } = response

  if (status === 401 || status === 403) {
    return { field: "currentPassword", message: WRONG_CURRENT }
  }
  if (status === 400 || status === 422) {
    for (const apiError of data?.errors ?? []) {
      if (apiError.field === "currentPassword") {
        return { field: "currentPassword", message: WRONG_CURRENT }
      }
      if (apiError.field === "password") {
        return {
          field: "password",
          message: "This password isn't accepted. Please try another one.",
        }
      }
    }
    return { message: "Some information is invalid. Please check the form." }
  }
  if (status === 429) {
    return {
      message: "Too many attempts. Please wait a moment before trying again.",
    }
  }
  if (status >= 500) {
    return {
      message: "Something went wrong on our side. Please try again in a moment.",
    }
  }
  return { message: "Password update failed. Please try again in a moment." }
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const HIDDEN = { current: false, next: false, confirm: false }

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [visible, setVisible] = useState(HIDDEN)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  // The banner describes the previous attempt: drop it as soon as a field changes.
  useEffect(() => {
    const { unsubscribe } = watch(() => setFormError(null))
    return () => unsubscribe()
  }, [watch])

  const toggle = (key: keyof typeof HIDDEN) =>
    setVisible((v) => ({ ...v, [key]: !v[key] }))

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      reset()
      setFormError(null)
      setVisible(HIDDEN)
    }
  }

  const onSubmit = async (values: PasswordForm) => {
    setFormError(null)
    try {
      await authService.changePassword(values)
      toast.success("Password updated.")
      handleOpenChange(false)
    } catch (error) {
      console.error("Change password error:", error)
      const failure = parseError(error)
      if (failure.field) {
        setError(
          failure.field,
          { type: "server", message: failure.message },
          { shouldFocus: true },
        )
      } else {
        setFormError(failure.message)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyRound />
          Change password
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password, then choose a new one.
          </DialogDescription>
        </DialogHeader>

        {/* noValidate: zod handles the messages. */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="currentPassword"
              className="text-xs font-medium text-foreground"
            >
              Current password
            </Label>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              autoFocus
              visible={visible.current}
              onToggle={() => toggle("current")}
              invalid={!!errors.currentPassword}
              aria-describedby="currentPassword-message"
              {...register("currentPassword")}
            />
            <FormMessage id="currentPassword-message" tone="error">
              {errors.currentPassword?.message}
            </FormMessage>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-foreground"
            >
              New password
            </Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              visible={visible.next}
              onToggle={() => toggle("next")}
              invalid={!!errors.password}
              aria-describedby="password-message"
              {...register("password", {
                // Keep the confirmation in sync once it has been filled in.
                onChange: () => {
                  if (getValues("passwordConfirmation")) {
                    void trigger("passwordConfirmation")
                  }
                },
              })}
            />
            {errors.password ? (
              <FormMessage id="password-message" tone="error">
                {errors.password.message}
              </FormMessage>
            ) : (
              <FormMessage id="password-message" tone="muted">
                At least {PASSWORD_MIN_LENGTH} characters.
              </FormMessage>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="passwordConfirmation"
              className="text-xs font-medium text-foreground"
            >
              Confirm new password
            </Label>
            <PasswordInput
              id="passwordConfirmation"
              autoComplete="new-password"
              visible={visible.confirm}
              onToggle={() => toggle("confirm")}
              invalid={!!errors.passwordConfirmation}
              aria-describedby="passwordConfirmation-message"
              {...register("passwordConfirmation")}
            />
            <FormMessage id="passwordConfirmation-message" tone="error">
              {errors.passwordConfirmation?.message}
            </FormMessage>
          </div>

          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? "Updating…" : "Update password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
