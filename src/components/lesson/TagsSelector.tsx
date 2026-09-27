import type { Tag } from "@/utils/types/lesson"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "../ui/popover"
import { Button } from "../ui/button"
import SearchBar, {
  SearchBarAddons,
  SearchBarInput,
} from "../homemade/search_bar"
import { useState } from "react"
import CheckBoxTab from "../homemade/checkbox_tab"
import { cn } from "@/utils/lib/shadcn"

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
  const [draft, setDraft] = useState("")

  if (variant == "compact")
    return (
  <div className={cn("rounded-none")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-l-none">
            <h1 className="font-bold">Select tag</h1>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <SearchBar search={draft} onSearch={setDraft}>
              <SearchBarInput
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
              <SearchBarAddons align="inline-end">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    setDraft("")
                  }}
                >
                  <h1>X</h1>
                </Button>
              </SearchBarAddons>
            </SearchBar>
          </PopoverHeader>
          <CheckBoxTab
            className={className}
            data={tags.filter((tag) =>
              tag.name.toLowerCase().includes(draft.toLowerCase()),
            )}
            getKey={(tag) => tag.id}
            getLabel={(tag) => tag.name}
            selected={new Set(selected.map((tag) => tag.id))}
            onSelectionChanged={(selection) => {
              const selectedTags = tags.filter((tag) => selection.has(tag.id))
              setSelection(selectedTags)
            }}
          />
        </PopoverContent>
      </Popover>
      </div>
    )

  return <h1>wiiii</h1>
}
