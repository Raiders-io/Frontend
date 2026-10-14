import LessonCard from "@/components/lesson/LessonCard"
import type { Lesson } from "@/utils/types/lesson"
import type { SerializedSearchItem } from "@/utils/types/component"
import PaginatedGrid from "@/components/search/PaginatedGrid"

import { useSearchLesson } from "@/utils/hooks/useSearch"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"


export default function SearchPage() {
  const { items, total, loading } = useSearchLesson()
  const { page, limit, setPage } = useSearchQueryParams()

  const renderItem = (item: SerializedSearchItem<Lesson>) => {
    switch (item.kind) {
      case "lesson":
        return <LessonCard Lesson={item.data} />
    }
  }

  const serializeLesson = items.map((lesson) => ({
    kind: "lesson" as const,
    data: lesson,
  }))

  
  return (
    <>
    <PaginatedGrid
      items={serializeLesson}
      loading={loading}
      limit={limit}
      currentPage={page}
      totalPages={Math.ceil(total / limit)}
      renderItem={renderItem}
      getKey={(item) => item.data.UUID}
      onPageChange={setPage}
      >

    </PaginatedGrid>
    </>
  )
}