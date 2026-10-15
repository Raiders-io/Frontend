import type { ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface IconActionProps extends Omit<ComponentProps<typeof Button>, "size" | "children"> {
  icon: LucideIcon
  label: string
  tooltip?: string
}

export function IconAction({ icon: Icon, label, tooltip = label, ...props }: IconActionProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button variant="ghost" size="icon-sm" aria-label={label} {...props}>
              <Icon />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
