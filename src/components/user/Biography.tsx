import { SectionCard } from "./SectionCard"

interface BiographyProps {
  bio: string
}

export function Biography({ bio }: BiographyProps) {
  if (!bio) return null

  return (
    <SectionCard title="Biographie">
      <p className="text-foreground/80 max-h-32 overflow-y-auto text-sm leading-relaxed wrap-break-word whitespace-pre-line sm:max-h-40">
        {bio}
      </p>
    </SectionCard>
  )
}
