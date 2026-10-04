import { createContext, useContext } from "react"
import type { ResourceOption } from "./searchbar_resource"

interface SearchBarContextType {
  query: string
  setQuery: (val: string) => void
  resource: ResourceOption
  setResource: (value: ResourceOption) => void
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
