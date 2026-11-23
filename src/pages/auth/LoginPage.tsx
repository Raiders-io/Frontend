import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { isAxiosError } from "axios"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { FormMessage } from "@/components/auth/FormMessage"
import { authService } from "@/services/auth_service"
import { useAuthStore } from "@/utils/stores/auth_store"
import { AuthLayout } from "@/pages/auth/AuthLayout"
import { changePageHome } from "@/utils/router/changePage"
import { PATHS } from "@/utils/router/paths"

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

// No minimum length on login: it only blocks legitimate users (older
// accounts, other password policies) and tells attackers the rules.
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address.")
    .email("This email address looks invalid (e.g. name@example.com)."),
  password: z.string().min(1, "Enter your password."),
})

type LoginForm = z.infer<typeof loginSchema>

/* -------------------------------------------------------------------------- */
/*  Server error handling                                                     */
/* -------------------------------------------------------------------------- */

interface LoginFailure {
  message: string
  /** Wrong email/password: both fields get flagged. */
  isCredentials: boolean
}

const failure = (message: string, isCredentials = false): LoginFailure => ({
  message,
  isCredentials,
})

/**
 * Turns any login error into a user-friendly message. The raw server text is
 * never displayed, and a wrong email and a wrong password are deliberately
 * indistinguishable (no account enumeration).
 */
function parseLoginError(error: unknown): LoginFailure {
  if (!isAxiosError(error)) {
    return failure("Something unexpected happened. Please try again in a moment.")
  }

  const { response } = error

  // No response: network down, server offline or timeout.
  if (!response) {
    return error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
      ? failure("The server is taking too long to respond. Please try again in a moment.")
      : failure("Can't reach the server. Check your internet connection and try again.")
  }

  const { status } = response

  if (status === 400 || status === 401 || status === 422) {
    return failure("Incorrect email or password.", true)
  }
  if (status === 429) {
    return failure("Too many attempts. Please wait a moment before trying again.")
  }
  if (status >= 500) {
    return failure("Something went wrong on our side. Please try again in a moment.")
  }
  return failure("Sign in failed. Please try again in a moment.")
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const [formError, setFormError] = useState<LoginFailure | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    // No errors during first input: validate on blur,
    // then live once the field has been visited.
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })

  // The global error describes the previous attempt: drop it as soon as the
  // user edits a field.
  useEffect(() => {
    const { unsubscribe } = watch(() => setFormError(null))
    return () => unsubscribe()
  }, [watch])

  const onSubmit = async (data: LoginForm) => {
    setFormError(null)
    try {
      const response = await authService.login(data)
      setAuth(response.data.user, response.data.token)
      changePageHome()
    } catch (error) {
      console.error("Login error:", error)
      const result = parseLoginError(error)
      setFormError(result)
      // Wrong credentials: put the cursor back on the password, selected,
      // so retyping replaces it.
      if (result.isCredentials) setFocus("password", { shouldSelect: true })
    }
  }

  const credentialsInvalid = formError?.isCredentials === true

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Enter your credentials to access your account."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to={PATHS.signup}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Create an account
          </Link>
        </>
      }
    >
      {/* noValidate: let zod handle messages instead of the browser's
          native bubbles on type="email". */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            placeholder="exemple@gmail.com"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            autoFocus
            aria-invalid={!!errors.email || credentialsInvalid}
            aria-describedby="email-message"
            className="h-11 bg-background"
            {...register("email")}
          />
          <FormMessage id="email-message" tone="error">
            {errors.email?.message}
          </FormMessage>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-foreground"
          >
            Password
          </Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            invalid={!!errors.password || credentialsInvalid}
            aria-describedby="password-message"
            {...register("password")}
          />
          <FormMessage id="password-message" tone="error">
            {errors.password?.message}
          </FormMessage>
        </div>

        {/* Global error (wrong credentials, network, server, too many attempts…) */}
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{formError.message}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  )
}