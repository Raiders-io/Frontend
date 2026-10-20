// <Question API data>
export type BackendQuestion = {
  id: string
  title: string
  questionType: string
  goodAnswers: string[] | string | null
  badAnswers: string[] | string | null
  starterCode: string | null
  referenceCode: string | null
}

export type CreateQuestionPayload = {
  title: string
  questionType: string
  goodAnswers: string[]
  badAnswers: string[]
  starterCode: string
  referenceCode: string
}

// <Exam API data>
// This relation carries a question together with its position and points in an exam.
export type BackendExamQuestion = {
  question: BackendQuestion
  position: number
  points: number
}

export type BackendExam = {
  id: string
  title: string | null
  description: string | null
  questions?: BackendQuestion[]
}

export type CreateExamPayload = {
  title: string
  description: string
  questions: {
    id: string
    position: number
    points: number
  }[]
}

// <Exam attempt API data>
export type BackendPaperAnswer = {
  id: string
  answer: string | null
  examsQuestion?: BackendExamQuestion
}

export type ExamPaper = {
  id: string
  examId: string
  status: string
  exam?: BackendExam
  questions?: BackendExamQuestion[]
  answers: BackendPaperAnswer[]
}

export type StartPaperResponse = {
  id: string
  status: string
}

export type ExamPaperSubmissionResult = {
  success: boolean
  score: number
  totalPoints: number
  goodAnswersId: string[]
}

// Shared API errors
export type BackendError = { error: string }
