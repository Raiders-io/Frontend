import { createContext, useContext } from "react"
import type { SearchResourceOption } from "@/utils/types/component"

interface SearchBarContextType {
  query: string
  setQuery: (val: string) => void
  resource?: SearchResourceOption
  setResource?: (value: SearchResourceOption) => void
}

export const SearchBarContext = createContext<SearchBarContextType | null>(null)

export const useSearchBar = () => {
  const context = useContext(SearchBarContext)
  if (!context)
    throw new Error(
      "SearchBar sub-components must be rendered within <SearchBar />",
    )
  return context
}
