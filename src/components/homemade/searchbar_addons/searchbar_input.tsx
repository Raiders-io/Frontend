import { InputGroupInput } from "@/components/ui/input-group"
import { useSearchBar } from "./searchbar_context"
import React from "react"

type SearchBarInputProps = React.ComponentPropsWithoutRef<
  typeof InputGroupInput
>

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

SearchBarInput.displayName = "SearchBarInput"
