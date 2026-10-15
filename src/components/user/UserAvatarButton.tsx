import type { MouseEventHandler, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/lib/shadcn"

interface UserAvatarButtonProps {
  children: ReactNode
  label: string
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function UserAvatarButton({
  children,
  label,
  className,
  onClick
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
	  onClick={onClick}
    >
      {children}
    </Button>
  )
}
