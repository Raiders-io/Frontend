import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/lib/shadcn"

interface UserAvatarButtonProps
  extends Omit<ComponentProps<typeof Button>, "aria-label"> {
  label: string
}

export function UserAvatarButton({
  children,
  label,
  className,
  ...props
}: UserAvatarButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-9 w-9 cursor-pointer rounded-full p-0 transition-shadow",
        "hover:ring-2 hover:ring-ring/40",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "data-[state=open]:ring-2 data-[state=open]:ring-ring",
        className,
      )}
      aria-label={label}
      {...props}
    >
      {children}
    </Button>
  )
}
