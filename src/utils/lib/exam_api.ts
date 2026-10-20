import api from "@/utils/lib/axios"
import type { Question } from "@/utils/types/exam"

type BackendQuestion = {
  id: string
  title: string
  questionType: string
  goodAnswers: string[] | string | null
  badAnswers: string[] | string | null
  starterCode: string | null
  referenceCode: string | null
  points: number
}

export type BackendExam = {
  id: string
  title: string | null
  description: string | null
  questions?: BackendQuestion[]
}

type BackendPaperAnswer = {
  id: string
  answer: string | null
  examsQuestion?: {
    position?: number | null
    question?: BackendQuestion
  }
}

type BackendError = { error: string }

export type ExamPaperSubmissionResult = {
  success: boolean
  score: number
  totalPoints: number
  goodAnswersId: string[]
}

export type ExamPaper = {
  id: string
  examId: string
  status: string
  exam?: BackendExam
  answers: BackendPaperAnswer[]
}

function rejectBackendError<T>(data: T | BackendError): T {
  if (typeof data === "object" && data !== null && "error" in data) {
    throw new Error(data.error)
  }
  return data as T
}

function asAnswers(value: BackendQuestion["goodAnswers"]): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [value]
    } catch {
      return [value]
    }
  }
  return []
}

export function toQuestion(
  question: BackendQuestion,
  position: number,
): Question {
  const goodAnswers = asAnswers(question.goodAnswers)
  const badAnswers = asAnswers(question.badAnswers)
  const type: Question["type"] =
    question.questionType === "MCQ"
      ? "multiple_choice"
      : question.questionType === "TEXT"
        ? "exact_answer"
        : "c_function"

  return {
    id: String(question.id),
    pos: position,
    text: question.title,
    type,
    points: question.points,
    starterCode: type === "c_function" ? question.starterCode ?? undefined : undefined,
    referenceCode:
      type === "c_function" ? question.referenceCode ?? undefined : undefined,
    answers: type === "exact_answer" ? goodAnswers : undefined,
    choices:
      type === "multiple_choice"
        ? [
            ...goodAnswers.map((text, index) => ({
              id: `good-${index}`,
              text,
              isCorrect: true,
            })),
            ...badAnswers.map((text, index) => ({
              id: `bad-${index}`,
              text,
              isCorrect: false,
            })),
          ]
        : undefined,
  }
}

export const examApi = {
  listQuestions: () =>
    api
      .get<BackendQuestion[]>("/questions")
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  createQuestion: (question: {
    title: string
    questionType: string
    goodAnswers: string[]
    badAnswers: string[]
    starterCode: string
    referenceCode: string
    points: number
  }) =>
    api
      .post<BackendQuestion>("/questions", question)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  deleteQuestion: (questionId: string) =>
    api.delete(`/questions/${questionId}`),
  createExam: (exam: {
    title: string
    description: string
    questions: { id: string; position: number; points: number }[]
  }) =>
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
  startPaper: (examId: string) =>
    api
      .post<{ id: string }>("/exam-papers", { examId })
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
