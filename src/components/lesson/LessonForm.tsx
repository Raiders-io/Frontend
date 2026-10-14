"use client"

import { useEffect, useMemo, type ReactNode } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

import PrivacyField from "@/components/lesson/PrivacyField"
import TagsField from "./TagsField"
import AttachmentsField, { type AttachmentPickerProps } from "./AttachmentsField"
import {
  EMPTY_LESSON_VALUES,
  CreateLessonSchema,
  type CreateLessonPayload,
} from "@/utils/schema/lessonSchema"

export interface LessonFormProps {
  mode?: "create" | "edit"
  initialValues?: Partial<CreateLessonPayload>
  onSubmit: (values: CreateLessonPayload) => void | Promise<void>
  onCancel?: () => void
  onChange?: (values: CreateLessonPayload) => void
  readOnly?: boolean
  loading?: boolean
  heading?: string
  description?: string
  submitLabel?: string
  renderAttachmentPicker?: (props: AttachmentPickerProps) => ReactNode
  footerActions?: ReactNode
}

const COPY = {
  create: {
    heading: "Create New Lesson",
    description:
      "Fill in the details below to create a new lesson. You can attach files and assign tags.",
    submit: "Create Lesson",
  },
  edit: {
    heading: "Edit Lesson",
    description: "Update the details of this lesson.",
    submit: "Save Changes",
  },
} as const

export default function LessonForm({
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  onChange,
  readOnly = false,
  loading = false,
  heading,
  description,
  submitLabel,
  renderAttachmentPicker,
  footerActions,
}: LessonFormProps) {
  const copy = COPY[mode]

  const values = useMemo<CreateLessonPayload>(
    () => ({ ...EMPTY_LESSON_VALUES, ...initialValues }),
    [initialValues]
  )

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateLessonPayload>({
    resolver: zodResolver(CreateLessonSchema),
    defaultValues: values,
    values, // keeps the form in sync when the page loads the lesson asynchronously
  })

  useEffect(() => {
    if (!onChange) return
    const sub = watch((v) => onChange(v as CreateLessonPayload))
    return () => sub.unsubscribe()
  }, [watch, onChange])

  const disabled = readOnly || loading

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldSet className="space-y-8" disabled={disabled}>
        <div className="space-y-1">
          <FieldLegend className="text-3xl font-bold tracking-tight">
            {heading ?? copy.heading}
          </FieldLegend>
          <FieldDescription>{description ?? copy.description}</FieldDescription>
        </div>

        <FieldGroup className="space-y-8">
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="title" className="text-xl font-medium">
              Lesson Title
            </FieldLabel>
            <FieldContent>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="e.g., Mathematics for Beginners"
                    aria-invalid={!!errors.title}
                    {...field}
                  />
                )}
              />
            </FieldContent>
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="description" className="text-lg font-medium">
              Description
            </FieldLabel>
            <FieldContent>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Briefly describe what this lesson covers..."
                    className="resize-none"
                    rows={5}
                    {...field}
                    value={field.value ?? ""}
                  />
                )}
              />
            </FieldContent>
          </Field>

          <div className="flex flex-col gap-4 md:flex-row">
            <Controller
              name="privacy"
              control={control}
              render={({ field }) => (
                <PrivacyField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  className="flex-1"
                />
              )}
            />
            <Field data-invalid={!!errors.tags} className="flex-1">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagsField
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  className="flex-1"
                  aria-invalid={!!errors.tags}

                />
              )}
            />
            {errors.tags && <FieldError>{errors.tags.message}</FieldError>}
            </Field>
          </div>

          <Controller
            name="files"
            control={control}
            render={({ field }) => (
              <AttachmentsField
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                renderPicker={renderAttachmentPicker}
              />
            )}
          />
        </FieldGroup>
      </FieldSet>

      {!readOnly && (
        <div className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
          {footerActions && <div className="mr-auto">{footerActions}</div>}
          <Button
            type="button"
            variant="outline"
            onClick={onCancel ?? (() => window.history.back())}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || isSubmitting}>
            {submitLabel ?? copy.submit}
          </Button>
        </div>
      )}
    </form>
  )
}
