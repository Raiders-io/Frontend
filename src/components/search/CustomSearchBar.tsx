import type { Tag } from "@/utils/types/lesson"
import type {
  SearchResourceOption,
  SearchSortValue,
} from "@/utils/types/component"
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
import { useSearchController } from "@/utils/hooks/useSearchController"
import { SearchPreview } from "./SearchPreview"
import { useTranslation } from 'react-i18next'

interface CustomSearchBarProps {
  className?: string
  resources?: SearchResourceOption[]
  sortOptions?: { label: string; value: SearchSortValue }[]
  children?: React.ReactNode
}

//TODO remove this hardcoded tags and fetch them from the backend
const MOCK_TAGS: Tag[] = [
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
  const { t } = useTranslation()
  const {
    searchInputRef,
    search,
    debouncedSearch,
    tagRef,
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
  } = useSearchController(resources, sortOptions)

  return (
    <SearchPreview isFocus={isFocus} query={debouncedSearch} className={className}>
    <SearchBar
      search={search}
      onSearch={onQueryChange}
      resource={currResource}
      onResourceChange={onResourceChange}
      className=""
    >
      <SearchBarInput 
        ref={searchInputRef}
        onKeyDown={handleEnterKey}
        onFocus={onFocus}
        onBlur={onBlur}
        />
      <SearchBarAddons align="inline-end">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </SearchBarAddons>
      {sortOptions && (
        <SearchBarAddons align="inline-end">
          <SearchBarSorting value={currSort} options={sortOptions} onSortChange={onSortChange} />
        </SearchBarAddons>
      )}
      {currResource?.value === "lesson" && (
        <SearchBarAddons align="inline-end" className="p-0">
          <TagsSelector
            tags={tagRef || MOCK_TAGS}
            selected={currTags}
            setSelection={onTagsChange}
          />
        </SearchBarAddons>
      )}
      {resources && (
        <SearchBarAddons align="inline-start" className="p-0 h-full">
          <SearchBarResource
            options={resources}
            className=""
            placeholder={t('allResources', 'All resources')}
          />
        </SearchBarAddons>
      )}
      <SearchBarAddons>
        <SearchIcon className="size-4" />
      </SearchBarAddons>
      {children}
    </SearchBar>
    </SearchPreview>
  )
}
