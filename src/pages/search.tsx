import LessonCard from "@/components/lesson/LessonCard"
import ExamCard from "@/components/exam/ExamCard"
import type { Lesson } from "@/utils/types/lesson"
import type { ExamSummary } from "@/utils/types/exam"
import type { SerializedSearchItem } from "@/utils/types/component"
import PaginatedGrid from "@/components/search/PaginatedGrid"
import { useSearchLesson } from "@/utils/hooks/useSearch"
import { useSearchExam } from "@/utils/hooks/useSearchExam"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const { page, limit, resource, setPage } = useSearchQueryParams()
  const isExamSearch = resource === "exam"
  const useExamMock = import.meta.env.DEV && searchParams.get("mock") === "exams"
  const lessonSearch = useSearchLesson({ enabled: !isExamSearch })
  const examSearch = useSearchExam({ enabled: isExamSearch, useMock: useExamMock })
  const { total, loading } = isExamSearch ? examSearch : lessonSearch

  // State to toggle between 'grid' (default card) and 'list' (preview/inline card)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const renderItem = (item: SerializedSearchItem<Lesson | ExamSummary>) => {
    if ("UUID" in item.data) {
      return <LessonCard lesson={item.data} variant={viewMode === 'grid' ? 'default' : 'preview'} />
    }

    return <ExamCard exam={item.data} variant={viewMode === "grid" ? "default" : "preview"} />
  }

  const serializedItems: SerializedSearchItem<Lesson | ExamSummary>[] = useMemo(() => {
    if (isExamSearch) {
      return examSearch.items.map((exam) => ({ kind: "exam", data: exam }))
    }
    return lessonSearch.items.map((lesson) => ({ kind: "lesson", data: lesson }))
  }, [isExamSearch, examSearch.items, lessonSearch.items])

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Enclosed panel: tinted surface so the (solid) cards stand out from it */}
      <div className="rounded-lg border border-border bg-muted/60 p-4 shadow-sm md:p-6 dark:bg-muted/30">

        {/* Header with Title and Layout Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Search Results</h1>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Paginated Grid receives the layout prop */}
        <PaginatedGrid
          items={serializedItems}
          loading={loading}
          limit={limit}
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
          renderItem={renderItem}
          getKey={(item) => "UUID" in item.data ? item.data.UUID : item.data.id}
          onPageChange={setPage}
          layout={viewMode}
        />
      </div>
    </div>
  )
}
