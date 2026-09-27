import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import React, { createContext, useContext, useEffect, useState } from "react"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/utils/lib/shadcn"

interface SearchBarProps {
  search: string
  onSearch: (value: string) => void
  resource?: string
  onResourceChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

interface SearchBarContextType {
  query: string
  setQuery: (val: string) => void
  resource: string
  setResource: (value: string) => void
}

interface SearchBarInputProps extends React.ComponentPropsWithoutRef<
  typeof InputGroupInput
> {}

interface SearchBarAddonsProps extends React.ComponentPropsWithoutRef<
  typeof InputGroupAddon
> {
  children?: React.ReactNode
}

const SearchBarContext = createContext<SearchBarContextType | null>(null)

function useSearchBar() {
  const context = useContext(SearchBarContext)
  if (!context)
    throw new Error(
      "SearchBar sub-components must be rendered within <SearchBar />",
    )
  return context
}

export const SearchBarInput = React.forwardRef<
  HTMLInputElement,
  SearchBarInputProps
>(({ ...props }, ref) => {
  const { query, setQuery } = useSearchBar()

  return (
    <InputGroupInput
      ref={ref}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      {...props}
    />
  )
})

export const SearchBarAddons = React.forwardRef<
  HTMLDivElement,
  SearchBarAddonsProps
>(({ children, ...props }, ref) => {
  return (
    <InputGroupAddon ref={ref} {...props}>
      {children}
    </InputGroupAddon>
  )
})

SearchBarInput.displayName = "SearchBarInput"
SearchBarAddons.displayName = "SearchBarAddons"

interface ResourceOption {
  label: string
  value: string
}

interface SearchBarResourceProps {
  options: ResourceOption[]
  className?: string
  placeholder?: string
}

export const SearchBarResource = ({
  options,
  placeholder,
  className,
}: SearchBarResourceProps) => {
  const { resource, setResource } = useSearchBar()

  return (
    <div
      className={cn(
        "flex items-center border-r rounded-l-[inherit] rounded-r-none",
        className,
      )}
    >
      <Select value={resource} onValueChange={setResource}>
        <SelectTrigger
          className={cn(
            "rounded-r-none font-bold",
          )}
        >
          <SelectValue placeholder={placeholder}/>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function SearchBar({
  search,
  onSearch,
  children,
  resource = "all",
  onResourceChange,
}: SearchBarProps) {
  const [query, setQuery] = useState(search)
  const [currResource, setCurrResource] = useState(resource)

  const handleQueryChange = (val: string) => {
    setQuery(val)
    onSearch(val)
  }

  const handleResourceChange = (val: string) => {
    setCurrResource(val)
    onResourceChange && onResourceChange(val)
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
      <InputGroup>{children}</InputGroup>
    </SearchBarContext.Provider>
  )
}
