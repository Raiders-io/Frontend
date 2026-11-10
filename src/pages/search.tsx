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
import SelectPanel from "@/components/search/SelectPanel"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"
import { useTranslation } from 'react-i18next'

export default function SearchPage() {
  const { t } = useTranslation()
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
    if ("lessonId" in item.data) {
      return <LessonCard lesson={item.data as Lesson} variant={viewMode === 'grid' ? 'default' : 'preview'} />
    }

    return <ExamCard exam={item.data as ExamSummary} variant={viewMode === "grid" ? "default" : "preview"} />
  }

  const serializedItems: SerializedSearchItem<Lesson | ExamSummary>[] = useMemo(() => {
    if (isExamSearch) {
      return examSearch.items.map((exam) => ({ kind: "exam", data: exam }))
    }
    return lessonSearch.items.map((lesson) => ({ kind: "lesson", data: lesson }))
  }, [isExamSearch, examSearch.items, lessonSearch.items])

  return (
    <BackgroundPanel
      title={t('searchResults', 'Search Results')}
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
