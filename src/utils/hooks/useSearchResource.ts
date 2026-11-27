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
  /** Overrides the `q` URL param (previews searching the input's text). */
  query?: string
  /** Overrides the `limit` URL param. */
  limit?: number
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
  query,
  limit,
  enabled = true,
  useMock = false,
}: UseSearchResourceOptions = {}) {
  const { resource: urlResource } = useSearchQueryParams()
  const resource = resourceOverride ?? urlResource

  const isExamSearch = resource === "exam"
  const isFileSearch = resource === "file"
  const isSearchUer = resource === "user"
  const isLessonSearch = !isExamSearch && !isFileSearch && !isSearchUer

  const lessonSearch = useSearchLesson({ query, limit, enabled: enabled && isLessonSearch })
  const examSearch = useSearchExam({ query, limit, enabled: enabled && isExamSearch, useMock })
  const fileSearch = useSearchFiles({ query, limit, enabled: enabled && isFileSearch })
  // const userSearch = userSearchUser({ enabled: enabled && isSearchUer })

  const active = isExamSearch ? examSearch : isFileSearch ? fileSearch : lessonSearch

  const items = useMemo<SerializedSearchItem<SearchableItem>[]>(() => {
    if (isExamSearch) {
      return examSearch.items.map((data) => ({ kind: "exam", data }))
    }
    if (isFileSearch) {
      return fileSearch.items.map((data) => ({ kind: "file", data }))
    }
    // if (isSearchUser) {
    //   return userSearch.items.map((data) => ({ kind: "user", data }))
    // }
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
