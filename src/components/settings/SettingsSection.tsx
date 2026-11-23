import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/lib/shadcn"

/* -------------------------------------------------------------------------- */
/*  Section: a titled card, targetable by the sidebar anchors                 */
/* -------------------------------------------------------------------------- */

interface SettingsSectionProps {
  id: string
  title: string
  description?: string
  icon?: LucideIcon
  tone?: "default" | "danger"
  children: ReactNode
}

export function SettingsSection({
  id,
  title,
  description,
  icon: Icon,
  tone = "default",
  children,
}: SettingsSectionProps) {
  const isDanger = tone === "danger"

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6">
      <Card className={cn(isDanger && "ring-destructive/40")}>
        <CardHeader>
          <CardTitle
            id={`${id}-title`}
            className={cn(
              "flex items-center gap-2 text-base",
              isDanger && "text-destructive",
            )}
          >
            {Icon && (
              <Icon
                aria-hidden="true"
                className={cn(
                  "size-4",
                  isDanger ? "text-destructive" : "text-muted-foreground",
                )}
              />
            )}
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="divide-y">{children}</CardContent>
      </Card>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Row: label + description on the left, control on the right                */
/* -------------------------------------------------------------------------- */

interface SettingRowProps {
  title: string
  description?: string
  /** id of the control, so clicking the label focuses/toggles it. */
  htmlFor?: string
  children?: ReactNode
}

export function SettingRow({
  title,
  description,
  htmlFor,
  children,
}: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {title}
        </Label>
        {description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}
