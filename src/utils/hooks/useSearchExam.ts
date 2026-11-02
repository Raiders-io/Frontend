import { useCallback, useMemo } from "react"
import { examService } from "@/services/exam_service"
import { mockExams } from "@/utils/mock"
import type { ExamSearchParams, ExamSummary } from "@/utils/types/exam"
import { useSearch } from "@/utils/hooks/useSearch"
import { useSearchQueryParams } from "@/utils/hooks/searchParams"

interface UseSearchExamOptions {
  enabled?: boolean
  useMock?: boolean
}

type ExamSearchRequest = ExamSearchParams & { useMock: boolean }

export function useSearchExam({ enabled = true, useMock = false }: UseSearchExamOptions = {}) {
  const { query, page, limit } = useSearchQueryParams()

  const params = useMemo<ExamSearchRequest>(
    () => ({ q: query, page, limit, useMock }),
    [query, page, limit, useMock],
  )

  const fetcher = useCallback(async (searchParams: ExamSearchRequest, signal?: AbortSignal) => {
    if (!searchParams.useMock) {
      return examService.getExams(
        {
          q: searchParams.q,
          page: searchParams.page,
          limit: searchParams.limit,
        },
        signal,
      )
    }

    const exams = mockExams
    const normalizedQuery = searchParams.q.trim().toLowerCase()
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

  return useSearch<ExamSearchRequest, ExamSummary>(params, fetcher, enabled)
}
