import { useTheme } from "@/components/theme-provider"
import { THEME_OPTIONS } from "@/components/theme-options"
import { cn } from "@/utils/lib/shadcn"

/**
 * Miniature fake UI (bar, button, text lines) painted with the theme's own
 * colours, so the card previews the palette without showing the real site.
 */
function ThemeMockup({ schemes }: { schemes: string[] }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-14 w-full overflow-hidden rounded-md border"
    >
      {schemes.map((scheme) => (
        <span
          key={scheme}
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-1 bg-background p-1.5",
            scheme,
          )}
        >
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-5 rounded-full bg-foreground/70" />
            <span className="ml-auto h-2.5 w-3 rounded-sm bg-primary" />
          </span>
          <span className="h-1.5 w-full rounded-full bg-muted-foreground/40" />
          <span className="flex gap-1">
            <span className="h-3 flex-1 rounded-sm bg-secondary" />
            <span className="h-3 flex-1 rounded-sm bg-accent" />
          </span>
        </span>
      ))}
    </span>
  )
}

/** Visual theme picker: one card per theme, the selected one highlighted. */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5"
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon, previewSchemes }) => {
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
            <ThemeMockup schemes={previewSchemes} />
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
