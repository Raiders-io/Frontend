import * as React from "react"
import { cn } from "@/utils/lib/shadcn"

const AlertDialog = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  { className, ...props }, 
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-background p-4 shadow-sm", className)}
      {...props}
    />
  )
})

AlertDialog.displayName = "AlertDialog"

export { AlertDialog }