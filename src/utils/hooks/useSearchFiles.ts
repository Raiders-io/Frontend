import { useCallback, useMemo } from "react"
import { objectService } from "@/services/object_service"
import type { FileObject } from "@/utils/types/object"
import { useSearch } from "@/utils/hooks/useSearch"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"

interface UseSearchFilesOptions {
  query?: string
  limit?: number
  enabled?: boolean
}

interface SearchFilesParams {
  q: string
  page: number
  limit: number
}

export function useSearchFiles({
  query: queryOverride,
  limit: limitOverride,
  enabled = true,
}: UseSearchFilesOptions = {}) {
  const { query: urlQuery, page, limit } = useSearchQueryParams()

  const isPreview = queryOverride !== undefined
  const query = queryOverride ?? urlQuery

  const params = useMemo<SearchFilesParams>(
    () => ({
      q: query,
      page: isPreview ? 1 : page,
      limit: limitOverride ?? limit,
    }),
    [query, page, limit, limitOverride, isPreview],
  )

  const fetcher = useCallback(
    async (p: SearchFilesParams, signal?: AbortSignal) => {
      const res = await objectService.search(p.q, p.page, p.limit, signal)
      const objects = res?.objects
      return {
        data: Array.isArray(objects?.data) ? objects.data : [],
        meta: { total: objects?.meta?.total ?? 0 },
      }
    },
    [],
  )

  return useSearch<SearchFilesParams, FileObject>(params, fetcher, enabled)
}
