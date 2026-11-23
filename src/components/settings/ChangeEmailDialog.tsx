import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isAxiosError } from "axios"
import { AlertCircle, Loader2, Mail } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { FormMessage } from "@/components/auth/FormMessage"
import { authService } from "@/services/auth_service"
import { useAuthStore } from "@/utils/stores/auth_store"

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

// Built from the current email so the schema can reject "same address".
const makeSchema = (currentEmail: string) =>
  z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Enter your new email address.")
        .email("This email address looks invalid (e.g. name@example.com)."),
      password: z.string().min(1, "Enter your password to confirm."),
    })
    .refine((d) => d.email !== currentEmail.trim().toLowerCase(), {
      message: "This is already your email address.",
      path: ["email"],
    })

type EmailForm = z.infer<ReturnType<typeof makeSchema>>
type FieldName = keyof EmailForm

/* -------------------------------------------------------------------------- */
/*  Server error handling                                                     */
/* -------------------------------------------------------------------------- */

interface ApiErrorBody {
  errors?: { field?: string; message?: string; rule?: string }[]
}

interface Failure {
  field?: FieldName
  type?: string
  message: string
}

const EMAIL_TAKEN = "An account already exists with this email address."

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

  if (status === 409) return { field: "email", type: "taken", message: EMAIL_TAKEN }
  if (status === 401 || status === 403) {
    return { field: "password", message: "Incorrect password." }
  }
  if (status === 400 || status === 422) {
    for (const apiError of data?.errors ?? []) {
      if (apiError.field === "password") {
        return { field: "password", message: "Incorrect password." }
      }
      if (apiError.field === "email") {
        const taken = /unique|exist|taken|already/i.test(
          `${apiError.rule ?? ""} ${apiError.message ?? ""}`,
        )
        return taken
          ? { field: "email", type: "taken", message: EMAIL_TAKEN }
          : { field: "email", message: "This email address isn't accepted." }
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
  return { message: "Email update failed. Please try again in a moment." }
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ChangeEmailDialog() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)

  const currentEmail = user?.email ?? ""
  const schema = useMemo(() => makeSchema(currentEmail), [currentEmail])

  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmailForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    const { unsubscribe } = watch(() => setFormError(null))
    return () => unsubscribe()
  }, [watch])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      reset()
      setFormError(null)
      setShowPassword(false)
    }
  }

  const onSubmit = async (values: EmailForm) => {
    setFormError(null)
    try {
      await authService.changeEmail(values)
      // Keep the persisted session in sync with the new address.
      if (user) setAuth({ ...user, email: values.email }, token)
      toast.success("Email updated.")
      handleOpenChange(false)
    } catch (error) {
      console.error("Change email error:", error)
      const failure = parseError(error)
      if (failure.field) {
        setError(
          failure.field,
          { type: failure.type ?? "server", message: failure.message },
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
        <Button variant="outline" size="sm" disabled={!user}>
          <Mail />
          Change email
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>
            Your current address is <strong>{currentEmail}</strong>. Confirm
            with your password to change it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
          <div className="space-y-1.5">
            <Label htmlFor="new-email" className="text-xs font-medium text-foreground">
              New email
            </Label>
            <Input
              id="new-email"
              type="email"
              inputMode="email"
              placeholder="exemple@gmail.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              aria-invalid={!!errors.email}
              aria-describedby="new-email-message"
              className="h-11 bg-background"
              {...register("email")}
            />
            <FormMessage id="new-email-message" tone="error">
              {errors.email?.message}
            </FormMessage>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email-password"
              className="text-xs font-medium text-foreground"
            >
              Password
            </Label>
            <PasswordInput
              id="email-password"
              autoComplete="current-password"
              visible={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              invalid={!!errors.password}
              aria-describedby="email-password-message"
              {...register("password")}
            />
            <FormMessage id="email-password-message" tone="error">
              {errors.password?.message}
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
              {isSubmitting ? "Updating…" : "Update email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
