// pages/ChooseUsernamePage.tsx
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Navigate } from "react-router-dom" // adapte à ton routeur
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FieldError, FieldGroup } from "@/components/ui/field"
import { UserAvatar } from "@/components/user/UserAvatar"
import {
  UsernameField,
  randomUsername,
  useUsernameStatus,
} from "@/components/user/UsernameField"
import { useMe, useUpdateMe } from "@/services/user/user_queries"
import type { PrivateProfile } from "@/utils/types/user"
import { usernameSchema } from "@/utils/types/common"
import { getErrorMessage } from "./utils"
import { PATHS } from "@/utils/router/paths"
import { useTranslation } from 'react-i18next'

const schema = z.object({ username: usernameSchema })
type FormValues = z.infer<typeof schema>

export default function ChooseUsername() {
  const { data: me, isLoading } = useMe()

  if (isLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </main>
    )
  }

  if (!me) return <Navigate to={PATHS.home} replace />

  return <ChooseUsernameForm me={me} />
}

function ChooseUsernameForm({ me }: { me: PrivateProfile }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const updateMe = useUpdateMe()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: randomUsername() },
  })
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form

  const username = useWatch({ name: "username", control })

  const { unchanged, canSubmit: usernameOk } = useUsernameStatus(
    username ?? "",
    me.username,
  )

  const done = () => navigate("/", { replace: true })

  const onSubmit = async ({ username }: FormValues) => {
    try {
      if (!unchanged) await updateMe.mutateAsync({ username })
      done()
    } catch (e) {
      setError("root", {
        message: getErrorMessage(e, "Failed to update username"),
      })
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8">
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <UserAvatar user={me} className="size-18" />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">{t('chooseYourUsername', 'Choose your username')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('this_how_other_users', 'This is how other users will see you. You can change it later in\n                your profile.')}
              </p>
            </div>
          </div>

          <FieldGroup className="gap-5">
            <UsernameField current={me.username} autoFocus />
            <FieldError errors={[errors.root]} />
          </FieldGroup>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !usernameOk}
            >
              {isSubmitting && <Loader2 />}
              {isSubmitting
                ? "Saving..."
                : unchanged
                  ? "Continue"
                  : t('saveAndContinue', 'Save and continue')}
            </Button>
            {!unchanged && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isSubmitting}
                onClick={done}
              >{t('keepUsername', 'Keep {{username}}', { username: me.username })}</Button>
            )}
          </div>
        </form>
      </FormProvider>
    </main>
  )
}
