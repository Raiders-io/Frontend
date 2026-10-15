import { useState } from "react"
import { SectionCard } from "./SectionCard"
import { Button } from "@/components/ui/button"

interface BiographyProps {
  bio: string
}

export function Biography({ bio }: BiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!bio) return null

  return (
    <SectionCard title="Bio">
      <div className="space-y-2">
        <p
          className={`text-foreground/80 text-sm leading-relaxed wrap-break-word whitespace-pre-line transition-all duration-200 ${
            !isExpanded ? "line-clamp-3 sm:line-clamp-4" : ""
          }`}
        >
          {bio}
        </p>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Afficher moins" : "Afficher plus"}
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}