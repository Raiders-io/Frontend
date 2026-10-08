import type { Tag } from "@/utils/types/lesson"
import type {
  SearchResourceOption,
  SearchSort,
  SearchSortValue,
} from "@/utils/types/component"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  SearchBar,
  SearchBarAddons,
  SearchBarInput,
  SearchBarResource,
  SearchBarSorting,
} from "@/components/homemade/search_bar"
import TagsSelector from "@/components/lesson/TagsSelector"
import { SearchIcon } from "lucide-react"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"

interface CustomSearchBarProps {
  className?: string
  resources?: SearchResourceOption[]
  sortOptions?: { label: string; value: SearchSortValue }[]
  children?: React.ReactNode
}

//TODO remove this hardcoded tags and fetch them from the backend
const ALL_TAGS: Tag[] = [
  { id: 1, name: "React" },
  { id: 2, name: "JavaScript" },
  { id: 3, name: "TypeScript" },
  { id: 4, name: "CSS" },
  { id: 5, name: "HTML" },
  { id: 11, name: "React" },
  { id: 21, name: "JavaScript" },
  { id: 31, name: "TypeScript" },
  { id: 41, name: "CSS" },
  { id: 51, name: "HTML" },
  { id: 12, name: "React" },
  { id: 22, name: "JavaScript" },
  { id: 32, name: "TypeScript" },
  { id: 42, name: "CSS" },
  { id: 52, name: "HTML" },
  { id: 121, name: "React" },
  { id: 221, name: "JavaScript" },
  { id: 321, name: "TypeScript" },
  { id: 421, name: "CSS" },
  { id: 521, name: "HTML" },
]

export default function CustomSearchBar({
  resources,
  sortOptions,
  className,
  children,
}: CustomSearchBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

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
  
  const [search, setSearch] = useState<string>(query)

  const currentResource = useMemo(() => 
    resources?.find((r) => r.value === resource) || resources?.[0]
  , [resources, resource])

  const tagsObject = useMemo(() => {
    if (!tags || tags.length === 0) return []
      return tags.map((tag) => getAllTags().find((t) => t.name === tag)).filter(Boolean) as Tag[]
  }, [tags])

  const currentSortObject = useMemo<SearchSort>(() => {
    const defaultVal = sortOptions?.[0]?.value || ""
    return {
      value: (sort as SearchSortValue) || defaultVal,
      isAscending: order === "asc",
    }
  }, [sort, order, sortOptions])

  useEffect(() => {
    setSearch(query)
  }, [query])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== query)
      setQuery(search)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [search, setQuery, query])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleResourceChange = (newResource: SearchResourceOption) => {
    setResource(newResource.value)
  }

  const handleSortChange = (newSort: SearchSort) => {
    setSort(newSort.value, newSort.isAscending)
  }

  const handleTagsChange = (newTags: Tag[]) => {
    setTags(newTags.map((tag) => tag.name))
  }

  const getAllTags = () => {
    return ALL_TAGS
  }

  const handleQueryChange = (value: string) => {
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

  return (
    <SearchBar
      search={search}
      onSearch={handleQueryChange}
      resource={currentResource}
      onResourceChange={handleResourceChange}
      className={className}
    >
      <SearchBarInput ref={searchInputRef} />
      <SearchBarAddons align="inline-end">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </SearchBarAddons>
      {sortOptions && (
        <SearchBarAddons align="inline-end">
          <SearchBarSorting value={currentSortObject} options={sortOptions} onSortChange={handleSortChange} />
        </SearchBarAddons>
      )}
      {currentResource?.value === "lesson" && (
        <SearchBarAddons align="inline-end" className="p-0">
          <TagsSelector
            tags={getAllTags()}
            selected={tagsObject}
            setSelection={handleTagsChange}
          />
        </SearchBarAddons>
      )}
      {resources && (
        <SearchBarAddons align="inline-start" className="p-0 h-full">
          <SearchBarResource
            options={resources}
            className=""
            placeholder="All resources"
          />
        </SearchBarAddons>
      )}
      <SearchBarAddons>
        <SearchIcon className="size-4" />
      </SearchBarAddons>
      {children}
    </SearchBar>
  )
}
