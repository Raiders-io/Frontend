import * as React from "react"
import { cn } from "@/utils/lib/shadcn"

type CheckboxProps = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>((
  { checked, onCheckedChange, className, ...props }, 
  ref
) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      ref={ref}
      className={cn("h-4 w-4 rounded border border-primary text-primary focus:ring-primary", className)}
      {...props}
    />
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }