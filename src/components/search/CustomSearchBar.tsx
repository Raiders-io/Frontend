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
import { mockTag } from "@/utils/mock"

interface CustomSearchBarProps {
  className?: string
  resources?: SearchResourceOption[]
  sortOptions?: { label: string; value: SearchSortValue }[]
  children?: React.ReactNode
}

export default function CustomSearchBar({
  resources,
  sortOptions,
  className,
  children,
}: CustomSearchBarProps) {
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
            tags={tagRef.length > 0 ? tagRef : mockTag}
            selected={currTags}
            setSelection={onTagsChange}
            className="rounded-l-none"
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
    </SearchPreview>
  )
}
