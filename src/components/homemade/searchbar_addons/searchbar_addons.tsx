import { InputGroupAddon } from "@/components/ui/input-group"
import React from "react"

interface SearchBarAddonsProps extends React.ComponentPropsWithoutRef<
  typeof InputGroupAddon
> {
  children?: React.ReactNode
}

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

SearchBarAddons.displayName = "SearchBarAddons"
