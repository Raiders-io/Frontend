import { useSearchParams } from "react-router-dom" // or "react-router" in v7
import { useCallback, useMemo } from "react"

export function useSearchQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get("q") ?? ""
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
  const resource = searchParams.get("resource") ?? ""
  const tagsRaw = searchParams.get("tags") ?? ""
  const tags = useMemo(() => tagsRaw.split(",").filter(Boolean), [tagsRaw])
  const sort = searchParams.get("sort") ?? ""
  const order = searchParams.get("order") ?? "asc"

  const updateParams = useCallback(
    (
      newParams: Record<string, string | number | null | undefined>,
      { replace = false }: { replace?: boolean } = {},
    ) => {
      setSearchParams(
        (prevParams) => {
          const updated = new URLSearchParams(prevParams)

          Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
              updated.delete(key)
            } else {
              updated.set(key, String(value))
            }
          })

          return updated
        },
        { replace }, // Set to true if you don't want every page click to add history entries
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage })
    },
    [updateParams],
  )

  const setQuery = useCallback(
    (newQuery: string) => {
      // Reset page to 1 whenever a new search query is executed
      updateParams({ q: newQuery, page: 1 }, { replace: true })
    },
    [updateParams],
  )

  const setResource = useCallback(
    (newResource: string) => {
      // Reset page to 1 whenever a new resource is selected
      updateParams({ resource: newResource, page: 1 })
    },
    [updateParams],
  )

  const setTags = useCallback(
    (newTags: string[]) => {
      // Reset page to 1 whenever new tags are selected
      updateParams({ tags: newTags.join(","), page: 1 })
    },
    [updateParams],
  )

  const setSort = useCallback(
    (sortValue: string, isAscending: boolean) => {
      // Reset page to 1 whenever a new sort option is selected
      updateParams({
        sort: sortValue,
        order: isAscending ? "asc" : "desc",
        page: 1,
      })
    },
    [updateParams],
  )

  return {
    query,
    page,
    limit,
    resource,
    tags,
    sort,
    order,
    setPage,
    setQuery,
    setResource,
    setTags,
    setSort,
  }
}
