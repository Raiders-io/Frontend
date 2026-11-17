"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { cn } from "@/utils/lib/shadcn"
import { Globe, GlobeOff } from "lucide-react"

interface PrivacyFieldProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  className?: string
  /** Override the default copy if another page needs different wording */
  labels?: {
    private: { title: string; description: string,icon: React.ReactNode}
    public: { title: string; description: string,icon: React.ReactNode}
    
  }
}

const DEFAULT_LABELS: NonNullable<PrivacyFieldProps["labels"]> = {
  private: {
    title: "Private Lesson",
    description: "Only you and explicitly invited users can view this lesson.",
    icon: <GlobeOff/>,
  },
  public: {
    title: "Public Lesson",
    description: "Everyone can see this lesson and create exams.",
    icon: <Globe/>,
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
      onClick={() => !disabled && onChange(!value)}
    >
      <div className="flex flex-1 flex-col gap-0.5">
        <FieldLabel htmlFor="privacy" className="text-base">
          <div className="flex items-center gap-2">
            {copy.icon}
            <h1 className="text-lg font-medium">{copy.title}</h1>
          </div>
        </FieldLabel>
        <FieldDescription>
          {copy.description}
          </FieldDescription>
      </div>

    </Field>
  )
}
