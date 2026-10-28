import api from "@/utils/lib/axios"
import type { ExamSummary } from "@/utils/types/exam"

export const examService = {
  getAllExams: async (signal?: AbortSignal): Promise<ExamSummary[]> => {
    const { data } = await api.get<ExamSummary[]>("/exam-authorings", {
      signal,
    })
    return data
  },
}
