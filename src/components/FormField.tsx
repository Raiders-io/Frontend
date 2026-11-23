import { useId, type ReactNode } from "react"
import {
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from "react-hook-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { FormMessage } from "@/components/auth/FormMessage"

/** Everything the control needs: react-hook-form wiring + a11y attributes. */
export type FormControlProps<T extends FieldValues> = UseFormRegisterReturn<
  Path<T>
> & {
  id: string
  "aria-invalid": boolean
  "aria-describedby": string
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  /** Muted help text, replaced by the error message when there is one. */
  hint?: ReactNode
  options?: RegisterOptions<T, Path<T>>
  children: (control: FormControlProps<T>) => ReactNode
}

/**
 * Label + control + message, wired to the surrounding <FormProvider>.
 * Use it with an explicit type: <FormField<MyForm> name="email" ...>.
 *
 *   <FormField<EmailForm> name="email" label="New email">
 *     {(control) => <Input {...control} type="email" />}
 *   </FormField>
 */
export function FormField<T extends FieldValues>({
  name,
  label,
  hint,
  options,
  children,
}: FormFieldProps<T>) {
  const { register, getFieldState, formState } = useFormContext<T>()
  const { error } = getFieldState(name, formState)

  const id = `${useId()}-${name}`
  const messageId = `${id}-message`

  return (
    <Field data-invalid={!!error} className="gap-1.5">
      <FieldLabel htmlFor={id} className="text-xs">
        {label}
      </FieldLabel>

      {children({
        ...register(name, options),
        id,
        "aria-invalid": !!error,
        "aria-describedby": messageId,
      })}

      <FormMessage id={messageId} tone={error ? "error" : "muted"}>
        {error?.message ?? hint}
      </FormMessage>
    </Field>
  )
}
