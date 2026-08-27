import * as React from "react"
import { cn } from "@/utils/lib/shadcn"

// Custom Checkbox component that extends the default checkbox functionality to include keyboard navigation for table rows.
// It includes handling for Enter key to toggle the checkbox and arrow keys to navigate between checkboxes in a table.

type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "checked" | "defaultChecked" | "onChange"
> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, className, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)

      if (event.defaultPrevented) {
        return
      }

      if (event.key === "Enter") {
        event.preventDefault()
        onCheckedChange?.(!checked)
        return
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        const table = event.currentTarget.closest("table")
        const checkboxes = Array.from(
          table?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ??
            [],
        ).filter((checkbox) => !checkbox.disabled)
        const currentIndex = checkboxes.indexOf(event.currentTarget)
        const nextIndex =
          event.key === "ArrowUp" || event.key === "ArrowLeft"
            ? currentIndex - 1
            : currentIndex + 1

        if (nextIndex >= 0 && nextIndex < checkboxes.length) {
          event.preventDefault()
          checkboxes[nextIndex]?.focus()
        }
      }
    }

    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        onKeyDown={handleKeyDown}
        ref={ref}
        className={cn(
          "h-4 w-4 rounded border border-primary text-primary focus:ring-primary",
          className,
        )}
        {...props}
      />
    )
  },
)

Checkbox.displayName = "Checkbox"

export { Checkbox as CustomCheckbox }
