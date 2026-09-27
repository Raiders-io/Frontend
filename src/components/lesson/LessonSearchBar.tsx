import type { Tag } from "@/utils/types/lesson"
import { useState } from "react"
import SearchBar, {
  SearchBarAddons,
  SearchBarInput,
  SearchBarResource,
} from "@/components/homemade/search_bar"
import TagsSelector from "./TagsSelector"
import { SearchIcon } from "lucide-react"

interface LessonSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  variant?: "compact" | "extended"
  className?: string
}

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

const Resource = [
  { label: "All", value: "all" },
  { label: "Lesson", value: "lesson" },
  { label: "Exercise", value: "exercise" },
  { label: "Video", value: "video" },
]

export default function LessonSearchBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  variant = "compact",
  className,
}: LessonSearchBarProps) {
  const getAllTags = () => {
    return [tag, tag2, tag3]
  }

  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [mokeSearch, setMokeSearch] = useState<string>("")
  const [selectedResource, setSelectedResource] = useState<string>(
    Resource[0].value,
  )

  const handleQueryChange = (value: string) => {
    const match = value.match(/^@(\w+)\s+(.*)$/)
      if (match) {
        const [, tag, queryText] = match
        const matchedRes = Resource.find((r) => r.value.toLowerCase() === tag.toLowerCase())
      if (matchedRes) {
        setSelectedResource(matchedRes.value)
        // onSearchChange(queryText)
        setMokeSearch(queryText)
        return 
      }
    }
    setMokeSearch(value)
  }

  if (variant == "compact")
    return (
      <div className={`${className}`}>
        <SearchBar
          search={mokeSearch}
          onSearch={handleQueryChange}
          resource={selectedResource}
          onResourceChange={(value) => {
            setSelectedResource(value)
            console.log(value)
          }}
        >
          <SearchBarInput />
          {selectedResource === "lesson" && (
            <SearchBarAddons align="inline-end" className="p-0">
              <TagsSelector
                tags={getAllTags()}
                selected={selectedTags}
                setSelection={setSelectedTags}
              />
            </SearchBarAddons>
          )}
          <SearchBarAddons align="inline-start" className="p-0 h-full">
            <SearchBarResource options={Resource} className="" placeholder="none" />
          </SearchBarAddons>
          <SearchBarAddons>
            <SearchIcon className="size-4" />
          </SearchBarAddons>
        </SearchBar>
      </div>
    )
  return <h1>Hello</h1>
}
