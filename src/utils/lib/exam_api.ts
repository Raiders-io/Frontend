import api from "@/utils/lib/axios"
import type { Question } from "@/utils/types/exam"

type BackendQuestion = {
  id: number
  title: string
  questionType: string
  goodAnswers: string[] | string | null
  badAnswers: string[] | string | null
  points: number
}

type BackendExam = {
  id: number
  title: string | null
  questions?: BackendQuestion[]
}

type BackendPaperAnswer = {
  id: number
  answer: string | null
  examsQuestion?: { question?: BackendQuestion }
}

type BackendError = { error: string }

export type ExamPaper = {
  id: number
  examId: number
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
  const type =
    question.questionType === "MCQ"
      ? "multiple_choice"
      : question.questionType === "TEXT"
        ? "exact_answer"
        : "c_code"

  return {
    id: String(question.id),
    pos: position,
    text: question.title,
    type,
    points: question.points,
    answers: type !== "multiple_choice" ? goodAnswers : undefined,
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
    points: number
  }) =>
    api
      .post<BackendQuestion>("/questions", question)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  deleteQuestion: (questionId: number) =>
    api.delete(`/questions/${questionId}`),
  createExam: (exam: {
    title: string
    questions: { id: number; position: number; points: number }[]
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
  startPaper: (examId: number) =>
    api
      .post<{ id: number }>("/exam-papers", { examId })
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  getPaper: (paperId: number) =>
    api
      .get<ExamPaper>(`/exam-papers/${paperId}`)
      .then((response) => ({
        ...response,
        data: rejectBackendError(response.data),
      })),
  updatePaper: (paperId: number, answers: { id: number; answer: string }[]) =>
    api.patch(`/exam-papers/${paperId}`, { answers, submit: true }),
}
