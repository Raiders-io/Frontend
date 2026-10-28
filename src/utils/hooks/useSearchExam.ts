import { useCallback, useMemo } from "react"
import { examService } from "@/services/exam_service"
import { mockExams } from "@/utils/mock"
import type { ExamSummary } from "@/utils/types/exam"
import { useSearch } from "@/utils/hooks/useSearch"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"

interface ExamSearchParams {
  query: string
  page: number
  limit: number
  useMock: boolean
}

interface UseSearchExamOptions {
  enabled?: boolean
  useMock?: boolean
}

export function useSearchExam({ enabled = true, useMock = false }: UseSearchExamOptions = {}) {
  const { query, page, limit } = useSearchQueryParams()

  const params = useMemo<ExamSearchParams>(
    () => ({ query, page, limit, useMock }),
    [query, page, limit, useMock],
  )

  const fetcher = useCallback(async (searchParams: ExamSearchParams, signal?: AbortSignal) => {
    const exams = searchParams.useMock
      ? mockExams
      : await examService.getAllExams(signal)
    const normalizedQuery = searchParams.query.trim().toLowerCase()
    const matchingExams = exams.filter((exam) => {
      const title = exam.title?.toLowerCase() ?? ""
      const description = exam.description?.toLowerCase() ?? ""
      return title.includes(normalizedQuery) || description.includes(normalizedQuery)
    })

    const startIndex = (searchParams.page - 1) * searchParams.limit
    return {
      data: matchingExams.slice(startIndex, startIndex + searchParams.limit),
      meta: { total: matchingExams.length },
    }
  }, [])

  return useSearch<ExamSearchParams, ExamSummary>(params, fetcher, enabled)
}
