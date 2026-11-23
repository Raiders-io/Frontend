import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { useTheme, type Theme } from "@/components/theme-provider"
import { cn } from "@/utils/lib/shadcn"

const OPTIONS: {
  value: Theme
  label: string
  icon: LucideIcon
  preview: string
}[] = [
  { value: "light", label: "Light", icon: Sun, preview: "bg-white" },
  { value: "dark", label: "Dark", icon: Moon, preview: "bg-zinc-900" },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    preview: "bg-linear-to-r from-white from-50% to-zinc-900 to-50%",
  },
]

/** Visual theme picker: three cards, one selected (radio semantics). */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="grid w-full grid-cols-3 gap-3"
    >
      {OPTIONS.map(({ value, label, icon: Icon, preview }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              "flex cursor-pointer flex-col gap-2 rounded-lg border p-2 text-sm font-medium outline-none transition-colors",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:bg-muted/50",
            )}
          >
            <span
              aria-hidden="true"
              className={cn("h-14 w-full rounded-md border", preview)}
            />
            <span className="flex items-center justify-center gap-1.5 pb-0.5">
              <Icon className="size-4" />
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
