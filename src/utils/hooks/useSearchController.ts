import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"
import { useLocation, useNavigate } from "react-router-dom"
import type {
  SearchResourceOption,
  SearchSort,
  SearchSortValue,
} from "../types/component"
import type { Tag } from "../types/lesson"

const TIMER = 300

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function useSearchController(
  resources?: SearchResourceOption[],
  sortOptions?: { label: string; value: SearchSortValue }[],
  allTags: Tag[] = [],
) {
  const navigate = useNavigate()
  const location = useLocation()
  const focus = useRef(false)
  const [isFocus, setIsFocus] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>("")
  const isSearchPage = useMemo(
    () => location.pathname.startsWith("/search"),
    [location.pathname],
  )
  const debouncedSearch = useDebouncedValue(search, TIMER)

  const {
    query,
    resource,
    tags,
    sort,
    order,
    setQuery,
    setResource,
    setTags,
    setSort,
  } = useSearchQueryParams()

  useEffect(() => {
    if (isSearchPage && !focus.current) setSearch(query)
  }, [query, isSearchPage])

  useEffect(() => {
    if (!isSearchPage) return
    const timer = setTimeout(() => {
      if (search !== query) setQuery(search)
    }, TIMER)
    return () => clearTimeout(timer)
  }, [search, query, isSearchPage, setQuery])

  useEffect(() => {
    const handleFastKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleFastKey)
    return () => window.removeEventListener("keydown", handleFastKey)
  }, [])

  const currResource = useMemo(
    () => resources?.find((r) => r.value === resource) || resources?.[0],
    [resources, resource],
  )

  const currTags = useMemo(() => {
    if (!tags || tags.length === 0) return []
    return tags
      .map((tag) => allTags.find((t) => t.name === tag))
      .filter(Boolean) as Tag[]
  }, [tags, allTags])

  const currSort = useMemo<SearchSort>(() => {
    const defaultVal = sortOptions?.[0]?.value || ("" as SearchSortValue)
    return {
      value: (sort as SearchSortValue) || defaultVal,
      isAscending: order === "asc",
    }
  }, [sort, order, sortOptions])

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (!isSearchPage) {
        const params = new URLSearchParams()
        if (search) params.set("q", search)
        if (resource) params.set("resource", resource)
        if (tags && tags.length > 0) params.set("tags", tags.join(","))
        if (sort) params.set("sort", sort)
        if (order) params.set("order", order)
        navigate(`/search?${params.toString()}`)
      } else {
        setQuery(search)
      }
    }
  }

  const onResourceChange = (newResource: SearchResourceOption) => {
    setResource(newResource.value)
  }

  const onSortChange = (newSort: SearchSort) => {
    setSort(newSort.value, newSort.isAscending)
  }

  const onTagsChange = (newTags: Tag[]) => {
    setTags(newTags.map((tag) => tag.name))
  }

  const onQueryChange = (value: string) => {
    const match = value.match(/^@(\w+)\s+(.*)$/)
    if (match) {
      const [, tag, queryText] = match
      const matchedRes = resources?.find(
        (r) => r.value.toLowerCase() === tag.toLowerCase(),
      )
      if (matchedRes) {
        setSearch(queryText)
        setResource(matchedRes.value)
        return
      }
    }
    setSearch(value)
  }

  const onFocus = () => {
    focus.current = true
    setIsFocus(true)
  }
  const onBlur = () => {
    focus.current = false
    setIsFocus(false)
  }

  return {
    searchInputRef,
    search,
    debouncedSearch,
    currResource,
    currTags,
    currSort,
    isFocus,
    handleEnterKey,
    onResourceChange,
    onSortChange,
    onTagsChange,
    onQueryChange,
    onFocus,
    onBlur,
  }
}
