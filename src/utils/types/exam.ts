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
