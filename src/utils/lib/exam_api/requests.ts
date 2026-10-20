import api from "@/utils/lib/axios"
import type { BackendQuestion,
  CreateQuestionPayload, 
  BackendExam, 
  CreateExamPayload,
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
      .get<BackendQuestion[]>("/questions")
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  createQuestion: (question: CreateQuestionPayload) =>
    api
      .post<BackendQuestion>("/questions", question)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  deleteQuestion: (questionId: string) =>
    api.delete(`/questions/${questionId}`),

  // Exam authoring
  createExam: (exam: CreateExamPayload) =>
    api
      .post<BackendExam>("/exam-authorings", exam)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  listExams: () =>
    api
      .get<BackendExam[]>("/exam-authorings")
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),

  // Exam attempts (a paper is one user's attempt at an exam)
  startPaper: (examId: string) =>
    api
      .post<StartPaperResponse>("/exam-papers", { examId })
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  getPaper: (paperId: string) =>
    api
      .get<ExamPaper>(`/exam-papers/${paperId}`)
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
      .patch<ExamPaperSubmissionResult>(`/exam-papers/${paperId}`, {
        answers,
        submit: true,
      })
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
}
