import { useRef, useState, type ReactNode } from "react"
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form"
import { Loader2 } from "lucide-react"
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
import { getErrorMessage } from "@/pages/user/utils"
import { shake } from "../utils/utils/shake"

interface FormDialogProps<T extends FieldValues> {
  /** The form created by the caller (it owns the schema and the defaults). */
  form: UseFormReturn<T>
  /** Element that opens the dialog (rendered with `asChild`). */
  trigger: ReactNode
  title: string
  description: ReactNode
  submitLabel: string
  pendingLabel: string
  successMessage: string
  /** Shown when the API gives no message of its own. */
  errorMessage: string
  /** Throw to signal a failure; resolve to signal success. */
  onSubmit: (values: T) => Promise<void>
  /** Called after the error toast, e.g. to attach the error to a field. */
  onError?: (error: unknown, message: string) => void
  children: ReactNode
}

/**
 * Dialog + form shell: open state, reset on close, submit with toast
 * feedback, shake on error, Cancel / Submit footer.
 */
export function FormDialog<T extends FieldValues>({
  form,
  trigger,
  title,
  description,
  submitLabel,
  pendingLabel,
  successMessage,
  errorMessage,
  onSubmit,
  onError,
  children,
}: FormDialogProps<T>) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { isSubmitting } = form.formState

  const close = () => {
    setOpen(false)
    form.reset()
  }

  const handleOpenChange = (next: boolean) => {
    if (next) setOpen(true)
    else if (!isSubmitting) close()
  }

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      toast.success(successMessage)
      close()
    } catch (error) {
      const message = getErrorMessage(error, errorMessage)
      toast.error(message)
      onError?.(error, message)
      shake(formRef.current)
    }
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          {/* noValidate: zod handles the messages. */}
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="flex flex-col gap-2"
          >
            {children}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={close}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? pendingLabel : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
