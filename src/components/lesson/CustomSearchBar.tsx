import type { Tag } from "@/utils/types/lesson"
import { useEffect, useRef, useState } from "react"
import {
  SearchBar,
  SearchBarAddons,
  SearchBarInput,
  SearchBarResource,
  SearchBarSorting,
} from "@/components/homemade/search_bar"
import TagsSelector from "./TagsSelector"
import { SearchIcon } from "lucide-react"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import type { ResourceOption } from "../homemade/searchbar_addons/searchbar_resource"

interface CustomSearchBarProps {
  className?: string
  resources?: ResourceOption[]
  sortOptions?: { label: string; value: string }[]
  handleQuery: (params: QueryParams) => void
  children?: React.ReactNode
}

interface QueryParams {
  search: string
  resource?: string
  tags?: Tag[]
  sort?: { value: string; ascending: boolean }
}

//TODO remove this hardcoded tags and fetch them from the backend
const tag: Tag = {
  id: 1,
  name: "Tin",
}

const tag2: Tag = {
  id: 2,
  name: "Copper",
}

const tag3: Tag = {
  id: 3,
  name: "Iron",
}

export default function CustomSearchBar({
  resources,
  sortOptions,
  className,
  handleQuery,
  children,
}: CustomSearchBarProps) {
  const [search, setSearch] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [tags, setTags] = useState<Tag[]>([])
  const [sort, setSort] = useState<string>("")
  const [resource, setResource] = useState<ResourceOption | undefined>(
    resources?.[0],
  )
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  const getAllTags = () => {
    return [tag, tag2, tag3]
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
        setResource(matchedRes)
        return
      }
    }
    setSearch(value)
  }

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    handleQuery({
      search: debouncedSearch,
      resource: resource?.value,
      tags,
      sort: { value: sort, ascending: true },
    })
  }, [debouncedSearch, resource, tags, sort, handleQuery])

  return (
    <SearchBar
      search={search}
      onSearch={handleQueryChange}
      resource={resource}
      onResourceChange={setResource}
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
          <SearchBarSorting options={sortOptions} onSortChange={setSort} />
        </SearchBarAddons>
      )}
      {resource.value === "lesson" && (
        <SearchBarAddons align="inline-end" className="p-0">
          <TagsSelector
            tags={getAllTags()}
            selected={tags}
            setSelection={setTags}
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
