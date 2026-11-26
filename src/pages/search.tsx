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
import { useNavigate, useSearchParams } from "react-router-dom"
import { LayoutGrid, List } from "lucide-react"
import { examApi } from "@/utils/lib/exam_api/requests"
import { PATHS } from "@/utils/router/paths"
import SelectPanel from "@/components/search/SelectPanel"
import BackgroundPanel from "@/components/homemade/BackgroundPanel"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { page, limit, resource, setPage } = useSearchQueryParams()
  const isExamSearch = resource === "exam"
  const useExamMock = import.meta.env.DEV && searchParams.get("mock") === "exams"
  const lessonSearch = useSearchLesson({ enabled: !isExamSearch })
  const examSearch = useSearchExam({ enabled: isExamSearch, useMock: useExamMock })
  const { total, loading } = isExamSearch ? examSearch : lessonSearch

  // State to toggle between 'grid' (default card) and 'list' (preview/inline card)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [startingExamId, setStartingExamId] = useState<string | null>(null)
  const [startError, setStartError] = useState("")

  async function startExam(examId: string) {
    if (startingExamId) return
    setStartingExamId(examId)
    setStartError("")
    try {
      const { data } = await examApi.startPaper(examId)
      navigate(PATHS.examPaperView(data.id))
    } catch {
      setStartError("Unable to start the exam. Check your authentication.")
    } finally {
      setStartingExamId(null)
    }
  }

  const renderItem = (item: SerializedSearchItem<Lesson | ExamSummary>) => {
    if ("lessonId" in item.data) {
      return <LessonCard lesson={item.data as Lesson} variant={viewMode === 'grid' ? 'default' : 'preview'} />
    }

    const exam = item.data as ExamSummary
    return (
      <ExamCard
        exam={exam}
        variant={viewMode === "grid" ? "default" : "preview"}
        onStart={() => void startExam(exam.id)}
      />
    )
  }

  const serializedItems: SerializedSearchItem<Lesson | ExamSummary>[] = useMemo(() => {
    if (isExamSearch) {
      return examSearch.items.map((exam) => ({ kind: "exam", data: exam }))
    }
    return lessonSearch.items.map((lesson) => ({ kind: "lesson", data: lesson }))
  }, [isExamSearch, examSearch.items, lessonSearch.items])

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
      {startError && (
        <p role="alert" className="mb-4 text-sm text-destructive">{startError}</p>
      )}
      {startingExamId && (
        <p role="status" className="mb-4 text-sm text-muted-foreground">Starting exam…</p>
      )}
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
