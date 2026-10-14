"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import type { FileItem } from "@/utils/schema/lessonSchema"

export interface AttachmentPickerProps {
  value: FileItem[]
  onChange: (files: FileItem[]) => void
  disabled?: boolean
}

interface AttachmentsFieldProps {
  value: FileItem[]
  onChange: (files: FileItem[]) => void
  disabled?: boolean
  className?: string
  /**
   * Plug-in point for the FileListWidget once it is ready:
   *   renderPicker={(p) => <FileListWidget mode="compact" {...p} />}
   * When omitted, a native file input is used.
   */
  renderPicker?: (props: AttachmentPickerProps) => ReactNode
}

// Identity of a file: stored ones by id, new ones by name
const keyOf = (f: FileItem) => f.id ?? f.filename

export default function AttachmentsField({
  value,
  onChange,
  disabled,
  className,
  renderPicker,
}: AttachmentsFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const picked: FileItem[] = Array.from(e.target.files).map((file) => ({
      filename: file.name,
      file,
    }))
    const existing = new Set(value.map(keyOf))
    onChange([...value, ...picked.filter((f) => !existing.has(keyOf(f)))])
    e.target.value = "" // allow re-selecting the same file
  }

  const remove = (item: FileItem) =>
    onChange(value.filter((f) => keyOf(f) !== keyOf(item)))

  return (
    <Field className={className}>
      <FieldLabel>Attachments</FieldLabel>
      <FieldContent>
        <div className="space-y-4">
          {renderPicker ? (
            renderPicker({ value, onChange, disabled })
          ) : (
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={disabled}
              className="cursor-pointer"
            />
          )}

          {value.length > 0 && (
            <ul className="space-y-2">
              {value.map((file) => (
                <li
                  key={keyOf(file)}
                  className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="flex-1 truncate font-medium">{file.filename}</span>
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => remove(file)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {file.filename}</span>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </FieldContent>
      <FieldDescription>
        Upload any supplementary materials, PDFs, or resources.
      </FieldDescription>
    </Field>
  )
}
