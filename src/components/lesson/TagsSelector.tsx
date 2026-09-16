import type { Tag } from "@/utils/types/lesson"
import SelectableTab from "../homemade/selectable_tab"
import { Badge } from "lucide-react"

interface TagsTableProps {
  tags: Tag[]
  variant?: "compact" | "extended"
  className?: string
  selected: Tag[]
  setSelection: (items: Tag[]) => void
}
export default function TagsSelector({
  tags,
  variant = "compact",
  className,
  selected,
  setSelection,
}: TagsTableProps) {
  if (variant == "compact")
    return (
      <SelectableTab
        className={className}
        data={tags}
        getKey={(tag) => tag.id}
        getLabel={(tag) => tag.name}
        selected={new Set(selected.map((tag) => tag.id))}
        onSelectionChanged={(selection) => {
          const selectedTags = tags.filter((tag) => selection.has(tag.id))
          setSelection(selectedTags)
        }}
      >
        Select tags
      </SelectableTab>
    )

  return <h1>wiiii</h1>
}
