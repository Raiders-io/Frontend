/* eslint-disable react-hooks/set-state-in-effect */
import { InputGroup } from "@/components/ui/input-group"
import React, { useEffect, useState } from "react"
import { SearchBarSorting } from "./searchbar_addons/searchbar_sorting"
import {
  SearchBarResource,
  type ResourceOption,
} from "./searchbar_addons/searchbar_resource"
import { SearchBarAddons } from "./searchbar_addons/searchbar_addons"
import { SearchBarInput } from "./searchbar_addons/searchbar_input"
import { SearchBarContext } from "./searchbar_addons/searchbar_context"

interface SearchBarProps {
  search: string
  onSearch: (value: string) => void
  resource?: ResourceOption
  onResourceChange?: (value: ResourceOption) => void
  className?: string
  children?: React.ReactNode
}

const SearchBar = ({
  search,
  onSearch,
  children,
  resource,
  onResourceChange,
  className,
}: SearchBarProps) => {
  const [query, setQuery] = useState(search)
  const [currResource, setCurrResource] = useState(resource)

  const handleQueryChange = (val: string) => {
    setQuery(val)
    onSearch(val)
  }

  const handleResourceChange = (val: ResourceOption) => {
    setCurrResource(val)
    if (onResourceChange) {
      onResourceChange(val)
    }
  }

  useEffect(() => {
    setQuery(search)
  }, [search])
  useEffect(() => {
    setCurrResource(resource)
  }, [resource])

  return (
    <SearchBarContext.Provider
      value={{
        query,
        setQuery: handleQueryChange,
        resource: currResource,
        setResource: handleResourceChange,
      }}
    >
      <InputGroup className={className}>{children}</InputGroup>
    </SearchBarContext.Provider>
  )
}

export {
  SearchBar,
  SearchBarInput,
  SearchBarAddons,
  SearchBarResource,
  SearchBarSorting,
}
