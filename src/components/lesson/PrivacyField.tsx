"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/utils/lib/shadcn"

interface PrivacyFieldProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  className?: string
  /** Override the default copy if another page needs different wording */
  labels?: {
    private: { title: string; description: string }
    public: { title: string; description: string }
  }
}

const DEFAULT_LABELS: NonNullable<PrivacyFieldProps["labels"]> = {
  private: {
    title: "Private Lesson",
    description: "Only you and explicitly invited users can view this lesson.",
  },
  public: {
    title: "Public Lesson",
    description: "Everyone can see this lesson and create exams.",
  },
}

export default function PrivacyField({
  value,
  onChange,
  disabled,
  className,
  labels = DEFAULT_LABELS,
}: PrivacyFieldProps) {
  const copy = value ? labels.private : labels.public

  return (
    <Field
      orientation="horizontal"
      className={cn(
        "rounded-md border border-input bg-transparent px-3 py-2",
        !disabled && "hover:bg-accent/20",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <FieldLabel htmlFor="privacy" className="text-base">
          {copy.title}
        </FieldLabel>
        <FieldDescription>{copy.description}</FieldDescription>
      </div>
      {/* A real switch: keyboard accessible, unlike the clickable <Field> */}
      <Switch
        id="privacy"
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </Field>
  )
}
