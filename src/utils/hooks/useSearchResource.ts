import { useMemo } from "react"
import { useSearchLesson } from "@/utils/hooks/useSearch"
import { useSearchExam } from "@/utils/hooks/useSearchExam"
import { useSearchFiles } from "@/utils/hooks/useSearchFiles"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"
import type { SerializedSearchItem } from "@/utils/types/component"
import type { Lesson } from "@/utils/types/lesson"
import type { ExamSummary } from "@/utils/types/exam"
import type { FileObject } from "@/utils/types/object"

export type SearchableItem = Lesson | ExamSummary | FileObject

interface UseSearchResourceOptions {
  /** Overrides the `resource` URL param (previews, tests, ...). */
  resource?: string
  enabled?: boolean
  useMock?: boolean
}

/**
 * Runs the search hook matching the active `resource` and serializes the
 * results into `SerializedSearchItem`s. Every hook is always called (rules of
 * hooks), only the one matching the resource is enabled.
 *
 * Resources without a dedicated hook ("all", "user", ...) fall back to lessons.
 */
export function useSearchResource({
  resource: resourceOverride,
  enabled = true,
  useMock = false,
}: UseSearchResourceOptions = {}) {
  const { resource: urlResource } = useSearchQueryParams()
  const resource = resourceOverride ?? urlResource

  const isExamSearch = resource === "exam"
  const isFileSearch = resource === "file"
  const isLessonSearch = !isExamSearch && !isFileSearch

  const lessonSearch = useSearchLesson({ enabled: enabled && isLessonSearch })
  const examSearch = useSearchExam({ enabled: enabled && isExamSearch, useMock })
  const fileSearch = useSearchFiles({ enabled: enabled && isFileSearch })

  const active = isExamSearch ? examSearch : isFileSearch ? fileSearch : lessonSearch

  const items = useMemo<SerializedSearchItem<SearchableItem>[]>(() => {
    if (isExamSearch) {
      return examSearch.items.map((data) => ({ kind: "exam", data }))
    }
    if (isFileSearch) {
      return fileSearch.items.map((data) => ({ kind: "file", data }))
    }
    return lessonSearch.items.map((data) => ({ kind: "lesson", data }))
  }, [isExamSearch, isFileSearch, examSearch.items, fileSearch.items, lessonSearch.items])

  return {
    resource,
    items,
    total: active.total,
    loading: active.loading,
    error: active.error,
  }
}
