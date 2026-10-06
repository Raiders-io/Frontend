import LessonCard from "@/components/lesson/LessonCard"
import type { Lesson } from "@/utils/types/lesson"
import type { SerializedSearchItem } from "@/utils/types/component"
import { useSearchParams } from "react-router"


export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()


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