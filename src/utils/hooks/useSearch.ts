import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchQueryParams } from "./searchParams"
import type { Lesson, LessonSearchParams } from "../types/lesson"
import type { SearchSortValue } from "../types/component"
import { lessonService } from "@/services/lesson_service"

type SearchHookResult<T> = {
  items: T[]
  total: number
  loading: boolean
  error: Error | null
}

export const useSearch = <TParams, TItem>(
  params: TParams,
  fetcher: (
    params: TParams,
    signal?: AbortSignal,
  ) => Promise<{ data: TItem[]; meta: { total: number } }>,
  enabled = true,
): SearchHookResult<TItem> => {
  const [items, setItems] = useState<TItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const { data, meta } = await fetcher(params, controller.signal)
        setItems(data)
        setTotal(meta.total)
      } catch (err: any) {
        if (err?.code !== "ERR_CANCELED" && err?.name !== "AbortError") {
          setError(err as Error)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    run()
    return () => controller.abort()
  }, [params, fetcher, enabled])

  return { items, total, loading, error }
}

interface UseSearchLessonOptions {
  query?: string
  limit?: number
  enabled?: boolean
}

export function useSearchLesson({
  query: queryOverride,
  limit: limitOverride,
  enabled = true,
}: UseSearchLessonOptions = {}) {
  const { query: urlQuery, tags, sort, order, page, limit } = useSearchQueryParams()

  const isPreview = queryOverride !== undefined
  const query = queryOverride ?? urlQuery

  const params = useMemo<LessonSearchParams>(() => ({
    title: query,
    tags,
    sortBy: sort as SearchSortValue,
    direction: order as "asc" | "desc",
    page: isPreview ? 1 : page,
    limit: limitOverride ?? limit,
  }), [query, tags, sort, order, page, limit, limitOverride, isPreview])

  const fetcher = useCallback(
    (p: LessonSearchParams, signal?: AbortSignal) => lessonService.searchLessons(p, signal),
    [],
  )

  return useSearch<LessonSearchParams, Lesson>(params, fetcher, enabled)
}