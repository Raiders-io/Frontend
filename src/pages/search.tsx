import LessonCard from "@/components/lesson/LessonCard"
import type { Lesson } from "@/utils/types/lesson"
import type { SerializedSearchItem } from "@/utils/types/component"
import PaginatedGrid from "@/components/search/PaginatedGrid"
import { useSearchLesson } from "@/utils/hooks/useSearch"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"
import { useMemo, useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import SelectPanel from "@/components/search/SelectPanel"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"

export default function SearchPage() {
  const { items, total, loading } = useSearchLesson()
  const { page, limit, setPage } = useSearchQueryParams()

  // State to toggle between 'grid' (default card) and 'list' (preview/inline card)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const renderItem = (item: SerializedSearchItem<Lesson>) => {
    switch (item.kind) {
      case "lesson":
        // Dynamically pass the variant based on the selected view mode
        return <LessonCard lesson={item.data} variant={viewMode === 'grid' ? 'default' : 'preview'} />
      default:
        return <></>
    }
  }

  const serializedLessons = useMemo(() => {
    if (!items) return []
    return items.map((lesson) => ({
      kind: "lesson" as const,
      data: lesson,
    }))
  }, [items])

  return (
    <BackgroundPanel
      title="Search Results"
      controls={<SelectPanel
        options={['grid', 'list']}
        viewMode={viewMode}
        setViewMode={setViewMode}
        render={(viewMode) => {
          switch (viewMode) {
            case 'grid':
              return <LayoutGrid className='h-8 w-8' />
            case 'list':
              return <List className="h-4 w-4" />
          }
        }}
      />
      }
    >
      <PaginatedGrid
        items={serializedLessons}
        loading={loading}
        limit={limit}
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        renderItem={renderItem}
        getKey={(item) => item.data.lessonId}
        onPageChange={setPage}
        layout={viewMode}
      />
    </BackgroundPanel>
  )
}
