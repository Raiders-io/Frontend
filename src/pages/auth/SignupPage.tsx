import { useState } from "react"
import { Controller, useForm, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { isAxiosError } from "axios"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { FormMessage } from "@/components/auth/FormMessage"
import { authService } from "@/services/auth_service"
import { useAuthStore } from "@/utils/stores/auth_store"
import { AuthLayout } from "@/pages/auth/AuthLayout"
import { changePageChooseUsername } from "@/utils/router/changePage"
import { PATHS } from "@/utils/router/paths"
import { emailSchema, newPasswordSchema } from "@/utils/schema/authSchema"

/* -------------------------------------------------------------------------- */
/*  Validation                                                                */
/* -------------------------------------------------------------------------- */

const PASSWORD_MIN_LENGTH = 8

const signupSchema = z
  .object({
    email: emailSchema,
    password: newPasswordSchema,
    passwordConfirmation: z.string().min(1, "Confirm your password."),
    ageConfirmed: z
      .boolean()
      .refine((v) => v, "You must be at least 18 years old to create an account."),
    termsAccepted: z
      .boolean()
      .refine((v) => v, "Accept the terms of service to continue."),
    prohibitedActivitiesAccepted: z
      .boolean()
      .refine(
        (v) => v,
        "You must agree not to use the service for prohibited activities.",
      ),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match.",
    path: ["passwordConfirmation"],
  })

type SignupForm = z.infer<typeof signupSchema>

/* -------------------------------------------------------------------------- */
/*  Server error handling                                                     */
/* -------------------------------------------------------------------------- */

interface ApiFieldError {
  field?: string
  message?: string
  rule?: string
}

interface ApiErrorBody {
  message?: string
  errors?: ApiFieldError[]
}

type SignupFailure =
  | {
      kind: "fields"
      email?: { type: "taken" | "invalid"; message: string }
      password?: string
    }
  | { kind: "banner"; message: string }

const EMAIL_TAKEN_MESSAGE = "An account already exists with this email address."

const banner = (message: string): SignupFailure => ({ kind: "banner", message })

/**
 * Turns any signup error into a user-friendly message, attached to the
 * right field when possible. The raw server text is never displayed.
 */
function parseSignupError(error: unknown): SignupFailure {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return banner("Something unexpected happened. Please try again in a moment.")
  }

  const { response } = error

  // No response: network down, server offline or timeout.
  if (!response) {
    return error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
      ? banner("The server is taking too long to respond. Please try again in a moment.")
      : banner(
          "Can't reach the server. Check your internet connection and try again.",
        )
  }

  const { status, data } = response

  if (status === 409) {
    return {
      kind: "fields",
      email: { type: "taken", message: EMAIL_TAKEN_MESSAGE },
    }
  }

  if (status === 400 || status === 422) {
    const failure: Extract<SignupFailure, { kind: "fields" }> = { kind: "fields" }

    for (const apiError of data?.errors ?? []) {
      if (apiError.field === "email" && !failure.email) {
        const isTaken = /unique|exist|taken|already/i.test(
          `${apiError.rule ?? ""} ${apiError.message ?? ""}`,
        )
        failure.email = isTaken
          ? { type: "taken", message: EMAIL_TAKEN_MESSAGE }
          : { type: "invalid", message: "This email address isn't accepted." }
      }
      if (apiError.field === "password" && !failure.password) {
        failure.password =
          "This password isn't accepted. Please try another one."
      }
    }

    return failure.email || failure.password
      ? failure
      : banner("Some information is invalid. Please check the form.")
  }

  if (status === 429) {
    return banner("Too many attempts. Please wait a moment before trying again.")
  }

  if (status >= 500) {
    return banner(
      "Something went wrong on our side. Please try again in a moment.",
    )
  }

  return banner("Account creation failed. Please try again in a moment.")
}

/* -------------------------------------------------------------------------- */
/*  Small internal components                                                 */
/* -------------------------------------------------------------------------- */

const inlineLinkClass =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"

type ConsentName =
  | "ageConfirmed"
  | "termsAccepted"
  | "prohibitedActivitiesAccepted"

function ConsentField({
  control,
  name,
  error,
  children,
}: {
  control: Control<SignupForm>
  name: ConsentName
  error?: { message?: string }
  children: React.ReactNode
}) {
  const errorId = `${name}-error`
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal" data-invalid={!!error}>
          <Checkbox
            id={name}
            ref={field.ref}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
          <FieldContent>
            {/* The <span> stops the label's flex gap from spacing every word. */}
            <FieldLabel htmlFor={name} className="font-normal">
              <span>{children}</span>
            </FieldLabel>
            <FieldError id={errorId} errors={[error]} className="text-xs" />
          </FieldContent>
        </Field>
      )}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SignupPage() {
  const { setAuth } = useAuthStore()
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    // No errors during first input: validate on blur,
    // then live once the field has been visited.
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      ageConfirmed: false,
      termsAccepted: false,
      prohibitedActivitiesAccepted: false,
    },
  })

  const password = watch("password")
  const passwordConfirmation = watch("passwordConfirmation")
  const isLengthOk = password.length >= PASSWORD_MIN_LENGTH
  const doPasswordsMatch =
    passwordConfirmation.length > 0 && passwordConfirmation === password

  const onSubmit = async ({ email, password }: SignupForm) => {
    setFormError(null)
    try {
      const response = await authService.signup({ email, password, passwordConfirmation})
      setAuth(response.data.user, response.data.token)
      changePageChooseUsername()
    } catch (error) {
      console.error("Signup error:", error)
      const failure = parseSignupError(error)

      if (failure.kind === "banner") {
        setFormError(failure.message)
        return
      }
      if (failure.email) {
        setError(
          "email",
          { type: failure.email.type, message: failure.email.message },
          { shouldFocus: true },
        )
      }
      if (failure.password) {
        setError(
          "password",
          { type: "server", message: failure.password },
          { shouldFocus: !failure.email },
        )
      }
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="A few details and you're ready to go."
      footer={
        <>
          Already have an account?{" "}
          <Link to={PATHS.login} className={inlineLinkClass}>
            Sign in
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
            aria-invalid={!!errors.email}
            aria-describedby="email-message"
            className="h-11 bg-background"
            {...register("email")}
          />
          <FormMessage id="email-message" tone="error">
            {errors.email?.message}
            {errors.email?.type === "taken" && (
              <>
                {" "}
                <Link to={PATHS.login} className={inlineLinkClass}>
                  Sign in?
                </Link>
              </>
            )}
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
            autoComplete="new-password"
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            invalid={!!errors.password}
            aria-describedby="password-message"
            {...register("password", {
              // If the confirmation is already filled in, revalidate it live.
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
            <FormMessage id="password-message" tone={isLengthOk ? "success" : "muted"}>
              {isLengthOk && <Check className="size-3" aria-hidden />}
              At least {PASSWORD_MIN_LENGTH} characters.
            </FormMessage>
          )}
        </div>

        {/* Confirmation */}
        <div className="space-y-1.5">
          <Label
            htmlFor="passwordConfirmation"
            className="text-xs font-medium text-foreground"
          >
            Confirm password
          </Label>
          <PasswordInput
            id="passwordConfirmation"
            autoComplete="new-password"
            visible={showConfirmation}
            onToggle={() => setShowConfirmation((v) => !v)}
            invalid={!!errors.passwordConfirmation}
            aria-describedby="passwordConfirmation-message"
            {...register("passwordConfirmation")}
          />
          {errors.passwordConfirmation ? (
            <FormMessage id="passwordConfirmation-message" tone="error">
              {errors.passwordConfirmation.message}
            </FormMessage>
          ) : (
            <FormMessage
              id="passwordConfirmation-message"
              tone={doPasswordsMatch ? "success" : "muted"}
            >
              {doPasswordsMatch && <Check className="size-3" aria-hidden />}
              {doPasswordsMatch ? "Passwords match." : null}
            </FormMessage>
          )}
        </div>

        {/* Consents */}
        <div className="space-y-3 pt-3">
          <ConsentField
            control={control}
            name="ageConfirmed"
            error={errors.ageConfirmed}
          >
            I'm at least 18 years old
          </ConsentField>

          <ConsentField
            control={control}
            name="termsAccepted"
            error={errors.termsAccepted}
          >
            I agree to the{" "}
            <Link
              to={PATHS.terms}
              target="_blank"
              rel="noreferrer"
              className={inlineLinkClass}
            >
              terms of service
            </Link>{" "}
            and the{" "}
            <Link
              to={PATHS.privacy}
              target="_blank"
              rel="noreferrer"
              className={inlineLinkClass}
            >
              privacy policy
            </Link>
            .
          </ConsentField>

          <ConsentField
            control={control}
            name="prohibitedActivitiesAccepted"
            error={errors.prohibitedActivitiesAccepted}
          >
            I won't use this service for prohibited activities (listed in the{" "}
            <Link
              to={PATHS.terms}
              target="_blank"
              rel="noreferrer"
              className={inlineLinkClass}
            >
              terms of service
            </Link>
            ).
          </ConsentField>
        </div>

        {/* Global error (network, server, too many attempts…) */}
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{formError}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  )
}