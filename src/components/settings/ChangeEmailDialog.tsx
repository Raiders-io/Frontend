import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { FormDialog } from "@/components/FormDialog"
import { FormField } from "@/components/FormField"
import { authService } from "@/services/auth_service"
import { useAuthStore } from "@/utils/stores/auth_store"
import { emailSchema } from "@/utils/schema/authSchema"
import { getErrorStatus } from "@/utils/utils/misc"
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const makeSchema = (currentEmail: string) =>
  z
    .object({
      email: emailSchema,
      password: z.string().min(1, "Enter your password to confirm."),
    })
    .refine((d) => d.email !== currentEmail.trim().toLowerCase(), {
      message: i18next.t('thisIsAlreadyYourEmailAddress', 'This is already your email address.'),
      path: ["email"],
    })

type EmailForm = z.infer<ReturnType<typeof makeSchema>>

export function ChangeEmailDialog() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)

  const currentEmail = user?.email ?? ""
  const schema = useMemo(() => makeSchema(currentEmail), [currentEmail])

  const form = useForm<EmailForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })

  return (
    <FormDialog
      form={form}
      trigger={
        <Button variant="outline" size="sm" disabled={!user}>
          <Mail />
          {t('changeEmail', 'Change email')}
        </Button>
      }
      title={t('changeEmail', 'Change email')}
      description={
        <>
          {t('yourCurrentAddressIs', 'Your current address is')} <strong>{currentEmail}</strong>{t('confirmPasswordChange', '. Confirm with\n          your password to change it.')}
        </>
      }
      submitLabel="Update email"
      pendingLabel="Updating…"
      successMessage="Email updated."
      errorMessage="Email update failed. Please try again."
      onSubmit={async (values) => {
        await authService.changeEmail(values)
        if (user) setAuth({ ...user, email: values.email }, token)
      }}
      onError={(error, message) => {
        const field = getErrorStatus(error) === 409 ? "email" : "password"
        form.setError(field, { type: "server", message }, { shouldFocus: true })
      }}
    >
      <FormField<EmailForm> name="email" label={t('newEmail', 'New email')}>
        {(control) => (
          <Input
            {...control}
            type="email"
            inputMode="email"
            placeholder="exemple@gmail.com"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            className="h-11 bg-background"
          />
        )}
      </FormField>

      <FormField<EmailForm> name="password" label="Password">
        {(control) => (
          <PasswordInput {...control} autoComplete="current-password" />
        )}
      </FormField>
    </FormDialog>
  )
}
