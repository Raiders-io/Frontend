import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { SectionCard } from "./SectionCard"
import { IconAction } from "@/components/homemade/IconAction"

interface BiographyProps {
  bio: string
}

export function Biography({ bio }: BiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!bio) return null

  const label = isExpanded ? "Afficher moins" : "Afficher plus"

  return (
    <SectionCard title="Bio">
      <div className="space-y-1">
        <p
          className={`text-foreground/80 text-sm leading-relaxed wrap-break-word whitespace-pre-line transition-all duration-200 ${
            !isExpanded ? "line-clamp-3 sm:line-clamp-4" : ""
          }`}
        >
          {bio}
        </p>

        <div className="flex justify-center">
          <IconAction
            icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
            label={label}
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
    </SectionCard>
  )
}