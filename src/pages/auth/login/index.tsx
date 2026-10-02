import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { isAxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/auth_service"
import { useAuthStore } from "@/utils/stores/auth_store"
import { AuthLayout } from "@/pages/auth/auth_layout"
import { changePageHome } from "@/utils/router/changePage"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
})

type LoginForm = z.infer<typeof loginSchema>

type CheckedState = boolean | "indeterminate"

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const [formError, setFormError] = useState<string | null>(null)
  const [isAgeChecked, setIsAgeChecked] = useState(true)
  const [isTermsChecked, setIsTermsChecked] = useState(true)
  const [isTermsProhibitedActivitiesChecked, setIsTermsProhibitedActivitiesChecked] = useState(true)

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })
  const { errors, isSubmitting } = formState

  const areCheckboxesValid = isAgeChecked && isTermsChecked && isTermsProhibitedActivitiesChecked

  const handleAgeChange = (checked: CheckedState) => {
    setIsAgeChecked(checked === true)
  }

  const handleTermsChange = (checked: CheckedState) => {
    setIsTermsChecked(checked === true)
  }

  const handleTermsProhibitedActivitiesChange = (checked: CheckedState) => {
    setIsTermsProhibitedActivitiesChecked(checked === true)
  }

  const onSubmit = async (data: LoginForm) => {
    setFormError(null)
    try {
      const response = await authService.login(data)
      setAuth(response.data.user, response.data.token)
      changePageHome()
    } catch (error) {
      console.error("Login error:", error)
      setFormError(
        isAxiosError(error) && error.response
          ? "Email ou mot de passe incorrect."
          : "Le serveur est injoignable. Réessaie dans un instant.",
      )
    }
  }

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Entre tes identifiants pour accéder à ton compte."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            to="/signup"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Créer un compte
          </Link>
        </>
      }
    >
      <FieldGroup>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@gmail.com"
              autoComplete="email"
              className="h-11 bg-background"
              {...register("email")}
            />
            <p className="min-h-4 text-xs leading-4 text-destructive">
              {errors.email?.message}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-foreground"
            >
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11 bg-background"
              {...register("password")}
            />
            <p className="min-h-4 text-xs leading-4 text-destructive">
              {errors.password?.message}
            </p>
          </div>

          {formError && (
            <div className="rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3">
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}
          <Field orientation="horizontal">
            <Checkbox
              id="age-confirmation"
              name="age-confirmation"
              checked={isAgeChecked}
              onCheckedChange={handleAgeChange}
            />
            <FieldContent>
              <FieldLabel htmlFor="age-confirmation">
                I am at least 18 years old
              </FieldLabel>
              <FieldDescription>
                By clicking this checkbox, you confirm that you are at least 18
                years old.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="terms-checkbox-desc"
              name="terms-checkbox-desc"
              checked={isTermsChecked}
              onCheckedChange={handleTermsChange}
            />
            <FieldContent>
              <FieldLabel htmlFor="terms-checkbox-desc">
                I agree to the terms and conditions
              </FieldLabel>
              <FieldDescription>
                By clicking this checkbox, you agree to the Terms of Service.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="terms-prohibited-activities-checkbox-desc"
              name="terms-prohibited-activities-checkbox-desc"
              checked={isTermsProhibitedActivitiesChecked}
              onCheckedChange={handleTermsProhibitedActivitiesChange}
            />
            <FieldContent>
              <FieldLabel htmlFor="terms-prohibited-activities-checkbox-desc">
                I will not use this service for prohibited activities
              </FieldLabel>
              <FieldDescription>
                By clicking this checkbox, you agree not to use this service for any prohibited activities (listed in the Terms of Service).
              </FieldDescription>
            </FieldContent>
          </Field>
        </form>
      </FieldGroup>
      <Button
        type="submit"
        disabled={isSubmitting || !areCheckboxesValid}
        className="mt-2 h-11 w-full"
        aria-label="Se connecter"
      >
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </Button>
    </AuthLayout>
  )
}
