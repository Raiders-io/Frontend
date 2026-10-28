export type Question = {
  id: string
  pos: number
  text: string
  type: "multiple_choice" | "exact_answer" | "c_code"
  answer?: string
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
