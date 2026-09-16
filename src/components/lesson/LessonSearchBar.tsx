import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import type { Tag } from "@/utils/types/lesson"
import TagsTable from "./TagsSelector"
import { useState } from "react"
import TagsSelector from "./TagsSelector"

interface LessonSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  variant?: "compact" | "extended"
}

const tag: Tag = {
  id: 1,
  name: "Tin",
}

const tag2: Tag = {
  id: 2,
  name: "Copper",
}

const tag3: Tag = {
  id: 3,
  name: "Iron",
}

export default function LessonSearchBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  variant = "compact",
}: LessonSearchBarProps) {
  const getAllTags = () => {
    return [tag, tag2, tag3]
  }

  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  if (variant == "compact")
    return (
      <div>
        <form>
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <TagsSelector
                tags={getAllTags()}
                selected={selectedTags}
                setSelection={setSelectedTags}
              />
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    )

  return <h1>Hello</h1>
}
