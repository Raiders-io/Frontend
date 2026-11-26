import api from "@/utils/lib/axios"
import type { ExamSearchParams, ExamSummary, PaginatedExamResponse } from "@/utils/types/exam"

export const examService = {
  getExams: async (
    params: ExamSearchParams,
    signal?: AbortSignal,
  ): Promise<PaginatedExamResponse> => {
    const { data } = await api.get<PaginatedExamResponse>("/exam-authorings", {
      params,
      signal,
    })
    return data
  },

  getExamsForLesson: async (
    lessonUuid: string,
    signal?: AbortSignal,
  ): Promise<ExamSummary[]> => {
    const { data } = await api.get<PaginatedExamResponse>("/exam-authorings", {
      params: { lesson_related_id: lessonUuid, page: 1, limit: 50, q: "" },
      signal,
    })
    return data.data
  },
}
