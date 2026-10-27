import { useFormContext } from "react-hook-form"
import { Dices, Loader2 } from "lucide-react"
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { useUsernameAvailability } from "@/services/user/user_queries"
import { usernameSchema, USERNAME_REASON_MESSAGES, USERNAME_MAX_LENGTH } from "@/utils/types/common"

export function randomUsername() {
  const suffix = String(Math.floor(Math.random() * 100))
  const base = uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: "_", length: 2 })
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, USERNAME_MAX_LENGTH - suffix.length)
  return base + suffix
}

export function useUsernameStatus(username: string, current: string) {
  const value = username.trim()
  const unchanged = value === current
  const shouldCheck = usernameSchema.safeParse(value).success && !unchanged
  const { isChecking, result, isError } = useUsernameAvailability(value, shouldCheck)
  const available = result?.available === true
  const unavailableMessage = result && "reason" in result ? USERNAME_REASON_MESSAGES[result.reason] : null

  return {
    value,
    unchanged,
    isChecking,
    isError,
    available,
    unavailableMessage,
    canSubmit: unchanged || (shouldCheck && !isChecking && available),
  }
}

export function UsernameField({ current, autoFocus }: { current: string; autoFocus?: boolean }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<{ username: string }>()
  const s = useUsernameStatus(watch("username") ?? "", current)

  const invalid = !!errors.username || !!s.unavailableMessage

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="username"
          autoComplete="off"
          autoFocus={autoFocus}
          aria-invalid={invalid}
          {...register("username")}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label="Generate a random username"
            onClick={() => setValue("username", randomUsername(), { shouldValidate: true, shouldDirty: true })}
          >
            <Dices />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="h-7 flex items-start">
        {errors.username ? (
          <FieldError className="m-0! p-0!" errors={[errors.username]} />
        ) : s.unavailableMessage ? (
          <FieldDescription className="m-0! p-0! text-destructive">
            {s.unavailableMessage}
          </FieldDescription>
        ) : s.isError ? (
          <FieldDescription className="m-0! p-0! text-destructive">
            Could not check availability. Try again.
          </FieldDescription>
        ) : s.isChecking ? (
          <FieldDescription className="m-0! p-0! flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" />
            Checking availability...
          </FieldDescription>
        ) : s.available ? (
          <FieldDescription className="m-0! p-0! text-emerald-600 dark:text-emerald-500">
            {s.value} is available
          </FieldDescription>
        ) : (
          <FieldDescription className="m-0! p-0!">
            Up to {USERNAME_MAX_LENGTH} characters: letters, numbers, and underscore.
          </FieldDescription>
        )}
      </div>
    </Field>
  )
}
