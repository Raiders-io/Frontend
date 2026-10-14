"use client"

import { useEffect } from "react"
import { useTagStore } from "@/utils/stores/tag_store"
import type { Tag } from "@/utils/types/lesson"
import TagsSelector from "@/components/lesson/TagsSelector"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"

interface TagsFieldProps {
  value: Tag[]
  onChange: (tags: Tag[]) => void
  /**
   * Optional: provide the available tags yourself (SSR, tests, filtered list).
   * When omitted, the field loads them from the tag store on its own.
   */
  availableTags?: Tag[]
  disabled?: boolean
  className?: string
}

export default function TagsField({
  value,
  onChange,
  availableTags,
  disabled,
  className,
}: TagsFieldProps) {
  const store = useTagStore()
  const tags = availableTags ?? store.tags
  const loading = availableTags ? false : store.loading

  // Self-sufficient: fetch only when nobody gave us tags and the store is empty
  useEffect(() => {
    if (!availableTags && store.tags.length === 0) store.fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTags])

  return (
    <Field className={className}>
      <div className="flex items-center gap-2">
        <FieldLabel className="text-lg font-medium">Tags</FieldLabel>
        <FieldContent className="items-end">
          {loading ? (
            <div className="flex h-10 items-center rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground">
              Loading tags...
            </div>
          ) : (
            <div className={disabled ? "pointer-events-none opacity-60" : undefined}>
              <TagsSelector
                tags={tags}
                variant="compact"
                selected={value}
                setSelection={onChange}
              />
            </div>
          )}
        </FieldContent>
      </div>
      <FieldDescription>
        {value.length > 0
          ? `${value.length} tag(s) selected`
          : "Select relevant tags for this lesson."}
      </FieldDescription>
    </Field>
  )
}
