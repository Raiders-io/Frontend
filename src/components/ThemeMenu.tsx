import { Check, Palette } from "lucide-react"
import { useTheme, type Theme } from "@/components/theme-provider"
import { THEME_OPTIONS } from "@/components/theme-options"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Quick theme switch for the footer; writes through the same state as Settings. */
export function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  const current = THEME_OPTIONS.find((option) => option.value === theme)
  const CurrentIcon = current?.icon ?? Palette

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          size="sm"
          aria-label={`Change theme (current: ${current?.label ?? theme})`}
          className="gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <CurrentIcon />
          {current?.label ?? "Theme"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value as Theme)}
            aria-current={theme === value ? "true" : undefined}
          >
            <Icon />
            {label}
            {theme === value && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
