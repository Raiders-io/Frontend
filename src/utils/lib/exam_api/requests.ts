import api from "@/utils/lib/axios"
import type { BackendQuestion,
  CreateQuestionPayload,
  BackendExam,
  CreateExamPayload,
  BackendExamListResponse,
  ExamPaper,
  StartPaperResponse,
  ExamPaperSubmissionResult,
} from "@/utils/lib/exam_api/types"
import { rejectBackendError } from "./utils"

// HTTP requests for the exam feature. The response generics describe the
// expected API body; rejectBackendError turns backend error objects into exceptions.
export const examApi = {
  // Question authoring
  listQuestions: () =>
    api
      .get<BackendQuestion[]>("/api/v1/questions")
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  createQuestion: (question: CreateQuestionPayload) =>
    api
      .post<BackendQuestion>("/api/v1/questions", question)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  deleteQuestion: (questionId: string) =>
    api.delete(`/api/v1/questions/${questionId}`),

  // Exam authoring
  createExam: (exam: CreateExamPayload) =>
    api
      .post<BackendExam>("/api/v1/exam-authorings", exam)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  listExams: () =>
    api
      .get<BackendExamListResponse>("/api/v1/exam-authorings")
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),

  // Exam attempts (a paper is one user's attempt at an exam)
  startPaper: (examId: string) =>
    api
      .post<StartPaperResponse>("/api/v1/exam-papers", { examId })
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  getPaper: (paperId: string) =>
    api
      .get<ExamPaper>(`/api/v1/exam-papers/${paperId}`)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  // Submit saved answers and ask the backend to grade the attempt.
  updatePaper: (
    paperId: string,
    answers: { id: string; answer: string }[],
  ) =>
    api
      .patch<ExamPaperSubmissionResult>(`/api/v1/exam-papers/${paperId}`, {
        answers,
        submit: true,
      })
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
}
