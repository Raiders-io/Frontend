import api from "@/utils/lib/axios"
import type { ExamSearchParams, PaginatedExamResponse } from "@/utils/types/exam"

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
}
