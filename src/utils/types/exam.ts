export type Question = {
  id: string
  pos: number
  points: number
  text: string
  type: "multiple_choice" | "exact_answer" | "c_function"
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
