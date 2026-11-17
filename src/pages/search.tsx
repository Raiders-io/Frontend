import LessonCard from "@/components/lesson/LessonCard"
import ExamCard from "@/components/exam/ExamCard"
import FileCard from "@/components/search/FileCard"
import type { Lesson } from "@/utils/types/lesson"
import type { ExamSummary } from "@/utils/types/exam"
import type { FileObject } from "@/utils/types/object"
import type { SerializedSearchItem } from "@/utils/types/component"
import PaginatedGrid from "@/components/search/PaginatedGrid"
import { useSearchResource } from "@/utils/hooks/useSearchResource"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { LayoutGrid, List } from "lucide-react"
import SelectPanel from "@/components/search/SelectPanel"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const { page, limit, setPage } = useSearchQueryParams()
  const useExamMock = import.meta.env.DEV && searchParams.get("mock") === "exams"
  const { items: serializedItems, total, loading } = useSearchResource({ useMock: useExamMock })

  // State to toggle between 'grid' (default card) and 'list' (preview/inline card)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const renderItem = (item: SerializedSearchItem<Lesson | ExamSummary | FileObject>) => {
    if ("lessonId" in item.data) {
      return <LessonCard lesson={item.data as Lesson} variant={viewMode === 'grid' ? 'default' : 'preview'} />
    }
    if ("name" in item.data) {
      return <FileCard file={item.data as FileObject} variant={viewMode === 'grid' ? 'default' : 'preview'} />
    }

    return <ExamCard exam={item.data as ExamSummary} variant={viewMode === "grid" ? "default" : "preview"} />
  }

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
        items={serializedItems}
        loading={loading}
        limit={limit}
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        renderItem={renderItem}
        getKey={(item) => {
          switch (item.kind) {
            case 'lesson':
              return (item.data as Lesson).lessonId
            case 'exam':
              return (item.data as ExamSummary).id
            case 'file':
              return (item.data as FileObject).name
            default:
              return 'None'
          }
        }}
        onPageChange={setPage}
        layout={viewMode}
      />
    </BackgroundPanel>
  )
}
