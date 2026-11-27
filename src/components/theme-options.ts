import {
  Coffee,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react"
import type { Theme } from "@/components/theme-provider"

export type ThemeOption = {
  value: Theme
  label: string
  icon: LucideIcon
  /**
   * Theme classes used to paint the mockup preview. Each class scopes its own
   * palette, so a preview shows its theme even while another one is active.
   * "system" shows a light half next to a dark half.
   */
  previewSchemes: string[]
}

export const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun, previewSchemes: ["light"] },
  { value: "dark", label: "Dark", icon: Moon, previewSchemes: ["dark"] },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    previewSchemes: ["light", "dark"],
  },
  { value: "coffee", label: "Coffee", icon: Coffee, previewSchemes: ["coffee"] },
  { value: "silk", label: "Silk", icon: Sparkles, previewSchemes: ["silk"] },
]
