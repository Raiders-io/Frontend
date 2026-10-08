import LessonCard from "@/components/lesson/LessonCard"
import type { Lesson } from "@/utils/types/lesson"
import type { SerializedSearchItem } from "@/utils/types/component"
import PaginatedGrid from "@/components/search/PaginatedGrid"

export default function SearchPage() {


  const renderItem = (item: SerializedSearchItem<Lesson>) => {
    switch (item.kind) {
      case "lesson":
        return <LessonCard Lesson={item.data} />
    }
  }
  return (
    <PaginatedGrid>

    </PaginatedGrid>
  )
}