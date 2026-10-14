import { createContext, useContext } from "react"
import type { SearchResourceOption } from "@/utils/types/component"
import i18next from 'i18next'

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
      i18next.t('searchbarSubcomponentsMustBeRenderedWithinSearchbar', 'SearchBar sub-components must be rendered within <SearchBar />'),
    )
  return context
}
