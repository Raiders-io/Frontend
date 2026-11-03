export type Question = {
  id: string
  pos: number
  points: number
  title: string
  type: "multiple_choice" | "written_answer" | "c_function"
  starterCode?: string
  referenceCode?: string
  answers?: string[]
  choices?: QuestionChoice[]
}

export type QuestionChoice = {
  id: string
  text: string
  isCorrect: boolean
}

export type ExamType = {
  name: string
  description?: string
  questions: Question[]
  createdAt?: string
}

export type ExamSummary = {
  id: string
  title: string | null
  description: string | null
  createdAt: string | null
  updatedAt: string | null
  authorId: string | null
  authorNickname: string | null
  tags: string[]
}

export type ExamSearchParams = {
  page: number
  limit: number
  q: string
}

export type PaginatedExamResponse = {
  data: ExamSummary[]
  meta: {
    total: number
    page: number
    limit: number
  }
}
