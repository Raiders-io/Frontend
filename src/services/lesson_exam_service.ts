import { examService } from "@/services/exam_service"
import type { ExamSummary } from "@/utils/types/exam"

export const lessonExamService = {
  async list(lessonUuid: string, signal?: AbortSignal): Promise<ExamSummary[]> {
    return examService.getExamsForLesson(lessonUuid, signal)
  },
}
