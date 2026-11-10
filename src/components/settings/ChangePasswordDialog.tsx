import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { FormDialog } from "@/components/FormDialog"
import { FormField } from "@/components/FormField"
import { authService } from "@/services/auth_service"
import {
  PASSWORD_MIN_LENGTH,
  newPasswordSchema,
} from "@/utils/schema/authSchema"
import { useTranslation } from 'react-i18next'

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    password: newPasswordSchema,
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

export function ChangePasswordDialog() {
  const { t } = useTranslation()
  const form = useForm<PasswordForm>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  return (
    <FormDialog
      form={form}
      trigger={
        <Button variant="outline" size="sm">
          <KeyRound />
          {t('changePassword', 'Change password')}
        </Button>
      }
      title={t('changePassword', 'Change password')}
      description={t('enterYourCurrentPasswordThenChooseANewOne', 'Enter your current password, then choose a new one.')}
      submitLabel="Update password"
      pendingLabel="Updating…"
      successMessage="Password updated."
      errorMessage="Password update failed. Please try again."
      onSubmit={(values) => authService.changePassword(values)}
      onError={(_, message) => {
        form.resetField("currentPassword")
        form.setError(
          "currentPassword",
          { type: "server", message },
          { shouldFocus: true },
        )
      }}
    >
      <FormField<PasswordForm> name="currentPassword" label={t('currentPassword', 'Current password')}>
        {(control) => (
          <PasswordInput {...control} autoComplete="current-password" />
        )}
      </FormField>

      <FormField<PasswordForm>
        name="password"
        label={t('newPassword', 'New password')}
        hint={t('atLeastPassword_min_lengthCharacters', 'At least {{PASSWORD_MIN_LENGTH}} characters.', { PASSWORD_MIN_LENGTH })}
        options={{
          // Keep the confirmation in sync once it has been filled in.
          onChange: () => {
            if (form.getValues("passwordConfirmation")) {
              void form.trigger("passwordConfirmation")
            }
          },
        }}
      >
        {(control) => <PasswordInput {...control} autoComplete="new-password" />}
      </FormField>

      <FormField<PasswordForm>
        name="passwordConfirmation"
        label={t('confirmNewPassword', 'Confirm new password')}
      >
        {(control) => <PasswordInput {...control} autoComplete="new-password" />}
      </FormField>
    </FormDialog>
  )
}
